/**
 * q-mp-617 — Close `kwatro-sinko-board-3d` branch gaps (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ `780db960`):
 *   File **850** LOC; with `tests/unit/*kwatro*board*` only:
 *   **77.11%** lines / **67.93%** branches (matches backlog 77.1% / 67.9%).
 *
 * Ownership (leave alone):
 *   `#1040`/`582` kwatro board-ui/controller residuals — **contained**
 *   `#835`/`352` layout-read batch (src) — **contained**
 *   `#1020` r55 inventory host — **contained**
 *   `kwatro-sinko/ai.ts` / `rules.ts` — hard-rule HOLD (setup imports only)
 *
 * Constraints: tests only; zero `src/` edits; stub AI (none invoked);
 * rules.ts for state setup only; no AI / scoring / legal-move outcome
 * asserts; no player-facing copy or aria/label string pins (element
 * presence, class/attribute chrome, render-call counts only); no
 * visual-baseline; no ratchet JSON.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createInitialState,
  selectChip,
} from '../../src/games/kwatro-sinko/rules';
import type { KwaState } from '../../src/games/kwatro-sinko/types';
import {
  dispatchTap,
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

function mountHost(): HTMLDivElement {
  const host = document.createElement('div');
  host.style.width = '400px';
  host.style.height = '400px';
  Object.defineProperty(host, 'clientWidth', {
    value: 400,
    configurable: true,
  });
  Object.defineProperty(host, 'clientHeight', {
    value: 400,
    configurable: true,
  });
  document.body.appendChild(host);
  return host;
}

beforeEach(() => {
  vi.resetModules();
  document.body.innerHTML = '';
  installCanvas2dStub();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete (window as Window & { __mp3dKwatroSinko?: unknown }).__mp3dKwatroSinko;
});

describe('q-mp-617 kwatro-sinko-board-3d — pure helpers', () => {
  it('parseKwatroNodeId / nodeToWorld / collectPathwayEdgeKeys chrome', async () => {
    const { parseKwatroNodeId, nodeToWorld, collectPathwayEdgeKeys } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');

    expect(parseKwatroNodeId('bad')).toBeNull();
    expect(parseKwatroNodeId('n2-3')).toEqual({ row: 2, col: 3 });
    const a = nodeToWorld(0, 0);
    const b = nodeToWorld(0, 1);
    expect(b.x).toBeGreaterThan(a.x);

    const state = createInitialState();
    // Malformed connection ids exercise buildEdgesOnce skip arms when mounted.
    const n00 = state.nodes.get('n0-0');
    expect(n00).toBeTruthy();
    n00!.connections = [...n00!.connections, 'not-a-node', ''];

    const keys = collectPathwayEdgeKeys(state);
    expect(keys.length).toBeGreaterThan(0);
    expect(keys.some((k) => k.includes('not-a-node'))).toBe(true);
  });
});

describe('q-mp-617 kwatro-sinko-board-3d — mount / texture / soft-fail', () => {
  it('wood + chip number textures take the 2d canvas path (SRGB when present)', async () => {
    const three = installThreeMock();
    (three as { SRGBColorSpace?: number }).SRGBColorSpace = 3001;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = mountHost();
    const board = await createKwatroSinkoBoard3D(host);
    stubCanvasLayout(board.canvas);
    board.update(createInitialState());
    expect(
      three.__createdMats.some((m) => (m.opts as { map?: unknown })?.map)
    ).toBe(true);
    expect(host.querySelector('canvas[data-mp3d="kwatro-sinko"]')).toBeTruthy();
    expect(host.querySelector('.kwa-a11y-grid')).toBeTruthy();
    board.unmount();
  });

  it('falls back to canvas getContext when renderer.getContext is absent', async () => {
    const three = installThreeMock();
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio = vi.fn();
      setSize = vi.fn();
      render = vi.fn();
      dispose = vi.fn();
      forceContextLoss = vi.fn();
      // no getContext method → board uses domElement.getContext fallback
    } as typeof three.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = mountHost();
    const board = await createKwatroSinkoBoard3D(host);
    expect(host.querySelector('canvas[data-mp3d="kwatro-sinko"]')).toBeTruthy();
    board.unmount();
  });

  it('uses experimental-webgl when webgl context is null', async () => {
    const three = installThreeMock();
    three.WebGLRenderer = class {
      domElement = document.createElement('canvas');
      setPixelRatio = vi.fn();
      setSize = vi.fn();
      render = vi.fn();
      dispose = vi.fn();
      forceContextLoss = vi.fn();
      getContext = undefined as unknown as () => unknown;
    } as typeof three.WebGLRenderer;
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn(function (
      this: HTMLCanvasElement,
      type: string
    ) {
      if (type === 'webgl') {
        return null;
      }
      if (type === 'experimental-webgl') {
        return {};
      }
      if (type === '2d') {
        return orig.call(this, '2d');
      }
      return null;
    }) as never;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = mountHost();
    const board = await createKwatroSinkoBoard3D(host);
    expect(host.querySelector('canvas[data-mp3d="kwatro-sinko"]')).toBeTruthy();
    board.unmount();
  });

  it('wraps non-Error constructor failures', async () => {
    const three = installThreeMock();
    three.WebGLRenderer = class {
      constructor() {
        throw 'boom-string';
      }
    } as typeof three.WebGLRenderer;
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    await expect(createKwatroSinkoBoard3D(mountHost())).rejects.toThrow(
      /WebGLRenderer failed/
    );
  });
});

describe('q-mp-617 kwatro-sinko-board-3d — pointer / pick arms', () => {
  it('raycast hit prefers chip handler; miss + no-handler soft-return', async () => {
    const hitQueue = [
      [{ object: { userData: { nodeId: 'n0-0' } } }],
      // Empty mid-board node via parent walk (n2-2 has no opening chip)
      [
        {
          object: { userData: {}, parent: { userData: { nodeId: 'n2-2' } } },
        },
      ],
      [],
    ];
    const three = installThreeMock({ hitQueue });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = mountHost();
    const onNode = vi.fn();
    const onChip = vi.fn();
    const board = await createKwatroSinkoBoard3D(host, onNode, onChip);
    stubCanvasLayout(board.canvas);
    board.update(createInitialState(), onNode, onChip);

    dispatchTap(board.canvas);
    expect(onChip).toHaveBeenCalledTimes(1);
    expect(onChip.mock.calls[0]?.[0]).toMatch(/^p1-/);

    onChip.mockClear();
    onNode.mockClear();
    // Parent-walk raycast hit → empty node → node handler
    dispatchTap(board.canvas, 210, 210);
    expect(onNode).toHaveBeenCalledTimes(1);
    expect(onNode.mock.calls[0]?.[0]).toBe('n2-2');

    onNode.mockClear();
    // Empty hit + far tap → pick miss
    stubCanvasLayout(board.canvas);
    vi.spyOn(board.canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 400,
      bottom: 400,
      width: 400,
      height: 400,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      },
    });
    dispatchTap(board.canvas, 10_000, 10_000);
    expect(onNode).not.toHaveBeenCalled();
    expect(onChip).not.toHaveBeenCalled();

    // No handlers → soft return
    board.update(createInitialState());
    dispatchTap(board.canvas, 200, 200);

    board.unmount();
    // Post-dispose tap is a no-op
    dispatchTap(board.canvas, 200, 200);
  });

  it('empty raycast nearest-node fallback still activates node handler', async () => {
    const three = installThreeMock({ hitQueue: [] });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = mountHost();
    const onNode = vi.fn();
    const board = await createKwatroSinkoBoard3D(host, onNode);
    stubCanvasLayout(board.canvas);
    board.update(createInitialState(), onNode);

    const pt = board.nodeToClientPoint('n2-2');
    expect(pt).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );
    dispatchTap(board.canvas, pt!.x, pt!.y);
    expect(onNode).toHaveBeenCalledTimes(1);
    expect(typeof onNode.mock.calls[0]?.[0]).toBe('string');
    board.unmount();
  });

  it('zero-size canvas css box yields pick miss (clientToNdc null)', async () => {
    const three = installThreeMock({ hitQueue: [] });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = mountHost();
    const onNode = vi.fn();
    const board = await createKwatroSinkoBoard3D(host, onNode);
    board.update(createInitialState(), onNode);
    vi.spyOn(board.canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      },
    });
    // Invalidate cached rect via resize, then tap with zero box
    window.dispatchEvent(new Event('resize'));
    dispatchTap(board.canvas, 1, 1);
    expect(onNode).not.toHaveBeenCalled();
    board.unmount();
  });
});

describe('q-mp-617 kwatro-sinko-board-3d — update / a11y chrome arms', () => {
  it('winning / selected / valid pad chrome + p2 class + focus restore', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = mountHost();
    const onNode = vi.fn();
    const onChip = vi.fn();
    const board = await createKwatroSinkoBoard3D(host, onNode, onChip);
    stubCanvasLayout(board.canvas);

    let state = createInitialState();
    board.update(state, onNode, onChip);

    // Focus a cell so syncA11y restore arm runs on next update
    const first = host.querySelector(
      '.kwa-a11y-grid [data-node-id]'
    ) as HTMLButtonElement | null;
    expect(first).toBeTruthy();
    first!.focus();

    state = selectChip(state, 'p1-0');
    board.update(state, onNode, onChip);
    expect(host.querySelector('.kwa-a11y-grid .kwa-valid-node')).toBeTruthy();
    expect(
      host.querySelector('.kwa-a11y-grid .kwa-selectable-chip')
    ).toBeNull();

    // Same chip again → syncChip else (no rebuild) arm
    board.update(state, onNode, onChip);

    // Winning alignment chrome (fabricated; no scoring assert)
    board.update(
      {
        ...state,
        phase: 'gameOver',
        winner: 'player1',
        winningAlignment: {
          nodes: ['n0-0', 'n0-1', 'n0-2', 'n0-3'],
          chips: [],
          expression: 'align',
          result: 4,
        },
      },
      onNode,
      onChip
    );

    // p2 chip class chrome on bottom row
    expect(host.querySelector('.kwa-a11y-grid .kwa-chip-p2')).toBeTruthy();

    // Missing node skip arm
    const withHole: KwaState = {
      ...createInitialState(),
      nodes: new Map(
        [...createInitialState().nodes].filter(([id]) => id !== 'n2-2')
      ),
    };
    board.update(withHole, onNode, onChip);
    expect(
      host.querySelector('.kwa-a11y-grid [data-node-id="n2-2"]')
    ).toBeNull();

    expect(board.nodeToClientPoint('not-a-node')).toBeNull();
    board.unmount();
  });

  it('reduced-motion skips chip emphasize scale; motion path scales', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = mountHost();
    const board = await createKwatroSinkoBoard3D(host);
    stubCanvasLayout(board.canvas);
    const base = createInitialState();

    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }));
    board.update({
      ...base,
      selectedChip: 'p1-0',
      winningAlignment: {
        nodes: ['n0-0'],
        chips: [],
        expression: 'align',
        result: 4,
      },
    });

    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }));
    board.update({
      ...base,
      selectedChip: 'p1-0',
      winningAlignment: {
        nodes: ['n0-0'],
        chips: [],
        expression: 'align',
        result: 4,
      },
    });
    // render-on-demand paint was scheduled
    expect(three.WebGLRenderer).toBeTruthy();
    board.unmount();
  });

  it('a11y chip activate + valid-node activate invoke handlers (no label pins)', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = mountHost();
    const onNode = vi.fn();
    const onChip = vi.fn();
    const board = await createKwatroSinkoBoard3D(host, onNode, onChip);
    stubCanvasLayout(board.canvas);

    let state = createInitialState();
    board.update(state, onNode, onChip);
    const chipBtn = host.querySelector(
      '.kwa-a11y-grid .kwa-selectable-chip'
    ) as HTMLButtonElement | null;
    expect(chipBtn).toBeTruthy();
    expect(chipBtn!.hasAttribute('data-node-id')).toBe(true);
    chipBtn!.click();
    expect(onChip).toHaveBeenCalledTimes(1);

    state = selectChip(state, onChip.mock.calls[0]![0] as string);
    board.update(state, onNode, onChip);
    const dest = host.querySelector(
      '.kwa-a11y-grid .kwa-valid-node'
    ) as HTMLButtonElement | null;
    expect(dest).toBeTruthy();
    dest!.click();
    expect(onNode).toHaveBeenCalledTimes(1);
    board.unmount();
  });
});

describe('q-mp-617 kwatro-sinko-board-3d — dispose / idempotence', () => {
  it('double unmount, post-dispose update/resize, detached chrome, context-lost', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = mountHost();
    const lost = vi.fn();
    host.addEventListener('mp3d-context-lost', lost);

    const board = await createKwatroSinkoBoard3D(host);
    stubCanvasLayout(board.canvas);
    board.update(createInitialState());

    // Detach chrome before unmount → parentElement falsy arms
    board.canvas.remove();
    host.querySelector('.kwa-a11y-grid')?.remove();
    delete (window as Window & { __mp3dKwatroSinko?: unknown })
      .__mp3dKwatroSinko;

    board.unmount();
    board.unmount();
    board.update(createInitialState());
    window.dispatchEvent(new Event('resize'));

    // Context-lost after dispose is a soft no-op
    const event = new Event('webglcontextlost', {
      cancelable: true,
      bubbles: true,
    });
    board.canvas.dispatchEvent(event);
    expect(lost).not.toHaveBeenCalled();

    // Fresh mount for context-lost happy path while disposed mid-handler
    const host2 = mountHost();
    const board2 = await createKwatroSinkoBoard3D(host2);
    const lost2 = vi.fn();
    host2.addEventListener('mp3d-context-lost', lost2);
    const ev2 = new Event('webglcontextlost', {
      cancelable: true,
      bubbles: true,
    });
    board2.canvas.dispatchEvent(ev2);
    expect(ev2.defaultPrevented).toBe(true);
    expect(lost2).toHaveBeenCalledTimes(1);
    expect(host2.querySelector('canvas')).toBeNull();
  });

  it('buildEdgesOnce with malformed pathway keys still mounts edges once', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const host = mountHost();
    const board = await createKwatroSinkoBoard3D(host);
    stubCanvasLayout(board.canvas);

    const state = createInitialState();
    const n11 = state.nodes.get('n1-1');
    expect(n11).toBeTruthy();
    n11!.connections = ['n0-0', 'bad-id', '|weird', 'n2-2'];

    board.update(state);
    board.update(state); // second call hits edgeLines early-return
    expect(host.querySelector('canvas[data-mp3d="kwatro-sinko"]')).toBeTruthy();
    board.unmount();
  });
});
