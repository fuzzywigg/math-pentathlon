/**
 * q-mp-631 — Close pwa/idle-warm residual gaps under the *idle-warm* verify glob.
 *
 * Tests only; 0 src. Injected schedule / fake env only — no network.
 * Targets uncovered clusters named in backlog-2026-10-10v: ~61–77, 84
 * (defaultImportShell / defaultImportGame / markWarmDone document guard).
 *
 * Open-PR check (post1023 empty; post1012 drafts scanned): none own closing
 * idle-warm residual coverage under tests/unit/*idle-warm*. Leave #978/515
 * (void braces) and #884/404 (soft-fail characterization) contained.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  IDLE_WARM_DONE_ATTR,
  scheduleIdleGameWarm,
} from '../../src/pwa/idle-warm';

function clearIdleWarmDom(): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.removeAttribute(IDLE_WARM_DONE_ATTR);
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    get: () => false,
  });
  try {
    delete (navigator as Navigator & { connection?: unknown }).connection;
  } catch {
    /* ignore */
  }
}

describe('q-mp-631 idle-warm — default importer residuals', () => {
  beforeEach(() => {
    clearIdleWarmDom();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearIdleWarmDom();
  });

  it('defaultImportShell + defaultImportGame warm hex then kings (no inject)', async () => {
    // Exercises src/pwa/idle-warm.ts ~61–74 under the *idle-warm* glob
    // (burn-1008 already covers this path but does not match that glob).
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
    });

    await vi.waitFor(() => {
      expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
        'done'
      );
    });
  });
});

describe('q-mp-631 idle-warm — markWarmDone document-undefined residual', () => {
  let originalDocument: Document | undefined;

  beforeEach(() => {
    originalDocument = globalThis.document;
    clearIdleWarmDom();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (typeof globalThis.document === 'undefined' && originalDocument) {
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        writable: true,
        value: originalDocument,
      });
    }
    clearIdleWarmDom();
  });

  it('markWarmDone early-returns when document is undefined', () => {
    // Sync skip path: document.hidden getter deletes global document then
    // returns true → markWarmDone hits `typeof document === 'undefined'`.
    // Avoids the async for-loop ReferenceError / unhandledrejection.
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get() {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- SSR probe
        delete (globalThis as { document?: Document }).document;
        return true;
      },
    });

    expect(() => {
      scheduleIdleGameWarm({
        schedule: (cb) => cb(),
        importShell: vi.fn().mockResolvedValue({}),
        importGame: vi.fn().mockResolvedValue({}),
      });
    }).not.toThrow();

    expect(typeof globalThis.document).toBe('undefined');
    expect(
      originalDocument?.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)
    ).toBeNull();
  });
});

describe('q-mp-631 idle-warm — exhaustive default arm stays structural', () => {
  it('source keeps never-exhaustive default in defaultImportGame', () => {
    // Lines 75–77 are TypeScript exhaustiveness; unreachable via public API
    // because DEFAULT_WARM_GAMES is a closed const. Pin presence only.
    const src = readFileSync(
      join(process.cwd(), 'src/pwa/idle-warm.ts'),
      'utf8'
    );
    expect(src).toMatch(
      /default:\s*\{\s*const _exhaustive:\s*never\s*=\s*gameId;/
    );
  });
});
