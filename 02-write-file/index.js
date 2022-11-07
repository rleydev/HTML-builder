const path = require('path');
const fileName = 'new.txt';
const { createWriteStream } = require('fs');
const { createInterface } = require('readline');
const { stdIn, stdOut, exit } = require('process');
const outputFile = createWriteStream(path.join(__dirname, 'new.txt'), 'utf-8');

const rl = createInterface({
  input: stdIn,
  output: stdOut,
})

const stop = () => {
  rl.write('Buy!');
  rl.close();
  outputFile.end();
  exit(0);
}

rl.write(`What to write in ${fileName}? \n`);

rl.on('line', (data) => {
  data.trim().toLowerCase() === 'exit' ? stop() : outputFile.write(`${data}\n`);
});

rl.on('SIGINT', () => {
  stop();
})