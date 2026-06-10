import type { AppAPI } from '@shared/api';

declare global {
  interface Window {
    appAPI: AppAPI;
  }
}

export {};
