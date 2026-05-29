import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db from "../electron/databaseHandler.ts"

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
    window.loadFile(path.join(__dirname, "../renderer-dist/index.html"));

    //DEV
    // window.loadURL("http://localhost:5173/");
}

app.whenReady().then(()=>{
    ipcMain.handle("ping", () => "pong");

    ipcMain.handle("update-budget", async (_, data) => {
        return await db.updateBudget(data);
    });

    ipcMain.handle("get-budget", async () => {
        return await db.getBudget();
    });

    ipcMain.handle("get-saving-allocation", async () => {
        return await db.getSavingAllocation();
    });

    ipcMain.handle("update-saving-allocation", async (__, data) => {
        return await db.updateSavingAllocation(data);
    })

    createWindow();
});