import { IconGenerator } from './generator';
import { SvgRenderer } from './svg-renderer';
import { IconOptions } from './types';

export { IconOptions, IconData, Shape, Point } from './types';

/**
 * Generate an SVG icon from a hash string
 * @param hash - Any hash string (MD5, SHA256, or any hex string)
 * @param options - Configuration options
 * @returns SVG string
 */
export function generateIcon(hash: string, options: IconOptions = {}): string {
  const generator = new IconGenerator(hash, options);
  const iconData = generator.generate();
  return SvgRenderer.render(iconData);
}

/**
 * Generate icon data structure (without rendering to SVG)
 * @param hash - Any hash string
 * @param options - Configuration options
 * @returns Icon data object
 */
export function generateIconData(hash: string, options: IconOptions = {}) {
  const generator = new IconGenerator(hash, options);
  return generator.generate();
}

export { IconGenerator } from './generator';
export { SvgRenderer } from './svg-renderer';
