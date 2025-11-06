// Generate sample icons for README
const { generateIcon } = require('./dist/index');
const crypto = require('crypto');
const fs = require('fs');

console.log('Generating sample icons for README...\n');

// Helper to create hash from string
function hashString(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

// 1. Different compositions
console.log('Generating composition samples...');
const compositions = ['centered', 'radial', 'split', 'frame'];
compositions.forEach(comp => {
  const icon = generateIcon(hashString(`composition-${comp}`), {
    composition: comp,
    colorScheme: 'vibrant',
    shapeCount: 7
  });
  fs.writeFileSync(`samples/${comp}.svg`, icon);
  console.log(`✓ samples/${comp}.svg`);
});

// 2. Different color schemes
console.log('\nGenerating color scheme samples...');
const schemes = ['pastel', 'vibrant', 'ocean', 'sunset', 'warm', 'cool'];
schemes.forEach(scheme => {
  const icon = generateIcon(hashString(`scheme-${scheme}`), {
    composition: 'centered',
    colorScheme: scheme,
    shapeCount: 7
  });
  fs.writeFileSync(`samples/scheme-${scheme}.svg`, icon);
  console.log(`✓ samples/scheme-${scheme}.svg`);
});

// 3. Gradient examples
console.log('\nGenerating gradient samples...');
const icon = generateIcon(hashString('gradient-example'), {
  composition: 'radial',
  colorScheme: 'sunset',
  useGradients: true,
  shapeCount: 7
});
fs.writeFileSync('samples/gradient.svg', icon);
console.log('✓ samples/gradient.svg');

// 4. Individual shapes
console.log('\nGenerating shape samples...');
const shapes = ['circle', 'square', 'triangle', 'hexagon', 'diamond'];
shapes.forEach(shape => {
  const icon = generateIcon(hashString(`shape-${shape}`), {
    allowedShapes: [shape],
    composition: 'centered',
    colorScheme: 'cool',
    shapeCount: 5
  });
  fs.writeFileSync(`samples/shape-${shape}.svg`, icon);
  console.log(`✓ samples/shape-${shape}.svg`);
});

console.log('\n✅ All sample icons generated successfully!');
console.log(`\nTotal: ${compositions.length + schemes.length + 1 + shapes.length} icons`);
