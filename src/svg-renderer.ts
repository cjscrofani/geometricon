import { IconData, Shape, Gradient } from './types';

/**
 * Renders icon data as SVG
 */
export class SvgRenderer {
  /**
   * Convert IconData to SVG string
   */
  static render(iconData: IconData): string {
    const { shapes, size, gradients } = iconData;

    // Render gradient definitions if present
    let defsSection = '';
    if (gradients && gradients.length > 0) {
      const renderedGradients = gradients.map(gradient => this.renderGradient(gradient)).join('\n    ');
      defsSection = `  <defs>
    ${renderedGradients}
  </defs>\n`;
    }

    const renderedShapes = shapes.map(shape => this.renderShape(shape)).join('\n    ');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
${defsSection}  <g>
    ${renderedShapes}
  </g>
</svg>`;
  }

  /**
   * Render a gradient definition
   */
  private static renderGradient(gradient: Gradient): string {
    const { id, type, colors, angle } = gradient;

    if (type === 'linear') {
      // Calculate x1, y1, x2, y2 from angle
      const angleRad = ((angle || 0) * Math.PI) / 180;
      const x1 = 50 - 50 * Math.cos(angleRad);
      const y1 = 50 - 50 * Math.sin(angleRad);
      const x2 = 50 + 50 * Math.cos(angleRad);
      const y2 = 50 + 50 * Math.sin(angleRad);

      return `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
      <stop offset="0%" stop-color="${colors[0]}" />
      <stop offset="100%" stop-color="${colors[1]}" />
    </linearGradient>`;
    } else {
      // Radial gradient
      return `<radialGradient id="${id}">
      <stop offset="0%" stop-color="${colors[0]}" />
      <stop offset="100%" stop-color="${colors[1]}" />
    </radialGradient>`;
    }
  }

  /**
   * Render a single geometric shape to SVG
   */
  private static renderShape(shape: Shape): string {
    // Use gradient if present, otherwise use solid color
    const fillValue = shape.gradientId ? `url(#${shape.gradientId})` : shape.color;
    const commonAttributes = `fill="${fillValue}" opacity="${shape.opacity}"`;
    const { x, y } = shape.position;

    switch (shape.type) {
      case 'circle':
        return `<circle cx="${x}" cy="${y}" r="${shape.radius || shape.size / 2}" ${commonAttributes}/>`;

      case 'square': {
        const halfSize = shape.size / 2;
        const transform = `transform="translate(${x} ${y}) rotate(${shape.rotation || 0})"`;
        return `<rect x="${-halfSize}" y="${-halfSize}" width="${shape.size}" height="${shape.size}" ${commonAttributes} ${transform}/>`;
      }

      case 'triangle': {
        const halfSize = shape.size / 2;
        const height = (shape.size * Math.sqrt(3)) / 2;
        const points = `0,${-height * 0.67} ${-halfSize},${height * 0.33} ${halfSize},${height * 0.33}`;
        const transform = `transform="translate(${x} ${y}) rotate(${shape.rotation || 0})"`;
        return `<polygon points="${points}" ${commonAttributes} ${transform}/>`;
      }

      case 'hexagon': {
        const radius = shape.size / 2;
        const points = [];
        for (let cornerIndex = 0; cornerIndex < 6; cornerIndex++) {
          const angle = (cornerIndex * Math.PI) / 3;
          const pointX = radius * Math.cos(angle);
          const pointY = radius * Math.sin(angle);
          points.push(`${pointX},${pointY}`);
        }
        const transform = `transform="translate(${x} ${y}) rotate(${shape.rotation || 0})"`;
        return `<polygon points="${points.join(' ')}" ${commonAttributes} ${transform}/>`;
      }

      case 'diamond': {
        const halfSize = shape.size / 2;
        const points = `0,${-halfSize} ${halfSize},0 0,${halfSize} ${-halfSize},0`;
        const transform = `transform="translate(${x} ${y}) rotate(${shape.rotation || 0})"`;
        return `<polygon points="${points}" ${commonAttributes} ${transform}/>`;
      }

      default:
        return '';
    }
  }
}
