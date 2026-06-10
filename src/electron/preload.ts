import { contextBridge } from 'electron';
import type { AppAPI } from '@shared/api';

contextBridge.exposeInMainWorld('appAPI', {
  ping: (): string => 'pong',
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
} satisfies AppAPI);
