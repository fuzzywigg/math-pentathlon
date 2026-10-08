/**
 * burn-1008-mp-ui-helper-dedupe — characterization tests that pin current
 * behavior of duplicated UI/glue helpers before/after consolidation.
 *
 * Task: consolidate identical/near-identical copies across game screens.
 * Zero behavior change.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getPlayerName as sharedGetPlayerName,
  formatModeSeatLabel,
  formatModeSeatLabelComputer,
  getOpponentSeat,
} from '../../src/ui/seat-labels';
import { injectStylesOnce } from '../../src/ui/inject-styles';
import {
  getDieFaceEmoji,
  getDieFaceEmojiOrQuestion,
} from '../../src/ui/die-faces';
import {
  clearNullableTimeout,
  createGenerationTimeoutHandle,
  clearGenerationTimeout,
  bumpGeneration,
  scheduleGenerationTimeout,
  scheduleGenerationGated,
} from '../../src/ui/timeout-handle';
import {
  pointyTopHexPolygonPoints,
  pointyTopHexPathD,
  flatTopAxialToPixel,
  pointyTopHexCorners,
} from '../../src/ui/hex-svg';
import {
  syncAppOpponentChrome,
  clearGameModeChrome,
  applyGameModeChrome,
} from '../../src/ui/player-colors';

import { getPlayerName as contigName } from '../../src/games/contig-60/board-ui';
import { getPlayerName as juggleName } from '../../src/games/juggle/board-ui';
import { getPlayerName as sumName } from '../../src/games/sum-dominoes/board-ui';
import { getPlayerName as fabName } from '../../src/games/fab-a-diffy/board-ui';
import { getPlayerName as fiarName } from '../../src/games/fiar/board-ui';
import { getPlayerName as fracName } from '../../src/games/frac-fact/board-ui';
import { getPlayerName as pinballName } from '../../src/games/fraction-pinball/board-ui';
import { getPlayerName as kwaName } from '../../src/games/kwatro-sinko/board-ui';
import { getPlayerName as parName } from '../../src/games/par-55/board-ui';
import { getPlayerName as pentName } from '../../src/games/pent-em-in/board-ui';
import { getPlayerName as primeName } from '../../src/games/prime-gold/board-ui';
import { getPlayerName as qgName } from '../../src/games/queens-guards/board-ui';
import { getPlayerName as ramrodName } from '../../src/games/ramrod/board-ui';
import { getPlayerName as remName } from '../../src/games/remainder-islands/board-ui';
import { getPlayerName as starsName } from '../../src/games/stars-bars/board-ui';

import { getOpponent as contigOpp } from '../../src/games/contig-60/types';
import { getOpponent as juggleOpp } from '../../src/games/juggle/types';
import { getOpponent as sumOpp } from '../../src/games/sum-dominoes/types';
import { getOpponent as fabOpp } from '../../src/games/fab-a-diffy/types';
import { getOpponent as fiarOpp } from '../../src/games/fiar/types';
import { getOpponent as fracOpp } from '../../src/games/frac-fact/types';
import { getOpponent as pinballOpp } from '../../src/games/fraction-pinball/types';
import { getOpponent as kwaOpp } from '../../src/games/kwatro-sinko/types';
import { getOpponent as parOpp } from '../../src/games/par-55/types';
import { getOpponent as pentOpp } from '../../src/games/pent-em-in/types';
import { getOpponent as qgOpp } from '../../src/games/queens-guards/types';
import { getOpponent as ramrodOpp } from '../../src/games/ramrod/types';
import { getOpponent as remOpp } from '../../src/games/remainder-islands/types';
import { getOpponent as callaOpp } from '../../src/games/calla/types';
import { getOpponent as hexOpp } from '../../src/games/hex/types';
import { getOpponent as hexAGoneOpp } from '../../src/games/hex-a-gone/types';
import { getOpponent as starTrackOpp } from '../../src/games/star-track/types';
import { getOpponent as kingsOpp } from '../../src/games/kings-quadraphages/rules';

const BLUE_RED_NAMES = [
  ['contig-60', contigName],
  ['juggle', juggleName],
  ['sum-dominoes', sumName],
  ['fab-a-diffy', fabName],
  ['fiar', fiarName],
  ['frac-fact', fracName],
  ['fraction-pinball', pinballName],
  ['kwatro-sinko', kwaName],
  ['par-55', parName],
  ['pent-em-in', pentName],
  ['prime-gold', primeName],
  ['queens-guards', qgName],
  ['ramrod', ramrodName],
  ['remainder-islands', remName],
] as const;

const OPPONENTS = [
  ['contig-60', contigOpp],
  ['juggle', juggleOpp],
  ['sum-dominoes', sumOpp],
  ['fab-a-diffy', fabOpp],
  ['fiar', fiarOpp],
  ['frac-fact', fracOpp],
  ['fraction-pinball', pinballOpp],
  ['kwatro-sinko', kwaOpp],
  ['par-55', parOpp],
  ['pent-em-in', pentOpp],
  ['queens-guards', qgOpp],
  ['ramrod', ramrodOpp],
  ['remainder-islands', remOpp],
  ['calla', callaOpp],
  ['hex', hexOpp],
  ['hex-a-gone', hexAGoneOpp],
  ['star-track', starTrackOpp],
  ['kings-quadraphages', kingsOpp],
] as const;

describe('ui-helper-dedupe characterization — getPlayerName', () => {
  it('shared helper: Blue/Red and vsAI You/Computer', () => {
    expect(sharedGetPlayerName('player1')).toBe('Blue');
    expect(sharedGetPlayerName('player2')).toBe('Red');
    expect(sharedGetPlayerName('player1', false)).toBe('Blue');
    expect(sharedGetPlayerName('player2', false)).toBe('Red');
    expect(sharedGetPlayerName('player1', true)).toBe('You');
    expect(sharedGetPlayerName('player2', true)).toBe('Computer');
  });

  it.each(BLUE_RED_NAMES)(
    '%s board-ui getPlayerName is Blue/Red',
    (_game, gn) => {
      expect(gn('player1')).toBe('Blue');
      expect(gn('player2')).toBe('Red');
      expect(gn('player1')).toBe(sharedGetPlayerName('player1'));
      expect(gn('player2')).toBe(sharedGetPlayerName('player2'));
    }
  );

  it('stars-bars getPlayerName matches shared vsAI branch', () => {
    expect(starsName('player1')).toBe('Blue');
    expect(starsName('player2')).toBe('Red');
    expect(starsName('player1', false)).toBe('Blue');
    expect(starsName('player2', false)).toBe('Red');
    expect(starsName('player1', true)).toBe('You');
    expect(starsName('player2', true)).toBe('Computer');
    expect(starsName('player1', true)).toBe(
      sharedGetPlayerName('player1', true)
    );
    expect(starsName('player2', true)).toBe(
      sharedGetPlayerName('player2', true)
    );
  });

  it('mode seat labels: AI vs Computer variants', () => {
    expect(formatModeSeatLabel('player1', 'human-vs-human')).toBe('Blue');
    expect(formatModeSeatLabel('player2', 'human-vs-human')).toBe('Red');
    expect(formatModeSeatLabel('player1', 'human-vs-ai')).toBe('You');
    expect(formatModeSeatLabel('player2', 'human-vs-ai')).toBe('AI');
    expect(formatModeSeatLabelComputer('player2', 'human-vs-ai')).toBe(
      'Computer'
    );
  });
});

describe('ui-helper-dedupe characterization — getOpponent', () => {
  it('shared getOpponentSeat flips seats', () => {
    expect(getOpponentSeat('player1')).toBe('player2');
    expect(getOpponentSeat('player2')).toBe('player1');
  });

  it.each(OPPONENTS)('%s getOpponent matches shared', (_game, opp) => {
    expect(opp('player1')).toBe('player2');
    expect(opp('player2')).toBe('player1');
    expect(opp('player1')).toBe(getOpponentSeat('player1'));
    expect(opp('player2')).toBe(getOpponentSeat('player2'));
  });
});

describe('ui-helper-dedupe characterization — die faces', () => {
  it('Contig/Juggle table: 1..6 emoji; falsy "" at 0 → String(0)', () => {
    // Historical: faces[0] === '' is falsy, so `faces[value] || value.toString()` → "0"
    expect(getDieFaceEmoji(0)).toBe('0');
    expect(getDieFaceEmoji(1)).toBe('⚀');
    expect(getDieFaceEmoji(2)).toBe('⚁');
    expect(getDieFaceEmoji(3)).toBe('⚂');
    expect(getDieFaceEmoji(4)).toBe('⚃');
    expect(getDieFaceEmoji(5)).toBe('⚄');
    expect(getDieFaceEmoji(6)).toBe('⚅');
    expect(getDieFaceEmoji(7)).toBe('7');
    expect(getDieFaceEmoji(-1)).toBe('-1');
  });

  it('Remainder Islands table: value-1 index, unknown → ?', () => {
    expect(getDieFaceEmojiOrQuestion(1)).toBe('⚀');
    expect(getDieFaceEmojiOrQuestion(6)).toBe('⚅');
    expect(getDieFaceEmojiOrQuestion(0)).toBe('?');
    expect(getDieFaceEmojiOrQuestion(7)).toBe('?');
  });
});

describe('ui-helper-dedupe characterization — injectStylesOnce', () => {
  afterEach(() => {
    document.getElementById('dedupe-test-styles')?.remove();
  });

  it('injects once and preserves first CSS body', () => {
    injectStylesOnce('dedupe-test-styles', '.a{color:red}');
    injectStylesOnce('dedupe-test-styles', '.a{color:blue}');
    const el = document.getElementById('dedupe-test-styles');
    expect(el).toBeTruthy();
    expect(el?.tagName).toBe('STYLE');
    expect(el?.textContent).toBe('.a{color:red}');
    expect(document.querySelectorAll('#dedupe-test-styles')).toHaveLength(1);
  });
});

describe('ui-helper-dedupe characterization — syncAppOpponentChrome', () => {
  let app: HTMLElement;

  beforeEach(() => {
    app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  });

  afterEach(() => {
    clearGameModeChrome(app);
    app.remove();
  });

  it('boolean true → human-vs-ai chrome; false → human', () => {
    syncAppOpponentChrome(true);
    expect(app.dataset.opponent).toBe('ai');
    expect(app.classList.contains('game-vs-ai')).toBe(true);

    syncAppOpponentChrome(false);
    expect(app.dataset.opponent).toBeUndefined();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
  });

  it('explicit mode string matches applyGameModeChrome', () => {
    syncAppOpponentChrome('human-vs-ai', 'player1');
    expect(app.dataset.opponent).toBe('ai');
    expect(app.dataset.aiSeat).toBe('player1');

    clearGameModeChrome(app);
    applyGameModeChrome(app, 'human-vs-human');
    syncAppOpponentChrome('human-vs-human');
    expect(app.dataset.opponent).toBeUndefined();
  });

  it('no-ops when #app is missing', () => {
    app.remove();
    expect(() => syncAppOpponentChrome(true)).not.toThrow();
  });
});

describe('ui-helper-dedupe characterization — timeout handle', () => {
  it('clearNullableTimeout clears and returns null', () => {
    let ran = false;
    const id = setTimeout(() => {
      ran = true;
    }, 50);
    expect(clearNullableTimeout(id)).toBeNull();
    expect(clearNullableTimeout(null)).toBeNull();
    expect(ran).toBe(false);
  });

  it('generation gate drops stale callbacks', async () => {
    const handle = createGenerationTimeoutHandle();
    let count = 0;
    scheduleGenerationTimeout(
      handle,
      () => {
        count += 1;
      },
      10
    );
    bumpGeneration(handle);
    await new Promise((r) => setTimeout(r, 30));
    expect(count).toBe(0);

    scheduleGenerationTimeout(
      handle,
      () => {
        count += 1;
      },
      10
    );
    await new Promise((r) => setTimeout(r, 30));
    expect(count).toBe(1);
    clearGenerationTimeout(handle);
  });

  it('scheduleGenerationGated matches separate timer/generation bindings', async () => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let generation = 0;
    let count = 0;
    const clearTimer = () => {
      timer = clearNullableTimeout(timer);
    };
    scheduleGenerationGated(
      {
        clearTimer,
        setTimer: (t) => {
          timer = t;
        },
        getGeneration: () => generation,
      },
      () => {
        count += 1;
      },
      10
    );
    generation += 1;
    await new Promise((r) => setTimeout(r, 30));
    expect(count).toBe(0);
    scheduleGenerationGated(
      {
        clearTimer,
        setTimer: (t) => {
          timer = t;
        },
        getGeneration: () => generation,
      },
      () => {
        count += 1;
      },
      10
    );
    await new Promise((r) => setTimeout(r, 30));
    expect(count).toBe(1);
    clearTimer();
  });
});

describe('ui-helper-dedupe characterization — hex SVG helpers', () => {
  it('pointy-top polygon points: 6 vertices, pointy orientation', () => {
    const pts = pointyTopHexPolygonPoints(100, 100, 30);
    const parts = pts.split(' ');
    expect(parts).toHaveLength(6);
    // i=0 → angle -30°: x = 100 + 30*cos(-30), y = 100 + 30*sin(-30)
    const [x0, y0] = parts[0]!.split(',').map(Number);
    expect(x0).toBeCloseTo(100 + 30 * Math.cos(-Math.PI / 6), 10);
    expect(y0).toBeCloseTo(100 + 30 * Math.sin(-Math.PI / 6), 10);
  });

  it('pointy-top path d ends with Z and starts with M', () => {
    const d = pointyTopHexPathD(0, 0, 10);
    expect(d.startsWith('M ')).toBe(true);
    expect(d.endsWith(' Z')).toBe(true);
    expect(pointyTopHexCorners(0, 0, 10)).toHaveLength(6);
  });

  it('flat-top axialToPixel matches hex-a-gone formula', () => {
    const size = 30;
    const { x, y } = flatTopAxialToPixel(1, 2, size);
    expect(x).toBeCloseTo(size * ((3 / 2) * 1), 10);
    expect(y).toBeCloseTo(
      size * ((Math.sqrt(3) / 2) * 1 + Math.sqrt(3) * 2),
      10
    );
  });
});
