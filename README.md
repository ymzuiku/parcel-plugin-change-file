# parcel-plugin-change-file

On Parcel build end, change index.html context, and copy static files in outDir

## Install

```sh
$ yarn add -D parcel-plugin-change-file
```

## :robot: Create parcel-plugin-change-file.js file

```
// in project-root-dir
module.exports = {
  html: `
    <h1>hello change</h1>
  `,
  copy: ['src/assets'],
};
```

## :lipstick: Fix index.html

Add `<!-- parcel-plugin-change-file -->` in index.html

```html
<body>
  <!-- parcel-plugin-change-file -->
</bodt>
```

## :beer: OK, after build, we change static html and files!
