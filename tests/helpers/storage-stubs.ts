/**
 * Shared Web Storage failure-mode stubs (SecurityError / QuotaExceededError).
 */

/** DOMException named SecurityError (storage disabled / private mode). */
export function securityError(message = 'blocked'): DOMException {
  return new DOMException(message, 'SecurityError');
}

/** DOMException named QuotaExceededError (write quota). */
export function quotaError(message = 'quota'): DOMException {
  return new DOMException(message, 'QuotaExceededError');
}

/**
 * Temporarily replace globalThis.localStorage with a getter that throws
 * SecurityError, then restore the prior property descriptor.
 */
export async function withThrowingLocalStorageAccess<T>(
  fn: () => T | Promise<T>,
  message = 'Safari private'
): Promise<T> {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw securityError(message);
    },
  });
  try {
    return await fn();
  } finally {
    if (original) {
      Object.defineProperty(globalThis, 'localStorage', original);
    }
  }
}
