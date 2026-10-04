import { registerSW } from 'virtual:pwa-register';
import { registerPwa } from './register';

/** Wire the generated service worker into the app entry. */
export function bootstrapPwa(): void {
  registerPwa({ registerSW });
}
