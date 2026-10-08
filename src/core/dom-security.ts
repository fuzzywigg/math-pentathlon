/**
 * Client-side DOM hardening helpers.
 *
 * Non-constant values must never be concatenated into HTML strings.
 * Prefer `textContent` / `createElement` / `safeHtml` (dynamics as text nodes).
 * Author-trusted markup (tutorial copy, help HTML) uses `setTrustedMarkup`.
 */

const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape a string for safe interpolation into an HTML text/attr context. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPE[ch] ?? ch);
}

/** Remove all children without assigning `innerHTML`. */
export function clearElement(el: ParentNode): void {
  el.replaceChildren();
}

/** Set plain text (never parses markup). */
export function setText(el: Node, value: string): void {
  el.textContent = value;
}

export type SafeHtmlValue = string | number | boolean | Node | null | undefined;

/**
 * Tagged template: static segments are trusted HTML; interpolations become
 * text nodes (or are adopted when already a `Node`). Equivalent rendering
 * to a template string for typical score/status markup, without XSS from
 * dynamic values.
 */
export function safeHtml(
  strings: TemplateStringsArray,
  ...values: SafeHtmlValue[]
): DocumentFragment {
  let html = '';
  for (let i = 0; i < strings.length; i++) {
    html += strings[i];
    if (i < values.length) {
      html += `<span data-mp-safe="${i}"></span>`;
    }
  }

  const template = document.createElement('template');
  template.innerHTML = html;

  for (let i = 0; i < values.length; i++) {
    const slot = template.content.querySelector(`[data-mp-safe="${i}"]`);
    if (!slot) continue;
    const value = values[i];
    if (value instanceof Node) {
      slot.replaceWith(value);
    } else if (value === null || value === undefined) {
      slot.replaceWith(document.createTextNode(''));
    } else {
      slot.replaceWith(document.createTextNode(String(value)));
    }
  }

  return template.content;
}

/** Clear then append `safeHtml` / fragment content. */
export function replaceWithSafeHtml(
  el: ParentNode,
  fragment: DocumentFragment
): void {
  el.replaceChildren(fragment);
}

/** Tags permitted in author-trusted tutorial / help snippets. */
const TRUSTED_TAGS = new Set([
  'P',
  'STRONG',
  'EM',
  'B',
  'I',
  'UL',
  'OL',
  'LI',
  'BR',
  'CODE',
  'SPAN',
  'DIV',
  'H2',
  'H3',
  'H4',
]);

/**
 * Parse author-trusted HTML, keep an allowlisted tag set, strip all
 * attributes (blocks `on*` / `javascript:` / foreign markup). Dynamics from
 * storage/URL must not go through this path.
 */
export function setTrustedMarkup(el: HTMLElement, html: string): void {
  const template = document.createElement('template');
  template.innerHTML = html;
  clearElement(el);
  for (const child of Array.from(template.content.childNodes)) {
    const cleaned = sanitizeTrustedNode(child);
    if (cleaned) el.appendChild(cleaned);
  }
}

function sanitizeTrustedNode(node: Node): Node | DocumentFragment | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent ?? '');
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const elem = node as Element;
  const children = Array.from(elem.childNodes)
    .map((c) => sanitizeTrustedNode(c))
    .filter((c): c is Node | DocumentFragment => c !== null);

  if (!TRUSTED_TAGS.has(elem.tagName)) {
    const frag = document.createDocumentFragment();
    for (const c of children) frag.appendChild(c);
    return frag;
  }

  const out = document.createElement(elem.tagName.toLowerCase());
  // Intentionally copy no attributes.
  for (const c of children) out.appendChild(c);
  return out;
}
