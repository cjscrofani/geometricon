// Example usage of Geometricon library
const { generateIcon } = require('../dist/index');
const crypto = require('crypto');
const fs = require('fs');

// Generate a hash from a user email
const userEmail = 'alice@example.com';
const hash = crypto.createHash('md5').update(userEmail).digest('hex');

// Generate icon with default settings (7 shapes, centered composition)
const icon1 = generateIcon(hash);
fs.writeFileSync('example-default.svg', icon1);
console.log('✓ Generated example-default.svg');

// Generate icon with custom composition and color scheme
const icon2 = generateIcon(hash, {
  composition: 'radial',
  colorScheme: 'ocean',
  size: 300
});
fs.writeFileSync('example-radial-ocean.svg', icon2);
console.log('✓ Generated example-radial-ocean.svg');

// Generate icon with single color
const icon3 = generateIcon(hash, {
  composition: 'frame',
  color: '#3498DB',
  shapeCount: 5
});
fs.writeFileSync('example-blue-frame.svg', icon3);
console.log('✓ Generated example-blue-frame.svg');

// Generate icon with custom color palette
const icon4 = generateIcon(hash, {
  composition: 'split',
  colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
  shapeCount: 3
});
fs.writeFileSync('example-custom-palette.svg', icon4);
console.log('✓ Generated example-custom-palette.svg');

console.log('\nAll examples generated successfully!');
