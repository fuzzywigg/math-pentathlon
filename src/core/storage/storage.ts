// Storage System - LocalStorage wrapper with versioning and type safety

import {
  ProgressData,
  PlayerProfile,
  GameStats,
  GameResult,
  StreakData,
  Achievement,
  UserSettings,
  OwlState,
  createDefaultProgress,
  createDefaultGameStats,
  CURRENT_DATA_VERSION,
  DEFAULT_SETTINGS,
  DEFAULT_OWL_STATE,
} from './types';

const STORAGE_KEY = 'math-pentathlon-progress';
const MAX_MESSAGES_HISTORY = 50; // Prevent unbounded growth

class StorageManager {
  private data: ProgressData;
  private saveDebounceTimer: number | null = null;

  constructor() {
    this.data = this.load();
  }

  // Load data from localStorage
  private load(): ProgressData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return createDefaultProgress();
      }

      const parsed = JSON.parse(stored) as ProgressData;

      // Handle version migrations
      if (parsed.version < CURRENT_DATA_VERSION) {
        return this.migrate(parsed);
      }

      // Ensure all required fields exist (defensive)
      return this.ensureDefaults(parsed);
    } catch (error) {
      console.warn('Failed to load progress data, starting fresh:', error);
      return createDefaultProgress();
    }
  }

  // Migrate old data versions
  private migrate(data: ProgressData): ProgressData {
    // Version migrations go here as needed
    // For now, just update version and ensure defaults
    data.version = CURRENT_DATA_VERSION;
    return this.ensureDefaults(data);
  }

  // Ensure all required fields have values
  private ensureDefaults(data: ProgressData): ProgressData {
    return {
      version: data.version || CURRENT_DATA_VERSION,
      profile: data.profile || null,
      streak: data.streak || { currentStreak: 0, bestStreak: 0, lastPlayDate: '', streakStartDate: '' },
      achievements: data.achievements || [],
      gameStats: data.gameStats || {},
      owlState: data.owlState || { ...DEFAULT_OWL_STATE },
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
    };
  }

  // Save data to localStorage (debounced)
  private save(): void {
    if (this.saveDebounceTimer !== null) {
      clearTimeout(this.saveDebounceTimer);
    }

    this.saveDebounceTimer = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (error) {
        console.error('Failed to save progress data:', error);
      }
      this.saveDebounceTimer = null;
    }, 100);
  }

  // Force immediate save (for critical operations)
  public saveNow(): void {
    if (this.saveDebounceTimer !== null) {
      clearTimeout(this.saveDebounceTimer);
      this.saveDebounceTimer = null;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save progress data:', error);
    }
  }

  // Profile methods
  public getProfile(): PlayerProfile | null {
    return this.data.profile;
  }

  public setProfile(profile: PlayerProfile): void {
    this.data.profile = profile;
    this.save();
  }

  public createProfile(name: string, avatar: string): PlayerProfile {
    const profile: PlayerProfile = {
      id: crypto.randomUUID(),
      name,
      avatar,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    };
    this.setProfile(profile);
    return profile;
  }

  public updateLastActive(): void {
    if (this.data.profile) {
      this.data.profile.lastActiveAt = Date.now();
      this.save();
    }
  }

  // Game stats methods
  public getGameStats(gameId: string): GameStats {
    if (!this.data.gameStats[gameId]) {
      this.data.gameStats[gameId] = createDefaultGameStats(gameId);
    }
    return this.data.gameStats[gameId];
  }

  public getAllGameStats(): Record<string, GameStats> {
    return { ...this.data.gameStats };
  }

  public recordGameResult(result: GameResult): GameStats {
    const stats = this.getGameStats(result.gameId);

    stats.gamesPlayed++;
    stats.totalPlayTime += result.duration;
    stats.lastPlayed = result.playedAt;

    if (result.winner === 'draw') {
      stats.gamesDraw++;
      stats.currentWinStreak = 0;
    } else if (result.playerWon) {
      stats.gamesWon++;
      stats.currentWinStreak++;
      if (stats.currentWinStreak > stats.bestWinStreak) {
        stats.bestWinStreak = stats.currentWinStreak;
      }
    } else {
      stats.gamesLost++;
      stats.currentWinStreak = 0;
    }

    this.data.gameStats[result.gameId] = stats;
    this.updateStreak();
    this.save();

    return stats;
  }

  // Streak methods
  public getStreak(): StreakData {
    return { ...this.data.streak };
  }

  public updateStreak(): StreakData {
    const today = this.getTodayString();
    const streak = this.data.streak;

    if (streak.lastPlayDate === today) {
      // Already played today, no change
      return streak;
    }

    const yesterday = this.getYesterdayString();

    if (streak.lastPlayDate === yesterday) {
      // Continuing streak
      streak.currentStreak++;
      streak.lastPlayDate = today;
    } else if (streak.lastPlayDate === '') {
      // First play ever
      streak.currentStreak = 1;
      streak.lastPlayDate = today;
      streak.streakStartDate = today;
    } else {
      // Streak broken, start new
      streak.currentStreak = 1;
      streak.lastPlayDate = today;
      streak.streakStartDate = today;
    }

    if (streak.currentStreak > streak.bestStreak) {
      streak.bestStreak = streak.currentStreak;
    }

    this.save();
    return streak;
  }

  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getYesterdayString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  // Achievement methods
  public getAchievements(): Achievement[] {
    return [...this.data.achievements];
  }

  public hasAchievement(id: string): boolean {
    return this.data.achievements.some((a) => a.id === id);
  }

  public unlockAchievement(id: string): Achievement | null {
    if (this.hasAchievement(id)) {
      return null; // Already unlocked
    }

    const achievement: Achievement = {
      id,
      unlockedAt: Date.now(),
    };

    this.data.achievements.push(achievement);
    this.save();
    return achievement;
  }

  // Owl state methods
  public getOwlState(): OwlState {
    return { ...this.data.owlState };
  }

  public updateOwlMood(mood: OwlState['mood']): void {
    this.data.owlState.mood = mood;
    this.data.owlState.lastInteraction = Date.now();
    this.save();
  }

  public markMessageSeen(messageId: string): void {
    if (!this.data.owlState.messagesSeen.includes(messageId)) {
      this.data.owlState.messagesSeen.push(messageId);
      this.data.owlState.totalMessagesShown++;

      // Prevent unbounded growth
      if (this.data.owlState.messagesSeen.length > MAX_MESSAGES_HISTORY) {
        this.data.owlState.messagesSeen = this.data.owlState.messagesSeen.slice(-MAX_MESSAGES_HISTORY);
      }

      this.save();
    }
  }

  public hasSeenMessage(messageId: string): boolean {
    return this.data.owlState.messagesSeen.includes(messageId);
  }

  public markTutorialCompleted(tutorialId: string): void {
    if (!this.data.owlState.tutorialsCompleted.includes(tutorialId)) {
      this.data.owlState.tutorialsCompleted.push(tutorialId);
      this.save();
    }
  }

  public hasTutorialCompleted(tutorialId: string): boolean {
    return this.data.owlState.tutorialsCompleted.includes(tutorialId);
  }

  // Settings methods
  public getSettings(): UserSettings {
    return { ...this.data.settings };
  }

  public updateSettings(settings: Partial<UserSettings>): void {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
  }

  // Aggregate statistics
  public getTotalGamesPlayed(): number {
    return Object.values(this.data.gameStats).reduce((sum, stats) => sum + stats.gamesPlayed, 0);
  }

  public getTotalPlayTime(): number {
    return Object.values(this.data.gameStats).reduce((sum, stats) => sum + stats.totalPlayTime, 0);
  }

  public getOverallWinRate(): number {
    const stats = Object.values(this.data.gameStats);
    const totalWins = stats.reduce((sum, s) => sum + s.gamesWon, 0);
    const totalGames = stats.reduce((sum, s) => sum + s.gamesPlayed, 0);
    return totalGames > 0 ? totalWins / totalGames : 0;
  }

  public getGamesPlayedByDivision(): Record<string, number> {
    // This would need game registry info - simplified for now
    return {};
  }

  // Reset all data
  public resetAll(): void {
    this.data = createDefaultProgress();
    this.saveNow();
  }

  // Export/Import for backup
  public exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importData(json: string): boolean {
    try {
      const imported = JSON.parse(json) as ProgressData;
      this.data = this.ensureDefaults(imported);
      this.saveNow();
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const storage = new StorageManager();
