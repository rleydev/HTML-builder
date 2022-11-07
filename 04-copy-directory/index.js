
const fs = require('fs');
const path  = require('path');
const { mkdir, copyFile, readdir, rm } = require ('node:fs/promises');

async function copyDir () {
  const sourcePath = path.join(__dirname, 'files');
  const destPath = path.join(__dirname, 'files-copy');

  async function createDir(newFolder) {
    try {
      await mkdir(newFolder);
    } catch (error) {
      await rm(newFolder, { recursive: true, force: true });
      await createDir(newFolder)
    }
  }
  await createDir(destPath)
  
  copyFolder(sourcePath, destPath)
  
  async function copyFolder(orig, res) {
    try {
      const files = await readdir(orig, { withFileTypes: true });
      for (const file of files) {
        const sourseFile = path.join(orig, file.name);
        const destFile = path.join(res, file.name);
        if (file.isFile()) {
          await copyFile(sourseFile, destFile);
        } else {
          createDir(path.join(res, file.name));
          copyFolder(path.join(orig, file.name), path.join(res, file.name))
        }
      }
    } catch (error) {
      console.error("It is impossible to read the folder");
    }
  } 
}

copyDir();