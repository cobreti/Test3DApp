import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('appAPI', {
  ping: (): string => 'pong',
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
});
