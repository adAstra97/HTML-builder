const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(filePath);

const sayGoodbye = () => {
  process.on('exit', () => stdout.write('\nGoodbye! See you next time'));
  process.exit();
};

stdout.write('Hello! Please enter your text\n');
stdin.on('data', (data) => {
  if (data.toString().trim().toLowerCase() === 'exit') sayGoodbye();

  output.write(data);
});

process.on('SIGINT', sayGoodbye);
