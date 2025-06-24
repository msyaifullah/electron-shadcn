import { app, BrowserWindow, Tray, Menu, nativeImage } from "electron";
import registerListeners from "./helpers/ipc/listeners-register";
import path from "path";
import fs from "fs";

import { installExtension, REACT_DEVELOPER_TOOLS } from "@tomjs/electron-devtools-installer";

const inDevelopment = process.env.NODE_ENV === "development";
let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;

function createTray() {
  try {
    // Get the absolute path to the icon using process.cwd() to get the project root
    const iconPath = path.join(process.cwd(), 'assets/tray-icon.png');
    console.log('Project root:', process.cwd());
    console.log('Absolute tray icon path:', iconPath);
    
    if (!fs.existsSync(iconPath)) {
      console.error('Tray icon file does not exist at:', iconPath);
      return;
    }

    const icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) {
      console.error('Failed to create tray icon from path:', iconPath);
      return;
    }

    // Resize icon to ensure proper display
    const resizedIcon = icon.resize({ width: 16, height: 16 });
    tray = new Tray(resizedIcon);
    setupTrayMenu();
    console.log('Tray created successfully');
  } catch (error) {
    console.error('Error creating tray:', error);
  }
}

function setupTrayMenu() {
  if (!tray) return;
  
  // Create tray menu
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show App', 
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { 
      label: 'Hide App', 
      click: () => {
        if (mainWindow) {
          mainWindow.hide();
        }
      }
    },
    { type: 'separator' },
    { 
      label: 'Exit', 
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Electron App');
  // Do NOT set context menu for left click
  // tray.setContextMenu(contextMenu);

  // Left click toggles window
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });

  // Right click shows context menu
  tray.on('right-click', () => {
    tray?.popUpContextMenu(contextMenu);
  });
}

function createWindow() {
  const preload = path.join(__dirname, "preload.js");
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      devTools: inDevelopment,
      contextIsolation: true,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: false,
      preload: preload,
    },
    titleBarStyle: "hidden",
  });

  // Hide window instead of closing when user clicks the close button
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
    return false;
  });

  registerListeners(mainWindow);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}


app.whenReady().then(() => {
  createWindow();
  createTray();
  installExtensions();
});

// Handle app quit
app.on('before-quit', () => {
  app.isQuitting = true;
});

//osX only
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//osX only ends

async function installExtensions() {
  try {
    const result = await installExtension(REACT_DEVELOPER_TOOLS);
    console.log(`Extensions installed successfully: ${result}`);
  } catch {
    console.error("Failed to install extensions");
  }
}

