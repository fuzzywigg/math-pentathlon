// Game registry - centralized list of available games

export interface GameInfo {
  id: string;
  name: string;
  division: string;
  gradeRange: string;
  description: string;
  playerCount: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  available: boolean;
}

export interface DivisionInfo {
  id: string;
  name: string;
  gradeRange: string;
  description: string;
}

// Division definitions
export const DIVISIONS: DivisionInfo[] = [
  {
    id: 'division-1',
    name: 'Division I',
    gradeRange: 'Grades K-1',
    description: 'Fun starter games for the youngest players',
  },
  {
    id: 'division-2',
    name: 'Division II',
    gradeRange: 'Grades 2-3',
    description: 'Games that build counting, matching, and planning skills',
  },
  {
    id: 'division-3',
    name: 'Division III',
    gradeRange: 'Grades 4-5',
    description: 'Games with shapes, fractions, and clever board moves',
  },
  {
    id: 'division-4',
    name: 'Division IV',
    gradeRange: 'Grades 6-7',
    description: 'Trickier number games for bigger challenges',
  },
];

// Registry of all Math Pentathlon games
export const GAMES: GameInfo[] = [
  // ==========================================
  // DIVISION I - Grades K-1
  // ==========================================
  {
    id: 'kings-quadraphages',
    name: 'Kings & Quadraphages',
    division: 'Division I',
    gradeRange: 'Grades K-1',
    description:
      "Move your King, place blockers, and trap the other player's King.",
    playerCount: '2 Players',
    difficulty: 'beginner',
    icon: '♚',
    available: true,
  },
  {
    id: 'hex',
    name: 'Hex',
    division: 'Division I',
    gradeRange: 'Grades K-1',
    description:
      'Connect your two sides of the board with a path of your pieces.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '⬡',
    available: true,
  },
  {
    id: 'star-track',
    name: 'Star Track',
    division: 'Division I',
    gradeRange: 'Grades K-1',
    description:
      'Pick a chain length and race your piece to the center star.',
    playerCount: '2 Players',
    difficulty: 'beginner',
    icon: '★',
    available: true,
  },
  {
    id: 'hex-a-gone',
    name: 'Hex-a-Gone!',
    division: 'Division I',
    gradeRange: 'Grades K-1',
    description:
      'Cover the hex board with pattern blocks. Last player who can place wins!',
    playerCount: '2 Players',
    difficulty: 'beginner',
    icon: '⬢',
    available: true,
  },
  {
    id: 'calla',
    name: 'Calla',
    division: 'Division I',
    gradeRange: 'Grades K-1',
    description:
      "Drop cubes around the board, capture the other player's cubes, and fill your Calla.",
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '🎯',
    available: true,
  },

  // ==========================================
  // DIVISION II - Grades 2-3
  // ==========================================
  {
    id: 'sum-dominoes',
    name: 'Sum Dominoes & Dice',
    division: 'Division II',
    gradeRange: 'Grades 2-3',
    description: 'Roll the dice, then play a domino that matches the sum.',
    playerCount: '2-4 Players',
    difficulty: 'beginner',
    icon: '🁣',
    available: true,
  },
  {
    id: 'par-55',
    name: 'Par 55',
    division: 'Division II',
    gradeRange: 'Grades 2-3',
    description:
      'Place attribute blocks next to matching ones and race to 55 points.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '⬠',
    available: true,
  },
  {
    id: 'ramrod',
    name: 'Ramrod',
    division: 'Division II',
    gradeRange: 'Grades 2-3',
    description: 'Fill sum boxes with number rods that add up to the target.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '▭',
    available: true,
  },
  {
    id: 'kwatro-sinko',
    name: 'Kwatro-Sinko',
    division: 'Division II',
    gradeRange: 'Grades 2-3',
    description: 'Move number chips so a line adds up to 4 or 5.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '◈',
    available: true,
  },
  {
    id: 'fiar',
    name: 'FIAR',
    division: 'Division II',
    gradeRange: 'Grades 2-3',
    description:
      'Four In A Row — place and move chips to make a line of four.',
    playerCount: '2 Players',
    difficulty: 'beginner',
    icon: '◇',
    available: true,
  },

  // ==========================================
  // DIVISION III - Grades 4-5
  // ==========================================
  {
    id: 'juggle',
    name: 'Juggle',
    division: 'Division III',
    gradeRange: 'Grades 4-5',
    description:
      'Roll for shapes and fill your 9×9 board before your opponent does.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '⊞',
    available: true,
  },
  {
    id: 'contig-60',
    name: 'Contig 60',
    division: 'Division III',
    gradeRange: 'Grades 4-5',
    description:
      'Use three dice and math to place chips. First to five in a row wins.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '🎲',
    available: true,
  },
  {
    id: 'stars-bars',
    name: 'Stars & Bars',
    division: 'Division III',
    gradeRange: 'Grades 4-5',
    description: 'Sort shape cards by matching attributes and score points.',
    playerCount: '2 Players',
    difficulty: 'advanced',
    icon: '✦',
    available: true,
  },
  {
    id: 'fab-a-diffy',
    name: 'Fab-a-Diffy',
    division: 'Division III',
    gradeRange: 'Grades 4-5',
    description: 'Match fraction bars that are equal in value.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '½',
    available: true,
  },
  {
    id: 'queens-guards',
    name: 'Queens & Guards',
    division: 'Division III',
    gradeRange: 'Grades 4-5',
    description:
      'Move Queens and Guards on a hex board and trap the other side.',
    playerCount: '2 Players',
    difficulty: 'advanced',
    icon: '♛',
    available: true,
  },

  // ==========================================
  // DIVISION IV - Grades 6-7
  // ==========================================
  {
    id: 'prime-gold',
    name: 'Prime Gold',
    division: 'Division IV',
    gradeRange: 'Grades 6-7',
    description:
      'Make number sentences from dice, then build diagonal lines of primes.',
    playerCount: '2 Players',
    difficulty: 'advanced',
    icon: '🔢',
    available: true,
  },
  {
    id: 'remainder-islands',
    name: 'Remainder Islands',
    division: 'Division IV',
    gradeRange: 'Grades 6-7',
    description:
      'Divide, find the remainder, and place chips on the matching islands.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '🏝️',
    available: true,
  },
  {
    id: 'pent-em-in',
    name: "Pent'Em In",
    division: 'Division IV',
    gradeRange: 'Grades 6-7',
    description:
      'Place pentomino pieces to block your opponent from fitting any more.',
    playerCount: '2 Players',
    difficulty: 'advanced',
    icon: '⊟',
    available: true,
  },
  {
    id: 'frac-fact',
    name: 'Frac Fact',
    division: 'Division IV',
    gradeRange: 'Grades 6-7',
    description:
      'Solve fraction problems and earn more points than your opponent.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '⅔',
    available: true,
  },
  {
    id: 'fraction-pinball',
    name: 'Fraction Pinball',
    division: 'Division IV',
    gradeRange: 'Grades 6-7',
    description:
      'Match fractions with their decimal partners, pinball-style.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '🎰',
    available: true,
  },
];

export function getGameById(id: string): GameInfo | undefined {
  return GAMES.find((game) => game.id === id);
}

export function getAvailableGames(): GameInfo[] {
  return GAMES.filter((game) => game.available);
}

export function getGamesByDivision(division: string): GameInfo[] {
  return GAMES.filter((game) => game.division === division);
}

export function getDivisionInfo(
  divisionName: string
): DivisionInfo | undefined {
  return DIVISIONS.find((d) => d.name === divisionName);
}
