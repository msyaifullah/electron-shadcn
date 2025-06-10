import { BrowserWindow, ipcMain } from "electron";
import {
  WIN_CLOSE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_MINIMIZE_CHANNEL,
  WIN_SET_SIZE_CHANNEL,
  WIN_GET_SIZE_CHANNEL,
} from "./window-channels";

const TRANSITION_DURATION = 300; // milliseconds
const STEPS = 20; // number of steps for the animation

function animateWindowSize(
  window: BrowserWindow,
  startWidth: number,
  startHeight: number,
  targetWidth: number,
  targetHeight: number
) {
  const widthStep = (targetWidth - startWidth) / STEPS;
  const heightStep = (targetHeight - startHeight) / STEPS;
  const stepDuration = TRANSITION_DURATION / STEPS;

  let currentStep = 0;

  const animate = () => {
    if (currentStep >= STEPS) {
      window.setSize(targetWidth, targetHeight);
      return;
    }

    const newWidth = Math.round(startWidth + widthStep * currentStep);
    const newHeight = Math.round(startHeight + heightStep * currentStep);
    window.setSize(newWidth, newHeight);

    currentStep++;
    setTimeout(animate, stepDuration);
  };

  animate();
}

export function addWindowEventListeners(mainWindow: BrowserWindow) {
  ipcMain.handle(WIN_MINIMIZE_CHANNEL, () => {
    mainWindow.minimize();
  });
  ipcMain.handle(WIN_MAXIMIZE_CHANNEL, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.handle(WIN_CLOSE_CHANNEL, () => {
    mainWindow.close();
  });

  ipcMain.handle(WIN_GET_SIZE_CHANNEL, () => {
    const bounds = mainWindow.getBounds();
    return {
      width: bounds.width,
      height: bounds.height
    };
  });

  ipcMain.handle(WIN_SET_SIZE_CHANNEL, (_, { width, height }: { width: number; height: number }) => {
    const currentBounds = mainWindow.getBounds();
    animateWindowSize(
      mainWindow,
      currentBounds.width,
      currentBounds.height,
      width,
      height
    );
    return { width, height };
  });
}
