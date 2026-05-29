const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("api", {
    ping: () => ipcRenderer.invoke("ping"),
    getBudget: () => ipcRenderer.invoke("get-budget"),
    getSavingAllocation: () => ipcRenderer.invoke("get-saving-allocation"),
    updateBudget: (data) => ipcRenderer.invoke("update-budget", data),
    updateSavingAllocation: (data) => ipcRenderer.invoke("update-saving-allocation", data),
});