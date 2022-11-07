const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Type something to add the text in file...\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') exit();
  output.write(data);
});

process.on('exit', () => stdout.write('Your text has been added to file\n'));
process.on('SIGINT', exit);