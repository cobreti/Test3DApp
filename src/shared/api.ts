/**
 * Contract for the API the Electron preload bridge exposes on `window.appAPI`.
 * Kept runtime-neutral (no Node- or DOM-only deps) so it compiles under both
 * the electron and renderer tsconfigs.
 */
export interface AppAPI {
  ping: () => string;
  platform: string;
  versions: {
    electron: string;
    chrome: string;
    node: string;
  };
}
