# parcel-plugin-change-file

## :bulb: How ignore parcel bundler file ?

On Parcel build end, change index.html context, and copy static files in outDir

## :building_construction: Install

```sh
$ yarn add -D parcel-plugin-change-file
```

## :pencil2: Create parcel-plugin-change-file.js file

```
// in project-dir
module.exports = {
  html: ['<link rel="manifest" href="manifest.webmanifest">'],
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

File tree like this:

![](.imgs/2018-07-22-00-27-46.png)