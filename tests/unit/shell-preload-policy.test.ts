import { describe, it, expect } from 'vitest';
import {
  DEFERRED_CORE_PREFIXES,
  coreManualChunkName,
  shouldPreloadMenuDependency,
  uiManualChunkName,
} from '../../vite.shell-chunks';

describe('shell preload / chunk policy', () => {
  it('preloads shell core + ui + vite-preload for the menu entry', () => {
    expect(shouldPreloadMenuDependency('assets/core-abc.js')).toBe(true);
    expect(shouldPreloadMenuDependency('assets/ui-abc.js')).toBe(true);
    expect(shouldPreloadMenuDependency('vendor/vite-preload-abc.js')).toBe(
      true
    );
  });

  it('does not preload games, demos, three, or deferred core', () => {
    expect(shouldPreloadMenuDependency('assets/game-hex-abc.js')).toBe(false);
    expect(shouldPreloadMenuDependency('assets/demo-dice-abc.js')).toBe(false);
    expect(shouldPreloadMenuDependency('vendor/three-abc.js')).toBe(false);
    expect(shouldPreloadMenuDependency('vendor/mp3d-abc.js')).toBe(false);
    expect(shouldPreloadMenuDependency('assets/owl-abc.js')).toBe(false);
    expect(shouldPreloadMenuDependency('assets/owl-ui-abc.js')).toBe(false);
    expect(shouldPreloadMenuDependency('assets/stats-abc.js')).toBe(false);
    expect(shouldPreloadMenuDependency('assets/stats-dashboard-abc.css')).toBe(
      false
    );
    expect(shouldPreloadMenuDependency('assets/game-routes-abc.js')).toBe(
      false
    );
    expect(shouldPreloadMenuDependency('assets/game-play-abc.css')).toBe(false);
    expect(shouldPreloadMenuDependency('assets/game-shell-abc.js')).toBe(false);
    expect(shouldPreloadMenuDependency('assets/player-colors-abc.js')).toBe(
      false
    );

    for (const prefix of DEFERRED_CORE_PREFIXES) {
      if (prefix === 'owl') continue;
      expect(
        shouldPreloadMenuDependency(`assets/core-${prefix}-abc.js`),
        `core-${prefix}`
      ).toBe(false);
    }
  });

  it('assigns deferred core subsystems to separate chunks', () => {
    expect(coreManualChunkName('/repo/src/core/router.ts')).toBe('core');
    expect(coreManualChunkName('/repo/src/core/game-registry.ts')).toBe('core');
    expect(coreManualChunkName('/repo/src/core/owl/owl-system.ts')).toBe('owl');
    expect(coreManualChunkName('/repo/src/core/dice/roller.ts')).toBe(
      'core-dice'
    );
    expect(coreManualChunkName('/repo/src/core/fractions/arithmetic.ts')).toBe(
      'core-fractions'
    );
    expect(
      coreManualChunkName('/repo/src/ui/game-selector.ts')
    ).toBeUndefined();
  });

  it('splits owl-ui, stats, game-routes, and game-shell out of the shared ui chunk', () => {
    expect(uiManualChunkName('/repo/src/ui/game-selector.ts')).toBe('ui');
    expect(uiManualChunkName('/repo/src/ui/owl/owl-component.ts')).toBe(
      'owl-ui'
    );
    expect(uiManualChunkName('/repo/src/ui/stats-dashboard.ts')).toBe('stats');
    expect(uiManualChunkName('/repo/src/ui/styles/stats-dashboard.css')).toBe(
      'stats'
    );
    expect(uiManualChunkName('/repo/src/ui/game-route-mounts.ts')).toBe(
      'game-routes'
    );
    expect(uiManualChunkName('/repo/src/ui/components/game-shell.ts')).toBe(
      'game-shell'
    );
    expect(uiManualChunkName('/repo/src/ui/player-colors.ts')).toBe(
      'game-shell'
    );
    expect(
      uiManualChunkName('/repo/src/ui/styles/game-play.css')
    ).toBeUndefined();
    expect(uiManualChunkName('/repo/src/ui/three/fiar-board-3d.ts')).toBe(
      'mp3d'
    );
  });

  it('assigns storage to a deferred core chunk', () => {
    expect(coreManualChunkName('/repo/src/core/storage/storage.ts')).toBe(
      'core-storage'
    );
    expect(coreManualChunkName('/repo/src/core/storage/types.ts')).toBe(
      'core-storage'
    );
  });
});
