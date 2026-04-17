import sharp from 'sharp';

async function resize() {
  await sharp('public/icon.png')
    .resize(192, 192)
    .toFile('public/images/icon-192.png');
  console.log('Resized to 192x192 successfully');
}
resize();
