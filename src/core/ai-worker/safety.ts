/**
 * Generous safety deadline for AI worker searches on very slow devices.
 *
 * Measured desktop (unthrottled) Queens & Guards Hard opening ≈ 36 s;
 * estimated 4× CPU tablet ≈ 145 s. This cap is intentionally above that
 * so normal Hard play is never truncated — it only aborts pathological
 * stalls far beyond measured times. When it fires, the engine returns the
 * best root move evaluated so far (search depth is never reduced).
 */
export const AI_WORKER_SAFETY_DEADLINE_MS = 180_000;
