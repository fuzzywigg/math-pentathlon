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
    description: 'Foundation games for early learners',
  },
  {
    id: 'division-2',
    name: 'Division II',
    gradeRange: 'Grades 2-3',
    description: 'Building computational and strategic thinking',
  },
  {
    id: 'division-3',
    name: 'Division III',
    gradeRange: 'Grades 4-5',
    description: 'Advanced geometry and fraction concepts',
  },
  {
    id: 'division-4',
    name: 'Division IV',
    gradeRange: 'Grades 6-7',
    description: 'Complex operations and algebraic thinking',
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
    description: 'Trap your opponent\'s King using strategic placement of Quadraphages.',
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
    description: 'Connect opposite sides of the board with an unbroken chain.',
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
    description: 'Select chain links of various lengths to move across the star-shaped board.',
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
    description: 'Cover hexagonal spaces with pattern blocks - last player to place wins!',
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
    description: 'Distribute cubes strategically to capture and earn free turns.',
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
    description: 'Match domino faces to dice sums. Develops subtraction and algebraic thinking.',
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
    description: 'Use attribute logic blocks on pentagon bases to score points.',
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
    description: 'Network addend combinations with Cuisenaire rods to complete sum boxes.',
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
    description: 'Move chips along pathways to create alignments totaling four or five.',
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
    description: 'Four In A Row - place and move chips along pathways to form winning alignments.',
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
    description: 'Juggle polyominoes to complete your 9x9 grid. Area and transformations.',
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
    description: 'Form number sentences from dice rolls. Four operations strategy game.',
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
    description: 'Multiple classification logic with geometric attribute cards.',
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
    description: 'Fraction bars game developing equivalence and operations understanding.',
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
    description: 'Hexagonal strategy game combining Checkers simplicity with Chess complexity.',
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
    description: 'Exponents, factorials, and primes in a diagonal alignment strategy game.',
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
    description: 'Division game with hexagonal islands. Strategic placement using remainders.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '🏝️',
    available: false,
  },
  {
    id: 'pent-em-in',
    name: "Pent'Em In",
    division: 'Division IV',
    gradeRange: 'Grades 6-7',
    description: 'Use pentominoes to entrap opponents. Transformational geometry strategy.',
    playerCount: '2 Players',
    difficulty: 'advanced',
    icon: '⊟',
    available: false,
  },
  {
    id: 'frac-fact',
    name: 'Frac Fact',
    division: 'Division IV',
    gradeRange: 'Grades 6-7',
    description: 'Combine fraction bars with operations to match answer bars.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '⅔',
    available: false,
  },
  {
    id: 'fraction-pinball',
    name: 'Fraction Pinball',
    division: 'Division IV',
    gradeRange: 'Grades 6-7',
    description: 'Fraction-decimal conversion game simulating pinball mechanics.',
    playerCount: '2 Players',
    difficulty: 'intermediate',
    icon: '🎰',
    available: false,
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

export function getDivisionInfo(divisionName: string): DivisionInfo | undefined {
  return DIVISIONS.find((d) => d.name === divisionName);
}
