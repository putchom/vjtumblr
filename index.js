var app           = require('app');
var BrowserWindow = require('browser-window');
var Menu          = require('menu');
var ipc           = require('ipc');
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

  // videoWindowにgifをアサイン
  ipc.on('assign-video-window', function(event, imageUrl, channel) {
    videoWindow.webContents.send('assign-video-window', imageUrl, channel);
  });

  // videoWindowの各チャンネルにCueを送る
  ipc.on('send-cue', function(event, channel, now) {
    videoWindow.webContents.send('send-cue', channel, now);
  });

  // videoWindowのgifをClearする
  ipc.on('send-clear', function(event, imageUrl, channel) {
    videoWindow.webContents.send('send-clear', imageUrl, channel);
  });

  // ABフェーダーの値をvideoWindowに送る
  ipc.on('send-ab-fader-val', function(event, val) {
    videoWindow.webContents.send('send-ab-fader-val', val);
  });

  // 明暗フェーダーの値をvideoWindowに送る
  ipc.on('send-bw-fader-val', function(event, val) {
    videoWindow.webContents.send('send-bw-fader-val', val);
  });

  // Textの値をvideoWindowに送る
  ipc.on('send-text', function(event, textResources, textFontClass, textColorClass) {
    videoWindow.webContents.send('send-text', textResources, textFontClass, textColorClass);
  });

  // TextのOpacityの値をvideoWindowに送る
  ipc.on('send-text-opacity', function(event, textOpacity) {
    videoWindow.webContents.send('send-text-opacity', textOpacity);
  });

  // コメントをvideoWindowに送る
  ipc.on('send-bullet', function(event, bullet) {
    videoWindow.webContents.send('send-bullet', bullet);
  });

  // コメントのOpacityの値をvideoWindowに送る
  ipc.on('send-comment-opacity', function(event, commentOpacity) {
    videoWindow.webContents.send('send-comment-opacity', commentOpacity);
  });
});
