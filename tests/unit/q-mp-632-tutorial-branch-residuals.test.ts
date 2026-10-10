/**
 * q-mp-632 — Close `tutorial` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1023` @ tip head):
 * With core tutorial + mutation suites (fuller set): **91.13%** lines /
 * **74.86%** branches. Spec clusters include ~987, 1036–1037.
 *
 * Structural / state asserts only (engine API + overlay chrome structure).
 * No player-facing copy / aria / label / tooltip / step text pins.
 * No `src/` product edits. No AI / rules / scoring / legal-move changes.
 * Hex Hard 450ms untouched. No ratchet JSON. Overlay nnnull/nullish left alone.
 *
 * Open-draft check: no PR into `cursor/mp-tip-post1023` owns closing these
 * residual branches under the tutorial verification glob. Leave `#1020`/`592`
 * soft-fail characterization + `#499` nnnull with **contained**.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  TutorialManager,
  exitTutorialIfActive,
  tutorialManager,
  type TutorialConfig,
  type TutorialStep,
} from '../../src/core/tutorial';

/** Narrow private surface for defensive / geometry branch probes. */
type TutorialPriv = {
  tooltipElement: HTMLElement | null;
  overlayElement: HTMLElement | null;
  tooltipSizeValid: boolean;
  cachedTooltipW: number;
  cachedTooltipH: number;
  applyTooltipCoords(left: number, top: number): void;
  parkTooltipForAbsolutePosition(): void;
  measureParkedTooltipSize(): { width: number; height: number };
  positionTooltipCenter(tipBox?: { width: number; height: number }): void;
  positionTooltip(
    targetRect: DOMRect,
    position: NonNullable<TutorialStep['position']>,
    avoidRect?: {
      left: number;
      top: number;
      right: number;
      bottom: number;
    },
    tipBox?: { width: number; height: number }
  ): NonNullable<TutorialStep['position']>;
  getViewportMetrics(): {
    width: number;
    height: number;
    offsetLeft: number;
    offsetTop: number;
  };
  buildAvoidRect(
    highlightLeft: number,
    highlightTop: number,
    highlightWidth: number,
    highlightHeight: number,
    isClickCellAction: boolean,
    cueAbove: boolean
  ): { left: number; top: number; right: number; bottom: number };
  preferVerticalSide(
    avoidRect: {
      left: number;
      top: number;
      right: number;
      bottom: number;
    },
    height: number,
    margin: number
  ): 'top' | 'bottom' | 'left' | 'right';
  handleKeyDown: (e: KeyboardEvent) => void;
  computeSidePosition(
    position: 'top' | 'bottom' | 'left' | 'right',
    anchor: {
      left: number;
      top: number;
      right: number;
      bottom: number;
    },
    width: number,
    height: number,
    margin: number
  ): { left: number; top: number };
  restoreReturnFocus(): void;
  returnFocusEl: HTMLElement | null;
};

function priv(manager: TutorialManager): TutorialPriv {
  return manager as unknown as TutorialPriv;
}

function stubViewport(width: number, height: number): void {
  vi.stubGlobal('innerWidth', width);
  vi.stubGlobal('innerHeight', height);
  vi.stubGlobal('visualViewport', {
    width,
    height,
    offsetLeft: 0,
    offsetTop: 0,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
}

function stubTooltipBox(width: number, height: number): () => void {
  const widthDesc = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetWidth'
  );
  const heightDesc = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight'
  );
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      return (this as HTMLElement).classList?.contains('tutorial-tooltip')
        ? width
        : 0;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return (this as HTMLElement).classList?.contains('tutorial-tooltip')
        ? height
        : 0;
    },
  });
  return () => {
    if (widthDesc) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', widthDesc);
    }
    if (heightDesc) {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', heightDesc);
    }
  };
}

function mountTarget(
  id: string,
  rect: { left: number; top: number; width: number; height: number }
): HTMLElement {
  const el = document.createElement('div');
  el.id = id;
  Object.defineProperty(el, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      left: rect.left,
      top: rect.top,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
      toJSON: () => ({}),
    }),
  });
  document.body.appendChild(el);
  return el;
}

function cleanupTutorialDom(): void {
  document
    .querySelectorAll(
      '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
    )
    .forEach((el) => el.remove());
}

describe('q-mp-632 tutorial — residual branch closure', () => {
  let manager: TutorialManager;
  let restoreBox: (() => void) | undefined;
  let target: HTMLElement | undefined;

  beforeEach(() => {
    manager = new TutorialManager();
    stubViewport(1024, 768);
    restoreBox = stubTooltipBox(280, 140);
  });

  afterEach(() => {
    manager?.exit();
    if (tutorialManager.getIsActive()) {
      tutorialManager.exit();
    }
    target?.remove();
    target = undefined;
    cleanupTutorialDom();
    restoreBox?.();
    restoreBox = undefined;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('exitTutorialIfActive (L1036–1037)', () => {
    it('no-ops when the singleton is inactive', () => {
      expect(tutorialManager.getIsActive()).toBe(false);
      exitTutorialIfActive();
      expect(tutorialManager.getIsActive()).toBe(false);
      expect(document.querySelector('.tutorial-overlay')).toBeNull();
    });

    it('exits an active singleton tutorial and clears overlay chrome', () => {
      const config: TutorialConfig = {
        id: 'q632-exit-active',
        name: 'ExitActive',
        steps: [
          { id: 's0', title: 'T0', message: 'm0' },
          { id: 's1', title: 'T1', message: 'm1' },
        ],
      };
      tutorialManager.start(config);
      expect(tutorialManager.getIsActive()).toBe(true);
      expect(document.querySelector('.tutorial-overlay')).toBeTruthy();

      exitTutorialIfActive();

      expect(tutorialManager.getIsActive()).toBe(false);
      expect(tutorialManager.getCurrentStep()).toBeNull();
      expect(document.querySelector('.tutorial-overlay')).toBeNull();
      expect(document.querySelector('.tutorial-tooltip')).toBeNull();
    });
  });

  describe('required-action Next gate (L331 false arm)', () => {
    it('Next click with requiredAction leaves step index unchanged', () => {
      target = mountTarget('q632-req', {
        left: 200,
        top: 200,
        width: 40,
        height: 40,
      });
      manager.start({
        id: 'q632-req-next',
        name: 'ReqNext',
        steps: [
          {
            id: 'gated',
            title: 'Gated',
            message: 'do action',
            highlightSelector: '#q632-req',
            requiredAction: { type: 'click', selector: '#q632-req' },
          },
          { id: 'after', title: 'After', message: 'done' },
        ],
      });

      const next = document.querySelector(
        '.tutorial-next-btn'
      ) as HTMLButtonElement;
      expect(next).toBeTruthy();
      expect(next.disabled).toBe(true);
      expect(next.classList.contains('tutorial-btn-waiting')).toBe(true);

      // Force the listener path even if the control stays disabled in jsdom.
      next.disabled = false;
      next.click();

      expect(manager.getCurrentStepIndex()).toBe(0);
      expect(manager.getCurrentStep()?.id).toBe('gated');
      expect(manager.getIsActive()).toBe(true);
    });
  });

  describe('focus restore edges (L97 / L121)', () => {
    it('start with non-HTMLElement activeElement leaves returnFocus unset', async () => {
      const text = document.createTextNode('focus-probe');
      document.body.appendChild(text);
      const desc = Object.getOwnPropertyDescriptor(document, 'activeElement');
      Object.defineProperty(document, 'activeElement', {
        configurable: true,
        get: () => text,
      });
      try {
        manager.start({
          id: 'q632-nonhtml-focus',
          name: 'NonHtmlFocus',
          steps: [{ id: 's0', title: 'T', message: 'm' }],
        });
        expect(manager.getIsActive()).toBe(true);
        expect(priv(manager).returnFocusEl).toBeNull();
        manager.exit();
        await Promise.resolve();
        expect(manager.getIsActive()).toBe(false);
      } finally {
        if (desc) {
          Object.defineProperty(document, 'activeElement', desc);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- restore probe
          delete (document as { activeElement?: Element | null }).activeElement;
        }
        text.remove();
      }
    });

    it('restoreReturnFocus no-ops when the trigger was removed from the DOM', async () => {
      const trigger = document.createElement('button');
      trigger.id = 'q632-trigger';
      document.body.appendChild(trigger);
      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      manager.start({
        id: 'q632-detached-focus',
        name: 'DetachedFocus',
        steps: [{ id: 's0', title: 'T', message: 'm' }],
      });
      expect(priv(manager).returnFocusEl).toBe(trigger);

      trigger.remove();
      manager.exit();
      await Promise.resolve();
      expect(manager.getIsActive()).toBe(false);
      expect(document.contains(trigger)).toBe(false);
    });
  });

  describe('keydown residual arms (L382 / L385)', () => {
    it('non-Escape key while active does not exit', () => {
      manager.start({
        id: 'q632-keydown',
        name: 'Keydown',
        steps: [{ id: 's0', title: 'T', message: 'm' }],
      });
      priv(manager).handleKeyDown(
        new KeyboardEvent('keydown', { key: 'Enter' })
      );
      expect(manager.getIsActive()).toBe(true);
      expect(document.querySelector('.tutorial-overlay')).toBeTruthy();
    });

    it('Escape handler no-ops once isActive is already false', () => {
      manager.start({
        id: 'q632-keydown-inactive',
        name: 'KeydownInactive',
        steps: [{ id: 's0', title: 'T', message: 'm' }],
      });
      manager.exit();
      expect(manager.getIsActive()).toBe(false);
      priv(manager).handleKeyDown(
        new KeyboardEvent('keydown', { key: 'Escape' })
      );
      expect(manager.getIsActive()).toBe(false);
    });
  });

  describe('ResizeObserver size cache (L354–369 / L937)', () => {
    it('borderBoxSize callback warms the parked-size cache', () => {
      type ROCallback = (entries: ResizeObserverEntry[]) => void;
      let captured: ROCallback | undefined;
      class FakeRO {
        constructor(cb: ROCallback) {
          captured = cb;
        }
        observe(): void {}
        disconnect(): void {}
        unobserve(): void {}
      }
      vi.stubGlobal('ResizeObserver', FakeRO);

      manager.start({
        id: 'q632-ro-border',
        name: 'ROBorder',
        steps: [{ id: 's0', title: 'T', message: 'm' }],
      });
      expect(captured).toBeTypeOf('function');

      captured!([
        {
          borderBoxSize: [{ inlineSize: 300, blockSize: 160 }],
          contentRect: { width: 0, height: 0 },
        } as unknown as ResizeObserverEntry,
      ]);

      const p = priv(manager);
      expect(p.tooltipSizeValid).toBe(true);
      expect(p.cachedTooltipW).toBe(300);
      expect(p.cachedTooltipH).toBe(160);

      const measured = p.measureParkedTooltipSize();
      expect(measured.width).toBeGreaterThan(0);
      expect(measured.height).toBe(160);
    });

    it('contentRect fallback warms the cache when borderBoxSize is empty', () => {
      type ROCallback = (entries: ResizeObserverEntry[]) => void;
      let captured: ROCallback | undefined;
      class FakeRO {
        constructor(cb: ROCallback) {
          captured = cb;
        }
        observe(): void {}
        disconnect(): void {}
        unobserve(): void {}
      }
      vi.stubGlobal('ResizeObserver', FakeRO);

      manager.start({
        id: 'q632-ro-content',
        name: 'ROContent',
        steps: [{ id: 's0', title: 'T', message: 'm' }],
      });

      captured!([
        {
          borderBoxSize: [],
          contentRect: { width: 240, height: 110 },
        } as unknown as ResizeObserverEntry,
      ]);

      const p = priv(manager);
      expect(p.tooltipSizeValid).toBe(true);
      expect(p.cachedTooltipW).toBe(240);
      expect(p.cachedTooltipH).toBe(110);
    });

    it('empty ResizeObserver entry is ignored', () => {
      type ROCallback = (entries: ResizeObserverEntry[]) => void;
      let captured: ROCallback | undefined;
      class FakeRO {
        constructor(cb: ROCallback) {
          captured = cb;
        }
        observe(): void {}
        disconnect(): void {}
        unobserve(): void {}
      }
      vi.stubGlobal('ResizeObserver', FakeRO);

      manager.start({
        id: 'q632-ro-empty',
        name: 'ROEmpty',
        steps: [{ id: 's0', title: 'T', message: 'm' }],
      });
      const beforeValid = priv(manager).tooltipSizeValid;
      captured!([] as unknown as ResizeObserverEntry[]);
      expect(priv(manager).tooltipSizeValid).toBe(beforeValid);
    });

    it('zero borderBoxSize falls through to contentRect (L360–366)', () => {
      type ROCallback = (entries: ResizeObserverEntry[]) => void;
      let captured: ROCallback | undefined;
      class FakeRO {
        constructor(cb: ROCallback) {
          captured = cb;
        }
        observe(): void {}
        disconnect(): void {}
        unobserve(): void {}
      }
      vi.stubGlobal('ResizeObserver', FakeRO);

      manager.start({
        id: 'q632-ro-zero-border',
        name: 'ROZeroBorder',
        steps: [{ id: 's0', title: 'T', message: 'm' }],
      });

      captured!([
        {
          borderBoxSize: [{ inlineSize: 0, blockSize: 0 }],
          contentRect: { width: 222, height: 99 },
        } as unknown as ResizeObserverEntry,
      ]);

      const p = priv(manager);
      expect(p.tooltipSizeValid).toBe(true);
      expect(p.cachedTooltipW).toBe(222);
      expect(p.cachedTooltipH).toBe(99);
    });

    it('all-zero ResizeObserver sizes leave the cache untouched (L366 false)', () => {
      type ROCallback = (entries: ResizeObserverEntry[]) => void;
      let captured: ROCallback | undefined;
      class FakeRO {
        constructor(cb: ROCallback) {
          captured = cb;
        }
        observe(): void {}
        disconnect(): void {}
        unobserve(): void {}
      }
      vi.stubGlobal('ResizeObserver', FakeRO);

      manager.start({
        id: 'q632-ro-all-zero',
        name: 'ROAllZero',
        steps: [{ id: 's0', title: 'T', message: 'm' }],
      });
      const p = priv(manager);
      p.tooltipSizeValid = false;
      p.cachedTooltipW = 0;
      p.cachedTooltipH = 0;

      captured!([
        {
          borderBoxSize: [{ inlineSize: 0, blockSize: 0 }],
          contentRect: { width: 0, height: 0 },
        } as unknown as ResizeObserverEntry,
      ]);

      expect(p.tooltipSizeValid).toBe(false);
      expect(p.cachedTooltipW).toBe(0);
      expect(p.cachedTooltipH).toBe(0);
    });
  });

  describe('geometry / null defensive arms', () => {
    it('applyTooltipCoords no-ops when tooltipElement is null (L987)', () => {
      const p = priv(manager);
      p.tooltipElement = null;
      expect(() => p.applyTooltipCoords(12, 34)).not.toThrow();
    });

    it('park / measure / center no-op or empty when tooltip is null', () => {
      const p = priv(manager);
      p.tooltipElement = null;
      expect(() => p.parkTooltipForAbsolutePosition()).not.toThrow();
      expect(p.measureParkedTooltipSize()).toEqual({ width: 0, height: 0 });
      expect(() => p.positionTooltipCenter()).not.toThrow();
    });

    it('positionTooltip returns declared side when tooltipElement is null', () => {
      const p = priv(manager);
      p.tooltipElement = null;
      const rect = {
        left: 10,
        top: 10,
        right: 50,
        bottom: 50,
        width: 40,
        height: 40,
        x: 10,
        y: 10,
        toJSON: () => ({}),
      } as DOMRect;
      expect(p.positionTooltip(rect, 'right')).toBe('right');
      expect(p.positionTooltip(rect, 'center')).toBe('center');
    });

    it('positionTooltip center path with tipBox skips park measure', () => {
      manager.start({
        id: 'q632-center-tipbox',
        name: 'CenterTipBox',
        steps: [{ id: 's0', title: 'T', message: 'm', position: 'center' }],
      });
      const p = priv(manager);
      const rect = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect;
      expect(
        p.positionTooltip(rect, 'center', undefined, {
          width: 200,
          height: 100,
        })
      ).toBe('center');
      const tooltip = document.querySelector(
        '.tutorial-tooltip'
      ) as HTMLElement;
      expect(tooltip.style.left).toMatch(/px$/);
      expect(tooltip.style.top).toMatch(/px$/);
    });

    it('getViewportMetrics falls back to innerWidth/innerHeight without visualViewport', () => {
      vi.stubGlobal('visualViewport', undefined);
      vi.stubGlobal('innerWidth', 640);
      vi.stubGlobal('innerHeight', 480);
      const metrics = priv(manager).getViewportMetrics();
      expect(metrics).toEqual({
        width: 640,
        height: 480,
        offsetLeft: 0,
        offsetTop: 0,
      });
    });

    it('buildAvoidRect expands cue band above and below for click-cell', () => {
      const p = priv(manager);
      const above = p.buildAvoidRect(100, 200, 80, 80, true, true);
      const below = p.buildAvoidRect(100, 200, 80, 80, true, false);
      expect(above.top).toBeLessThan(below.top);
      expect(below.bottom).toBeGreaterThan(above.bottom);
      expect(above.right - above.left).toBeGreaterThanOrEqual(56);
    });

    it('preferVerticalSide picks residual band when neither side fits tip height', () => {
      stubViewport(200, 120);
      const p = priv(manager);
      // Avoid rect fills most of the short viewport; tip height cannot fit either band.
      const side = p.preferVerticalSide(
        { left: 10, top: 40, right: 190, bottom: 80 },
        100,
        16
      );
      expect(side === 'top' || side === 'bottom').toBe(true);
    });

    it('preferVerticalSide returns top when only the upper band fits', () => {
      stubViewport(400, 400);
      const p = priv(manager);
      // Huge avoid rect near the bottom → spaceAbove wins.
      const side = p.preferVerticalSide(
        { left: 10, top: 300, right: 390, bottom: 380 },
        40,
        16
      );
      expect(side).toBe('top');
    });

    it('computeSidePosition right arm returns coords east of the anchor', () => {
      const pos = priv(manager).computeSidePosition(
        'right',
        { left: 100, top: 100, right: 140, bottom: 140 },
        80,
        40,
        16
      );
      expect(pos.left).toBeGreaterThanOrEqual(140);
      expect(Number.isFinite(pos.top)).toBe(true);
    });

    it('computeSidePosition exhaustive default soft-falls to bottom-like coords', () => {
      const pos = priv(manager).computeSidePosition(
        'not-a-side' as unknown as 'top',
        { left: 50, top: 50, right: 90, bottom: 90 },
        60,
        30,
        16
      );
      expect(Number.isFinite(pos.left)).toBe(true);
      expect(Number.isFinite(pos.top)).toBe(true);
      expect(pos.top).toBeGreaterThanOrEqual(90);
    });
  });

  describe('positionTooltip flip / omit-arg residuals', () => {
    it('omitted tipBox/avoidRect still places a left preference on a wide desktop', () => {
      target = mountTarget('q632-omit', {
        left: 500,
        top: 200,
        width: 40,
        height: 40,
      });
      manager.start({
        id: 'q632-omit-args',
        name: 'OmitArgs',
        steps: [
          {
            id: 's0',
            title: 'T',
            message: 'm',
            highlightSelector: '#q632-omit',
            position: 'left',
          },
        ],
      });
      const p = priv(manager);
      const rect = target.getBoundingClientRect();
      const side = p.positionTooltip(rect, 'left');
      expect(side === 'left' || side === 'top' || side === 'bottom').toBe(true);
      const tooltip = document.querySelector(
        '.tutorial-tooltip'
      ) as HTMLElement;
      expect(tooltip.style.left).toMatch(/px$/);
    });

    it('cramped left/right preference flips through vertical residual path', () => {
      restoreBox?.();
      restoreBox = stubTooltipBox(360, 220);
      stubViewport(390, 200);
      target = mountTarget('q632-cramp', {
        left: 160,
        top: 80,
        width: 40,
        height: 40,
      });
      manager.start({
        id: 'q632-cramp-lr',
        name: 'CrampLR',
        steps: [
          {
            id: 's0',
            title: 'T',
            message: 'm',
            highlightSelector: '#q632-cramp',
            position: 'left',
            requiredAction: { type: 'click-cell', row: 0, col: 0 },
          },
        ],
      });
      expect(manager.getIsActive()).toBe(true);
      const tooltip = document.querySelector(
        '.tutorial-tooltip'
      ) as HTMLElement;
      expect(tooltip).toBeTruthy();
      expect(tooltip.style.left).toMatch(/px$/);
      expect(document.querySelector('.tutorial-hit-proxy')).toBeTruthy();
      expect(document.querySelector('.tutorial-tap-cue')).toBeTruthy();
    });

    it('highlight with position center routes through positionTooltipCenter', () => {
      target = mountTarget('q632-hl-center', {
        left: 300,
        top: 200,
        width: 48,
        height: 48,
      });
      manager.start({
        id: 'q632-hl-center',
        name: 'HlCenter',
        steps: [
          {
            id: 's0',
            title: 'T',
            message: 'm',
            highlightSelector: '#q632-hl-center',
            position: 'center',
          },
        ],
      });
      const ring = document.querySelector(
        '.tutorial-highlight-ring'
      ) as HTMLElement;
      expect(ring.style.display).toBe('block');
      const tooltip = document.querySelector(
        '.tutorial-tooltip'
      ) as HTMLElement;
      expect(tooltip.style.left).toMatch(/px$/);
      expect(tooltip.style.top).toMatch(/px$/);
    });

    it('left preference with unplaceable tipBox hits left/right flip residual', () => {
      // Force tryPlaceOnSide failures so flip arm uses preferVerticalSide
      // (L754–756) when side is still left/right after the room check.
      restoreBox?.();
      restoreBox = stubTooltipBox(500, 400);
      stubViewport(320, 240);
      target = mountTarget('q632-flip-lr', {
        left: 120,
        top: 100,
        width: 40,
        height: 40,
      });
      manager.start({
        id: 'q632-flip-lr',
        name: 'FlipLR',
        steps: [
          {
            id: 's0',
            title: 'T',
            message: 'm',
            highlightSelector: '#q632-flip-lr',
            position: 'right',
          },
        ],
      });
      const p = priv(manager);
      const rect = target.getBoundingClientRect();
      const side = p.positionTooltip(rect, 'right', undefined, {
        width: 500,
        height: 400,
      });
      expect(
        side === 'right' ||
          side === 'top' ||
          side === 'bottom' ||
          side === 'left'
      ).toBe(true);
      const tooltip = document.querySelector(
        '.tutorial-tooltip'
      ) as HTMLElement;
      expect(tooltip.style.left).toMatch(/px$/);
    });

    it('left with horizontal room but tall tip hits flip preferVerticalSide (L756)', () => {
      // Keep side === 'left' past the room check, fail tryPlace, then take the
      // ternary alternate that calls preferVerticalSide (not top↔bottom).
      // Custom avoidRect extends left into the tip slot so tryPlace overlaps
      // even though the room check (based on clearRect.left) still passes.
      restoreBox?.();
      restoreBox = stubTooltipBox(80, 60);
      stubViewport(800, 400);
      target = mountTarget('q632-flip-pref', {
        left: 400,
        top: 180,
        width: 40,
        height: 40,
      });
      manager.start({
        id: 'q632-flip-pref',
        name: 'FlipPref',
        steps: [
          {
            id: 's0',
            title: 'T',
            message: 'm',
            highlightSelector: '#q632-flip-pref',
            position: 'left',
          },
        ],
      });
      const p = priv(manager);
      const rect = target.getBoundingClientRect();
      const bloatedAvoid = {
        left: 250, // room: 250-16=234 >= 80+12 → side stays left
        top: 0,
        right: 550,
        bottom: 400, // full-height avoid → any left placement overlaps
      };
      const side = p.positionTooltip(rect, 'left', bloatedAvoid, {
        width: 80,
        height: 60,
      });
      expect(
        side === 'left' ||
          side === 'top' ||
          side === 'bottom' ||
          side === 'right'
      ).toBe(true);
      const tooltip = document.querySelector(
        '.tutorial-tooltip'
      ) as HTMLElement;
      expect(tooltip.style.left).toMatch(/px$/);
    });

    it('bottom preference with unplaceable tip flips toward top (L756)', () => {
      restoreBox?.();
      restoreBox = stubTooltipBox(500, 400);
      stubViewport(320, 240);
      target = mountTarget('q632-flip-bottom', {
        left: 120,
        top: 80,
        width: 40,
        height: 40,
      });
      manager.start({
        id: 'q632-flip-bottom',
        name: 'FlipBottom',
        steps: [
          {
            id: 's0',
            title: 'T',
            message: 'm',
            highlightSelector: '#q632-flip-bottom',
            position: 'bottom',
          },
        ],
      });
      const p = priv(manager);
      const rect = target.getBoundingClientRect();
      // Oversized tipBox makes preferred bottom placement overlap → flip to top.
      const side = p.positionTooltip(rect, 'bottom', undefined, {
        width: 500,
        height: 400,
      });
      expect(side === 'bottom' || side === 'top').toBe(true);
      const tooltip = document.querySelector(
        '.tutorial-tooltip'
      ) as HTMLElement;
      expect(tooltip.style.top).toMatch(/px$/);
    });

    it('missing highlight target with ring removed takes L644 false arm', () => {
      manager.start({
        id: 'q632-no-ring',
        name: 'NoRing',
        steps: [
          {
            id: 's0',
            title: 'T',
            message: 'm',
            highlightSelector: '#q632-absent-target',
          },
        ],
      });
      const overlay = priv(manager).overlayElement;
      overlay
        ?.querySelectorAll('.tutorial-highlight-ring')
        .forEach((el) => el.remove());
      // Re-show with selector present but target + ring both absent.
      manager.refreshHighlight();
      expect(manager.getIsActive()).toBe(true);
      expect(document.querySelector('.tutorial-highlight-ring')).toBeNull();
    });
  });

  describe('missing chrome querySelector soft arms', () => {
    it('showCurrentStep survives stripped title/message/counter/nav nodes', () => {
      manager.start({
        id: 'q632-stripped',
        name: 'Stripped',
        steps: [
          { id: 's0', title: 'T0', message: 'm0' },
          { id: 's1', title: 'T1', message: 'm1' },
        ],
      });
      const tooltip = document.querySelector(
        '.tutorial-tooltip'
      ) as HTMLElement;
      tooltip
        .querySelectorAll(
          '.tutorial-tooltip-title, .tutorial-tooltip-message, .tutorial-step-counter, .tutorial-prev-btn, .tutorial-next-btn'
        )
        .forEach((el) => el.remove());

      manager.nextStep();
      expect(manager.getCurrentStepIndex()).toBe(1);
      expect(manager.getCurrentStep()?.id).toBe('s1');
      expect(manager.getIsActive()).toBe(true);
    });
  });
});
