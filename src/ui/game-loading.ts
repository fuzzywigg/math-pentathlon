/** Small loading / error UI shown while a game chunk is fetched. */

import { gameLoadErrorHint } from './offline';

export function renderGameLoading(
  container: HTMLElement,
  gameName: string
): void {
  container.innerHTML = `
    <div class="game-loading" role="status" aria-live="polite" data-testid="game-loading">
      <div class="game-loading-spinner" aria-hidden="true"></div>
      <p class="game-loading-text">Loading ${escapeHtml(gameName)}…</p>
    </div>
  `;
}

export function renderGameLoadError(
  container: HTMLElement,
  gameName: string,
  onRetry: () => void,
  onHome: () => void,
  options: { offline?: boolean } = {}
): void {
  const hint = gameLoadErrorHint(options.offline);
  container.innerHTML = `
    <div class="game-loading game-loading-error" role="alert" data-testid="game-load-error">
      <p class="game-loading-text">Could not load ${escapeHtml(gameName)}.</p>
      <p class="game-loading-hint" data-testid="game-load-error-hint">${escapeHtml(hint)}</p>
      <div class="game-loading-actions">
        <button type="button" class="btn btn-primary" data-action="retry">Try again</button>
        <button type="button" class="btn btn-secondary" data-action="home">Back to games</button>
      </div>
    </div>
  `;

  container
    .querySelector('[data-action="retry"]')
    ?.addEventListener('click', onRetry);
  container
    .querySelector('[data-action="home"]')
    ?.addEventListener('click', onHome);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
