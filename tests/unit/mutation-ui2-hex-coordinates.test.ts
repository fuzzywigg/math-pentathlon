import { describe, expect, it } from 'vitest';
import { axialToOffset, offsetToAxial } from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('mutation-ui2 hex coordinates parity offsets', () => {
  it('even-parity axialToOffset uses (q+1)&1 — distinct from (q+2)&1', () => {
    // q=1 even: offset bit 0 → row = r + floor(1/2) = r
    const a = axialToOffset(createAxial(1, 0), 'even');
    expect(a).toEqual({ col: 1, row: 0 });
    expect(offsetToAxial(a, 'even')).toEqual(createAxial(1, 0));

    // q=0 even: offset bit 1 → row = r + floor(1/2) = r
    const b = axialToOffset(createAxial(0, 2), 'even');
    expect(b).toEqual({ col: 0, row: 2 });
    expect(offsetToAxial(b, 'even')).toEqual(createAxial(0, 2));

    // q=2 even: offset bit 1 → row = r + floor((2+1)/2) = r+1
    const c = axialToOffset(createAxial(2, 0), 'even');
    expect(c).toEqual({ col: 2, row: 1 });
    expect(offsetToAxial(c, 'even')).toEqual(createAxial(2, 0));
  });

  it('odd-parity axialToOffset uses q&1', () => {
    expect(axialToOffset(createAxial(1, 0), 'odd')).toEqual({
      col: 1,
      row: 1,
    });
    expect(axialToOffset(createAxial(2, 0), 'odd')).toEqual({
      col: 2,
      row: 1,
    });
    expect(axialToOffset(createAxial(0, 3), 'odd')).toEqual({
      col: 0,
      row: 3,
    });
  });

  it('offsetToAxial even parity inverts (col+1)&1 path', () => {
    expect(offsetToAxial({ col: 1, row: 0 }, 'even')).toEqual(
      createAxial(1, 0)
    );
    expect(offsetToAxial({ col: 2, row: 1 }, 'even')).toEqual(
      createAxial(2, 0)
    );
    expect(offsetToAxial({ col: 0, row: 2 }, 'even')).toEqual(
      createAxial(0, 2)
    );
  });

  it.skip('equivalent: (q+1)&1 vs (q-1)&1 share parity — cannot kill ± flip', () => {
    // Reason: for any integer q, (q+1) and (q-1) have the same parity, so
    // `& 1` yields identical offset bits. Not a product bug.
  });
});
