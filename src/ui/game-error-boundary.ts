/**
 * Per-game-route error boundary (vanilla DOM).
 * Catches window errors + unhandled rejections while a game is mounted and
 * shows a friendly reset UI — analogous to a React error boundary.
 */

import { clearElement, setText } from '../core/dom-security';

interface GameErrorBoundaryOptions {
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
 * Friendly crash / reset UI for a game route.
 * Distinct from chunk-load failure (`game-load-error`).
 * Built with safe DOM APIs — gameName is never parsed as HTML.
 */
export function renderGameCrash(
  container: HTMLElement,
  gameName: string,
  onReset: () => void,
  onHome: () => void
): void {
  clearElement(container);

  const wrap = document.createElement('div');
  wrap.className = 'game-loading game-loading-error';
  wrap.setAttribute('role', 'alert');
  wrap.setAttribute('data-testid', 'game-error-boundary');

  const title = document.createElement('p');
  title.className = 'game-loading-text';
  setText(title, `Something went wrong in ${gameName}.`);

  const hint = document.createElement('p');
  hint.className = 'game-loading-hint';
  hint.setAttribute('data-testid', 'game-error-boundary-hint');
  setText(
    hint,
    'You can try again or head back to the game list — your other games are fine.'
  );

  const actions = document.createElement('div');
  actions.className = 'game-loading-actions';

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn btn-primary';
  resetBtn.dataset.action = 'reset';
  setText(resetBtn, 'Try again');
  resetBtn.addEventListener('click', onReset);

  const homeBtn = document.createElement('button');
  homeBtn.type = 'button';
  homeBtn.className = 'btn btn-secondary';
  homeBtn.dataset.action = 'home';
  setText(homeBtn, 'Back to games');
  homeBtn.addEventListener('click', onHome);

  actions.append(resetBtn, homeBtn);
  wrap.append(title, hint, actions);
  container.appendChild(wrap);
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
    if (!active || didCatch) {
      return;
    }
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
    if (!event.error) {
      return;
    }
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
