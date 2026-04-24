import sharp from 'sharp';
import fs from 'fs';

async function generate() {
  const size = 512;
  const radius = 100; // Ощутимое скругление
  const bgColor = '#F9ECE1';

  // Берем логотип из нашего файла-источника
  const txt = fs.readFileSync('icon-base64.txt', 'utf8');
  const base64Data = txt.replace(/^data:image\/png;base64,/, "");
  const originalBuffer = Buffer.from(base64Data, 'base64');

  // Извлекаем само изображение малыша (без лишних полей)
  const contentBuffer = await sharp(originalBuffer)
    .extract({ left: 89, top: 84, width: 332, height: 348 })
    .toBuffer();

  const roundedBoxSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${bgColor}"/></svg>`
  );

  // Создаем иконку: скругленный квадрат с логотипом по центру
  const iconBuffer = await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
  .composite([
    { input: roundedBoxSvg, blend: 'over' },
    {
      input: await sharp(contentBuffer).resize(360, 360, { fit: 'contain' }).toBuffer(),
      gravity: 'center', blend: 'over'
    }
  ])
  .png()
  .toBuffer();

  // Сохраняем как основной файл
  await sharp(iconBuffer).toFile('public/icon-512.png');
  await sharp(iconBuffer).resize(192, 192).toFile('public/icon-192.png');

  console.log('Icons generated in V4-Style (Rounded with transparency).');
}

generate().catch(console.error);
