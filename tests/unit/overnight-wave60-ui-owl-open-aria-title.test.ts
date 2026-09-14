/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl minimized open aria/title.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OwlComponent } from '../../src/ui/owl/owl-component';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 60 ui owl — open aria/title', () => {
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

  it('minimized button pins Open Ollie aria + Say hi title', () => {
    owl.init();
    const btn = owl.getElement()!.querySelector('.owl-minimized') as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Open Ollie the Owl');
    expect(btn.getAttribute('title')).toBe('Say hi to Ollie!');
  });
});
