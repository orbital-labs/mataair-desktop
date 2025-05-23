/* eslint-disable indent */
import {
  app,
  BrowserWindow,
  shell,
  globalShortcut,
  Menu,
  MenuItemConstructorOptions
} from "electron";
import { release } from "os";
import path, { join } from "path";

const isMac = process.platform === "darwin";

const template: MenuItemConstructorOptions = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" }
          ]
        }
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }]
  },
  // { role: 'editMenu' }
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }]
            }
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" }
          ]
        : [{ role: "close" }])
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Visit Website",
        click: async () => {
          await shell.openExternal("https://mataair.co");
        }
      },
      {
        label: "Visit Companion Website",
        click: async () => {
          await shell.openExternal("https://app.mataair.co");
        }
      },
      {
        label: "Download Android App",
        click: async () => {
          await shell.openExternal(
            "https://play.google.com/store/apps/details?id=com.orbital.mataair"
          );
        }
      },
      {
        label: "Download iOS App",
        click: async () => {
          await shell.openExternal("https://apps.apple.com/app/id1561475506");
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

let win: BrowserWindow | null = null;
// Here you can add more preload scripts
// const splash = join(__dirname, "../preload/splash.js");

// 🚧 Use ['ENV_NAME'] to avoid vite:define plugin
const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../../index.html"));
  } else {
    win.loadURL(url);
  }

  // Test active push message to Renderer-process
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (
      url.startsWith("https://play.google.com") ||
      url.startsWith("https://apps.apple.com") ||
      url.startsWith("https://mataair-app.orbitallabs.net") ||
      url.startsWith("https://mataair.co")
    ) {
      shell.openExternal(url);
      return { action: "deny" };
    }

    return { action: "allow" };
  });

  // win.removeMenu();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// handle MacOS DeepLink
app.setAsDefaultProtocolClient("mataair");

app.on("open-url", (event, url) => {
  event.preventDefault();
  if (win) {
    win.webContents.send("open-url", url);
  }
});


// handle Windows DeepLink
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, argv) => {
    // Windows: protocol URL will be in argv
    const deepLink = argv.find(arg => arg.startsWith('mataair://'))
    if (deepLink && win) {
      win.webContents.send('open-url', deepLink)
    }
  })
}

app.on("ready", () => {
  // Register a shortcut listener for Ctrl + Shift + I
  globalShortcut.register("Control+Shift+I", () => {
    // When the user presses Ctrl + Shift + I, this function will get called
    // You can modify this function to do other things, but if you just want
    // to disable the shortcut, you can just return false
    return false;
  });
});
