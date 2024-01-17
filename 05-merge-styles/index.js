const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const styleFolder = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(pathBundle);

fsPromises.readdir(styleFolder, { withFileTypes: true }).then((res) => {
  res.forEach((item) => {
    if (item.isFile() && path.extname(item.name) === '.css') {
      const filePath = path.join(styleFolder, item.name);
      const readableStream = fs.createReadStream(filePath);
      readableStream.on('data', (chunk) =>
        output.write(chunk.toString() + '\n'),
      );
    }
  });
});
