/**
 * @vitest-environment node
 *
 * Hermetic coverage for q-mp-1239 + q-mp-1244 + q-mp-1245:
 *  - runtimePerfMarkdownTitle follows PERF_DATE
 *  - clickFirst returns false when click rejects
 *  - maxLongTaskMs is null for an empty list (matches frameMaxMs)
 * Fake locators only — no Playwright / CDP / vite.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  clickFirst,
  maxLongTaskMs,
  runtimePerfMarkdownTitle,
} from '../../scripts/lib/runtime-perf-helpers.mjs';

describe('runtimePerfMarkdownTitle (q-mp-1239)', () => {
  it('uses the PERF_DATE stem in the H1 (not a hardcoded Oct 7 literal)', () => {
    expect(runtimePerfMarkdownTitle('2026-10-11')).toBe(
      '# Runtime perf — 2026-10-11'
    );
    expect(runtimePerfMarkdownTitle('2026-10-07')).toBe(
      '# Runtime perf — 2026-10-07'
    );
  });
});

describe('clickFirst (q-mp-1244)', () => {
  function fakePage(opts: {
    count: number;
    visible?: boolean;
    click?: () => Promise<void>;
  }) {
    const loc = {
      count: vi.fn(async () => opts.count),
      isVisible: vi.fn(async () => opts.visible ?? true),
      click: vi.fn(
        opts.click ??
          (async () => {
            /* ok */
          })
      ),
    };
    return {
      locator: vi.fn(() => ({ first: () => loc })),
      _loc: loc,
    };
  }

  it('returns false when no matching locator', async () => {
    const page = fakePage({ count: 0 });
    await expect(clickFirst(page, '.cell')).resolves.toBe(false);
    expect(page._loc.click).not.toHaveBeenCalled();
  });

  it('returns false when locator is not visible', async () => {
    const page = fakePage({ count: 1, visible: false });
    await expect(clickFirst(page, '.cell')).resolves.toBe(false);
    expect(page._loc.click).not.toHaveBeenCalled();
  });

  it('returns true when click resolves', async () => {
    const page = fakePage({ count: 1, visible: true });
    await expect(clickFirst(page, '.cell')).resolves.toBe(true);
    expect(page._loc.click).toHaveBeenCalledWith({ force: true });
  });

  it('returns false when click rejects (never swallows into success)', async () => {
    const page = fakePage({
      count: 1,
      visible: true,
      click: async () => {
        throw new Error('element detached');
      },
    });
    await expect(clickFirst(page, '.cell')).resolves.toBe(false);
    expect(page._loc.click).toHaveBeenCalled();
  });
});

describe('maxLongTaskMs (q-mp-1245)', () => {
  it('returns null for an empty long-task list (like frameMaxMs)', () => {
    expect(maxLongTaskMs([])).toBeNull();
  });

  it('returns null for non-array input', () => {
    expect(maxLongTaskMs(null as unknown as [])).toBeNull();
    expect(maxLongTaskMs(undefined as unknown as [])).toBeNull();
  });

  it('returns the real max when tasks exist', () => {
    expect(
      maxLongTaskMs([{ duration: 12 }, { duration: 48.5 }, { duration: 3 }])
    ).toBe(48.5);
    expect(maxLongTaskMs([12, 48.5, 3])).toBe(48.5);
  });
});
