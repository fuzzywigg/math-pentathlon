/**
 * Wave 36 — renderGameSelector hero progress link → /stats.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { renderGameSelector } from '../../src/ui/game-selector';
import * as router from '../../src/core/router';

describe('Wave 36 selector — progress CTA', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
    vi.restoreAllMocks();
  });

  it('hero-progress-link navigates to /stats', () => {
    const nav = vi.spyOn(router, 'navigate').mockImplementation(() => {});
    renderGameSelector(root);
    const link = root.querySelector('.hero-progress-link') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#/stats');
    link.click();
    expect(nav).toHaveBeenCalledWith('/stats');
  });
});
