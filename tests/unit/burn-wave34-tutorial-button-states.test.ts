/**
 * Wave 34 — Next/Back button disabled / waiting / Finish label matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'wave34-btn-state', name: 'BtnState', steps };
}

describe('Wave 34 tutorial — button state matrix', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('hides Back on first step and shows it later', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        { id: 's0', title: 'A', message: 'a' },
        { id: 's1', title: 'B', message: 'b' },
      ])
    );
    const prev = document.querySelector(
      '.tutorial-prev-btn'
    ) as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
    expect(prev.style.visibility).toBe('hidden');
    manager.nextStep();
    expect(prev.disabled).toBe(false);
    expect(prev.style.visibility).toBe('visible');
  });

  it('labels last free step Finish and gated step as waiting', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'gate',
          title: 'G',
          message: 'g',
          requiredAction: { type: 'click', selector: '.x' },
        },
        { id: 'last', title: 'L', message: 'l' },
      ])
    );
    const next = document.querySelector(
      '.tutorial-next-btn'
    ) as HTMLButtonElement;
    expect(next.disabled).toBe(true);
    expect(next.classList.contains('tutorial-btn-waiting')).toBe(true);
    expect(next.textContent).toMatch(/Complete the action/i);

    manager.handleAction('click', { selector: '.x' });
    expect(manager.getCurrentStep()?.id).toBe('last');
    expect(next.disabled).toBe(false);
    expect(next.textContent).toBe('Finish');
    expect(next.classList.contains('tutorial-btn-waiting')).toBe(false);
  });

  it('middle free step shows Next not Finish', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([
        { id: 's0', title: 'A', message: 'a' },
        { id: 's1', title: 'B', message: 'b' },
        { id: 's2', title: 'C', message: 'c' },
      ])
    );
    const next = document.querySelector(
      '.tutorial-next-btn'
    ) as HTMLButtonElement;
    expect(next.textContent).toBe('Next');
    manager.nextStep();
    expect(next.textContent).toBe('Next');
    manager.nextStep();
    expect(next.textContent).toBe('Finish');
  });
});
