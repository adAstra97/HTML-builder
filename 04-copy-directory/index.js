const fsPromises = require('fs/promises');
const path = require('path');

const originFolderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

const readOriginalFolder = async (currentFolder, targetFolder) => {
  try {
    const arr = await fsPromises.readdir(currentFolder, { recursive: true });

    for (const file of arr) {
      const sourceFilePath = path.join(currentFolder, file);
      const targetFilePath = path.join(targetFolder, file);

      const stat = await fsPromises.stat(sourceFilePath);

      if (stat.isFile()) {
        await fsPromises.copyFile(sourceFilePath, targetFilePath);
      } else {
        await fsPromises.mkdir(targetFilePath, { recursive: true });
        await readOriginalFolder(sourceFilePath, targetFilePath);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const createCopyFolder = async () => {
  try {
    await fsPromises.rm(copyFolderPath, { recursive: true, force: true });
    await fsPromises.mkdir(copyFolderPath, { recursive: true });
    await readOriginalFolder(originFolderPath, copyFolderPath);

    console.log('Folder copied successfully');
  } catch (err) {
    console.error(err);
  }
};

createCopyFolder();
