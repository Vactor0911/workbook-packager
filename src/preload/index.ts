import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import * as fs from "fs";

// Custom APIs for renderer
const api = {};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("csvAPI", {
      saveCsvFile: (filePath: string, data: any) => {
        const bom = "\uFEFF"; // UTF-8 BOM 추가
        fs.writeFileSync(filePath, bom + data, "utf8");
      },
      saveNewCsvFile: () => ipcRenderer.invoke("dialog:saveFile"),
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
