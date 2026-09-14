/**
 * Wave 40 — ollie inspect chrome selectors matrix leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  resolveInspectTarget,
  stubNarrationFor,
  type InspectChrome,
} from '../../src/core/owl';

describe('Wave 40 ollie-inspect — chrome matrix', () => {
  const mounted: HTMLElement[] = [];

  afterEach(() => {
    mounted.splice(0).forEach((el) => el.remove());
  });

  function mount(html: string): HTMLElement {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    const el = wrap.firstElementChild as HTMLElement;
    document.body.appendChild(el);
    mounted.push(el);
    return el;
  }

  it('resolves each known chrome control id / class', () => {
    const cases: Array<{ html: string; chrome: InspectChrome; hint: string }> =
      [
        {
          html: '<button id="help-btn">How to Play</button>',
          chrome: 'howto',
          hint: 'How to Play',
        },
        {
          html: '<button id="tutorial-btn">Tutorial</button>',
          chrome: 'tutorial',
          hint: 'Tutorial',
        },
        {
          html: '<button id="new-game-btn">New Game</button>',
          chrome: 'new-game',
          hint: 'New Game',
        },
        {
          html: '<button id="back-btn">Back</button>',
          chrome: 'back',
          hint: 'Back',
        },
        {
          html: '<div class="button-row"><span>row</span></div>',
          chrome: 'button-row',
          hint: 'game controls',
        },
        {
          html: '<header class="game-header"><h1>Title</h1></header>',
          chrome: 'game-header',
          hint: 'game title',
        },
      ];

    for (const { html, chrome, hint } of cases) {
      const el = mount(html);
      const target = resolveInspectTarget(el);
      expect(target).toEqual({ kind: 'chrome', chrome });
      expect(stubNarrationFor(target)).toContain('[STUB inspect]');
      expect(stubNarrationFor(target).toLowerCase()).toContain(
        hint.toLowerCase().split(' ')[0].toLowerCase()
      );
      el.remove();
    }
  });

  it('child inside button-row resolves button-row when not a known id', () => {
    const row = mount(
      '<div class="button-row"><span class="w40-inner">x</span></div>'
    );
    const inner = row.querySelector('.w40-inner')!;
    expect(resolveInspectTarget(inner)).toEqual({
      kind: 'chrome',
      chrome: 'button-row',
    });
  });

  it('help-btn inside button-row prefers howto over button-row', () => {
    const row = mount(
      '<div class="button-row"><button id="help-btn">?</button></div>'
    );
    const btn = row.querySelector('#help-btn')!;
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'chrome',
      chrome: 'howto',
    });
  });

  it('unknown-chrome narration exists for direct stub path', () => {
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'unknown-chrome' })
    ).toMatch(/Chrome on the page/i);
  });
});
