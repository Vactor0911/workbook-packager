import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: unknown;
    csvAPI: {
      saveCsvFile: (filePath: string, data: string) => void;
      saveNewCsvFile: () => Promise<string | undefined>;
    };
    fileAPI: {
      openFolder: (filePath: string) => void;
    };
  }
}
