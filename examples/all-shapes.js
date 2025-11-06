// Example showing all possible shape types
const { generateIcon } = require('../dist/index');
const crypto = require('crypto');
const fs = require('fs');

console.log('Generating examples for all shape types...\n');

// All available shape types
const shapeTypes = ['circle', 'square', 'triangle', 'hexagon', 'diamond'];

// Generate an icon for each shape type
shapeTypes.forEach((shapeType, index) => {
  const hash = crypto.createHash('md5')
    .update(`shape-${shapeType}-${index}`)
    .digest('hex');

  const icon = generateIcon(hash, {
    allowedShapes: [shapeType],
    composition: 'centered',
    colorScheme: 'vibrant',
    shapeCount: 5
  });

  const filename = `example-shape-${shapeType}.svg`;
  fs.writeFileSync(filename, icon);
  console.log(`✓ Generated ${filename} - Only ${shapeType} shapes`);
});

console.log('\n--- With gradients ---\n');

// Generate gradient versions
shapeTypes.forEach((shapeType, index) => {
  const hash = crypto.createHash('md5')
    .update(`gradient-${shapeType}-${index}`)
    .digest('hex');

  const icon = generateIcon(hash, {
    allowedShapes: [shapeType],
    composition: 'radial',
    colorScheme: 'cool',
    shapeCount: 5,
    useGradients: true
  });

  const filename = `example-gradient-${shapeType}.svg`;
  fs.writeFileSync(filename, icon);
  console.log(`✓ Generated ${filename} - ${shapeType} with gradients`);
});

console.log('\n--- All shapes combined ---\n');

// Generate with all shapes
const combinedHash = crypto.createHash('md5')
  .update('all-shapes-combined')
  .digest('hex');

const combinedIcon = generateIcon(combinedHash, {
  composition: 'centered',
  colorScheme: 'pastel',
  shapeCount: 7
});

fs.writeFileSync('example-all-shapes.svg', combinedIcon);
console.log('✓ Generated example-all-shapes.svg - All shape types combined');

// Generate with all shapes + gradients
const combinedGradientIcon = generateIcon(combinedHash, {
  composition: 'frame',
  colorScheme: 'sunset',
  shapeCount: 7,
  useGradients: true
});

fs.writeFileSync('example-all-shapes-gradient.svg', combinedGradientIcon);
console.log('✓ Generated example-all-shapes-gradient.svg - All shapes with gradients');

console.log('\nAll examples generated successfully!');
console.log('\nShape types available:');
shapeTypes.forEach(shape => console.log(`  - ${shape}`));
