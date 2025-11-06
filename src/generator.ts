import { HashUtils } from './hash-utils';
import { IconData, Shape, Point, IconOptions, Gradient } from './types';

/**
 * Preset color schemes
 */
const COLOR_SCHEMES: Record<string, string[]> = {
  pastel: [
    '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
    '#E0BBE4', '#FFDFD3', '#C9E4DE', '#D4A5A5', '#FEC8D8'
  ],
  vibrant: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195', '#C06C84'
  ],
  warm: [
    '#FF6B35', '#F7931E', '#FDC830', '#F37735', '#E63946',
    '#D4A574', '#FF9F1C', '#E71D36', '#C9ADA7', '#FF8C42'
  ],
  cool: [
    '#4A90E2', '#50C9CE', '#6A5ACD', '#20B2AA', '#5F9EA0',
    '#7B68EE', '#4682B4', '#00CED1', '#87CEEB', '#6495ED'
  ],
  monochrome: [
    '#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7',
    '#D5DBDB', '#E8EAED', '#F4F6F7', '#FAFBFC', '#FFFFFF'
  ],
  earth: [
    '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#DEB887',
    '#F4A460', '#BC8F8F', '#A0826D', '#C19A6B', '#DAA520'
  ],
  ocean: [
    '#006994', '#0077BE', '#0096C7', '#00B4D8', '#48CAE4',
    '#90E0EF', '#ADE8F4', '#CAF0F8', '#023E8A', '#0353A4'
  ],
  sunset: [
    '#FF4E50', '#FC913A', '#F9D423', '#EDE574', '#E1F5C4',
    '#FF6B9D', '#C06C84', '#6C5B7B', '#355C7D', '#2A363B'
  ]
};

/**
 * Generates abstract icon compositions from hash strings
 */
export class IconGenerator {
  private hash: HashUtils;
  private size: number;
  private padding: number;
  private options: IconOptions;

  constructor(hashString: string, options: IconOptions = {}) {
    this.hash = new HashUtils(hashString);
    this.size = options.size || 200;
    this.padding = this.size * 0.05; // 5% padding to keep shapes fully visible
    this.options = {
      useComplexity: options.useComplexity !== false, // Default true
      allowedShapes: options.allowedShapes || ['circle', 'square', 'triangle', 'hexagon', 'diamond'],
      composition: options.composition || 'centered', // Default to centered composition
      saturationMin: options.saturationMin ?? 40,
      saturationMax: options.saturationMax ?? 65,
      lightnessMin: options.lightnessMin ?? 70,
      lightnessMax: options.lightnessMax ?? 88,
      opacityMin: options.opacityMin ?? 0.75,
      opacityMax: options.opacityMax ?? 0.95,
      ...options
    };
  }

  /**
   * Generate the complete icon data
   */
  generate(): IconData {
    // Generate background color
    const backgroundColor = this.hash.nextColor(40, 85);

    // Get hash complexity (0-1)
    const complexity = this.hash.getComplexity();

    // Determine number of shapes
    let shapeCount: number;

    if (this.options.shapeCount !== undefined) {
      // Fixed count specified
      shapeCount = this.options.shapeCount;
    } else if (this.options.shapeCountMin !== undefined || this.options.shapeCountMax !== undefined) {
      // Range specified
      const min = this.options.shapeCountMin ?? 2;
      const max = this.options.shapeCountMax ?? 4;
      shapeCount = this.hash.nextInt(min, max + 1);
    } else if (this.options.useComplexity) {
      // Use complexity-based (default) - 7 shapes for rich geometric patterns
      shapeCount = 7;
    } else {
      // Default: 7 shapes
      shapeCount = 7;
    }

    // Generate gradients if enabled
    const gradients: Gradient[] = [];
    if (this.options.useGradients) {
      for (let gradientIndex = 0; gradientIndex < shapeCount; gradientIndex++) {
        gradients.push(this.generateGradient(gradientIndex));
      }
    }

    // Generate shapes
    const shapes: Shape[] = [];
    for (let shapeIndex = 0; shapeIndex < shapeCount; shapeIndex++) {
      shapes.push(this.generateShape(shapeIndex, shapeCount, complexity, gradients));
    }

    // Apply composition positioning for visual harmony
    this.applyComposition(shapes, this.options.composition!);

    const iconData: IconData = {
      backgroundColor,
      shapes,
      size: this.size
    };

    if (this.options.useGradients && gradients.length > 0) {
      iconData.gradients = gradients;
    }

    return iconData;
  }

  /**
   * Apply composition strategy to position shapes harmoniously
   */
  private applyComposition(shapes: Shape[], composition: string): void {
    switch (composition) {
      case 'centered':
        this.applyCenteredComposition(shapes);
        break;
      case 'radial':
        this.applyRadialComposition(shapes);
        break;
      case 'split':
        this.applySplitComposition(shapes);
        break;
      case 'frame':
        this.applyFrameComposition(shapes);
        break;
      case 'random':
      default:
        // Keep existing random positioning
        break;
    }
  }

  /**
   * Get color based on options priority:
   * 1. Single fixed color
   * 2. Custom color palette
   * 3. Preset color scheme
   * 4. Generated HSL color
   */
  private getColor(): string {
    // Priority 1: Single fixed color
    if (this.options.color) {
      return this.options.color;
    }

    // Priority 2: Custom color palette
    if (this.options.colorPalette && this.options.colorPalette.length > 0) {
      return this.hash.pick(this.options.colorPalette);
    }

    // Priority 3: Preset color scheme
    if (this.options.colorScheme && COLOR_SCHEMES[this.options.colorScheme]) {
      return this.hash.pick(COLOR_SCHEMES[this.options.colorScheme]);
    }

    // Priority 4: Generated HSL color (default)
    return this.hash.nextColor(
      this.hash.nextInt(this.options.saturationMin!, this.options.saturationMax!),
      this.hash.nextInt(this.options.lightnessMin!, this.options.lightnessMax!)
    );
  }

  /**
   * Generate a gradient for a shape
   */
  private generateGradient(gradientIndex: number): Gradient {
    const gradientId = `gradient-${gradientIndex}`;
    const gradientType = this.hash.nextRange(0, 1) > 0.5 ? 'linear' : 'radial';

    // Get two colors for the gradient
    const color1 = this.getColor();
    const color2 = this.getColor();

    const gradient: Gradient = {
      id: gradientId,
      type: gradientType,
      colors: [color1, color2]
    };

    // Add angle for linear gradients
    if (gradientType === 'linear') {
      gradient.angle = this.hash.nextInt(0, 360);
    }

    return gradient;
  }

  /**
   * Generate a single geometric shape
   */
  private generateShape(shapeIndex: number, totalShapes: number, hashComplexity: number, gradients: Gradient[] = []): Shape {
    // Pick a shape type from allowed shapes
    const type = this.hash.pick(this.options.allowedShapes!);

    // Calculate size - smaller shapes since we have 7 of them
    const shapeBaseSize = this.size * this.hash.nextRange(0.15, 0.25);

    // Rotation - use clean angles for geometric shapes
    const rotation = this.hash.nextInt(0, 4) * 90; // 0, 90, 180, 270

    const shape: Shape = {
      type,
      color: this.getColor(),
      opacity: this.hash.nextRange(this.options.opacityMin!, this.options.opacityMax!),
      position: { x: this.size / 2, y: this.size / 2 }, // Will be repositioned by composition
      rotation,
      size: shapeBaseSize,
      radius: type === 'circle' ? shapeBaseSize / 2 : undefined,
      width: type === 'square' ? shapeBaseSize : undefined,
      height: type === 'square' ? shapeBaseSize : undefined
    };

    // Add gradient reference if gradients are enabled
    if (this.options.useGradients && gradients.length > shapeIndex) {
      shape.gradientId = gradients[shapeIndex].id;
    }

    return shape;
  }

  /**
   * Centered composition: One large central shape with others arranged around it
   * UPDATED FOR SYMMETRY: Shapes arranged symmetrically
   */
  private applyCenteredComposition(shapes: Shape[]): void {
    const center = this.size / 2;

    if (shapes.length === 1) {
      // Single shape: center it and make it large
      shapes[0].position = { x: center, y: center };
      shapes[0].size = shapes[0].size * 1.5;
    } else {
      // First shape in center (larger)
      shapes[0].position = { x: center, y: center };
      shapes[0].size = shapes[0].size * 1.3;

      // Remaining shapes arranged in a circle around center
      const radius = this.size * 0.32;
      for (let shapeIndex = 1; shapeIndex < shapes.length; shapeIndex++) {
        const angle = ((shapeIndex - 1) / (shapes.length - 1)) * Math.PI * 2;
        shapes[shapeIndex].position = {
          x: center + Math.cos(angle) * radius,
          y: center + Math.sin(angle) * radius
        };
      }
    }
  }

  /**
   * Radial composition: Shapes arranged symmetrically in a circle
   */
  private applyRadialComposition(shapes: Shape[]): void {
    const center = this.size / 2;

    if (shapes.length === 1) {
      shapes[0].position = { x: center, y: center };
      shapes[0].size = shapes[0].size * 1.4;
    } else {
      const angleStep = (Math.PI * 2) / shapes.length;
      const radius = this.size * 0.35;

      shapes.forEach((shape, shapeIndex) => {
        const angle = shapeIndex * angleStep;
        shape.position = {
          x: center + Math.cos(angle) * radius,
          y: center + Math.sin(angle) * radius
        };
      });
    }
  }

  /**
   * Split composition: Clean symmetrical division
   */
  private applySplitComposition(shapes: Shape[]): void {
    const splitVertical = this.hash.nextRange(0, 1) > 0.5;
    const center = this.size / 2;

    if (shapes.length === 1) {
      shapes[0].position = { x: center, y: center };
      shapes[0].size = shapes[0].size * 1.3;
    } else if (shapes.length === 2) {
      // Perfect mirror split
      if (splitVertical) {
        shapes[0].position = { x: this.size * 0.3, y: center };
        shapes[1].position = { x: this.size * 0.7, y: center };
      } else {
        shapes[0].position = { x: center, y: this.size * 0.3 };
        shapes[1].position = { x: center, y: this.size * 0.7 };
      }
      shapes.forEach(shape => {
        shape.size = shape.size * 1.1;
      });
    } else {
      // Multiple shapes: distribute symmetrically on both sides
      const shapesInFirstHalf = Math.ceil(shapes.length / 2);

      shapes.forEach((shape, shapeIndex) => {
        if (shapeIndex < shapesInFirstHalf) {
          // Left/Top side
          const positionRatio = shapeIndex / (shapesInFirstHalf - 1 || 1); // 0 to 1
          if (splitVertical) {
            shape.position = {
              x: this.size * 0.28,
              y: this.size * (0.25 + positionRatio * 0.5)
            };
          } else {
            shape.position = {
              x: this.size * (0.25 + positionRatio * 0.5),
              y: this.size * 0.28
            };
          }
        } else {
          // Right/Bottom side
          const indexInSecondHalf = shapeIndex - shapesInFirstHalf;
          const positionRatio = indexInSecondHalf / (shapes.length - shapesInFirstHalf - 1 || 1); // 0 to 1
          if (splitVertical) {
            shape.position = {
              x: this.size * 0.72,
              y: this.size * (0.25 + positionRatio * 0.5)
            };
          } else {
            shape.position = {
              x: this.size * (0.25 + positionRatio * 0.5),
              y: this.size * 0.72
            };
          }
        }
        shape.size = shape.size * 0.85;
      });
    }
  }

  /**
   * Frame composition: Symmetrical border with optional center
   */
  private applyFrameComposition(shapes: Shape[]): void {
    const center = this.size / 2;

    if (shapes.length === 1) {
      shapes[0].position = { x: center, y: center };
      shapes[0].size = shapes[0].size * 1.3;
    } else if (shapes.length === 2) {
      // Opposite corners
      shapes[0].position = { x: this.size * 0.25, y: this.size * 0.25 };
      shapes[1].position = { x: this.size * 0.75, y: this.size * 0.75 };
      shapes.forEach(shape => {
        shape.size = shape.size * 1.0;
      });
    } else if (shapes.length === 3) {
      // Center + two corners
      shapes[0].position = { x: center, y: center };
      shapes[0].size = shapes[0].size * 1.1;

      shapes[1].position = { x: this.size * 0.2, y: this.size * 0.2 };
      shapes[2].position = { x: this.size * 0.8, y: this.size * 0.8 };
      shapes[1].size = shapes[1].size * 0.7;
      shapes[2].size = shapes[2].size * 0.7;
    } else if (shapes.length === 4) {
      // Four corners
      const cornerPositions = [
        { x: this.size * 0.25, y: this.size * 0.25 },
        { x: this.size * 0.75, y: this.size * 0.25 },
        { x: this.size * 0.25, y: this.size * 0.75 },
        { x: this.size * 0.75, y: this.size * 0.75 },
      ];

      shapes.forEach((shape, shapeIndex) => {
        shape.position = cornerPositions[shapeIndex];
        shape.size = shape.size * 0.8;
      });
    } else {
      // 5+ shapes: Distribute around perimeter with optional center
      if (shapes.length % 2 === 1) {
        // Odd number: one in center, rest around perimeter
        shapes[0].position = { x: center, y: center };
        shapes[0].size = shapes[0].size * 1.0;

        // Distribute remaining shapes around a circle
        const radius = this.size * 0.37;
        const angleStep = (Math.PI * 2) / (shapes.length - 1);

        for (let shapeIndex = 1; shapeIndex < shapes.length; shapeIndex++) {
          const angle = (shapeIndex - 1) * angleStep;
          shapes[shapeIndex].position = {
            x: center + Math.cos(angle) * radius,
            y: center + Math.sin(angle) * radius
          };
          shapes[shapeIndex].size = shapes[shapeIndex].size * 0.75;
        }
      } else {
        // Even number: distribute all around perimeter
        const radius = this.size * 0.37;
        const angleStep = (Math.PI * 2) / shapes.length;

        shapes.forEach((shape, shapeIndex) => {
          const angle = shapeIndex * angleStep;
          shape.position = {
            x: center + Math.cos(angle) * radius,
            y: center + Math.sin(angle) * radius
          };
          shape.size = shape.size * 0.8;
        });
      }
    }
  }
}
