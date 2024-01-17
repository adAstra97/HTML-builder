const fsPromises = require('fs/promises');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');
fsPromises.readdir(secretFolderPath, { withFileTypes: true }).then((res) => {
  res.forEach((item) => {
    if (item.isFile()) {
      const filePath = path.join(secretFolderPath, item.name);
      const convertedPath = item.name.replace('.', ' - ');

      fsPromises.stat(filePath).then((stat) => {
        console.log(`${convertedPath} - ${(stat.size / 1024).toFixed(3)}kb`);
      });
    }
  });
});
