import sharp from 'sharp';

async function fix() {
  await sharp('public/icon-512.png')
    .flatten({ background: '#F9ECE1' })
    .resize(192, 192)
    .toFile('public/apple-icon.png');
  console.log('Fixed apple-icon.png');
}
fix();
