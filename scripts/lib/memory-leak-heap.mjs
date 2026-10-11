/**
 * Pure heap-snapshot helpers for scripts/memory-leak-audit.mjs (q-mp-1215 / 1216).
 * Kept free of Playwright / vite so unit tests can import hermetically.
 */

/** @param {number | null | undefined} bytes */
export function fmtMb(bytes) {
  if (bytes == null) return 'n/a';
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Subtract warm from after when both sides are finite numbers; otherwise null
 * (q-mp-1216 — never coerce null/missing heap metrics to 0).
 *
 * @param {number | null | undefined} after
 * @param {number | null | undefined} warm
 * @returns {number | null}
 */
export function metricDelta(after, warm) {
  if (
    typeof after !== 'number' ||
    typeof warm !== 'number' ||
    !Number.isFinite(after) ||
    !Number.isFinite(warm)
  ) {
    return null;
  }
  return after - warm;
}

/**
 * Parse Chrome heap snapshot for Detached DOM counts + total self size.
 * Fail closed when required node_fields are missing (q-mp-1215) — never NaN.
 *
 * @param {string} jsonText
 * @returns {{ detachedDomNodes: number, detachedSelfSize: number, totalSelfSize: number }}
 */
export function analyzeHeapSnapshot(jsonText) {
  const data = JSON.parse(jsonText);
  const nodeFields = data?.snapshot?.meta?.node_fields;
  if (!Array.isArray(nodeFields)) {
    throw new Error('heap snapshot missing snapshot.meta.node_fields');
  }
  const strings = data.strings;
  const nodes = data.nodes;
  if (!Array.isArray(nodes) || !Array.isArray(strings)) {
    throw new Error('heap snapshot missing nodes or strings arrays');
  }
  const fieldCount = nodeFields.length;
  if (fieldCount === 0) {
    throw new Error('heap snapshot node_fields is empty');
  }
  const nameOffset = nodeFields.indexOf('name');
  const selfSizeOffset = nodeFields.indexOf('self_size');
  if (selfSizeOffset < 0) {
    throw new Error(
      'heap snapshot missing required node_fields entry: self_size'
    );
  }
  if (nameOffset < 0) {
    throw new Error('heap snapshot missing required node_fields entry: name');
  }

  let detachedDomNodes = 0;
  let detachedSelfSize = 0;
  let totalSelfSize = 0;

  for (let i = 0; i < nodes.length; i += fieldCount) {
    const selfSize = nodes[i + selfSizeOffset];
    totalSelfSize += selfSize;
    const name = strings[nodes[i + nameOffset]];
    if (typeof name === 'string' && name.startsWith('Detached ')) {
      detachedDomNodes += 1;
      detachedSelfSize += selfSize;
    }
  }

  return { detachedDomNodes, detachedSelfSize, totalSelfSize };
}
