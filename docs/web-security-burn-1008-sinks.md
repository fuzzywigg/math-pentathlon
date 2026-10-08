# XSS sink inventory — burn-1008-mp-web-security

Task id: `burn-1008-mp-web-security`.

## Legend

| Disposition | Meaning |
| --- | --- |
| `replaced-safe-dom` | Non-constant data now via `clearElement` / `safeHtml` / `createElement` / `textContent` / `setTrustedMarkup` |
| `constant-trusted` | Static markup only (no `${}` / user / URL / storage interpolation) |
| `helper-internal` | `template.innerHTML` inside `dom-security` helpers |
| `shell-trusted-builder` | `buildShellHtml`: titles/attrs escaped; `helpContentHtml` repo-authored |

## High-risk APIs (absent)

No `eval`, `new Function`, `document.write`, `outerHTML`, `insertAdjacentHTML`, `dangerouslySetInnerHTML`, or string-based `setTimeout`/`setInterval` in `src/`.

No IndexedDB usage.

## Remaining `innerHTML` assignments (post-hardening)

| File:line | Disposition | Snippet |
| --- | --- | --- |
| `src/core/dice/dice-selector.ts:252` | `constant-trusted` | `resultArea.innerHTML =` |
| `src/core/dom-security.ts:53` | `helper-internal` | `template.innerHTML = html;` |
| `src/core/dom-security.ts:116` | `helper-internal` | `template.innerHTML = html;` |
| `src/demos/alignment-demo.ts:55` | `constant-trusted` | `wrapper.innerHTML = \`` |
| `src/demos/alignment-demo.ts:184` | `constant-trusted` | `wrapper.innerHTML = \`` |
| `src/demos/alignment-demo.ts:348` | `constant-trusted` | `wrapper.innerHTML = \`` |
| `src/demos/alignment-demo.ts:448` | `constant-trusted` | `wrapper.innerHTML = \`` |
| `src/demos/attribute-demo.ts:39` | `constant-trusted` | `container.innerHTML = \`` |
| `src/demos/attribute-demo.ts:326` | `constant-trusted` | `infoContainer.innerHTML =` |
| `src/demos/attribute-demo.ts:486` | `constant-trusted` | `validSetsContainer.innerHTML = \`<strong>Tip:</strong> A valid SET requires each attribute ` |
| `src/demos/attribute-demo.ts:542` | `constant-trusted` | `slot1.innerHTML = '<span class="placeholder">Piece 1</span>';` |
| `src/demos/attribute-demo.ts:558` | `constant-trusted` | `slot2.innerHTML = '<span class="placeholder">Piece 2</span>';` |
| `src/demos/attribute-demo.ts:568` | `constant-trusted` | `resultsContainer.innerHTML =` |
| `src/demos/dice-demo.ts:17` | `constant-trusted` | `wrapper.innerHTML = \`` |
| `src/demos/expression-demo.ts:36` | `constant-trusted` | `container.innerHTML = \`` |
| `src/demos/expression-demo.ts:408` | `constant-trusted` | `solutionsList.innerHTML = '<div style="color: #666;">Searching...</div>';` |
| `src/demos/expression-demo.ts:424` | `constant-trusted` | `solutionsList.innerHTML =` |
| `src/demos/fraction-demo.ts:38` | `constant-trusted` | `container.innerHTML = \`` |
| `src/demos/fraction-demo.ts:544` | `constant-trusted` | `resultContainer.innerHTML =` |
| `src/demos/fraction-demo.ts:646` | `constant-trusted` | `resultContainer.innerHTML =` |
| `src/demos/fraction-demo.ts:698` | `constant-trusted` | `resultContainer.innerHTML =` |
| `src/demos/fraction-demo.ts:714` | `constant-trusted` | `simplifiedItem.innerHTML = \`` |
| `src/demos/graph-demo.ts:42` | `constant-trusted` | `container.innerHTML = \`` |
| `src/demos/graph-demo.ts:401` | `constant-trusted` | `resultEl.innerHTML = '<strong>No path found</strong>';` |
| `src/demos/polyomino-demo.ts:65` | `constant-trusted` | `container.innerHTML = \`` |
| `src/demos/polyomino-demo.ts:458` | `constant-trusted` | `display.innerHTML =` |
| `src/demos/polyomino-demo.ts:552` | `constant-trusted` | `infoContainer.innerHTML = '<p>Select a shape to see details</p>';` |
| `src/games/contig-60/board-ui.ts:185` | `constant-trusted` | `noMoves.innerHTML = \`` |
| `src/games/fiar/game-controller.ts:214` | `constant-trusted` | `statusContainer.innerHTML = \`` |
| `src/games/frac-fact/board-ui.ts:106` | `constant-trusted` | `container.innerHTML =` |
| `src/games/frac-fact/board-ui.ts:229` | `constant-trusted` | `feedback.innerHTML = \`` |
| `src/games/frac-fact/board-ui.ts:239` | `constant-trusted` | `feedback.innerHTML = \`` |
| `src/games/fraction-pinball/board-ui.ts:33` | `constant-trusted` | `container.innerHTML =` |
| `src/games/fraction-pinball/board-ui.ts:215` | `constant-trusted` | `gradient.innerHTML = \`` |
| `src/games/kwatro-sinko/game-controller.ts:253` | `constant-trusted` | `targetInfo.innerHTML =` |
| `src/games/kwatro-sinko/game-controller.ts:371` | `constant-trusted` | `targetInfo.innerHTML =` |
| `src/games/prime-gold/board-ui.ts:531` | `constant-trusted` | `legend.innerHTML = \`` |
| `src/games/remainder-islands/board-ui.ts:316` | `constant-trusted` | `container.innerHTML = \`` |
| `src/ui/components/game-shell.ts:382` | `shell-trusted-builder` | `shellTpl.innerHTML = buildShellHtml(options);` |
| `src/ui/game-selector.ts:155` | `constant-trusted` | `chevronTpl.innerHTML = \`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke` |
| `src/ui/game-selector.ts:237` | `constant-trusted` | `logoTpl.innerHTML = \`` |
| `src/ui/game-selector.ts:344` | `constant-trusted` | `footerTpl.innerHTML = \`` |
| `src/ui/owl/owl-component.ts:56` | `constant-trusted` | `owlTpl.innerHTML = this.getTemplate();` |

## Replaced dynamic sinks (from this PR)

Every former non-constant `innerHTML` interpolation in games/demos/core/UI was converted. Representative call sites now use `replaceWithSafeHtml` / `clearElement` / `setText` / `setTrustedMarkup`:

| Area | Disposition |
| --- | --- |
| `src/ui/game-error-boundary.ts` | `replaced-safe-dom (createElement + setText)` |
| `src/ui/game-loading.ts` | `replaced-safe-dom (createElement + setText)` |
| `src/ui/stats-dashboard.ts` | `replaced-safe-dom (createElement + textContent; storage-fed name)` |
| `src/ui/game-selector.ts` | `replaced-safe-dom for dynamic stats/tabs; constants via template` |
| `src/ui/components/game-shell.ts` | `shell-trusted-builder (template mount)` |
| `src/ui/owl/owl-component.ts` | `constant-trusted via template; messages already textContent` |
| `src/core/tutorial.ts` | `replaced-safe-dom (setTrustedMarkup allowlist for step.message)` |
| `src/core/dice/*` | `replaced-safe-dom` |
| `src/core/expressions/expression-ui.ts` | `replaced-safe-dom` |
| `src/core/hex/hex-ui.ts` | `replaced-safe-dom (clearElement)` |
| `src/core/polyomino/polyomino-ui.ts` | `replaced-safe-dom (textContent)` |
| `src/games/*/board-ui.ts + game-controller.ts` | `replaced-safe-dom for all former interpolations` |
| `src/demos/*` | `replaced-safe-dom for all former interpolations` |

Approx. call sites after conversion: `replaceWithSafeHtml` × 71, `clearElement` × 80.

## Storage / URL param validation

| Source | Disposition |
| --- | --- |
| `localStorage` `math-pentathlon-progress` | `validated` via `src/core/storage/sanitize.ts` on load/import/settings/profile |
| URL/hash flags `board3d`, `board3dLQ`, `preserveDrawingBuffer` | `allowlisted` boolean tokens via `src/core/url-flags.ts` |
| IndexedDB | `n/a` (unused) |

## CSP / security headers

- `public/_headers` — Cloudflare Pages: CSP **Report-Only** + `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` / `frame-ancestors 'none'`
- Vite dev/preview — same headers via `vite.security-headers.ts` (dev CSP allows Vite HMR `unsafe-eval` + `ws:`)
