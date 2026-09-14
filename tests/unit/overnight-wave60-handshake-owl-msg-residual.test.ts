/**
 * Overnight TOKENMAXX HEAVY leftovers after #290 — Owl owl message/stub/ui residual handshake.
 * Distinct from open #291 dual-API/geometry leftovers. Unit-only. No invent-product.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  owlMessages,
  stubNarrationFor,
  OWL_REST_SPEED,
} from '../../src/core/owl';
import { OwlComponent } from '../../src/ui/owl/owl-component';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

describe('Wave 60 handshake — owl msg residual', () => {
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

  it('stitches library + stub + UI residual pins', () => {
    expect(
      owlMessages
        .getMessagesByCategory('app:start')
        .find((m) => m.id === 'welcome-1')!.text
    ).toMatch(/Ollie the Owl/);
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'back' })
    ).toMatch(/game list/);
    expect(OWL_REST_SPEED).toBe(0.4);

    owl.init();
    expect(
      owl.getElement()!
        .querySelector('.owl-minimized')
        ?.getAttribute('aria-label')
    ).toBe('Open Ollie the Owl');
  });
});
