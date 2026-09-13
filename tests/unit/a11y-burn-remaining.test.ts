import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState as createStarsState } from '../../src/games/stars-bars/rules';
import { renderBoard as renderStarsBoard } from '../../src/games/stars-bars/board-ui';
import { createInitialState as createKwaState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard as renderKwaBoard } from '../../src/games/kwatro-sinko/board-ui';
import { createInitialState as createPar55State } from '../../src/games/par-55/rules';
import { renderBoard as renderPar55Board } from '../../src/games/par-55/board-ui';

describe('a11y burn remaining click boards (#8)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Stars & Bars board is an ARIA grid with labeled gridcells', () => {
    const root = renderStarsBoard(createStarsState(), () => undefined);
    document.body.appendChild(root);

    const grid = root.querySelector('[role="grid"]');
    expect(grid).toBeTruthy();

    const cells = root.querySelectorAll('[role="gridcell"][data-row][data-col]');
    expect(cells.length).toBe(25);

    const tabbable = root.querySelectorAll('[role="gridcell"][tabindex="0"]');
    expect(tabbable.length).toBe(1);

    const sample = cells[0] as HTMLElement;
    expect(sample.getAttribute('aria-label')).toMatch(/0,0/);
  });

  it('Kwatro-Sinko SVG nodes are gridcells with coord labels', () => {
    const root = renderKwaBoard(
      createKwaState(),
      () => undefined,
      () => undefined
    );
    document.body.appendChild(root);

    const svg = root.querySelector('svg[role="grid"]');
    expect(svg).toBeTruthy();

    const cells = root.querySelectorAll('[role="gridcell"][data-row][data-col]');
    expect(cells.length).toBeGreaterThan(10);

    const tabbable = root.querySelectorAll('[role="gridcell"][tabindex="0"]');
    expect(tabbable.length).toBe(1);

    const sample = cells[0] as Element;
    expect(sample.getAttribute('aria-label')).toBeTruthy();
  });

  it('Par 55 bases are gridcells with row/col labels', () => {
    const root = renderPar55Board(createPar55State(), () => undefined);
    document.body.appendChild(root);

    const svg = root.querySelector('svg[role="grid"]');
    expect(svg).toBeTruthy();

    const cells = root.querySelectorAll('[role="gridcell"][data-row][data-col]');
    expect(cells.length).toBeGreaterThan(10);

    const tabbable = root.querySelectorAll('[role="gridcell"][tabindex="0"]');
    expect(tabbable.length).toBe(1);

    const sample = cells[0] as Element;
    expect(sample.getAttribute('aria-label')).toMatch(/\d+,\d+/);
  });
});
