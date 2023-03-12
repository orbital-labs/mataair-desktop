export {};

declare global {
  interface Window {
    // Expose API through preload script
    fs: typeof import("fs");
    ipcRenderer: import("electron").IpcRenderer;
    removeLoading: () => void;
    electron: {
      login: (data) => void;
      logout: () => void;
      getUser: () => Promise<any>;
      getToken: () => Promise<any>;
    };
  }
}
