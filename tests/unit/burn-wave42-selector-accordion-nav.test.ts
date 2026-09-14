/**
 * Wave 42 — game-selector accordion open/close leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { renderGameSelector } from '../../src/ui/game-selector';
import { DIVISIONS } from '../../src/core/game-registry';
import * as router from '../../src/core/router';

describe('Wave 42 selector — accordion nav', () => {
  let root: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    Element.prototype.scrollIntoView = vi.fn();
    root = document.createElement('div');
    document.body.appendChild(root);
    vi.spyOn(router, 'navigate').mockImplementation(() => {});
    renderGameSelector(root);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    root.remove();
    vi.restoreAllMocks();
  });

  it('first division accordion starts open', () => {
    const sections = root.querySelectorAll('.division-accordion');
    expect(sections.length).toBe(DIVISIONS.length);
    expect(sections[0].classList.contains('accordion-open')).toBe(true);
  });

  it('clicking another header opens that section', () => {
    const sections = [...root.querySelectorAll('.division-accordion')];
    const header = sections[1].querySelector('.accordion-header') as HTMLElement;
    header.click();
    expect(sections[1].classList.contains('accordion-open')).toBe(true);
  });

  it('opening one section closes others', () => {
    const sections = [...root.querySelectorAll('.division-accordion')];
    (sections[2].querySelector('.accordion-header') as HTMLElement).click();
    expect(sections[2].classList.contains('accordion-open')).toBe(true);
    expect(sections[0].classList.contains('accordion-open')).toBe(false);
  });

  it('division tabs exist for each division', () => {
    const tabs = root.querySelectorAll('[data-division]');
    expect(tabs.length).toBeGreaterThanOrEqual(DIVISIONS.length);
  });

  it('game cards are present after render', () => {
    expect(root.querySelectorAll('.game-card').length).toBeGreaterThan(0);
  });
});
