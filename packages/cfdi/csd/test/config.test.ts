import { describe, expect, it } from 'vitest';
import { setMode, getMode } from '../src/config';

describe('CSD Config', () => {
  it('default mode should be node', () => {
    expect(getMode()).toBe('node');
  });

  it('should change mode to binary', () => {
    setMode('binary');
    expect(getMode()).toBe('binary');
  });

  it('should change mode back to node', () => {
    setMode('node');
    expect(getMode()).toBe('node');
  });
});
