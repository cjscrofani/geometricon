/**
 * Utilities for extracting deterministic values from hash strings
 */

export class HashUtils {
  private hash: string;
  private index: number = 0;
  private complexity: number = 0;

  constructor(hash: string) {
    // Ensure we have a valid hex hash
    this.hash = hash.toLowerCase().replace(/[^0-9a-f]/g, '');
    if (this.hash.length < 16) {
      // If hash is too short, repeat it
      while (this.hash.length < 32) {
        this.hash += this.hash;
      }
    }

    // Calculate hash complexity (0-1 scale)
    this.complexity = this.calculateComplexity();
  }

  /**
   * Calculate the complexity of the hash based on character distribution
   * Returns a value between 0 (low complexity) and 1 (high complexity)
   */
  private calculateComplexity(): number {
    // Count unique characters
    const uniqueChars = new Set(this.hash).size;
    const uniqueRatio = uniqueChars / 16; // Hex has 16 possible chars (0-f)

    // Calculate entropy - measure of randomness
    const charCounts = new Map<string, number>();
    for (const char of this.hash) {
      charCounts.set(char, (charCounts.get(char) || 0) + 1);
    }

    let entropy = 0;
    const hashLength = this.hash.length;
    for (const count of charCounts.values()) {
      const probability = count / hashLength;
      if (probability > 0) {
        entropy -= probability * Math.log2(probability);
      }
    }

    // Normalize entropy (max entropy for hex is 4 bits)
    const normalizedEntropy = entropy / 4;

    // Combine metrics (weighted average)
    const complexity = (uniqueRatio * 0.4) + (normalizedEntropy * 0.6);

    return Math.max(0, Math.min(1, complexity));
  }

  /**
   * Get the complexity score of the hash (0-1)
   */
  getComplexity(): number {
    return this.complexity;
  }

  /**
   * Get next byte value (0-255)
   */
  private nextByte(): number {
    if (this.index >= this.hash.length) {
      this.index = 0; // Wrap around
    }
    const byte = parseInt(this.hash.substr(this.index, 2), 16);
    this.index += 2;
    return byte;
  }

  /**
   * Get a random-looking float between 0 and 1
   */
  nextFloat(): number {
    return this.nextByte() / 255;
  }

  /**
   * Get a random-looking integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min)) + min;
  }

  /**
   * Get a random-looking float between min and max
   */
  nextRange(min: number, max: number): number {
    return this.nextFloat() * (max - min) + min;
  }

  /**
   * Generate a color from hash bytes
   */
  nextColor(saturation: number = 70, lightness: number = 60): string {
    const hue = this.nextInt(0, 360);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Pick one item from an array
   */
  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length)];
  }

  /**
   * Reset index to start
   */
  reset(): void {
    this.index = 0;
  }
}
