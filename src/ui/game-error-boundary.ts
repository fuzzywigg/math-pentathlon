/**
 * Per-game-route error boundary (vanilla DOM).
 * Catches window errors + unhandled rejections while a game is mounted and
 * shows a friendly reset UI — analogous to a React error boundary.
 */

export interface GameErrorBoundaryOptions {
  /** Display name for copy (e.g. "Hex"). */
  gameName: string;
  /** Host that currently shows the game shell (usually `#app`). */
  container: HTMLElement;
  /** Remount the same game route. */
  onReset: () => void;
  /** Navigate back to the game list. */
  onHome: () => void;
  /**
   * Called once before the crash UI replaces the container — use to run the
   * game's destroy/cleanup so timers/workers do not keep firing.
   */
  onBeforeShow?: () => void;
}

export interface GameErrorBoundaryHandle {
  dispose: () => void;
  /** True after a crash UI has been shown for this install. */
  readonly didCatch: boolean;
}

/**
 * Friendly crash / reset screen for a game route.
 * Distinct from chunk-load failure (`game-load-error`).
 */
export function renderGameCrash(
  container: HTMLElement,
  gameName: string,
  onReset: () => void,
  onHome: () => void
): void {
  container.innerHTML = `
    <div class="game-loading game-loading-error" role="alert" data-testid="game-error-boundary">
      <p class="game-loading-text">Something went wrong in ${escapeHtml(gameName)}.</p>
      <p class="game-loading-hint" data-testid="game-error-boundary-hint">
        You can try again or head back to the game list — your other games are fine.
      </p>
      <div class="game-loading-actions">
        <button type="button" class="btn btn-primary" data-action="reset">Try again</button>
        <button type="button" class="btn btn-secondary" data-action="home">Back to games</button>
      </div>
    </div>
  `;

  container
    .querySelector('[data-action="reset"]')
    ?.addEventListener('click', onReset);
  container
    .querySelector('[data-action="home"]')
    ?.addEventListener('click', onHome);
}

/**
 * Install window-level listeners for the active game route.
 * Dispose on route leave (and after showing the crash UI).
 */
export function installGameErrorBoundary(
  options: GameErrorBoundaryOptions
): GameErrorBoundaryHandle {
  let active = true;
  let didCatch = false;

  const show = (reason: unknown) => {
    if (!active || didCatch) return;
    didCatch = true;
    active = false;
    removeListeners();

    try {
      options.onBeforeShow?.();
    } catch {
      // Cleanup failures must not block the reset UI.
    }

    // Keep a breadcrumb in the console for debugging without leaving a blank page.
    console.error(`[game-error-boundary] ${options.gameName}`, reason);

    renderGameCrash(
      options.container,
      options.gameName,
      options.onReset,
      options.onHome
    );
  };

  const onError = (event: ErrorEvent) => {
    // Resource/load errors (img/script) have no error object — skip those.
    if (!event.error) return;
    event.preventDefault();
    show(event.error);
  };

  const onRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    show(event.reason);
  };

  const removeListeners = () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };

  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);

  return {
    get didCatch() {
      return didCatch;
    },
    dispose: () => {
      active = false;
      removeListeners();
    },
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
