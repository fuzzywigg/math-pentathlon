/**
 * Hermetic coverage for scripts/lib/dismiss-owl.mjs (q-mp-922).
 * Fake Playwright page only — no Chromium launch.
 */
import { describe, it, expect } from 'vitest';
import { dismissOwl } from '../../scripts/lib/dismiss-owl.mjs';

type ClickRecord = { selector: string; force?: boolean };

type FakeLocator = {
  first: () => FakeLocator;
  isVisible: () => Promise<boolean>;
  click: (opts?: { force?: boolean }) => Promise<void>;
};

type FakePage = {
  locator: (selector: string) => FakeLocator;
  evaluate: (fn: () => void) => Promise<void>;
};

function createFakePage(opts: {
  dismissVisible?: boolean | 'throw';
  minimizeVisible?: boolean | 'throw';
}): {
  page: FakePage;
  clicks: ClickRecord[];
} {
  const clicks: ClickRecord[] = [];
  const dismissVisible = opts.dismissVisible ?? true;
  const minimizeVisible = opts.minimizeVisible ?? true;

  function makeLocator(
    selector: string,
    visible: boolean | 'throw'
  ): FakeLocator {
    const self: FakeLocator = {
      first: () => self,
      isVisible: async () => {
        if (visible === 'throw') throw new Error('detached');
        return visible;
      },
      click: async (clickOpts) => {
        clicks.push({ selector, force: clickOpts?.force });
      },
    };
    return self;
  }

  const page: FakePage = {
    locator(selector: string) {
      if (
        selector.includes('owl-bubble-dismiss') ||
        selector.includes('Dismiss message')
      ) {
        return makeLocator(selector, dismissVisible);
      }
      if (selector.includes('owl-minimize-btn')) {
        return makeLocator(selector, minimizeVisible);
      }
      throw new Error(`unexpected locator: ${selector}`);
    },
    // Match Playwright: run the callback in the page context (jsdom here).
    async evaluate(fn: () => void) {
      fn();
    },
  };

  return { page, clicks };
}

function mountOwl(): HTMLElement {
  const owl = document.createElement('div');
  owl.id = 'ollie-owl';
  owl.style.pointerEvents = 'auto';
  document.body.appendChild(owl);
  return owl;
}

describe('dismissOwl (q-mp-922)', () => {
  it('clicks dismiss + minimize and sets pointer-events none by default', async () => {
    const owl = mountOwl();
    const { page, clicks } = createFakePage({});
    await dismissOwl(page);
    expect(clicks).toEqual([
      {
        selector:
          '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss',
        force: true,
      },
      { selector: '#ollie-owl .owl-minimize-btn', force: true },
    ]);
    expect(owl.style.pointerEvents).toBe('none');
  });

  it('skips dismiss click when dismiss control is not visible', async () => {
    const owl = mountOwl();
    const { page, clicks } = createFakePage({ dismissVisible: false });
    await dismissOwl(page);
    expect(clicks).toEqual([
      { selector: '#ollie-owl .owl-minimize-btn', force: true },
    ]);
    expect(owl.style.pointerEvents).toBe('none');
  });

  it('treats dismiss isVisible rejection as not visible', async () => {
    const { page, clicks } = createFakePage({ dismissVisible: 'throw' });
    await dismissOwl(page, { minimize: false, pointerEventsNone: false });
    expect(clicks).toEqual([]);
  });

  it('skips minimize when options.minimize is false', async () => {
    const owl = mountOwl();
    const { page, clicks } = createFakePage({});
    await dismissOwl(page, { minimize: false });
    expect(clicks).toEqual([
      {
        selector:
          '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss',
        force: true,
      },
    ]);
    expect(owl.style.pointerEvents).toBe('none');
  });

  it('skips minimize click when minimize control is not visible', async () => {
    const { page, clicks } = createFakePage({ minimizeVisible: false });
    await dismissOwl(page, { pointerEventsNone: false });
    expect(clicks).toEqual([
      {
        selector:
          '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss',
        force: true,
      },
    ]);
  });

  it('skips pointer-events evaluate when options.pointerEventsNone is false', async () => {
    const owl = mountOwl();
    const { page } = createFakePage({});
    await dismissOwl(page, { pointerEventsNone: false });
    expect(owl.style.pointerEvents).toBe('auto');
  });

  it('pointerEventsNone evaluate is a no-op when #ollie-owl is missing', async () => {
    expect(document.getElementById('ollie-owl')).toBeNull();
    const { page, clicks } = createFakePage({});
    await dismissOwl(page, { minimize: false });
    expect(clicks).toHaveLength(1);
    expect(document.getElementById('ollie-owl')).toBeNull();
  });
});
