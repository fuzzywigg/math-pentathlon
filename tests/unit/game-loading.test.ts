import { describe, expect, it, vi } from 'vitest';
import {
  renderGameLoadError,
  renderGameLoading,
} from '../../src/ui/game-loading';

describe('game-loading UI', () => {
  it('renders a polite loading status with the game name', () => {
    const root = document.createElement('div');
    renderGameLoading(root, 'Hex');

    const status = root.querySelector('[data-testid="game-loading"]');
    expect(status).not.toBeNull();
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(root.textContent).toContain('Loading Hex');
  });

  it('escapes HTML in the game name', () => {
    const root = document.createElement('div');
    renderGameLoading(root, '<img src=x onerror=alert(1)>');
    expect(root.innerHTML).not.toContain('<img');
    expect(root.innerHTML).toContain('&lt;img');
  });

  it('wires retry and home actions on load error', () => {
    const root = document.createElement('div');
    const onRetry = vi.fn();
    const onHome = vi.fn();
    renderGameLoadError(root, 'Calla', onRetry, onHome);

    expect(
      root.querySelector('[data-testid="game-load-error"]')
    ).not.toBeNull();
    root.querySelector<HTMLButtonElement>('[data-action="retry"]')?.click();
    root.querySelector<HTMLButtonElement>('[data-action="home"]')?.click();
    expect(onRetry).toHaveBeenCalledOnce();
    expect(onHome).toHaveBeenCalledOnce();
  });
});
