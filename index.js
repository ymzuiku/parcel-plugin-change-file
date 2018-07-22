const fse = require('fs-extra');
const path = require('path');
const config = require(path.resolve(
  process.cwd(),
  'parcel-plugin-change-file.js',
));

function changeHtml(filePath, data = '') {
  if (config && config.html && config.html.length > 0) {
    for (let i = 0, l = config.html.length; i <= l; i++) {
      const exp = eval(`/<!-- parcel-plugin-change-file-${i} -->/g`)
      data = data.replace(
        exp,
        config.html[i],
      );
    }
  }
  data = data.replace(/<!--\[/g, '');
  data = data.replace(/\]-->/g, '');
  fse.createFileSync(filePath);
  fse.writeFileSync(filePath, data);
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
  if (process.env.changeFile != 'false') {
    bundler.on('bundled', bund => {
      console.log(bund)
      const bundleDir = path.dirname(bund.name);
      if (bund.type === 'html') {
        const data = fse.readFileSync(bund.name, { encoding: 'utf-8' });
        fse.removeSync(bund.name);
        changeHtml(bund.name, data);
      }
      copyFiles(bundleDir);
    });
  }
};
