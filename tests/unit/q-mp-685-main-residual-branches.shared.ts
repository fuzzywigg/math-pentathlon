/**
 * Shared fixtures for q-mp-685 main.ts residual-branch shards (q-mp-1212).
 * DEMO_ROUTES + DOM hooks stay identical across parallel unit-isolated files.
 */
import { afterEach, beforeEach, vi } from 'vitest';

export type DemoRoute = {
  hash: string;
  attr: string;
  load: () => Promise<ReturnType<typeof vi.fn>>;
};

export const DEMO_ROUTES: DemoRoute[] = [
  {
    hash: '#/demo/dice',
    attr: 'dice',
    load: async () => {
      const m = await import('../../src/demos/dice-demo');
      return vi.mocked(m.renderDiceDemo);
    },
  },
  {
    hash: '#/demo/alignment',
    attr: 'alignment',
    load: async () => {
      const m = await import('../../src/demos/alignment-demo');
      return vi.mocked(m.renderAlignmentDemo);
    },
  },
  {
    hash: '#/demo/fractions',
    attr: 'fractions',
    load: async () => {
      const m = await import('../../src/demos/fraction-demo');
      return vi.mocked(m.renderFractionDemo);
    },
  },
  {
    hash: '#/demo/polyomino',
    attr: 'polyomino',
    load: async () => {
      const m = await import('../../src/demos/polyomino-demo');
      return vi.mocked(m.renderPolyominoDemo);
    },
  },
  {
    hash: '#/demo/graph',
    attr: 'graph',
    load: async () => {
      const m = await import('../../src/demos/graph-demo');
      return vi.mocked(m.renderGraphDemo);
    },
  },
  {
    hash: '#/demo/attributes',
    attr: 'attributes',
    load: async () => {
      const m = await import('../../src/demos/attribute-demo');
      return vi.mocked(m.renderAttributeDemo);
    },
  },
  {
    hash: '#/demo/expressions',
    attr: 'expressions',
    load: async () => {
      const m = await import('../../src/demos/expression-demo');
      return vi.mocked(m.renderExpressionDemo);
    },
  },
];

export const NON_DICE_DEMOS = DEMO_ROUTES.filter((d) => d.attr !== 'dice');

type BoundaryInstall =
  typeof import('../../src/ui/game-error-boundary').installGameErrorBoundary;

export type MainResidualMocks = {
  mountGameById: ReturnType<typeof vi.fn>;
  initGameMountDeps: ReturnType<typeof vi.fn>;
  renderStatsDashboard: ReturnType<typeof vi.fn>;
  isBrowserOffline: ReturnType<typeof vi.fn>;
  installGameErrorBoundary: ReturnType<typeof vi.fn>;
  boundaryState: { real: BoundaryInstall | null };
};

/** Same beforeEach/afterEach as the pre-shard monolith (coverage-preserving). */
export function installMainResidualHooks(m: MainResidualMocks): void {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    window.location.hash = '';
    m.mountGameById.mockReset();
    m.initGameMountDeps.mockReset();
    m.mountGameById.mockResolvedValue(undefined);
    m.initGameMountDeps.mockImplementation(() => undefined);
    m.renderStatsDashboard.mockReset();
    m.renderStatsDashboard.mockImplementation((container: HTMLElement) => {
      container.innerHTML = '<div data-testid="stats">stats</div>';
    });
    m.isBrowserOffline.mockReturnValue(false);
    m.installGameErrorBoundary.mockClear();
    m.installGameErrorBoundary.mockImplementation((opts) => {
      if (!m.boundaryState.real) {
        throw new Error('q-mp-685: real installGameErrorBoundary not armed');
      }
      return m.boundaryState.real(opts);
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.location.hash = '';
    vi.resetModules();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
}
