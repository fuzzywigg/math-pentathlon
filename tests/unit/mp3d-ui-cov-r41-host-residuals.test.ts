/**
 * q-mp-470 / UI coverage round 41 — residual arms across colder board-3d
 * hosts (FIAR / Pent / Hex / Queens / Kwatro / Star / Kings). Characterization
 * only; no AI / timing / copy-body / product layout edits.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  dispatchTap,
  installCanvas2dStub,
  installThreeMock,
  stubCanvasLayout,
} from './helpers/mp3d-three-mock';
import { createInitialState as createFiarState } from '../../src/games/fiar/types';
import { createInitialState as createPentState } from '../../src/games/pent-em-in/types';
import { createInitialState as createHexState } from '../../src/games/hex-a-gone/types';
import { createInitialState as createQueensState } from '../../src/games/queens-guards/types';
import { createInitialState as createKwatroState } from '../../src/games/kwatro-sinko/rules';
import { createInitialState as createStarState } from '../../src/games/star-track/types';
import { createInitialGameState as createKingsState } from '../../src/games/kings-quadraphages/game-state';

vi.mock('../../src/ui/player-colors', () => ({
  getPlayerSeatColors: () => ({
    player1: '#2563eb',
    player2: '#dc2626',
    player1Light: '#93c5fd',
    player2Light: '#fca5a5',
  }),
}));

describe('q-mp-470 ui-cov-r41 host residuals', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
    installCanvas2dStub();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    const w = window as Window & Record<string, unknown>;
    delete w.__mp3dFiar;
    delete w.__mp3dPentEmIn;
    delete w.__mp3dHexAGone;
    delete w.__mp3dQueensGuards;
    delete w.__mp3dKwatroSinko;
    delete w.__mp3dStarTrack;
    delete w.__mp3dKingsQuadraphages;
  });

  it('FIAR: zero-rect miss, parent-walk hit, marked-dot clear, post-dispose', async () => {
    const parent = {
      userData: { nodeId: 'c3r3', kind: 'space' },
      parent: null as unknown,
    };
    const child = { userData: {}, parent };
    const hitQueue = [[{ object: child }], [{ object: child }]];
    const three = installThreeMock({ hitQueue });
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));
    const { createFiarBoard3D } =
      await import('../../src/ui/three/fiar-board-3d');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onNode = vi.fn();
    const board = await createFiarBoard3D(host, onNode);
    stubCanvasLayout(board.canvas);

    const base = createFiarState();
    const n = base.board.nodes.get('c3r3')!;
    base.board.nodes.set('c3r3', {
      ...n,
      chip: 'player1',
      chipKind: 'marked',
    });
    board.update(base, onNode);

    // Clear marked-dot arm on second update.
    base.board.nodes.set('c3r3', {
      ...n,
      chip: 'player1',
      chipKind: 'plain',
    });
    board.update(base, onNode);

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
    window.dispatchEvent(new Event('resize'));
    dispatchTap(board.canvas);
    expect(onNode).not.toHaveBeenCalled();

    stubCanvasLayout(board.canvas);
    window.dispatchEvent(new Event('resize'));
    dispatchTap(board.canvas);
    expect(onNode).toHaveBeenCalledWith('c3r3');

    board.unmount();
    board.update(base);
    window.dispatchEvent(new Event('resize'));
    board.canvas.dispatchEvent(
      new Event('webglcontextlost', { cancelable: true, bubbles: true })
    );
  });

  it('Queens/Kwatro/Star null hooks + Pent/Hex/Kings post-dispose no-ops', async () => {
    const three = installThreeMock();
    vi.doMock('../../src/ui/three/load-three', () => ({
      loadThree: async () => three,
    }));

    const host = document.createElement('div');
    document.body.appendChild(host);

    const { createQueensGuardsBoard3D } =
      await import('../../src/ui/three/queens-guards-board-3d');
    const queens = await createQueensGuardsBoard3D(host);
    stubCanvasLayout(queens.canvas);
    queens.update(createQueensState());
    expect(queens.cellToClientPoint(-1, 0)).toBeNull();
    expect(queens.cellToClientPoint(0, 99)).toBeNull();
    queens.unmount();
    queens.update(createQueensState());
    window.dispatchEvent(new Event('resize'));

    host.replaceChildren();
    const { createKwatroSinkoBoard3D } =
      await import('../../src/ui/three/kwatro-sinko-board-3d');
    const kwatro = await createKwatroSinkoBoard3D(host);
    stubCanvasLayout(kwatro.canvas);
    kwatro.update(createKwatroState());
    expect(kwatro.nodeToClientPoint('not-a-node')).toBeNull();
    kwatro.unmount();
    kwatro.update(createKwatroState());

    host.replaceChildren();
    const { createStarTrackBoard3D } =
      await import('../../src/ui/three/star-track-board-3d');
    const star = await createStarTrackBoard3D(host);
    stubCanvasLayout(star.canvas);
    star.update(createStarState());
    star.unmount();
    expect(star.spaceToClientPoint('player1', 0)).toBeNull();
    star.update(createStarState());

    host.replaceChildren();
    const { createPentEmInBoard3D } =
      await import('../../src/ui/three/pent-em-in-board-3d');
    const pent = await createPentEmInBoard3D(host);
    stubCanvasLayout(pent.canvas);
    pent.update(createPentState());
    pent.unmount();
    pent.update(createPentState());
    window.dispatchEvent(new Event('resize'));

    host.replaceChildren();
    const { createHexAGoneBoard3D } =
      await import('../../src/ui/three/hex-a-gone-board-3d');
    const hex = await createHexAGoneBoard3D(host);
    stubCanvasLayout(hex.canvas);
    hex.update(createHexState());
    hex.unmount();
    hex.update(createHexState());

    host.replaceChildren();
    const { createKingsQuadraphagesBoard3D } =
      await import('../../src/ui/three/kings-quadraphages-board-3d');
    const kings = await createKingsQuadraphagesBoard3D(host);
    stubCanvasLayout(kings.canvas);
    kings.update(createKingsState());
    kings.unmount();
    kings.update(createKingsState());
  });
});
