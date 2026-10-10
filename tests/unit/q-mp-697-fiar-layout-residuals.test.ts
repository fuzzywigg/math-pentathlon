/**
 * q-mp-697 — Close `fiar/layout` residual gaps (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059` @ `ac5577f6`): with the full
 * related `tests/unit/*fiar*` glob under
 * `--coverage.include=src/games/fiar/layout.ts`,
 * **91.93%** lines (57/62) / **82.75%** branches (24/29).
 * Uncovered under that glob: L106 + L172 (`ROW_COLS[row]` undefined continue),
 * L125 (`parseNodeId` null continue), L137 (yellow-center lattice skip),
 * L141 (`seen.has` duplicate-key continue).
 *
 * SAFE (Grok Bot): layout helpers only — not `rules.ts` / board-3d / AI.
 * Structural asserts only; no player-facing copy / aria / label / message-body
 * pins. Zero `src/` edits. Leave FIAR board-3d / UI-round drafts **contained**.
 *
 * Listed in `vitest.config.ts` `isolatedFiles` for `Set.prototype` add/has
 * spies (must not leak into isolate:false shared workers).
 *
 * Unreachable keep-sites (documented; dense `ROW_COLS` + `row < length` loop
 * never yields `cols === undefined` without mutating the module-private
 * catalog): L106 / L172. Acceptance allows documented unreachable arms.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  countConfirmedEdges,
  createVerifiedProductionLayout,
  parseNodeId,
} from '../../src/games/fiar/layout';

const LAYOUT_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/games/fiar/layout.ts'
  ),
  'utf8'
);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('q-mp-697 fiar/layout — unreachable ROW_COLS hole keep-sites', () => {
  it('source keeps buildConfirmedEdges undefined-cols continue (L105–107)', () => {
    expect(LAYOUT_SRC).toMatch(
      /for \(let row = 0; row < ROW_COLS\.length; row\+\+\) \{\s*const cols = ROW_COLS\[row\];\s*if \(cols === undefined\) \{\s*continue;/s
    );
  });

  it('source keeps createVerifiedProductionLayout undefined-cols continue (L170–173)', () => {
    // Two identical hole guards; both stay as structural keep-sites.
    const matches = LAYOUT_SRC.match(
      /const cols = ROW_COLS\[row\];\s*if \(cols === undefined\) \{\s*continue;/gs
    );
    expect(matches?.length).toBe(2);
  });
});

describe('q-mp-697 fiar/layout — buildConfirmedEdges residual arms', () => {
  it('skips non-grid ids injected into the node set (L125)', () => {
    // nodeSet is built only from nodeId(); inject a malformed id on first add
    // so parseNodeId → null hits the continue before direction fan-out.
    const realAdd = Set.prototype.add;
    let injected = false;
    const spy = vi.spyOn(Set.prototype, 'add').mockImplementation(function (
      this: Set<unknown>,
      value: unknown
    ) {
      const ret = realAdd.call(this, value);
      if (
        !injected &&
        typeof value === 'string' &&
        /^c\d+r\d+$/.test(value) &&
        !value.includes('|')
      ) {
        injected = true;
        realAdd.call(this, 'not-a-grid-node');
      }
      return ret;
    });

    try {
      const n = countConfirmedEdges();
      expect(injected).toBe(true);
      expect(parseNodeId('not-a-grid-node')).toBeNull();
      // Production edge count unchanged — malformed id contributes no edges.
      expect(n).toBe(createVerifiedProductionLayout().edges.length);
    } finally {
      spy.mockRestore();
    }
  });

  it('skips yellow-center lattice point when c4r3 is present (L137)', () => {
    // ROW_COLS omits c4r3, so the yellow-center guard is normally dead after
    // the !nodeSet.has(other) filter. Inject c4r3 so the (col===4 && row===3)
    // arm runs and continues without adding center-touching edges.
    const realAdd = Set.prototype.add;
    let injected = false;
    const spy = vi.spyOn(Set.prototype, 'add').mockImplementation(function (
      this: Set<unknown>,
      value: unknown
    ) {
      const ret = realAdd.call(this, value);
      if (
        !injected &&
        typeof value === 'string' &&
        /^c\d+r\d+$/.test(value) &&
        !value.includes('|')
      ) {
        injected = true;
        realAdd.call(this, 'c4r3');
      }
      return ret;
    });

    try {
      const n = countConfirmedEdges();
      expect(injected).toBe(true);
      // Center is not a playable space — confirmed count stays at production 116.
      expect(n).toBe(116);
      expect(
        createVerifiedProductionLayout().nodes.some(
          (node) => node.id === 'c4r3'
        )
      ).toBe(false);
    } finally {
      spy.mockRestore();
    }
  });

  it('skips duplicate undirected edge keys via seen.has (L141)', () => {
    // Half-direction enumeration never rediscovers an edge; force one
    // seen.has(key) true arm after the first edge key is recorded.
    let armDuplicate = false;
    let forced = false;
    const realAdd = Set.prototype.add;
    const realHas = Set.prototype.has;
    const addSpy = vi.spyOn(Set.prototype, 'add').mockImplementation(function (
      this: Set<unknown>,
      value: unknown
    ) {
      const ret = realAdd.call(this, value);
      if (typeof value === 'string' && value.includes('|')) {
        armDuplicate = true;
      }
      return ret;
    });
    const hasSpy = vi.spyOn(Set.prototype, 'has').mockImplementation(function (
      this: Set<unknown>,
      value: unknown
    ) {
      if (
        armDuplicate &&
        !forced &&
        typeof value === 'string' &&
        value.includes('|') &&
        !realHas.call(this, value)
      ) {
        forced = true;
        armDuplicate = false;
        return true;
      }
      return realHas.call(this, value);
    });

    try {
      const n = countConfirmedEdges();
      expect(forced).toBe(true);
      // One forged duplicate skip → one fewer confirmed edge than production.
      expect(n).toBe(115);
    } finally {
      addSpy.mockRestore();
      hasSpy.mockRestore();
    }
  });
});

describe('q-mp-697 fiar/layout — structural production invariants', () => {
  it('createVerifiedProductionLayout stays at 40 nodes / 116 edges by default', () => {
    const layout = createVerifiedProductionLayout();
    expect(layout.nodes).toHaveLength(40);
    expect(layout.edges).toHaveLength(116);
    expect(layout.includeDiamondBorderEdges).toBe(false);
    expect(layout.yellowCenter?.kind).toBe('diamond');
    expect(countConfirmedEdges()).toBe(116);
  });
});
