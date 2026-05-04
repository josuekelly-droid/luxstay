// scripts/convert-svg-to-png.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const files = [
  { input: 'favicon.svg', output: 'favicon.png', width: 64, height: 64 },
  { input: 'icon-192.svg', output: 'icon-192.png', width: 192, height: 192 },
  { input: 'icon-512.svg', output: 'icon-512.png', width: 512, height: 512 },
  { input: 'og-image.svg', output: 'og-image.png', width: 1200, height: 630 },
];

async function convertAll() {
  console.log('🔄 Conversion SVG → PNG en cours...\n');

  for (const file of files) {
    const inputPath = path.join(publicDir, file.input);
    const outputPath = path.join(publicDir, file.output);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  ${file.input} introuvable, ignoré.`);
      continue;
    }

    const svgBuffer = fs.readFileSync(inputPath);

    await sharp(svgBuffer)
      .resize(file.width, file.height)
      .png()
      .toFile(outputPath);

    console.log(`✅ ${file.input} → ${file.output} (${file.width}x${file.height})`);
  }

  console.log('\n🎉 Conversion terminée !');
}

convertAll().catch(console.error);