/**
 * Lightweight setup for `environment: 'node'` pure-logic suites.
 * Avoids jsdom while still resetting storage / owl / timers between files
 * under isolate:false.
 */
import './helpers/node-storage-polyfill';
import { afterEach, vi } from 'vitest';
import { owlMessages, owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

type MutableOwl = { messages: unknown[] };
type MutableOwlSystem = { gameStartTime: number };

const owlInternal = owlMessages as unknown as MutableOwl;
const owlSystemInternal = owlSystem as unknown as MutableOwlSystem;
const stockOwlMessages = owlInternal.messages.slice();

function restoreIfMocked(fn: unknown): void {
  const mocked = fn as { mockRestore?: () => void };
  if (typeof mocked.mockRestore === 'function') {
    mocked.mockRestore();
  }
}

afterEach(() => {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    // ignore
  }
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
  owlSystemInternal.gameStartTime = 0;
  owlInternal.messages.length = 0;
  owlInternal.messages.push(...stockOwlMessages);
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  try {
    vi.clearAllTimers();
  } catch {
    // ignore
  }
  vi.useRealTimers();
  restoreIfMocked(performance.now);
  restoreIfMocked(Math.random);
});
