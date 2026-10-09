import './style.css';
import './ui/styles/mobile-play-shell.css';
import './ui/styles/zoom-reflow.css';
import './ui/styles/forced-colors.css';
import {
  addRoute,
  initRouter,
  getCurrentPath,
  getPathParams,
  navigate,
  setNotFoundHandler,
} from './core/router';
import { renderGameSelector } from './ui/game-selector';
import type {
  AIDifficultyLevel,
  GameShellElements,
  GameShellOptions,
} from './ui/components/game-shell';
import { getGameById } from './core/game-registry';
import {
  isCurrentRouteGeneration,
  nextRouteGeneration,
} from './core/route-generation';
import { renderGameLoadError, renderGameLoading } from './ui/game-loading';
import {
  installGameErrorBoundary,
  type GameErrorBoundaryHandle,
} from './ui/game-error-boundary';
import { bindOfflineDocumentFlag, isBrowserOffline } from './ui/offline';
import { bindReducedMotionPreference } from './ui/reduced-motion';
import { bootstrapPwa } from './pwa/bootstrap';
import { bootstrapOwl } from './pwa/bootstrap-owl';
import { scheduleIdleGameWarm } from './pwa/idle-warm';
import { exitTutorialIfActive } from './core/tutorial';

/** Resolve New Game modal AI difficulty (shell Easy/Medium/Hard). */
function resolveAIDifficulty(
  difficulty?: AIDifficultyLevel
): AIDifficultyLevel {
  return difficulty ?? 'medium';
}

/**
 * Retry a failed dynamic import by reloading the page.
 * Browsers cache rejected module fetches in the module map, so calling the
 * same `import()` again (e.g. re-entering `renderGame`) cannot recover without
 * a full navigation. Reload keeps the hash route so the game remounts.
 */
function retryLazyChunkLoad(): void {
  window.location.reload();
}

/** Lazy game-shell — keeps player-color chrome off the menu critical path. */
async function mountGameShell(
  container: HTMLElement,
  options: GameShellOptions
): Promise<GameShellElements> {
  const { mountGameShell: mount } = await import('./ui/components/game-shell');
  return mount(container, options);
}

// Get the app container
const appContainer = document.getElementById('app');

if (!appContainer) {
  // Soft-fail (R-SHELL-01): misconfigured hosts get a console diagnostic
  // instead of an uncaught throw that aborts module evaluation silently.
  console.error('[main] App container not found');
}

// Store reference to cleanup functions
let currentCleanup: (() => void) | null = null;
/** Active game-route error boundary (window error / rejection → friendly reset). */
let activeGameBoundary: GameErrorBoundaryHandle | null = null;

// Cleanup previous view
function cleanup(): void {
  exitTutorialIfActive();
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }
  if (activeGameBoundary) {
    activeGameBoundary.dispose();
    activeGameBoundary = null;
  }
}

/** Install (or replace) the per-game error boundary for the current route. */
function bindGameErrorBoundary(gameName: string): void {
  if (activeGameBoundary) {
    activeGameBoundary.dispose();
    activeGameBoundary = null;
  }
  activeGameBoundary = installGameErrorBoundary({
    gameName,
    container: appContainer!,
    onReset: () => renderGame(),
    onHome: () => navigate('/'),
    onBeforeShow: () => {
      exitTutorialIfActive();
      if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
      }
    },
  });
}

// Render the game selector (home page)
function renderHome(): void {
  nextRouteGeneration();
  cleanup();
  document.title = 'Math Pentathlon';
  renderGameSelector(appContainer!);
}

// Read-only progress dashboard (existing storage APIs only)
function renderStats(): void {
  const routeGen = nextRouteGeneration();
  cleanup();
  document.title = 'Math Pentathlon - Your Progress';
  renderGameLoading(appContainer!, 'Your Progress');

  void (async () => {
    try {
      const [{ renderStatsDashboard }] = await Promise.all([
        import('./ui/stats-dashboard'),
        import('./ui/styles/stats-dashboard.css'),
      ]);
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderStatsDashboard(appContainer!);
    } catch {
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderGameLoadError(
        appContainer!,
        'Your Progress',
        retryLazyChunkLoad,
        () => navigate('/')
      );
    }
  })();
}

// Render a specific game (lazy-loads play CSS + that game's chunk on demand)
function renderGame(): void {
  const routeGen = nextRouteGeneration();
  cleanup();

  const path = getCurrentPath();
  const params = getPathParams('/game/:id', path);
  const gameId = params.id;
  if (gameId === undefined) {
    navigate('/');
    return;
  }

  const gameInfo = getGameById(gameId);

  if (!gameInfo || !gameInfo.available) {
    navigate('/');
    return;
  }

  document.title = `Math Pentathlon - ${gameInfo.name}`;
  renderGameLoading(appContainer!, gameInfo.name);
  // Every game route gets a friendly reset boundary before the chunk mounts.
  bindGameErrorBoundary(gameInfo.name);

  const mount = async (): Promise<void> => {
    try {
      // Dynamic-only: play CSS + mounts stay off the menu module graph.
      const [{ initGameMountDeps, mountGameById }] = await Promise.all([
        import('./ui/game-route-mounts'),
        import('./ui/styles/game-play.css'),
      ]);
      if (!isCurrentRouteGeneration(routeGen)) return;
      initGameMountDeps({
        container: appContainer!,
        setCleanup: (fn: (() => void) | null) => {
          currentCleanup = fn;
        },
        mountGameShell,
        resolveAIDifficulty,
      });
      await mountGameById(gameId, routeGen);
    } catch (err) {
      console.error(`Failed to load game ${gameId}`, err);
      if (!isCurrentRouteGeneration(routeGen)) return;
      // Load failures use the dedicated load-error UI; drop the runtime boundary.
      if (activeGameBoundary) {
        activeGameBoundary.dispose();
        activeGameBoundary = null;
      }
      renderGameLoadError(
        appContainer!,
        gameInfo.name,
        retryLazyChunkLoad,
        () => navigate('/'),
        { offline: isBrowserOffline() }
      );
    }
  };

  void mount();
}

function renderDiceDemoPage(): void {
  const routeGen = nextRouteGeneration();
  cleanup();
  document.title = 'Dice System Demo';
  renderGameLoading(appContainer!, 'Dice System Demo');
  void (async () => {
    try {
      const { renderDiceDemo } = await import('./demos/dice-demo');
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderDiceDemo(appContainer!);
    } catch (err) {
      console.error('Failed to load demo', err);
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderGameLoadError(
        appContainer!,
        'Dice System Demo',
        retryLazyChunkLoad,
        () => navigate('/'),
        { offline: isBrowserOffline() }
      );
    }
  })();
}

function renderAlignmentDemoPage(): void {
  const routeGen = nextRouteGeneration();
  cleanup();
  document.title = 'Alignment Detection Demo';
  renderGameLoading(appContainer!, 'Alignment Detection Demo');
  void (async () => {
    try {
      const { renderAlignmentDemo } = await import('./demos/alignment-demo');
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderAlignmentDemo(appContainer!);
    } catch (err) {
      console.error('Failed to load demo', err);
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderGameLoadError(
        appContainer!,
        'Alignment Detection Demo',
        retryLazyChunkLoad,
        () => navigate('/'),
        { offline: isBrowserOffline() }
      );
    }
  })();
}

function renderFractionDemoPage(): void {
  const routeGen = nextRouteGeneration();
  cleanup();
  document.title = 'Fraction System Demo';
  renderGameLoading(appContainer!, 'Fraction System Demo');
  void (async () => {
    try {
      const { renderFractionDemo } = await import('./demos/fraction-demo');
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderFractionDemo(appContainer!);
    } catch (err) {
      console.error('Failed to load demo', err);
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderGameLoadError(
        appContainer!,
        'Fraction System Demo',
        retryLazyChunkLoad,
        () => navigate('/'),
        { offline: isBrowserOffline() }
      );
    }
  })();
}

function renderPolyominoDemoPage(): void {
  const routeGen = nextRouteGeneration();
  cleanup();
  document.title = 'Polyomino System Demo';
  renderGameLoading(appContainer!, 'Polyomino System Demo');
  void (async () => {
    try {
      const { renderPolyominoDemo } = await import('./demos/polyomino-demo');
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderPolyominoDemo(appContainer!);
    } catch (err) {
      console.error('Failed to load demo', err);
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderGameLoadError(
        appContainer!,
        'Polyomino System Demo',
        retryLazyChunkLoad,
        () => navigate('/'),
        { offline: isBrowserOffline() }
      );
    }
  })();
}

function renderGraphDemoPage(): void {
  const routeGen = nextRouteGeneration();
  cleanup();
  document.title = 'Graph/Network System Demo';
  renderGameLoading(appContainer!, 'Graph/Network System Demo');
  void (async () => {
    try {
      const { renderGraphDemo } = await import('./demos/graph-demo');
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderGraphDemo(appContainer!);
    } catch (err) {
      console.error('Failed to load demo', err);
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderGameLoadError(
        appContainer!,
        'Graph/Network System Demo',
        retryLazyChunkLoad,
        () => navigate('/'),
        { offline: isBrowserOffline() }
      );
    }
  })();
}

function renderAttributeDemoPage(): void {
  const routeGen = nextRouteGeneration();
  cleanup();
  document.title = 'Attribute Logic Demo';
  renderGameLoading(appContainer!, 'Attribute Logic Demo');
  void (async () => {
    try {
      const { renderAttributeDemo } = await import('./demos/attribute-demo');
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderAttributeDemo(appContainer!);
    } catch (err) {
      console.error('Failed to load demo', err);
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderGameLoadError(
        appContainer!,
        'Attribute Logic Demo',
        retryLazyChunkLoad,
        () => navigate('/'),
        { offline: isBrowserOffline() }
      );
    }
  })();
}

function renderExpressionDemoPage(): void {
  const routeGen = nextRouteGeneration();
  cleanup();
  document.title = 'Expression Builder Demo';
  renderGameLoading(appContainer!, 'Expression Builder Demo');
  void (async () => {
    try {
      const { renderExpressionDemo } = await import('./demos/expression-demo');
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderExpressionDemo(appContainer!);
    } catch (err) {
      console.error('Failed to load demo', err);
      if (!isCurrentRouteGeneration(routeGen)) return;
      renderGameLoadError(
        appContainer!,
        'Expression Builder Demo',
        retryLazyChunkLoad,
        () => navigate('/'),
        { offline: isBrowserOffline() }
      );
    }
  })();
}

// Bootstrap only when the shell host exists (soft-fail above leaves the
// module loaded so deploy/dev consoles can see the diagnostic).
if (appContainer) {
  // Set up routes
  addRoute('/', renderHome);
  addRoute('/stats', renderStats);
  addRoute('/game/:id', renderGame);
  addRoute('/demo/dice', renderDiceDemoPage);
  addRoute('/demo/alignment', renderAlignmentDemoPage);
  addRoute('/demo/fractions', renderFractionDemoPage);
  addRoute('/demo/polyomino', renderPolyominoDemoPage);
  addRoute('/demo/graph', renderGraphDemoPage);
  addRoute('/demo/attributes', renderAttributeDemoPage);
  addRoute('/demo/expressions', renderExpressionDemoPage);

  // Unknown hashes used to leave the previous view mounted (default console.error).
  setNotFoundHandler(() => {
    navigate('/');
  });

  // Initialize router
  initRouter();

  // Offline shell + background precache — idle-deferred so first paint wins radio
  bootstrapPwa();

  // Tablet / a11y: sync reduced-motion + offline flags onto <html>
  bindReducedMotionPreference();
  bindOfflineDocumentFlag();

  // Defer mascot + popular game warm-imports until after first paint
  bootstrapOwl();
  scheduleIdleGameWarm();
}
