const { generateIconData } = require('./dist/index');
const fs = require('fs');
const crypto = require('crypto');

// List of all headings in the README
const headings = [
  { text: 'Geometricon', file: 'geometricon.svg', size: 48 },
  { text: 'Features', file: 'features.svg', size: 32 },
  { text: 'Visual Examples', file: 'visual-examples.svg', size: 32 },
  { text: 'Composition Modes', file: 'composition-modes.svg', size: 24 },
  { text: 'Color Schemes', file: 'color-schemes.svg', size: 24 },
  { text: 'Shape Types', file: 'shape-types.svg', size: 24 },
  { text: 'Installation', file: 'installation.svg', size: 32 },
  { text: 'Usage', file: 'usage.svg', size: 32 },
  { text: 'CLI Usage', file: 'cli-usage.svg', size: 24 },
  { text: 'Node.js API', file: 'nodejs-api.svg', size: 24 },
  { text: 'Basic Usage', file: 'basic-usage.svg', size: 20 },
  { text: 'With Options', file: 'with-options.svg', size: 20 },
  { text: 'Generate Icon Data Without Rendering', file: 'generate-icon-data.svg', size: 24 },
  { text: 'Examples', file: 'examples.svg', size: 32 },
  { text: 'Node.js Example', file: 'nodejs-example.svg', size: 24 },
  { text: 'Web Usage', file: 'web-usage.svg', size: 24 },
  { text: 'How It Works', file: 'how-it-works.svg', size: 32 },
  { text: 'API Reference', file: 'api-reference.svg', size: 32 },
  { text: 'generateIcon', file: 'generate-icon-func.svg', size: 24 },
  { text: 'generateIconData', file: 'generate-icon-data-func.svg', size: 24 },
  { text: 'Composition Modes Detail', file: 'composition-modes-detail.svg', size: 32 },
  { text: 'Available Compositions', file: 'available-compositions.svg', size: 24 },
  { text: 'Default Behavior', file: 'default-behavior.svg', size: 24 },
  { text: 'Shape Types Detail', file: 'shape-types-detail.svg', size: 32 }
];

// Helper function to create vertical arrangement of shapes
function createVerticalSVG(iconData, size) {
  const shapes = iconData.shapes.slice(0, 3); // Take only first 3 shapes

  // Calculate vertical positions
  const shapeSize = size * 0.25; // Each shape takes 25% of the height
  const spacing = size * 0.05; // 5% spacing between shapes
  const totalHeight = (shapeSize * 3) + (spacing * 2);
  const startY = (size - totalHeight) / 2;

  // Position shapes vertically centered
  const verticalShapes = shapes.map((shape, index) => {
    const y = startY + (index * (shapeSize + spacing)) + (shapeSize / 2);
    return {
      ...shape,
      x: size / 2,
      y: y,
      size: shapeSize
    };
  });

  // Generate SVG
  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">\n`;

  verticalShapes.forEach(shape => {
    const { type, x, y, size: shapeSize, color, rotation, opacity } = shape;

    svg += `  <g transform="translate(${x}, ${y}) rotate(${rotation})">\n`;

    if (type === 'circle') {
      svg += `    <circle cx="0" cy="0" r="${shapeSize / 2}" fill="${color}" opacity="${opacity}" />\n`;
    } else if (type === 'square') {
      const half = shapeSize / 2;
      svg += `    <rect x="${-half}" y="${-half}" width="${shapeSize}" height="${shapeSize}" fill="${color}" opacity="${opacity}" />\n`;
    } else if (type === 'triangle') {
      const h = shapeSize / 2;
      const points = `0,${-h} ${h},${h} ${-h},${h}`;
      svg += `    <polygon points="${points}" fill="${color}" opacity="${opacity}" />\n`;
    } else if (type === 'hexagon') {
      const r = shapeSize / 2;
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        return `${r * Math.cos(angle)},${r * Math.sin(angle)}`;
      }).join(' ');
      svg += `    <polygon points="${points}" fill="${color}" opacity="${opacity}" />\n`;
    } else if (type === 'diamond') {
      const half = shapeSize / 2;
      const points = `0,${-half} ${half},0 0,${half} ${-half},0`;
      svg += `    <polygon points="${points}" fill="${color}" opacity="${opacity}" />\n`;
    }

    svg += `  </g>\n`;
  });

  svg += `</svg>`;
  return svg;
}

console.log('Generating icons for README headings...\n');

headings.forEach(({ text, file, size }) => {
  // Generate MD5 hash from the heading text
  const hash = crypto.createHash('md5').update(text).digest('hex');

  // Generate the icon data with 3 shapes
  const iconData = generateIconData(hash, {
    size: size,
    shapeCount: 3
  });

  // Create custom vertical SVG
  const svg = createVerticalSVG(iconData, size);

  // Save to file
  const filePath = `readme-icons/${file}`;
  fs.writeFileSync(filePath, svg);
  console.log(`✓ Generated: ${filePath} (${text})`);
});

console.log('\n✨ All icons generated successfully!');
