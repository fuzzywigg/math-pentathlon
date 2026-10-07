import type {
  CalibrationFlag,
  Difficulty,
  GameAdapter,
  MatchupStats,
  Policy,
} from './types';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export interface MatchupKey {
  p1: Policy;
  p2: Policy;
  label: string;
}

export function aiVsRandomMatchups(): MatchupKey[] {
  return DIFFICULTIES.map((d) => ({
    p1: d,
    p2: 'random' as const,
    label: `${d}-vs-random`,
  }));
}

export function aiVsAiMatchups(): MatchupKey[] {
  const out: MatchupKey[] = [];
  for (const a of DIFFICULTIES) {
    for (const b of DIFFICULTIES) {
      if (a === b) continue;
      out.push({ p1: a, p2: b, label: `${a}-vs-${b}` });
    }
  }
  return out;
}

export function aggregate(
  results: { winner: string; length: number }[]
): MatchupStats {
  const games = results.length;
  let p1Wins = 0;
  let p2Wins = 0;
  let draws = 0;
  let lengthSum = 0;
  for (const r of results) {
    lengthSum += r.length;
    if (r.winner === 'player1') p1Wins += 1;
    else if (r.winner === 'player2') p2Wins += 1;
    else draws += 1;
  }
  return {
    games,
    p1Wins,
    p2Wins,
    draws,
    avgLength: games === 0 ? 0 : lengthSum / games,
    p1WinRate: games === 0 ? 0 : p1Wins / games,
    p2WinRate: games === 0 ? 0 : p2Wins / games,
    drawRate: games === 0 ? 0 : draws / games,
  };
}

export function runMatchup(
  adapter: GameAdapter,
  p1: Policy,
  p2: Policy,
  games: number,
  baseSeed: number
): MatchupStats {
  const results = [];
  for (let i = 0; i < games; i++) {
    results.push(adapter.play(p1, p2, baseSeed + i * 1009));
  }
  return aggregate(results);
}

/** Flags for Easy beating Hard vs random, or difficulty levels indistinguishable. */
export function detectFlags(
  gameId: string,
  vsRandom: Record<Difficulty, MatchupStats>,
  /** Absolute win-rate gap below which levels are "indistinguishable". */
  indistinguishEpsilon = 0.05
): CalibrationFlag[] {
  const flags: CalibrationFlag[] = [];
  const easy = vsRandom.easy.p1WinRate;
  const medium = vsRandom.medium.p1WinRate;
  const hard = vsRandom.hard.p1WinRate;

  if (easy > hard + indistinguishEpsilon) {
    flags.push({
      kind: 'easy-beats-hard',
      detail: `${gameId}: Easy win rate (${pct(easy)}) exceeds Hard (${pct(hard)}) vs random`,
    });
  }

  const pairs: [Difficulty, Difficulty, number, number][] = [
    ['easy', 'medium', easy, medium],
    ['medium', 'hard', medium, hard],
    ['easy', 'hard', easy, hard],
  ];
  for (const [a, b, ra, rb] of pairs) {
    if (Math.abs(ra - rb) < indistinguishEpsilon) {
      flags.push({
        kind: 'indistinguishable',
        detail: `${gameId}: ${a} vs ${b} win rates indistinguishable (${pct(ra)} vs ${pct(rb)}) vs random`,
      });
    }
  }

  return flags;
}

function pct(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function formatStats(s: MatchupStats): string {
  return `n=${s.games} P1=${pct(s.p1WinRate)} P2=${pct(s.p2WinRate)} draw=${pct(s.drawRate)} avgLen=${s.avgLength.toFixed(1)}`;
}
