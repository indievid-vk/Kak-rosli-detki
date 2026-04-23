import https from 'https';
import fs from 'fs';

const url = 'https://raw.githubusercontent.com/indievid-vk/Kak-rosli_detki/main/public/apple-icon.png';
const file = fs.createWriteStream('public/apple-icon.png');

https.get(url, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to get file: ${response.statusCode}`);
    return;
  }
  
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded apple-icon.png from GitHub');
    
    // Now also recreate the apple-icon-base64.txt so restore scripts don't corrupt it
    const data = fs.readFileSync('public/apple-icon.png');
    const base64 = `data:image/png;base64,${data.toString('base64')}`;
    fs.writeFileSync('apple-icon-base64.txt', base64);
    console.log('Created matching apple-icon-base64.txt');
  });
}).on('error', (err) => {
  fs.unlink('public/apple-icon.png', () => {});
  console.error(`Error: ${err.message}`);
});
