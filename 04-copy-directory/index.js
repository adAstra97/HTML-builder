const fsPromises = require('fs/promises');
const path = require('path');

const originFolderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

const readOriginalFolder = async () => {
  try {
    const arr = await fsPromises.readdir(originFolderPath, { recursive: true });
    arr.forEach((file) => {
      fsPromises.copyFile(
        path.join(originFolderPath, file),
        path.join(copyFolderPath, file),
      );
    });
  } catch (err) {
    console.error(err);
  }
};

const createCopyFolder = async () => {
  try {
    await fsPromises.rm(copyFolderPath, { recursive: true, force: true });
    await fsPromises.mkdir(copyFolderPath, { recursive: true });
    await readOriginalFolder();
    console.log('Folder copied successfully');
  } catch (err) {
    console.error(err);
  }
};

createCopyFolder();
