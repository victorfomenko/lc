var path = require('path');
const spawn = require('child_process').spawn;

var staticDir = path.resolve('./static/css');
var inputFile = path.resolve('./css/lovecanvas.sass');
var outputFile = staticDir + '/main.css';

function compile(dev, watch) {
  const options = [];

  if (watch) {
    options.push('--watch');
  }

  if (dev) {
    options.push('--source-map', outputFile + '.map');
  } else {
    options.push('--output-style', 'compressed');
  }

  options.push(inputFile, outputFile);

  const ls = spawn('node-sass', options);

  ls.stdout.on('data', (data) => {
    console.log(`node-sass: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.log(`node-sass error: ${data}`);
  });
}

module.exports = function (dev) {
  compile(dev);
  dev && compile(dev, true);
};