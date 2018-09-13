const fs = require('fs-extra');
const path = require('path');

const package = require(path.resolve(process.cwd(), 'package.json'));
const configFilePath = path.resolve(
  process.cwd(),
  'parcel-plugin-change-file.js',
);

let config;
if (package['parcel-plugin-change-file']) {
  config = package['parcel-plugin-change-file'];
} else if (fs.existsSync(configFilePath)) {
  config = require(configFilePath);
} else {
  console.log(
    'No find parcel-plugin-change-file in package.json or parcel-plugin-change-file.js',
  );
  return;
}

function changeHtml(filePath, data = '') {
  if (config && config.html && config.html.length > 0) {
    for (let i = 0, l = config.html.length; i <= l; i++) {
      const exp = eval(`/<!-- parcel-plugin-change-file-${i} -->/g`);
      data = data.replace(exp, config.html[i]);
    }
  }
  data = data.replace(/<!--\|/g, '');
  data = data.replace(/\|-->/g, '');
  fs.createFileSync(filePath);
  fs.writeFileSync(filePath, data);
}

function copyFiles(outPath) {
  if (config && config.copy && config.copy.length > 0) {
    for (var i = 0, l = config.copy.length; i < l; i++) {
      const ele = config.copy[i];
      const targetPath = path.resolve(process.cwd(), ele);
      fs.copySync(targetPath, outPath);
    }
  }
}

module.exports = function(bundler) {
  if (process.env.changeFile != 'false') {
    bundler.on('bundled', bund => {
      const bundleDir = path.dirname(bund.name);
      const htmlPath = path.resolve(bundleDir, 'index.html');
      const ishaveHtml = fs.existsSync(htmlPath);
      if (ishaveHtml) {
        const data = fs.readFileSync(htmlPath, { encoding: 'utf-8' });
        fs.removeSync(htmlPath);
        changeHtml(htmlPath, data);
      }
      copyFiles(bundleDir);
    });
  }
};
