import {
  SIDEBAR_STATE_GET_CHANNEL,
  SIDEBAR_STATE_SET_CHANNEL,
} from "./sidebar-channels"

export function exposeSidebarContext() {
  const { contextBridge, ipcRenderer } = window.require("electron")
  contextBridge.exposeInMainWorld("sidebar", {
    getState: () => ipcRenderer.invoke(SIDEBAR_STATE_GET_CHANNEL),
    setState: (state: boolean) => ipcRenderer.invoke(SIDEBAR_STATE_SET_CHANNEL, state),
  })
} 