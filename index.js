const fse = require('fs-extra');
const path = require('path');
const config = require(path.resolve(
  process.cwd(),
  'parcel-plugin-change-file.js',
));

function changeHtml(filePath, data = '') {
  if (config && config.html && config.html.length > 0) {
    for (let i = 0, l = config.html.length; i <= l; i++) {
      data = data.replace(
        `<!-- parcel-plugin-change-file[${i}] -->`,
        config.html[i],
      );
    }
<<<<<<< HEAD
  }
  data = data.replace('<!--[', '');
  data = data.replace(']-->', '');
  fse.createFileSync(filePath);
  fse.writeFileSync(filePath, data);
=======
    fse.createFileSync(filePath);
    fse.writeFileSync(filePath, data);
  }
  data = data.replace('<!--[', '');
  data = data.replace(']-->', '');
>>>>>>> 3273e7786f84f474342150b92a9f89a2a43e02cc
}

function copyFiles(outPath) {
  if (config && config.copy && config.copy.length > 0) {
    for (var i = 0, l = config.copy.length; i < l; i++) {
      const ele = config.copy[i];
      const targetPath = path.resolve(process.cwd(), ele);
      fse.copySync(targetPath, outPath);
    }
  }
}

module.exports = function(bundler) {
  bundler.on('bundled', bund => {
    const bundleDir = path.dirname(bund.name);
    const htmlPath = path.resolve(bundleDir, 'index.html');
    const data = fse.readFileSync(htmlPath, { encoding: 'utf-8' });
    fse.removeSync(htmlPath);
    changeHtml(htmlPath, data);
    copyFiles(bundleDir);
  });
};
