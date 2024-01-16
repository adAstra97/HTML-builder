const fs = require('fs');
const path = require('path');
const { stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath);
readableStream.on('data', (chunk) => stdout.write(chunk));
