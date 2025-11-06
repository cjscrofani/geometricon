#!/usr/bin/env node

const { generateIcon } = require('../dist/index');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Parse command line arguments
const args = process.argv.slice(2);

function showHelp() {
  console.log(`
Geometricon - Geometric Icon Generator

Usage:
  geometricon <hash> [options]
  geometricon --help

Arguments:
  <hash>                    Hash string to generate icon from

Options:
  --output, -o <path>       Output file path (default: stdout)
  --size <number>           Icon size in pixels (default: 200)

  Shape Count Options:
  --shape-count <number>    Fixed number of shapes
  --shape-count-min <n>     Minimum number of shapes
  --shape-count-max <n>     Maximum number of shapes
  --no-complexity           Disable complexity-based generation

  Shape Type Options:
  --shapes <types>          Allowed shape types (comma-separated)
                            Options: circle,square,triangle,hexagon,diamond
                            Example: --shapes circle,square,triangle

  Composition Options:
  --composition <mode>      Visual composition strategy (default: centered)
                            Options: centered, radial, split, frame, random
                            • centered: Main shape in center with accents
                            • radial: Circular arrangement around center
                            • split: Clean left/right or top/bottom division
                            • frame: Central shape with corner/edge decorations
                            • random: Original random positioning

  Color Options:
  --color <color>           Single fixed color for all shapes (hex: #FF5733)
  --color-palette <colors>  Custom color palette (comma-separated hex values)
                            Example: --color-palette "#FF5733,#33FF57,#3357FF"
  --color-scheme <scheme>   Preset color scheme
                            Options: pastel, vibrant, warm, cool, monochrome,
                                    earth, ocean, sunset
  --saturation-min <n>      Min saturation (0-100, default: 40)
  --saturation-max <n>      Max saturation (0-100, default: 65)
  --lightness-min <n>       Min lightness (0-100, default: 70)
  --lightness-max <n>       Max lightness (0-100, default: 88)
  --opacity-min <n>         Min opacity (0-1, default: 0.65)
  --opacity-max <n>         Max opacity (0-1, default: 0.9)
  --use-gradients           Use gradients instead of solid colors

Examples:
  # Generate from a hash
  geometricon abc123def456 -o icon.svg

  # Generate from MD5 of text
  echo -n "hello" | md5 | xargs geometricon -o hello-icon.svg

  # Fixed 3 shapes, only circles and squares
  geometricon abc123 --shape-count 3 --shapes circle,square -o simple.svg

  # Disable complexity-based generation
  geometricon abc123 --no-complexity --shape-count-min 2 --shape-count-max 5

  # Custom colors (vibrant instead of pastel)
  geometricon abc123 --saturation-min 70 --saturation-max 90 --lightness-min 50 --lightness-max 70

  # Use a single color
  geometricon abc123 --color "#FF5733" -o icon.svg

  # Use a custom color palette
  geometricon abc123 --color-palette "#FF5733,#33FF57,#3357FF" -o icon.svg

  # Use a preset color scheme
  geometricon abc123 --color-scheme ocean -o icon.svg
`);
}

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

// Parse arguments
const hash = args[0];
let output = null;
const options = {};

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  const next = args[i + 1];

  switch (arg) {
    case '--output':
    case '-o':
      output = next;
      i++;
      break;

    case '--size':
      options.size = parseInt(next);
      i++;
      break;

    case '--shape-count':
      options.shapeCount = parseInt(next);
      i++;
      break;

    case '--shape-count-min':
      options.shapeCountMin = parseInt(next);
      i++;
      break;

    case '--shape-count-max':
      options.shapeCountMax = parseInt(next);
      i++;
      break;

    case '--no-complexity':
      options.useComplexity = false;
      break;

    case '--shapes':
      options.allowedShapes = next.split(',').map(s => s.trim());
      i++;
      break;

    case '--composition':
      options.composition = next;
      i++;
      break;

    case '--color':
      options.color = next;
      i++;
      break;

    case '--color-palette':
      options.colorPalette = next.split(',').map(s => s.trim());
      i++;
      break;

    case '--color-scheme':
      options.colorScheme = next;
      i++;
      break;

    case '--saturation-min':
      options.saturationMin = parseInt(next);
      i++;
      break;

    case '--saturation-max':
      options.saturationMax = parseInt(next);
      i++;
      break;

    case '--lightness-min':
      options.lightnessMin = parseInt(next);
      i++;
      break;

    case '--lightness-max':
      options.lightnessMax = parseInt(next);
      i++;
      break;

    case '--opacity-min':
      options.opacityMin = parseFloat(next);
      i++;
      break;

    case '--opacity-max':
      options.opacityMax = parseFloat(next);
      i++;
      break;

    case '--use-gradients':
      options.useGradients = true;
      break;

    default:
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
  }
}

// Validate hash
if (!hash || hash.length < 8) {
  console.error('Error: Hash must be at least 8 characters long');
  process.exit(1);
}

try {
  // Generate icon
  const svg = generateIcon(hash, options);

  // Output
  if (output) {
    fs.writeFileSync(output, svg);
    console.log(`Icon generated: ${output}`);

    // Show options used
    const usedOptions = [];
    if (options.useComplexity === false) usedOptions.push('complexity: disabled');
    if (options.shapeCount) usedOptions.push(`shapes: ${options.shapeCount}`);
    if (options.shapeCountMin || options.shapeCountMax) {
      usedOptions.push(`shapes: ${options.shapeCountMin || 2}-${options.shapeCountMax || 4}`);
    }
    if (options.allowedShapes) usedOptions.push(`types: ${options.allowedShapes.join(', ')}`);
    if (options.composition && options.composition !== 'centered') usedOptions.push(`composition: ${options.composition}`);
    if (options.color) usedOptions.push(`color: ${options.color}`);
    if (options.colorPalette) usedOptions.push(`palette: ${options.colorPalette.length} colors`);
    if (options.colorScheme) usedOptions.push(`scheme: ${options.colorScheme}`);

    if (usedOptions.length > 0) {
      console.log(`Options: ${usedOptions.join(', ')}`);
    }
  } else {
    console.log(svg);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
