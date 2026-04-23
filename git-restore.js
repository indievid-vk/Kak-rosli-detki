import { execSync } from 'child_process';

try {
  execSync('git checkout public/apple-icon.png');
  console.log('Restored apple-icon.png from git');
} catch (e) {
  console.error('Failed', e.toString());
}
