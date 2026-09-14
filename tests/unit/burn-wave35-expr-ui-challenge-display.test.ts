/**
 * Wave 35 — renderTargetDisplay / renderChallengeCard catalogs.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  renderTargetDisplay,
  renderChallengeCard,
} from '../../src/core/expressions/expression-ui';
import {
  MAKE_TEN_CHALLENGES,
  TWENTY_FOUR_CHALLENGES,
  COUNTDOWN_CHALLENGES,
  createTargetChallenge,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 expr-ui — target display', () => {
  it.each(MAKE_TEN_CHALLENGES)(
    'MAKE_TEN target=$target numbers=$numbers',
    (challenge) => {
      const el = renderTargetDisplay(challenge);
      expect(el.classList.contains('target-display')).toBe(true);
      expect(el.querySelector('.value')?.textContent).toBe(
        String(challenge.target)
      );
      expect(el.querySelectorAll('.number-chip')).toHaveLength(
        challenge.numbers.length
      );
      const chips = [...el.querySelectorAll('.number-chip')].map(
        (c) => c.textContent
      );
      expect(chips).toEqual(challenge.numbers.map(String));
    }
  );

  it('custom challenge chips match numbers', () => {
    const c = createTargetChallenge([8, 8, 3], 19);
    const el = renderTargetDisplay(c);
    expect(el.querySelectorAll('.number-chip')).toHaveLength(3);
    expect(el.querySelector('.label')?.textContent?.length).toBeGreaterThan(0);
  });
});

describe('Wave 35 expr-ui — challenge cards', () => {
  it('TWENTY_FOUR cards expose target and fire onClick', () => {
    for (const challenge of TWENTY_FOUR_CHALLENGES.slice(0, 3)) {
      const hits: number[] = [];
      const card = renderChallengeCard(challenge, () =>
        hits.push(challenge.target)
      );
      expect(card.classList.contains('challenge-card')).toBe(true);
      expect(card.querySelector('.target')?.textContent).toBe(
        `= ${challenge.target}`
      );
      expect(card.querySelectorAll('.numbers span')).toHaveLength(
        challenge.numbers.length
      );
      card.click();
      expect(hits).toEqual([challenge.target]);
    }
  });

  it('COUNTDOWN challenges render without requiring click handler', () => {
    const challenge = COUNTDOWN_CHALLENGES[0]!;
    const card = renderChallengeCard(challenge);
    expect(card.querySelector('.target')?.textContent).toContain(
      String(challenge.target)
    );
    expect(card.querySelectorAll('.numbers span').length).toBeGreaterThan(0);
  });
});
