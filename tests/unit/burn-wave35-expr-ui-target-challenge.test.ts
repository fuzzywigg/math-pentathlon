/**
 * Wave 35 — renderTargetDisplay / renderChallengeCard leftovers.
 * Distinct from #161 builder DnD. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  renderTargetDisplay,
  renderChallengeCard,
  createTargetChallenge,
  MAKE_TEN_CHALLENGES,
  injectExpressionStyles,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#expression-styles')
    .forEach((el) => el.remove());
});

describe('Wave 35 expr-ui-target — display chips', () => {
  it('shows target and number chips', () => {
    injectExpressionStyles();
    const challenge = createTargetChallenge([1, 5, 8], 14);
    const el = renderTargetDisplay(challenge);
    expect(el.querySelector('.value')?.textContent).toBe('14');
    const chips = [...el.querySelectorAll('.number-chip')].map(
      (c) => c.textContent
    );
    expect(chips).toEqual(['1', '5', '8']);
  });
});

describe('Wave 35 expr-ui-target — challenge card click', () => {
  it('invokes onClick and renders = target', () => {
    const challenge = MAKE_TEN_CHALLENGES[1];
    const onClick = vi.fn();
    const card = renderChallengeCard(challenge, onClick);
    expect(card.querySelector('.target')?.textContent).toBe(
      `= ${challenge.target}`
    );
    card.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('omits listener when onClick absent', () => {
    const card = renderChallengeCard(MAKE_TEN_CHALLENGES[0]);
    expect(() => card.click()).not.toThrow();
  });
});
