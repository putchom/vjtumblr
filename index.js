var app           = require('app');
var BrowserWindow = require('browser-window');
var Menu          = require('menu');
var mainWindow    = null;
var videoWindow   = null;
var aboutWindow   = null;
var template = [
  {
    label: 'Quit',
    submenu: [
      { label: 'About VJ Tumblr', click: function() { openAboutWindow(); }},
      { label: 'Open Video Window', accelerator: 'CmdOrCtrl+O', click: function() { openVideoWindow(); }},
      { type: 'separator' },
      { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function() { app.quit(); }}
    ]
  },{
    label: 'View',
    submenu: [
      { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }},
      { label: 'Open Dev Tools', accelerator: 'Alt+CmdOrCtrl+I', click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }}
    ]
  },{
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:'}
    ]
  },{
    label: 'Window',
    submenu: [
      { label: 'Close', accelerator: 'CmdOrCtrl+W', selector: 'performClose:'}
    ]
  }
];
var menu = Menu.buildFromTemplate(template);
function openMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 680,
    resizable: false
  });
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
}
function openVideoWindow() {
  videoWindow = new BrowserWindow({
    width: 800,
    height: 450
  });
  videoWindow.loadUrl('file://' + __dirname + '/video.html');
}
function openAboutWindow() {
  aboutWindow = new BrowserWindow({
    width: 400,
    height: 200
  });
  aboutWindow.loadUrl('file://' + __dirname + '/about.html');
}
app.on('window-all-closed', function() {
  app.quit();
});
app.on('ready', function() {
  Menu.setApplicationMenu(menu);
  openMainWindow();
  openVideoWindow();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  videoWindow.on('closed', function() {
    videoWindow = null;
  });
});
