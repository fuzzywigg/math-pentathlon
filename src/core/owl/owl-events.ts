// Owl Event System - Types and event handling for Owl interactions

export type OwlEventType =
  | 'app:start'
  | 'app:return'
  | 'game:start'
  | 'game:end'
  | 'game:move'
  | 'tutorial:start'
  | 'tutorial:complete'
  | 'achievement:unlock'
  | 'streak:update'
  | 'streak:broken'
  | 'milestone:reached';

export interface OwlEventBase {
  type: OwlEventType;
  timestamp: number;
}

export interface AppStartEvent extends OwlEventBase {
  type: 'app:start';
  isFirstVisit: boolean;
  daysSinceLastVisit: number;
}

export interface AppReturnEvent extends OwlEventBase {
  type: 'app:return';
  daysSinceLastVisit: number;
  currentStreak: number;
}

export interface GameStartEvent extends OwlEventBase {
  type: 'game:start';
  gameId: string;
  gameName: string;
  division: string;
  isFirstTime: boolean;
  timesPlayed: number;
}

export interface GameEndEvent extends OwlEventBase {
  type: 'game:end';
  gameId: string;
  gameName: string;
  playerWon: boolean;
  isDraw: boolean;
  duration: number;
  moveCount: number;
  winStreak: number;
  isNewBestStreak: boolean;
}

export interface TutorialStartEvent extends OwlEventBase {
  type: 'tutorial:start';
  gameId: string;
  gameName: string;
}

export interface TutorialCompleteEvent extends OwlEventBase {
  type: 'tutorial:complete';
  gameId: string;
  gameName: string;
}

export interface AchievementUnlockEvent extends OwlEventBase {
  type: 'achievement:unlock';
  achievementId: string;
  achievementName: string;
  achievementDescription: string;
}

export interface StreakUpdateEvent extends OwlEventBase {
  type: 'streak:update';
  currentStreak: number;
  isNewRecord: boolean;
  previousBest: number;
}

export interface StreakBrokenEvent extends OwlEventBase {
  type: 'streak:broken';
  previousStreak: number;
  daysMissed: number;
}

export interface MilestoneEvent extends OwlEventBase {
  type: 'milestone:reached';
  milestoneType: 'games_played' | 'games_won' | 'time_played' | 'division_complete';
  value: number;
  description: string;
}

export type OwlEvent =
  | AppStartEvent
  | AppReturnEvent
  | GameStartEvent
  | GameEndEvent
  | TutorialStartEvent
  | TutorialCompleteEvent
  | AchievementUnlockEvent
  | StreakUpdateEvent
  | StreakBrokenEvent
  | MilestoneEvent;

// Event handler type
export type OwlEventHandler = (event: OwlEvent) => void;

// Simple event emitter for Owl system
export class OwlEventEmitter {
  private handlers: Map<OwlEventType | '*', OwlEventHandler[]> = new Map();

  on(type: OwlEventType | '*', handler: OwlEventHandler): () => void {
    const handlers = this.handlers.get(type) || [];
    handlers.push(handler);
    this.handlers.set(type, handlers);

    // Return unsubscribe function
    return () => {
      const currentHandlers = this.handlers.get(type) || [];
      this.handlers.set(
        type,
        currentHandlers.filter((h) => h !== handler)
      );
    };
  }

  emit(event: OwlEvent): void {
    // Call specific handlers
    const specificHandlers = this.handlers.get(event.type) || [];
    specificHandlers.forEach((handler) => handler(event));

    // Call wildcard handlers
    const wildcardHandlers = this.handlers.get('*') || [];
    wildcardHandlers.forEach((handler) => handler(event));
  }

  off(type: OwlEventType | '*', handler?: OwlEventHandler): void {
    if (!handler) {
      this.handlers.delete(type);
    } else {
      const handlers = this.handlers.get(type) || [];
      this.handlers.set(
        type,
        handlers.filter((h) => h !== handler)
      );
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}
