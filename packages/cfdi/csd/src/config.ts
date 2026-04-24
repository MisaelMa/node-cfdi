export type CsdMode = 'node' | 'binary';

let _mode: CsdMode = 'node';

export function setMode(mode: CsdMode): void {
  _mode = mode;
}

export function getMode(): CsdMode {
  return _mode;
}
