// Owl System - Main controller for Ollie the Owl mascot

import { storage, OwlMood, GameResult } from '../storage';
import { getGameById } from '../game-registry';
import {
  OwlEventEmitter,
  OwlEvent,
  GameStartEvent,
  GameEndEvent,
  AppStartEvent,
  StreakUpdateEvent,
} from './owl-events';
import { owlMessages, OwlMessage, MessageContext } from './owl-messages';

export interface OwlDisplayState {
  isVisible: boolean;
  mood: OwlMood;
  message: OwlMessage | null;
  isAnimating: boolean;
}

export type OwlStateChangeHandler = (state: OwlDisplayState) => void;

class OwlSystem {
  private events = new OwlEventEmitter();
  private stateHandlers: OwlStateChangeHandler[] = [];
  private currentState: OwlDisplayState = {
    isVisible: false,
    mood: 'happy',
    message: null,
    isAnimating: false,
  };
  private messageQueue: OwlMessage[] = [];
  private isProcessingQueue = false;
  private messageDisplayTime = 5000; // 5 seconds default
  private gameStartTime: number = 0;

  constructor() {
    // Listen to all events and process them
    this.events.on('*', (event) => this.handleEvent(event));
  }

  // Initialize the Owl system on app start
  initialize(): void {
    const profile = storage.getProfile();
    const streak = storage.getStreak();
    const settings = storage.getSettings();

    if (!settings.owlEnabled) {
      return;
    }

    const now = Date.now();
    const lastActive = profile?.lastActiveAt || 0;
    const daysSinceLastVisit = lastActive
      ? Math.floor((now - lastActive) / (1000 * 60 * 60 * 24))
      : 0;

    // Determine initial mood based on absence
    let initialMood: OwlMood = 'happy';
    if (daysSinceLastVisit > 7) {
      initialMood = 'sleepy';
    } else if (daysSinceLastVisit > 2) {
      initialMood = 'encouraging';
    }

    storage.updateOwlMood(initialMood);

    // Emit app start event
    if (!profile) {
      this.events.emit({
        type: 'app:start',
        timestamp: now,
        isFirstVisit: true,
        daysSinceLastVisit: 0,
      });
    } else {
      this.events.emit({
        type: 'app:return',
        timestamp: now,
        daysSinceLastVisit,
        currentStreak: streak.currentStreak,
      });
    }

    // Update last active
    storage.updateLastActive();

    // Show owl after brief delay
    setTimeout(() => {
      this.show();
    }, 1000);
  }

  // Show the owl
  show(): void {
    this.updateState({ isVisible: true });
  }

  // Hide the owl
  hide(): void {
    this.updateState({ isVisible: false, message: null });
  }

  // Toggle owl visibility
  toggle(): void {
    if (this.currentState.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  // Get current display state
  getState(): OwlDisplayState {
    return { ...this.currentState };
  }

  // Subscribe to state changes
  onStateChange(handler: OwlStateChangeHandler): () => void {
    this.stateHandlers.push(handler);
    // Immediately call with current state
    handler(this.getState());

    return () => {
      this.stateHandlers = this.stateHandlers.filter((h) => h !== handler);
    };
  }

  // Update and notify state
  private updateState(partial: Partial<OwlDisplayState>): void {
    this.currentState = { ...this.currentState, ...partial };
    this.stateHandlers.forEach((handler) => handler(this.getState()));
  }

  // Handle events and trigger messages
  private handleEvent(event: OwlEvent): void {
    const settings = storage.getSettings();
    if (!settings.owlEnabled) return;

    const context = this.buildContext(event);
    const message = owlMessages.selectMessage(event.type, context);

    if (message) {
      this.queueMessage(message, this.getMoodForEvent(event));
    }
  }

  // Build context for message selection
  private buildContext(event: OwlEvent): MessageContext {
    const profile = storage.getProfile();
    const streak = storage.getStreak();
    const stats = storage.getAllGameStats();
    const totalGames = storage.getTotalGamesPlayed();

    const context: MessageContext = {
      playerName: profile?.name || 'Mathematician',
      currentStreak: streak.currentStreak,
      totalGamesPlayed: totalGames,
      timeOfDay: this.getTimeOfDay(),
    };

    // Add event-specific context
    if (event.type === 'game:start' || event.type === 'game:end') {
      const gameEvent = event as GameStartEvent | GameEndEvent;
      context.gameId = gameEvent.gameId;
      context.gameName = gameEvent.gameName;

      const gameStats = stats[gameEvent.gameId];
      if (gameStats) {
        context.gamesPlayedThisGame = gameStats.gamesPlayed;
        context.winStreak = gameStats.currentWinStreak;
      }
    }

    if (event.type === 'game:end') {
      const endEvent = event as GameEndEvent;
      context.playerWon = endEvent.playerWon;
      context.isDraw = endEvent.isDraw;
    }

    return context;
  }

  // Get appropriate mood for event
  private getMoodForEvent(event: OwlEvent): OwlMood {
    switch (event.type) {
      case 'app:start':
        return (event as AppStartEvent).isFirstVisit ? 'happy' : 'encouraging';
      case 'app:return':
        return 'happy';
      case 'game:start':
        return 'encouraging';
      case 'game:end': {
        const endEvent = event as GameEndEvent;
        if (endEvent.playerWon) return 'celebrating';
        if (endEvent.isDraw) return 'thinking';
        return 'encouraging';
      }
      case 'achievement:unlock':
        return 'celebrating';
      case 'streak:update':
        return (event as StreakUpdateEvent).isNewRecord ? 'proud' : 'happy';
      case 'streak:broken':
        return 'encouraging';
      default:
        return 'happy';
    }
  }

  // Queue a message for display
  private queueMessage(message: OwlMessage, mood: OwlMood): void {
    this.messageQueue.push(message);
    storage.updateOwlMood(mood);
    this.updateState({ mood });

    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  // Process message queue
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.messageQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;

      // Check if we've seen this message recently (for non-important messages)
      if (message.priority !== 'high' && storage.hasSeenMessage(message.id)) {
        continue;
      }

      // Show message
      this.updateState({ message, isAnimating: true });
      storage.markMessageSeen(message.id);

      // Wait for display time
      await this.delay(this.getDisplayTime(message));

      // Hide message
      this.updateState({ message: null, isAnimating: false });

      // Brief pause between messages
      if (this.messageQueue.length > 0) {
        await this.delay(500);
      }
    }

    this.isProcessingQueue = false;
  }

  // Get display time based on message length and priority
  private getDisplayTime(message: OwlMessage): number {
    const baseTime = this.messageDisplayTime;
    const lengthBonus = Math.min(message.text.length * 30, 3000);
    const priorityMultiplier = message.priority === 'high' ? 1.5 : 1;
    return (baseTime + lengthBonus) * priorityMultiplier;
  }

  // Helper delay function
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get time of day for contextual messages
  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  // Public API for game integration

  // Call when a game starts
  onGameStart(gameId: string): void {
    const game = getGameById(gameId);
    if (!game) return;

    const stats = storage.getGameStats(gameId);
    this.gameStartTime = Date.now();

    this.events.emit({
      type: 'game:start',
      timestamp: Date.now(),
      gameId,
      gameName: game.name,
      division: game.division,
      isFirstTime: stats.gamesPlayed === 0,
      timesPlayed: stats.gamesPlayed,
    });
  }

  // Call when a game ends
  onGameEnd(gameId: string, result: { winner: 'player1' | 'player2' | 'ai' | 'draw' | null; moveCount: number }): void {
    const game = getGameById(gameId);
    if (!game) return;

    const duration = Date.now() - this.gameStartTime;
    const playerWon = result.winner === 'player1';
    const isDraw = result.winner === 'draw';

    // Record result in storage
    const gameResult: GameResult = {
      gameId,
      winner: result.winner,
      playerWon,
      duration,
      moveCount: result.moveCount,
      playedAt: Date.now(),
    };

    const updatedStats = storage.recordGameResult(gameResult);
    const previousBest = updatedStats.bestWinStreak - (playerWon ? 1 : 0);

    this.events.emit({
      type: 'game:end',
      timestamp: Date.now(),
      gameId,
      gameName: game.name,
      playerWon,
      isDraw,
      duration,
      moveCount: result.moveCount,
      winStreak: updatedStats.currentWinStreak,
      isNewBestStreak: updatedStats.currentWinStreak > previousBest && playerWon,
    });

    // Check for streak updates
    const streak = storage.getStreak();
    if (streak.currentStreak > 0) {
      this.events.emit({
        type: 'streak:update',
        timestamp: Date.now(),
        currentStreak: streak.currentStreak,
        isNewRecord: streak.currentStreak === streak.bestStreak,
        previousBest: streak.bestStreak,
      });
    }
  }

  // Call when tutorial starts
  onTutorialStart(gameId: string): void {
    const game = getGameById(gameId);
    if (!game) return;

    this.events.emit({
      type: 'tutorial:start',
      timestamp: Date.now(),
      gameId,
      gameName: game.name,
    });
  }

  // Call when tutorial completes
  onTutorialComplete(gameId: string): void {
    const game = getGameById(gameId);
    if (!game) return;

    storage.markTutorialCompleted(gameId);

    this.events.emit({
      type: 'tutorial:complete',
      timestamp: Date.now(),
      gameId,
      gameName: game.name,
    });
  }

  // Dismiss current message
  dismissMessage(): void {
    this.updateState({ message: null, isAnimating: false });
  }

  // Get event emitter for external subscriptions
  getEvents(): OwlEventEmitter {
    return this.events;
  }
}

// Singleton instance
export const owlSystem = new OwlSystem();
