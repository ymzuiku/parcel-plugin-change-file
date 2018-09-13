const fs = require('fs-extra');
const path = require('path');

const package = require(path.resolve(process.cwd(), 'package.json'));
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
let isCopyed = false;

function changeHtml(filePath) {
  let data = fse.readFileSync(filePath, { encoding: 'utf-8' });
  if (config && config.html && config.html.length > 0) {
    for (let i = 0, l = config.html.length; i <= l; i++) {
      const exp = eval(
        `/<!-- ${config.replaceName || 'parcel-plugin-change-file'}-${i} -->/g`,
      );
      data = data.replace(exp, config.html[i]);
    }
  }
  data = data.replace(/<!--\|/g, '');
  data = data.replace(/\|-->/g, '');
  setTimeout(() => {
    fse.removeSync(filePath);
    fse.createFileSync(filePath);
    fse.writeFileSync(filePath, data);
  }, config.timeout || 30);
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
      if (bund.type === 'html') {
        changeHtml(bund.name);
      }
      if (!isCopyed) {
        isCopyed = true;
        copyFiles(bundleDir);
      }
    });
  }
};
