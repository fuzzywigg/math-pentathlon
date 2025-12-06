// Storage Types - Data structures for persistent player data

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  lastActiveAt: number;
}

export interface GameStats {
  gameId: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDraw: number;
  totalPlayTime: number; // milliseconds
  bestWinStreak: number;
  currentWinStreak: number;
  lastPlayed: number;
  firstPlayed: number;
}

export interface OwlState {
  mood: OwlMood;
  lastInteraction: number;
  messagesSeen: string[]; // Message IDs to prevent repeats
  tutorialsCompleted: string[];
  totalMessagesShown: number;
}

export type OwlMood = 'happy' | 'encouraging' | 'celebrating' | 'thinking' | 'sleepy' | 'proud';

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastPlayDate: string; // YYYY-MM-DD format
  streakStartDate: string;
}

export interface Achievement {
  id: string;
  unlockedAt: number;
}

export interface ProgressData {
  version: number; // For data migrations
  profile: PlayerProfile | null;
  streak: StreakData;
  achievements: Achievement[];
  gameStats: Record<string, GameStats>;
  owlState: OwlState;
  settings: UserSettings;
}

export interface UserSettings {
  owlEnabled: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  owlFrequency: 'chatty' | 'normal' | 'quiet';
}

export interface GameResult {
  gameId: string;
  winner: 'player1' | 'player2' | 'ai' | 'draw' | null;
  playerWon: boolean;
  duration: number; // milliseconds
  moveCount: number;
  playedAt: number;
}

// Default values
export const DEFAULT_SETTINGS: UserSettings = {
  owlEnabled: true,
  soundEnabled: true,
  reducedMotion: false,
  owlFrequency: 'normal',
};

export const DEFAULT_OWL_STATE: OwlState = {
  mood: 'happy',
  lastInteraction: 0,
  messagesSeen: [],
  tutorialsCompleted: [],
  totalMessagesShown: 0,
};

export const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  bestStreak: 0,
  lastPlayDate: '',
  streakStartDate: '',
};

export const CURRENT_DATA_VERSION = 1;

export function createDefaultProgress(): ProgressData {
  return {
    version: CURRENT_DATA_VERSION,
    profile: null,
    streak: { ...DEFAULT_STREAK },
    achievements: [],
    gameStats: {},
    owlState: { ...DEFAULT_OWL_STATE },
    settings: { ...DEFAULT_SETTINGS },
  };
}

export function createDefaultGameStats(gameId: string): GameStats {
  const now = Date.now();
  return {
    gameId,
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesDraw: 0,
    totalPlayTime: 0,
    bestWinStreak: 0,
    currentWinStreak: 0,
    lastPlayed: now,
    firstPlayed: now,
  };
}
