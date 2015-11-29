var packager = require('electron-packager');
var config   = require('./package.json');

packager({
  dir: './',
  out: '../dist',
  name: config.name,
  platform: 'darwin',
  arch: 'x64',
  version: '0.30.0',
  icon: './icon_512x512@2x.icns',

  'app-bundle-id': '',
  'app-version': config.version,
  'helper-bundle-id': '',
  overwrite: true,
  asar: true,
  prune: true,
  ignore: "node_modules/(electron-packager|electron-prebuilt|\.bin)|release\.js",
  'version-string': {
    CompanyName: 'putchom',
    FileDescription: 'tmblr VJ System',
    OriginalFilename: config.name,
    FileVersion: config.version,
    ProductVersion: config.version,
    ProductName: config.name,
    InternalName: config.name
  }
}, function done (err, appPath) {
  if(err) {
    throw new Error(err);
  }
  console.log('Done!!');
});
