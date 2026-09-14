/**
 * Wave 42 leftovers D — ramrod createRod color. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createRod, ROD_COLORS } from '../../src/games/ramrod/types';

describe('Wave 42 ramrod — createRod color', () => {
  it('createRod color matches ROD_COLORS; null owner/position', () => {
    for (let length = 1; length <= 10; length++) {
      const rod = createRod(`id-${length}`, length);
      expect(rod.color).toBe(ROD_COLORS[length]);
      expect(rod.length).toBe(length);
      expect(rod.id).toBe(`id-${length}`);
      expect(rod.owner).toBeNull();
      expect(rod.position).toBeNull();
    }
  });
});
