/** Small loading / error UI shown while a game chunk is fetched. */

import { clearElement, setText } from '../core/dom-security';
import { gameLoadErrorHint } from './offline';

export function renderGameLoading(
  container: HTMLElement,
  gameName: string
): void {
  clearElement(container);

  const wrap = document.createElement('div');
  wrap.className = 'game-loading';
  wrap.setAttribute('role', 'status');
  wrap.setAttribute('aria-live', 'polite');
  wrap.setAttribute('data-testid', 'game-loading');

  const spinner = document.createElement('div');
  spinner.className = 'game-loading-spinner';
  spinner.setAttribute('aria-hidden', 'true');

  const text = document.createElement('p');
  text.className = 'game-loading-text';
  setText(text, `Loading ${gameName}…`);

  wrap.append(spinner, text);
  container.appendChild(wrap);
}

export function renderGameLoadError(
  container: HTMLElement,
  gameName: string,
  onRetry: () => void,
  onHome: () => void,
  options: { offline?: boolean } = {}
): void {
  const hintText = gameLoadErrorHint(options.offline);
  clearElement(container);

  const wrap = document.createElement('div');
  wrap.className = 'game-loading game-loading-error';
  wrap.setAttribute('role', 'alert');
  wrap.setAttribute('data-testid', 'game-load-error');

  const title = document.createElement('p');
  title.className = 'game-loading-text';
  setText(title, `Could not load ${gameName}.`);

  const hint = document.createElement('p');
  hint.className = 'game-loading-hint';
  hint.setAttribute('data-testid', 'game-load-error-hint');
  setText(hint, hintText);

  const actions = document.createElement('div');
  actions.className = 'game-loading-actions';

  const retryBtn = document.createElement('button');
  retryBtn.type = 'button';
  retryBtn.className = 'btn btn-primary';
  retryBtn.dataset.action = 'retry';
  setText(retryBtn, 'Try again');
  retryBtn.addEventListener('click', onRetry);

  const homeBtn = document.createElement('button');
  homeBtn.type = 'button';
  homeBtn.className = 'btn btn-secondary';
  homeBtn.dataset.action = 'home';
  setText(homeBtn, 'Back to games');
  homeBtn.addEventListener('click', onHome);

  actions.append(retryBtn, homeBtn);
  wrap.append(title, hint, actions);
  container.appendChild(wrap);
}
