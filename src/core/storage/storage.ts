// Storage System - LocalStorage wrapper with versioning and type safety

import { setUserReducedMotionFlag } from '../settings-flags';
import {
  ensureProgressDefaults,
  isPlainProgressObject,
  normalizeLoadedProgress,
} from './migrate';
import {
  sanitizeDisplayStringAllowEmpty,
  sanitizeProfile,
  sanitizeSettings,
  MAX_PROFILE_AVATAR_LENGTH,
  MAX_PROFILE_NAME_LENGTH,
} from './sanitize';
import type {
  ProgressData,
  PlayerProfile,
  GameStats,
  GameResult,
  StreakData,
  Achievement,
  UserSettings,
  OwlState,
} from './types';
import { createDefaultProgress, createDefaultGameStats } from './types';

/** localStorage key for the on-device progress blob. */
export const PROGRESS_STORAGE_KEY = 'math-pentathlon-progress';

const STORAGE_KEY = PROGRESS_STORAGE_KEY;
const MAX_MESSAGES_HISTORY = 50; // Prevent unbounded growth

class StorageManager {
  private data: ProgressData;
  private saveDebounceTimer: number | null = null;

  constructor() {
    this.data = this.load();
    setUserReducedMotionFlag(this.data.settings.reducedMotion === true);
  }

  // Load data from localStorage
  private load(): ProgressData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return createDefaultProgress();
      }

      const parsed: unknown = JSON.parse(stored);

      // Primitives / arrays / null are corrupt — never hand them to ensureDefaults.
      if (!isPlainProgressObject(parsed)) {
        console.warn(
          'Failed to load progress data, starting fresh:',
          new TypeError('Progress root must be a plain object')
        );
        return createDefaultProgress();
      }

      const progress = parsed as unknown as ProgressData;
      return normalizeLoadedProgress(progress);
    } catch (error) {
      console.warn('Failed to load progress data, starting fresh:', error);
      return createDefaultProgress();
    }
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
    const sanitized = sanitizeProfile(profile);
    if (!sanitized) {
      throw new TypeError('Invalid player profile');
    }
    this.data.profile = sanitized;
    this.save();
  }

  public createProfile(name: string, avatar: string): PlayerProfile {
    const safeName =
      sanitizeDisplayStringAllowEmpty(name, MAX_PROFILE_NAME_LENGTH) ?? '';
    const safeAvatar =
      sanitizeDisplayStringAllowEmpty(avatar, MAX_PROFILE_AVATAR_LENGTH) ?? '';
    const profile: PlayerProfile = {
      id: crypto.randomUUID(),
      name: safeName,
      avatar: safeAvatar,
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
    return new Date().toISOString().split('T')[0] ?? '';
  }

  private getYesterdayString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0] ?? '';
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
    return {
      ...this.data.owlState,
      messagesSeen: [...this.data.owlState.messagesSeen],
      tutorialsCompleted: [...this.data.owlState.tutorialsCompleted],
    };
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
        this.data.owlState.messagesSeen =
          this.data.owlState.messagesSeen.slice(-MAX_MESSAGES_HISTORY);
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
    this.data.settings = sanitizeSettings({
      ...this.data.settings,
      ...settings,
    });
    setUserReducedMotionFlag(this.data.settings.reducedMotion === true);
    this.save();
  }

  // Aggregate statistics
  public getTotalGamesPlayed(): number {
    return Object.values(this.data.gameStats).reduce(
      (sum, stats) => sum + stats.gamesPlayed,
      0
    );
  }

  public getTotalPlayTime(): number {
    return Object.values(this.data.gameStats).reduce(
      (sum, stats) => sum + stats.totalPlayTime,
      0
    );
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
    setUserReducedMotionFlag(this.data.settings.reducedMotion === true);
    this.saveNow();
  }

  // Export/Import for backup
  public exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importData(json: string): boolean {
    try {
      const imported = JSON.parse(json) as ProgressData;
      this.data = ensureProgressDefaults(imported);
      setUserReducedMotionFlag(this.data.settings.reducedMotion === true);
      this.saveNow();
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const storage = new StorageManager();
