import { describe, expect, it } from 'vitest';
import {
  clearElement,
  escapeHtml,
  replaceWithSafeHtml,
  safeHtml,
  setText,
  setTrustedMarkup,
} from '../../src/core/dom-security';

describe('dom-security', () => {
  it('escapeHtml encodes markup characters', () => {
    expect(escapeHtml(`<img src=x onerror=alert(1)>`)).toBe(
      '&lt;img src=x onerror=alert(1)&gt;'
    );
  });

  it('safeHtml inserts dynamics as text nodes (equivalent structure)', () => {
    const root = document.createElement('div');
    const name = '<img src=x onerror=alert(1)>';
    replaceWithSafeHtml(
      root,
      safeHtml`<div class="status"><strong>${name}</strong> wins!</div>`
    );

    expect(root.querySelector('.status')).not.toBeNull();
    expect(root.querySelector('strong')?.textContent).toBe(name);
    expect(root.querySelector('img')).toBeNull();
    expect(root.innerHTML).not.toContain('<img');
    expect(root.textContent).toContain('wins!');
  });

  it('safeHtml preserves numeric score rendering', () => {
    const root = document.createElement('div');
    replaceWithSafeHtml(
      root,
      safeHtml`<span class="label">Blue:</span> <span class="value">${12}cm</span>`
    );
    expect(root.querySelector('.value')?.textContent).toBe('12cm');
    expect(root.textContent?.replace(/\s+/g, ' ').trim()).toBe('Blue: 12cm');
  });

  it('clearElement removes children without innerHTML assignment', () => {
    const root = document.createElement('div');
    root.appendChild(document.createElement('span'));
    clearElement(root);
    expect(root.childNodes.length).toBe(0);
  });

  it('setText never parses markup', () => {
    const el = document.createElement('p');
    setText(el, '<b>x</b>');
    expect(el.childNodes.length).toBe(1);
    expect(el.childNodes[0]?.nodeType).toBe(Node.TEXT_NODE);
    expect(el.textContent).toBe('<b>x</b>');
  });

  it('setTrustedMarkup keeps allowlisted tags and strips attrs/scripts', () => {
    const el = document.createElement('div');
    setTrustedMarkup(
      el,
      `<p onclick="alert(1)">Hello <strong>Hex</strong></p><script>alert(1)</script><img src=x onerror=alert(1)>`
    );
    expect(el.querySelector('strong')?.textContent).toBe('Hex');
    expect(el.querySelector('script')).toBeNull();
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('p')?.getAttribute('onclick')).toBeNull();
    expect(el.textContent).toContain('Hello');
  });
});
