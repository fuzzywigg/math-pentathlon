/**
 * Wave 48 — Juggle renderShapeControls phase gate. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderShapeControls } from '../../src/games/juggle/board-ui';

describe('Wave 48 juggle — shape controls gate', () => {
  it('empty when not placing or no selected shape', () => {
    const s = createInitialState();
    const el = renderShapeControls(s, () => undefined, () => undefined);
    expect(el.children.length).toBe(0);
    const fake = {
      ...s,
      phase: 'placing' as const,
      selectedShape: null,
    };
    expect(renderShapeControls(fake, () => undefined, () => undefined).children.length).toBe(0);
  });
});
