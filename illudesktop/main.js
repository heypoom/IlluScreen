const electron = require('electron')
const {PeerServer} = require('peer')

const {app, BrowserWindow} = electron

const RTC_PORT = 9000

let mainWindow

function createWindow() {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width,
    height,
    transparent: true,
    frame: false
  })

  mainWindow.setIgnoreMouseEvents(true)
  mainWindow.setAlwaysOnTop(true)

  mainWindow.loadURL('http://localhost:3000')

  mainWindow.webContents.openDevTools({mode: 'detach'})

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (!mainWindow) {
    createWindow()
  }
})

// Enable WebRTC server
PeerServer({
  debug: true,
  port: RTC_PORT
})
