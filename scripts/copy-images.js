import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Source and destination directories
const srcDir = path.join(rootDir, 'src', 'img');
const destDir = path.join(rootDir, 'public', 'img');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  try {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Created directory: ${destDir}`);
  } catch (err) {
    console.error(`Error creating directory: ${err}`);
  }
}

// Copy files from source to destination
function copyFiles(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source directory not found: ${src}`);
    return;
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Create the same directory in destination
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      // Recursively copy the subdirectory
      copyFiles(srcPath, destPath);
    } else {
      // Copy the file
      try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${srcPath} → ${destPath}`);
      } catch (err) {
        console.error(`Error copying file: ${err}`);
      }
    }
  }
}

// Start the copy process
try {
  copyFiles(srcDir, destDir);
  console.log('Images copied successfully!');
} catch (err) {
  console.error(`Error during copy process: ${err}`);
} 