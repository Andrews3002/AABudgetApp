import { app, BrowserWindow } from "electron";

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1200,
        height: 780
    });

    //PROD
    // window.loadFile("index.html");

    //DEV
    window.loadURL("http://localhost:5173/");
}

app.whenReady().then(()=>{
    createWindow();
});