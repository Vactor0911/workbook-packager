import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: unknown;
    csvAPI: {
      saveFile: (filePath: string, data: any) => void;
    };
  }
}
