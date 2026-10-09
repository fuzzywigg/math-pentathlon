/**
 * Idempotent `<style id="…">` injection used by every game board-ui.
 */

/**
 * Append a style element once. No-ops if an element with `id` already exists.
 */
export function injectStylesOnce(id: string, css: string): void {
  if (document.getElementById(id)) {
    return;
  }
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}
