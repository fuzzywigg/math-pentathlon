/**
 * Env-number parsing for harness scripts (q-mp-876 / q-mp-908).
 * Rejects non-finite / non-positive values before browser launch.
 * Kept free of Playwright so unit tests can import it hermetically.
 */

/**
 * @typedef {{ requirePositive?: boolean }} EnvNumberOpts
 */

/**
 * Parse a numeric environment variable.
 * Unset or empty → `defaultValue`. Non-finite (and non-positive when required)
 * → usage error naming the variable.
 *
 * @param {NodeJS.ProcessEnv | Record<string, string | undefined>} env
 * @param {string} name
 * @param {number} defaultValue
 * @param {EnvNumberOpts} [opts]
 * @returns {{ ok: true, value: number } | { ok: false, message: string }}
 */
export function parseEnvNumber(env, name, defaultValue, opts = {}) {
  const requirePositive = opts.requirePositive !== false;
  const raw = env[name];
  if (raw === undefined || raw === '') {
    return { ok: true, value: defaultValue };
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    return {
      ok: false,
      message: `Invalid ${name}=${JSON.stringify(String(raw))} (expected a finite number).`,
    };
  }
  if (requirePositive && !(n > 0)) {
    return {
      ok: false,
      message: `Invalid ${name}=${JSON.stringify(String(raw))} (expected a positive number).`,
    };
  }
  return { ok: true, value: n };
}

/**
 * Resolve a numeric env var or print a one-line error and exit non-zero.
 *
 * @param {string} name
 * @param {number} defaultValue
 * @param {EnvNumberOpts} [opts]
 * @returns {number}
 */
export function requireEnvNumber(name, defaultValue, opts = {}) {
  const result = parseEnvNumber(process.env, name, defaultValue, opts);
  if (!result.ok) {
    console.error(result.message);
    process.exit(2);
  }
  return result.value;
}
