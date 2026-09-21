const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const { initDatabase, getDb } = require('../database/db');

let mainWindow;
let server;

// Initialize database before app ready
initDatabase();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    autoHideMenuBar: true,
    title: 'GM Electric Store'
  });

  // In development, load from Next.js dev server
  // In production, load from exported static files
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (server) {
      server.close();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Start Express server for API routes
  const expressApp = express();
  expressApp.use(express.json());
  
  // Register API routes
  const apiRoutes = require('./api');
  expressApp.use('/api', apiRoutes);

  const PORT = 3001;
  server = expressApp.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for printer and other native features
ipcMain.handle('print-receipt', async (event, receiptData) => {
  // Handle printing logic here
  console.log('Printing receipt:', receiptData);
  return { success: true };
});

ipcMain.handle('get-printers', async () => {
  const printers = await mainWindow.webContents.getPrintersAsync();
  return printers;
});
