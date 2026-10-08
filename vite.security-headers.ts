import type { Plugin, Connect } from 'vite';
import { securityHeadersForEnv } from './src/core/security-headers';

/**
 * Apply the same security headers used on Cloudflare Pages (`public/_headers`)
 * to Vite's dev and preview servers so Chromium e2e can assert CSP report-only.
 */
export function securityHeadersPlugin(): Plugin {
  const apply =
    (mode: string): Connect.NextHandleFunction =>
    (_req, res, next) => {
      const headers = securityHeadersForEnv(mode);
      for (const [key, value] of Object.entries(headers)) {
        res.setHeader(key, value);
      }
      next();
    };

  return {
    name: 'mp-security-headers',
    configureServer(server) {
      server.middlewares.use(apply(server.config.mode));
    },
    configurePreviewServer(server) {
      server.middlewares.use(apply(server.config.mode || 'production'));
    },
  };
}
