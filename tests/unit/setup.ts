import { afterEach, vi } from 'vitest';
import { owlMessages, owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

/**
 * Shared cleanup so Vitest can run with `isolate: false` after the TOKENMAXX
 * prune without cross-file DOM / storage / owl-library pollution.
 *
 * OwlMessageManager.addMessage mutates the shared MESSAGE_LIBRARY array; snapshot
 * the stock catalog once and restore after every test.
 *
 * Do not call vi.restoreAllMocks() here — it tears down hoisted vi.mock factories
 * (e.g. router.navigate) across the shared module graph.
 */
type MutableOwl = { messages: unknown[] };

const owlInternal = owlMessages as unknown as MutableOwl;
const stockOwlMessages = owlInternal.messages.slice();

afterEach(() => {
  document.body.innerHTML = '';
  document.head.querySelectorAll('style').forEach((el) => el.remove());
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    // jsdom may not expose storage in every worker edge case
  }
  window.location.hash = '';
  try {
    storage.resetAll();
  } catch {
    // ignore
  }
  try {
    owlSystem.dismissMessage();
    owlSystem.hide();
  } catch {
    // ignore
  }
  owlInternal.messages.length = 0;
  owlInternal.messages.push(...stockOwlMessages);
  vi.clearAllMocks();
  vi.useRealTimers();
});
