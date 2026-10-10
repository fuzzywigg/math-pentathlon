/**
 * q-mp-604 — raise alignment-demo coverage from 0% lines (tests-only).
 * Structural asserts only; no player-facing copy / aria pins; no product edits.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

function clickFourCol(root: HTMLElement, col: number): void {
  (
    root.querySelector(
      `#four-board [data-row][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

function clickHex(root: HTMLElement, row: number, col: number): void {
  (
    root.querySelector(
      `#hex-board [data-row="${row}"][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

function clickPotential(root: HTMLElement, row: number, col: number): void {
  (
    root.querySelector(
      `#potential-board [data-row="${row}"][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

describe('q-mp-604 alignment-demo coverage — mount chrome', () => {
  it('mounts three section boards, back link, and highlight styles once', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);

    expect(root.querySelector('.alignment-demo')).toBeTruthy();
    expect(root.querySelector('a.back-link')).toBeTruthy();
    expect(root.querySelectorAll('.alignment-demo-section')).toHaveLength(3);
    expect(root.querySelector('#four-board')).toBeTruthy();
    expect(root.querySelector('#hex-board')).toBeTruthy();
    expect(root.querySelector('#potential-board')).toBeTruthy();
    expect(root.querySelectorAll('#four-board .demo-cell')).toHaveLength(42);
    expect(root.querySelectorAll('#hex-board .demo-hex-cell')).toHaveLength(49);
    expect(root.querySelectorAll('#potential-board .demo-cell')).toHaveLength(
      25
    );
    expect(
      root.querySelectorAll('#potential-board .cell-x').length
    ).toBeGreaterThanOrEqual(2);
    expect(
      root.querySelectorAll('#potential-board .cell-o').length
    ).toBeGreaterThanOrEqual(1);

    renderAlignmentDemo(root);
    expect(root.querySelectorAll('.alignment-demo')).toHaveLength(1);
    expect(root.querySelectorAll('.alignment-demo-section')).toHaveLength(3);
  });
});

describe('q-mp-604 alignment-demo coverage — four-in-row', () => {
  it('drops alternate pieces, updates info counts, and resets the board', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);

    clickFourCol(root, 0);
    expect(root.querySelectorAll('#four-board .cell-x')).toHaveLength(1);
    expect(root.querySelector('#four-status .player-o')).toBeTruthy();

    clickFourCol(root, 1);
    expect(root.querySelectorAll('#four-board .cell-o')).toHaveLength(1);
    expect(root.querySelector('#four-status .player-x')).toBeTruthy();

    const info = root.querySelector('#four-info');
    expect(info?.children.length).toBeGreaterThanOrEqual(2);

    (root.querySelector('#four-reset') as HTMLButtonElement).click();
    expect(
      root.querySelectorAll('#four-board .cell-x, #four-board .cell-o')
    ).toHaveLength(0);
    expect(root.querySelector('#four-status .player-x')).toBeTruthy();
  });

  it('marks a vertical X win and ignores further column clicks', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);

    for (let i = 0; i < 3; i++) {
      clickFourCol(root, 0);
      clickFourCol(root, 1);
    }
    clickFourCol(root, 0);

    expect(root.querySelector('#four-status .winner')).toBeTruthy();
    expect(
      root.querySelectorAll('#four-board .winning-cell').length
    ).toBeGreaterThanOrEqual(4);

    const before = root.querySelectorAll(
      '#four-board .cell-x, #four-board .cell-o'
    ).length;
    clickFourCol(root, 2);
    expect(
      root.querySelectorAll('#four-board .cell-x, #four-board .cell-o').length
    ).toBe(before);
  });

  it('rejects overflow on a full column without changing piece count', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);

    for (let i = 0; i < 8; i++) {
      clickFourCol(root, 6);
    }
    const filled = root.querySelectorAll(
      '#four-board [data-col="6"].cell-x, #four-board [data-col="6"].cell-o'
    ).length;
    expect(filled).toBe(6);

    const before = root.querySelector('#four-info')?.innerHTML;
    clickFourCol(root, 6);
    expect(root.querySelector('#four-info')?.innerHTML).toBe(before);
  });

  it('marks an O horizontal win on the bottom row', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);

    // First drop lands on row 5; park X elsewhere so O fills (5,0..3).
    clickFourCol(root, 4); // X park
    clickFourCol(root, 0); // O @5,0
    clickFourCol(root, 5); // X park
    clickFourCol(root, 1); // O @5,1
    clickFourCol(root, 6); // X park
    clickFourCol(root, 2); // O @5,2
    clickFourCol(root, 4); // X park
    clickFourCol(root, 3); // O @5,3 — horizontal O win

    expect(root.querySelector('#four-status .winner')).toBeTruthy();
    expect(
      root.querySelectorAll('#four-board .winning-cell').length
    ).toBeGreaterThanOrEqual(4);
  });
});

describe('q-mp-604 alignment-demo coverage — hex connect', () => {
  it('places alternating colors, ignores occupied cells, and resets', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);

    clickHex(root, 2, 2);
    expect(root.querySelectorAll('#hex-board .cell-blue')).toHaveLength(1);
    expect(root.querySelector('#hex-status .player-r')).toBeTruthy();

    clickHex(root, 2, 2); // occupied — no-op
    expect(root.querySelectorAll('#hex-board .cell-blue')).toHaveLength(1);
    expect(root.querySelectorAll('#hex-board .cell-red')).toHaveLength(0);

    clickHex(root, 2, 3);
    expect(root.querySelectorAll('#hex-board .cell-red')).toHaveLength(1);
    expect(root.querySelector('#hex-status .player-b')).toBeTruthy();

    const info = root.querySelector('#hex-info');
    expect(info?.children.length).toBeGreaterThanOrEqual(2);

    (root.querySelector('#hex-reset') as HTMLButtonElement).click();
    expect(
      root.querySelectorAll('#hex-board .cell-blue, #hex-board .cell-red')
    ).toHaveLength(0);
    expect(root.querySelector('#hex-status .player-b')).toBeTruthy();
  });

  it('Blue top–bottom spine wins and locks further placements', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);

    for (let row = 0; row < 6; row++) {
      clickHex(root, row, 3);
      clickHex(root, row, 6);
    }
    clickHex(root, 6, 3);

    expect(root.querySelector('#hex-status .winner')).toBeTruthy();
    expect(
      root.querySelectorAll('#hex-board .winning-cell').length
    ).toBeGreaterThan(0);

    const before = root.querySelectorAll(
      '#hex-board .cell-blue, #hex-board .cell-red'
    ).length;
    clickHex(root, 1, 1);
    expect(
      root.querySelectorAll('#hex-board .cell-blue, #hex-board .cell-red')
        .length
    ).toBe(before);
  });

  it('Red left–right spine wins with winning-cell chrome', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);

    const redTargets: Array<[number, number]> = [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [3, 6],
    ];
    const blueParks: Array<[number, number]> = [
      [0, 0],
      [1, 0],
      [2, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [0, 1],
    ];
    for (let i = 0; i < redTargets.length; i++) {
      const blue = blueParks[i];
      const red = redTargets[i];
      if (blue === undefined || red === undefined) {
        throw new Error('expected park/target pair');
      }
      clickHex(root, blue[0], blue[1]);
      clickHex(root, red[0], red[1]);
    }

    expect(root.querySelector('#hex-status .winner')).toBeTruthy();
    expect(
      root.querySelectorAll('#hex-board .winning-cell').length
    ).toBeGreaterThanOrEqual(7);

    const before = root.querySelectorAll(
      '#hex-board .cell-blue, #hex-board .cell-red'
    ).length;
    clickHex(root, 1, 1);
    expect(
      root.querySelectorAll('#hex-board .cell-blue, #hex-board .cell-red')
        .length
    ).toBe(before);
  });
});

describe('q-mp-604 alignment-demo coverage — potential analysis', () => {
  it('cycles empty→X→O→empty and shows selected-cell + potential rows', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);

    const idleInfo = root.querySelector('#potential-info')?.textContent ?? '';
    expect(idleInfo.length).toBeGreaterThan(0);

    clickPotential(root, 0, 0);
    expect(
      root.querySelector(
        '#potential-board [data-row="0"][data-col="0"].cell-x.selected-cell'
      )
    ).toBeTruthy();
    const afterX = root.querySelector('#potential-info')?.textContent ?? '';
    expect(afterX.length).toBeGreaterThan(idleInfo.length);
    expect(root.querySelector('#potential-info strong')).toBeTruthy();

    clickPotential(root, 0, 0);
    expect(
      root.querySelector(
        '#potential-board [data-row="0"][data-col="0"].cell-o.selected-cell'
      )
    ).toBeTruthy();

    clickPotential(root, 0, 0);
    expect(
      root.querySelector(
        '#potential-board [data-row="0"][data-col="0"].cell-x, #potential-board [data-row="0"][data-col="0"].cell-o'
      )
    ).toBeNull();
    expect(
      root.querySelector(
        '#potential-board [data-row="0"][data-col="0"].selected-cell'
      )
    ).toBeTruthy();
  });

  it('reset clears pieces and selection chrome', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);

    clickPotential(root, 4, 4);
    expect(
      root.querySelectorAll('#potential-board .selected-cell').length
    ).toBe(1);

    (root.querySelector('#potential-reset') as HTMLButtonElement).click();
    expect(
      root.querySelectorAll(
        '#potential-board .cell-x, #potential-board .cell-o, #potential-board .selected-cell'
      )
    ).toHaveLength(0);
    expect(
      (root.querySelector('#potential-info')?.textContent ?? '').length
    ).toBeGreaterThan(0);
  });

  it('reads potential on a pre-seeded X cell without changing occupancy', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);

    const before = root.querySelectorAll('#potential-board .cell-x').length;
    clickPotential(root, 2, 2); // pre-seeded X → cycles to O
    expect(root.querySelectorAll('#potential-board .cell-x').length).toBe(
      before - 1
    );
    expect(
      root.querySelector(
        '#potential-board [data-row="2"][data-col="2"].cell-o.selected-cell'
      )
    ).toBeTruthy();
    expect(root.querySelector('#potential-info br')).toBeTruthy();
  });
});
