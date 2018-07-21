const fse = require('fs-extra');
const path = require('path');
const config = require(path.resolve(
  process.cwd(),
  'parcel-plugin-change-file.js',
));

function changeHtml(filePath, data = '') {
  if (config && config.html && config.html.length > 0) {
    for (let i = 0, l = config.html.length; i <=l; i++) {
      data = data.replace(
        `<!-- parcel-plugin-change-file[${i}] -->`,
        config.html[i],
      );
    }
    fse.createFileSync(filePath);
    fse.writeFileSync(filePath, data);
  } else {
    console.log(
      'parcel-plugin-change-file: please add html strings in parcel-plugin-change-file.js',
    );
  }
}

function copyFiles(outPath) {
  if (config && config.copy && config.copy.length > 0) {
    for (var i = 0, l = config.copy.length; i < l; i++) {
      const ele = config.copy[i];
      const targetPath = path.resolve(process.cwd(), ele);
      fse.copySync(targetPath, outPath);
    }
  } else {
    console.log(
      'parcel-plugin-change-file: please add copy files in parcel-plugin-change-file.js',
    );
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
