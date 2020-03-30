const babel = require('babel-core');
const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.resolve(__dirname, 'util.js'));

babel.transform(code.toString(), {
  plugins: [
    [
      path.resolve(__dirname, '../index.js'),
      {
        outputFile: path.resolve(__dirname, 'message.json'),
      },
    ],
  ],
});

const message = fs.readFileSync(path.resolve(__dirname, 'message.json'));

console.log(JSON.stringify(JSON.parse(message.toString()), null, 2));
