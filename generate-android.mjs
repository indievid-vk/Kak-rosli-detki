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

  // Extract content
  const contentLeft = 89;
  const contentTop = 84;
  const contentWidth = 332;
  const contentHeight = 348;

  const contentBuffer = await sharp(originalBuffer)
    .extract({ left: contentLeft, top: contentTop, width: contentWidth, height: contentHeight })
    .toBuffer();

  const targetPadding = 42;
  const maxContentInTarget = size - (targetPadding * 2);

  // 1. Create the rounded box with the logo inside
  const roundedBoxSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${bgColor}" stroke="none"/></svg>`
  );

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    {
      input: roundedBoxSvg,
      blend: 'over'
    },
    {
      input: await sharp(contentBuffer)
        .resize(maxContentInTarget, maxContentInTarget, { fit: 'contain', background: { r: 249, g: 236, b: 225, alpha: 0 } })
        .toBuffer(),
      gravity: 'center',
      blend: 'over'
    }
  ])
  .png()
  .toFile('public/icon-512-rounded.png');
  
  // 2. Generate maskable icon for Android homescreen
  const maskableTargetPadding = 64; // More padding for maskable safety zone
  const maskableMaxContentInTarget = size - (maskableTargetPadding * 2);

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: bgColor
    }
  })
  .composite([{
    input: await sharp(contentBuffer)
      .resize(maskableMaxContentInTarget, maskableMaxContentInTarget, { fit: 'contain', background: { r: 249, g: 236, b: 225, alpha: 0 } })
      .toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toFile('public/maskable-icon-512-v2.png');

  console.log('Icons generation completed.');
}

generate().catch(console.error);
