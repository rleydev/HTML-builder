const path = require('path');
const { stdout } = require('process');
const { readdir, stat } = require('fs/promises');
const folder = 'secret-folder';
const folderPath = path.join(__dirname, folder);
const options = { withFileTypes: true };
const separator = '-';
const convertToKb = (bytes, digitsAfter = 3) => `${(bytes / 1024).toFixed(digitsAfter)}kb`;

async function logInfo(fullPath, outputDelimiter) {
  try {
    const filestat = await stat(fullPath);
    const info = path.basename(fullPath).split('.');
    info.push(convertToKb(filestat.size));
    stdout.write(`${info.join(outputDelimiter)}\n`);
  } catch (err) {
    console.log(err.message);
  }
}

async function printFilesInfo(folder, options, outputDelimiter) {
  try {
    const files = await readdir(folder, options);
    files
      .filter((file) => file.isFile())
      .forEach((file) => {
        logInfo(path.join(folder, file.name), outputDelimiter);
      });
  } catch (err) {
    console.log(err.message);
  }
}

printFilesInfo(folderPath, options, separator);