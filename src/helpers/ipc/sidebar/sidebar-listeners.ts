import { ipcMain } from "electron"
import {
  SIDEBAR_STATE_GET_CHANNEL,
  SIDEBAR_STATE_SET_CHANNEL,
} from "./sidebar-channels"

let sidebarState = true

export function addSidebarEventListeners() {
  ipcMain.handle(SIDEBAR_STATE_GET_CHANNEL, () => sidebarState)
  ipcMain.handle(SIDEBAR_STATE_SET_CHANNEL, (_, state: boolean) => {
    sidebarState = state
    return state
  })
} 