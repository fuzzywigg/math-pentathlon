/**
 * Thin re-export so unit tests can mock this module without resolving
 * vite-plugin-pwa's virtual:pwa-register id under Vitest.
 */
export { registerSW } from 'virtual:pwa-register';
