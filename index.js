const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const config = require(path.resolve(
  process.cwd(),
  'parcel-plugin-change-file.js',
));

function changeHtml(filePath, data = '') {
  if (config && config.html) {
    data = data.replace('<!-- parcel-plugin-change-file -->', html);
    fs.writeFileSync(filePath, data);
  }
}

function copys(outPath) {
  if (config && config.copy && config.copy.lenght > 0) {
    for (var i = 0, l = config.copyDirs.length; i < l; i++) {
      const ele = config.copyDirs[i];
      const targetPath = path.resolve(outPath, ele);
      fse.copySync(targetPath, outPath);
    }
  }
}

module.exports = function(bundler) {
  bunder.on('buildEnd', () => {
    // changeHtml
    const bundleDir = path.dirname(bundle.name);
    const htmlPath = path.resolve(bundleDir, 'index.html');
    fs.readFileSync(htmlPath, (err, data) => {
      if (err) throw err;
      fs.unlinkSync(htmlPath, err => {
        if (err) throw err;
        changeHtml(htmlPath, data);
      });
    });
    copys(bundleDir);
  });
};
