import { app, BrowserWindow, Tray, Menu, nativeImage, session } from "electron";
import registerListeners from "./helpers/ipc/listeners-register";
// "electron-squirrel-startup" seems broken when packaging with vite
//import started from "electron-squirrel-startup";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

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
    tray.popUpContextMenu(contextMenu);
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

async function installExtensions() {
  if (!inDevelopment) return;

  try {
    const extensionsDir = path.join(app.getPath('userData'), 'extensions');
    const extensionPath = path.join(extensionsDir, 'react-devtools');

    // Create extensions directory if it doesn't exist
    if (!fs.existsSync(extensionsDir)) {
      fs.mkdirSync(extensionsDir, { recursive: true });
    }

    // Check if extension is already installed
    const extensions = await session.defaultSession.extensions.getAllExtensions();
    if (extensions.some(ext => ext.name === 'React Developer Tools')) {
      console.log('React Developer Tools already installed');
      return;
    }

    // Install React DevTools extension if not already present
    if (!fs.existsSync(extensionPath)) {
      console.log('Installing React Developer Tools...');
      
      // Create a temporary directory for the installation
      const tempDir = path.join(app.getPath('temp'), 'react-devtools-install');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      try {
        // Install react-devtools package
        execSync('npm install react-devtools', { cwd: tempDir });
        
        // Copy the extension from node_modules to our extensions directory
        const sourcePath = path.join(tempDir, 'node_modules', 'react-devtools', 'shells', 'chrome', 'extension');
        if (fs.existsSync(sourcePath)) {
          fs.cpSync(sourcePath, extensionPath, { recursive: true });
          console.log('React Developer Tools copied successfully');
        } else {
          throw new Error('Could not find React DevTools extension in node_modules');
        }
      } finally {
        // Clean up temporary directory
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }

    // Load the extension
    const extension = await session.defaultSession.extensions.loadExtension(extensionPath);
    console.log(`Extensions installed successfully: ${extension.name}`);
  } catch (error) {
    console.error("Failed to install extensions:", error);
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
