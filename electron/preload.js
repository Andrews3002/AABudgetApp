const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("api", {
    ping: () => ipcRenderer.invoke("ping"),
    getBudget: () => ipcRenderer.invoke("get-budget"),
    updateBudget: (data) => ipcRenderer.invoke("update-budget", data),
});