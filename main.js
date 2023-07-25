const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path');
const fs = require('fs');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.loadFile('index.html')
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('upload-data', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'CSV', extensions: ['csv'] }]
    }).then(result => {
        if(!result.canceled) {
            const sourceFilePath = result.filePaths[0];
            const destFilePath = path.join(__dirname, 'data', path.basename(sourceFilePath));
            fs.copyFile(sourceFilePath, destFilePath, (err) => {
                if (err) throw err;
                console.log('File was copied to destination');
            });
        }
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on('configure-data', (event) => {
  console.log('Received configure-data event');
  const configureWindow = new BrowserWindow({
      width: 800,
      height: 600,
      parent: win, // This makes the new window a child of the main window
      modal: true,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true
      }
  });

  configureWindow.loadFile('configure.html');
});
