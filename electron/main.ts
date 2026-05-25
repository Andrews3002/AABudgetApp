import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export { __filename, __dirname };

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1200,
        height: 780,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
    });

    //PROD
    // window.loadFile("index.html");

    //DEV
    window.loadURL("http://localhost:5173/");
}

app.whenReady().then(()=>{
    ipcMain.handle("ping", () => "pong");
    createWindow();
});