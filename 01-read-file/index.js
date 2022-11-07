const path = require('path');
const { createReadStream } = require('fs');
const { stdOut } = require('process');
const readStream = createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

readStream.pipe(stdOut);
readStream.on('error', (error) => {
    console.log(error.message);
});