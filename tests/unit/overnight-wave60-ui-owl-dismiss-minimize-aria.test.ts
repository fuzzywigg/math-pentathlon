/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl dismiss/minimize aria labels.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OwlComponent } from '../../src/ui/owl/owl-component';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 60 ui owl — dismiss/minimize aria', () => {
  let owl: OwlComponent;
  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
    storage.updateSettings({ owlEnabled: true });
    owlSystem.hide();
    document.body.innerHTML = '';
    owl = new OwlComponent();
  });
  afterEach(() => {
    owl.destroy();
    document.body.innerHTML = '';
    localStorage.clear();
    storage.resetAll();
  });

  it('pins dismiss and minimize control aria labels', () => {
    owl.init();
    const root = owl.getElement()!;
    expect(
      root.querySelector('.owl-bubble-dismiss')?.getAttribute('aria-label')
    ).toBe('Dismiss message');
    const min = root.querySelector('.owl-minimize-btn') as HTMLButtonElement;
    expect(min.getAttribute('aria-label')).toBe('Minimize Ollie');
    expect(min.getAttribute('title')).toBe('Minimize');
  });
});
