/**
 * Bubbling MouseEvent click for jsdom controller / seat suites.
 */
import { expect } from 'vitest';

/** Assert el is present, then dispatch a bubbling click. */
export function click(el: Element | null): void {
  expect(el).toBeTruthy();
  el!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}
