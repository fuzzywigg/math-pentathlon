/**
 * Overnight HEAVY leftover after #256 — handshake owl × graph × poly after #253.
 * Distinct from wave55 align handshake. Tests-only. No engines.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  owlSystem,
  owlMessages,
  OwlEventEmitter,
  resolveInspectTarget,
} from '../../src/core/owl';
import {
  createStarGraph,
  getNeighbors,
  findNodesAtDistance,
  animateMove,
  renderGraph,
} from '../../src/core/graph';
import {
  TETROMINOES,
  injectPolyominoStyles,
  createDraggableShape,
  getCellFromMouseEvent,
  createBoard,
  renderBoard,
} from '../../src/core/polyomino';

afterEach(() => {
  document.getElementById('polyomino-styles')?.remove();
  document.body.innerHTML = '';
  owlSystem.hide();
});

describe('Wave 56 handshake — owl × graph × poly', () => {
  it('owl toggle + emitter clear + howto inspect', () => {
    owlSystem.hide();
    owlSystem.toggle();
    expect(owlSystem.getState().isVisible).toBe(true);
    owlSystem.hide();
    const bus = new OwlEventEmitter();
    let hits = 0;
    bus.on('*', () => {
      hits++;
    });
    bus.clear();
    bus.emit({
      type: 'app:start',
      timestamp: 1,
      isFirstVisit: true,
      daysSinceLastVisit: 0,
    });
    expect(hits).toBe(0);
    expect(
      owlMessages.getMessagesByCategory('app:return').length
    ).toBeGreaterThan(0);
    const btn = document.createElement('button');
    btn.id = 'help-btn';
    expect(resolveInspectTarget(btn).kind).toBe('chrome');
  });

  it('star graph degree + distance-0 + animate short path', async () => {
    const star = createStarGraph(4);
    expect(star.nodes.size).toBe(5);
    expect(getNeighbors(star, 'center').length).toBe(4);
    expect(findNodesAtDistance(star, 'center', 0)).toEqual(['center']);
    const svg = renderGraph(star);
    await expect(
      animateMove(svg, ['center'], star, 1)
    ).resolves.toBeUndefined();
  });

  it('O flags + inject styles + draggable dataset + mouse cell', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    expect(O.canRotate).toBe(false);
    expect(O.canFlip).toBe(false);
    injectPolyominoStyles();
    injectPolyominoStyles();
    expect(document.querySelectorAll('#polyomino-styles').length).toBe(1);
    const drag = createDraggableShape(O, 0, false);
    expect(drag.dataset.shapeId).toBe('O');
    const svg = renderBoard(createBoard(2, 2), [], {
      cellSize: 10,
      padding: 0,
    });
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 20, height: 20 }),
    });
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 5, clientY: 15 }),
        svg,
        { cellSize: 10, padding: 0 }
      )
    ).toEqual({ row: 1, col: 0 });
  });
});
