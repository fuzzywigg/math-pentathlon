/**
 * Shared DOM mount / teardown for Vitest jsdom suites.
 * Composes with `tests/unit/setup.ts` (global body clear + real timers).
 */
import { afterEach, beforeEach, vi } from 'vitest';

/** Clear document.body; optionally remove injected style nodes by id. */
function clearDom(styleIds?: readonly string[]): void {
  document.body.innerHTML = '';
  if (styleIds) {
    for (const id of styleIds) {
      document.getElementById(id)?.remove();
    }
  }
}

/** Create a bare root div, append to body, return it. */
export function mountRoot(options?: { id?: string }): HTMLElement {
  const root = document.createElement('div');
  if (options?.id) root.id = options.id;
  document.body.appendChild(root);
  return root;
}

/**
 * Shell many game controllers expect:
 * `<div id="app"><div><!-- returned --></div></div>`
 */
export function mountAppShell(): HTMLElement {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const container = document.createElement('div');
  app.appendChild(container);
  return container;
}

export type DomHooksOptions = {
  styleIds?: readonly string[];
  fakeTimers?: boolean;
};

/**
 * Install beforeEach/afterEach hooks: clear DOM (+ optional style ids).
 * When `fakeTimers` is true, enables fake timers in beforeEach and restores
 * real timers in afterEach (global setup also restores real timers).
 */
export function installDomHooks(options: DomHooksOptions = {}): void {
  const { styleIds, fakeTimers = false } = options;
  beforeEach(() => {
    clearDom(styleIds);
    if (fakeTimers) {
      vi.useFakeTimers();
    }
  });
  afterEach(() => {
    if (fakeTimers) {
      vi.useRealTimers();
    }
    clearDom(styleIds);
  });
}
