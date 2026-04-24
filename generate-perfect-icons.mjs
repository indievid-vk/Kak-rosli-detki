import sharp from 'sharp';
import fs from 'fs';

async function generate() {
  const size = 512;
  const radius = 115; // standard ~22.5% rounding for app icons
  const bgColor = '#F9ECE1';

  // Read the original base64 to extract the logo
  const txt = fs.readFileSync('icon-base64.txt', 'utf8');
  const base64Data = txt.replace(/^data:image\/png;base64,/, "");
  const originalBuffer = Buffer.from(base64Data, 'base64');

  // Extract content (the logo itself)
  const contentLeft = 89;
  const contentTop = 84;
  const contentWidth = 332;
  const contentHeight = 348;

  const contentBuffer = await sharp(originalBuffer)
    .extract({ left: contentLeft, top: contentTop, width: contentWidth, height: contentHeight })
    .toBuffer();

  // 1. Generate transparent rounded icons for "purpose": "any"
  const targetPadding = 42;
  const maxContentInTarget = size - (targetPadding * 2);

  const roundedBoxSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${bgColor}" stroke="none"/></svg>`
  );

  const roundedImg512 = await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
  .composite([
    { input: roundedBoxSvg, blend: 'over' },
    {
      input: await sharp(contentBuffer).resize(maxContentInTarget, maxContentInTarget, { fit: 'contain' }).toBuffer(),
      gravity: 'center', blend: 'over'
    }
  ])
  .png()
  .toBuffer();

  await sharp(roundedImg512).toFile('public/icon-512.png');
  await sharp(roundedImg512).resize(192).toFile('public/icon-192.png');

  // 2. Generate maskable icon for Android (FULL BLEED, NO CORNERS, SOLID BG)
  // Maskable safe zone is a circle with diameter 0.8 * size = 409.6px.
  // We will make the logo fit comfortably within 350px.
  const maskableContentSize = 350;

  await sharp({
    create: { width: size, height: size, channels: 3, background: bgColor }
  })
  .composite([{
    input: await sharp(contentBuffer).resize(maskableContentSize, maskableContentSize, { fit: 'contain' }).toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toFile('public/maskable-icon-512.png');

  console.log('Perfect icons generated.');
}

generate().catch(console.error);
