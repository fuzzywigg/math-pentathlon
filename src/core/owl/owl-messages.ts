// Owl Messages - Library of contextual messages for Ollie the Owl

import { OwlEventType } from './owl-events';
import { storage } from '../storage';

export interface OwlMessage {
  id: string;
  text: string;
  category: OwlEventType;
  priority: 'low' | 'normal' | 'high';
  conditions?: MessageCondition[];
}

export interface MessageCondition {
  type: 'timeOfDay' | 'streak' | 'gamesPlayed' | 'firstTime' | 'winStreak' | 'playerWon';
  value?: string | number | boolean;
  operator?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
}

export interface MessageContext {
  playerName?: string;
  gameId?: string;
  gameName?: string;
  currentStreak?: number;
  totalGamesPlayed?: number;
  gamesPlayedThisGame?: number;
  winStreak?: number;
  playerWon?: boolean;
  isDraw?: boolean;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

// Message templates with {placeholders}
const MESSAGE_LIBRARY: OwlMessage[] = [
  // =====================
  // APP START - First Visit
  // =====================
  {
    id: 'welcome-1',
    category: 'app:start',
    priority: 'high',
    text: "Hoot hoot! I'm Ollie the Owl, your math adventure guide! Ready to explore some amazing games?",
    conditions: [{ type: 'firstTime', value: true }],
  },
  {
    id: 'welcome-2',
    category: 'app:start',
    priority: 'high',
    text: "Welcome to Math Pentathlon! I'm Ollie, and I'll be cheering you on. Let's pick a game!",
    conditions: [{ type: 'firstTime', value: true }],
  },
  {
    id: 'welcome-3',
    category: 'app:start',
    priority: 'high',
    text: "Hello, young mathematician! I'm Ollie the Owl. Together we'll conquer 20 amazing math games!",
    conditions: [{ type: 'firstTime', value: true }],
  },

  // =====================
  // APP RETURN
  // =====================
  {
    id: 'return-morning-1',
    category: 'app:return',
    priority: 'normal',
    text: 'Good morning, {playerName}! Ready for some brain-boosting math fun?',
    conditions: [{ type: 'timeOfDay', value: 'morning' }],
  },
  {
    id: 'return-afternoon-1',
    category: 'app:return',
    priority: 'normal',
    text: 'Good afternoon! Perfect time for a math challenge, {playerName}!',
    conditions: [{ type: 'timeOfDay', value: 'afternoon' }],
  },
  {
    id: 'return-evening-1',
    category: 'app:return',
    priority: 'normal',
    text: 'Evening owl hours! The best time for strategic thinking. Ready to play?',
    conditions: [{ type: 'timeOfDay', value: 'evening' }],
  },
  {
    id: 'return-night-1',
    category: 'app:return',
    priority: 'normal',
    text: "Late night math session? I'm a night owl too! Let's do this!",
    conditions: [{ type: 'timeOfDay', value: 'night' }],
  },
  {
    id: 'return-streak-1',
    category: 'app:return',
    priority: 'high',
    text: "You're on a {currentStreak}-day streak! Keep it going, {playerName}!",
    conditions: [{ type: 'streak', value: 2, operator: 'gte' }],
  },
  {
    id: 'return-streak-big-1',
    category: 'app:return',
    priority: 'high',
    text: 'WOW! {currentStreak} days in a row! You are UNSTOPPABLE!',
    conditions: [{ type: 'streak', value: 7, operator: 'gte' }],
  },
  {
    id: 'return-generic-1',
    category: 'app:return',
    priority: 'normal',
    text: 'Welcome back, {playerName}! Which game shall we tackle today?',
  },
  {
    id: 'return-generic-2',
    category: 'app:return',
    priority: 'normal',
    text: "Great to see you again! Your math skills have been missed!",
  },
  {
    id: 'return-generic-3',
    category: 'app:return',
    priority: 'normal',
    text: "Hoot! You're back! Let's make some mathematical magic happen!",
  },

  // =====================
  // GAME START
  // =====================
  {
    id: 'game-start-first-1',
    category: 'game:start',
    priority: 'high',
    text: 'Your first time playing {gameName}! Take your time and have fun learning!',
    conditions: [{ type: 'firstTime', value: true }],
  },
  {
    id: 'game-start-first-2',
    category: 'game:start',
    priority: 'high',
    text: "Ooh, {gameName}! This is a great one. Don't worry about winning - just explore!",
    conditions: [{ type: 'firstTime', value: true }],
  },
  {
    id: 'game-start-return-1',
    category: 'game:start',
    priority: 'normal',
    text: '{gameName} again! I can see you really like this one!',
    conditions: [{ type: 'gamesPlayed', value: 5, operator: 'gte' }],
  },
  {
    id: 'game-start-return-2',
    category: 'game:start',
    priority: 'normal',
    text: "Back for more {gameName}? You're getting really good at this!",
    conditions: [{ type: 'gamesPlayed', value: 3, operator: 'gte' }],
  },
  {
    id: 'game-start-generic-1',
    category: 'game:start',
    priority: 'normal',
    text: '{gameName} - excellent choice! Show me what you can do!',
  },
  {
    id: 'game-start-generic-2',
    category: 'game:start',
    priority: 'normal',
    text: "Let's go! Remember, every move is a chance to learn something new!",
  },
  {
    id: 'game-start-generic-3',
    category: 'game:start',
    priority: 'normal',
    text: 'I believe in you! Think carefully and trust your instincts.',
  },
  {
    id: 'game-start-generic-4',
    category: 'game:start',
    priority: 'normal',
    text: 'Game time! Remember: mathematicians make mistakes, then learn from them!',
  },

  // =====================
  // GAME END - WIN
  // =====================
  {
    id: 'win-first-1',
    category: 'game:end',
    priority: 'high',
    text: 'YOU WON YOUR FIRST {gameName} GAME! This calls for a celebration!',
    conditions: [{ type: 'playerWon', value: true }, { type: 'gamesPlayed', value: 1 }],
  },
  {
    id: 'win-streak-1',
    category: 'game:end',
    priority: 'high',
    text: "{winStreak} wins in a row at {gameName}! You're on fire!",
    conditions: [{ type: 'playerWon', value: true }, { type: 'winStreak', value: 3, operator: 'gte' }],
  },
  {
    id: 'win-generic-1',
    category: 'game:end',
    priority: 'normal',
    text: 'VICTORY! Your strategic thinking really paid off!',
    conditions: [{ type: 'playerWon', value: true }],
  },
  {
    id: 'win-generic-2',
    category: 'game:end',
    priority: 'normal',
    text: "Hoot hoot! Winner winner! That was some impressive play!",
    conditions: [{ type: 'playerWon', value: true }],
  },
  {
    id: 'win-generic-3',
    category: 'game:end',
    priority: 'normal',
    text: "Amazing! Your math brain is really showing off today!",
    conditions: [{ type: 'playerWon', value: true }],
  },
  {
    id: 'win-generic-4',
    category: 'game:end',
    priority: 'normal',
    text: "Brilliant moves! I knew you had it in you!",
    conditions: [{ type: 'playerWon', value: true }],
  },
  {
    id: 'win-generic-5',
    category: 'game:end',
    priority: 'normal',
    text: "Champion! Want to try for another win?",
    conditions: [{ type: 'playerWon', value: true }],
  },

  // =====================
  // GAME END - LOSS
  // =====================
  {
    id: 'loss-encouraging-1',
    category: 'game:end',
    priority: 'normal',
    text: "That was a tough game! Every loss teaches us something. Want another go?",
    conditions: [{ type: 'playerWon', value: false }],
  },
  {
    id: 'loss-encouraging-2',
    category: 'game:end',
    priority: 'normal',
    text: "Not this time, but I saw some great moves in there! Try again?",
    conditions: [{ type: 'playerWon', value: false }],
  },
  {
    id: 'loss-encouraging-3',
    category: 'game:end',
    priority: 'normal',
    text: "The best mathematicians learn the most from challenges. You've got this!",
    conditions: [{ type: 'playerWon', value: false }],
  },
  {
    id: 'loss-encouraging-4',
    category: 'game:end',
    priority: 'normal',
    text: "Close game! A few different moves and it could have been yours!",
    conditions: [{ type: 'playerWon', value: false }],
  },
  {
    id: 'loss-encouraging-5',
    category: 'game:end',
    priority: 'normal',
    text: "Remember: mistakes are proof that you're trying! Ready to try again?",
    conditions: [{ type: 'playerWon', value: false }],
  },

  // =====================
  // GAME END - DRAW
  // =====================
  {
    id: 'draw-1',
    category: 'game:end',
    priority: 'normal',
    text: "A draw! Both players matched wits perfectly. Impressive!",
  },
  {
    id: 'draw-2',
    category: 'game:end',
    priority: 'normal',
    text: "Tied game! That means you were evenly matched. Great job!",
  },

  // =====================
  // TUTORIAL START
  // =====================
  {
    id: 'tutorial-start-1',
    category: 'tutorial:start',
    priority: 'high',
    text: "Smart choice starting with the tutorial! I'll guide you through {gameName} step by step.",
  },
  {
    id: 'tutorial-start-2',
    category: 'tutorial:start',
    priority: 'high',
    text: "Learning mode activated! Let's discover how to play {gameName} together!",
  },

  // =====================
  // TUTORIAL COMPLETE
  // =====================
  {
    id: 'tutorial-complete-1',
    category: 'tutorial:complete',
    priority: 'high',
    text: "Tutorial complete! You now know how to play {gameName}. Time to put it into practice!",
  },
  {
    id: 'tutorial-complete-2',
    category: 'tutorial:complete',
    priority: 'high',
    text: "You've mastered the basics of {gameName}! Ready for a real game?",
  },

  // =====================
  // ACHIEVEMENT UNLOCK
  // =====================
  {
    id: 'achievement-unlock-1',
    category: 'achievement:unlock',
    priority: 'high',
    text: 'ACHIEVEMENT UNLOCKED! {achievementName}! You earned it!',
  },

  // =====================
  // STREAK UPDATE
  // =====================
  {
    id: 'streak-new-1',
    category: 'streak:update',
    priority: 'high',
    text: "Day {currentStreak} of your practice streak! You're building great habits!",
    conditions: [{ type: 'streak', value: 2, operator: 'eq' }],
  },
  {
    id: 'streak-week-1',
    category: 'streak:update',
    priority: 'high',
    text: 'ONE WEEK STREAK! 7 days of math practice! Incredible dedication!',
    conditions: [{ type: 'streak', value: 7, operator: 'eq' }],
  },
  {
    id: 'streak-record-1',
    category: 'streak:update',
    priority: 'high',
    text: "NEW PERSONAL RECORD! {currentStreak} days! You've never gone this long before!",
  },

  // =====================
  // STREAK BROKEN
  // =====================
  {
    id: 'streak-broken-1',
    category: 'streak:broken',
    priority: 'normal',
    text: "Your streak reset, but that's okay! Today is a fresh start. Let's build a new one!",
  },
  {
    id: 'streak-broken-2',
    category: 'streak:broken',
    priority: 'normal',
    text: "Missed a day? No worries! The most important thing is you're here now!",
  },

  // =====================
  // MILESTONES
  // =====================
  {
    id: 'milestone-games-10',
    category: 'milestone:reached',
    priority: 'high',
    text: "10 games played! You're really getting into Math Pentathlon!",
  },
  {
    id: 'milestone-games-50',
    category: 'milestone:reached',
    priority: 'high',
    text: '50 games! You are officially a Math Pentathlon enthusiast!',
  },
  {
    id: 'milestone-games-100',
    category: 'milestone:reached',
    priority: 'high',
    text: '100 GAMES! You are a Math Pentathlon LEGEND!',
  },
];

class OwlMessageManager {
  private messages: OwlMessage[] = MESSAGE_LIBRARY;

  // Select a message based on event type and context
  selectMessage(eventType: OwlEventType, context: MessageContext): OwlMessage | null {
    // Filter messages by category
    const categoryMessages = this.messages.filter((m) => m.category === eventType);

    if (categoryMessages.length === 0) {
      return null;
    }

    // Find messages that match conditions
    const matchingMessages = categoryMessages.filter((m) => this.matchesConditions(m, context));

    if (matchingMessages.length === 0) {
      // Fall back to messages without conditions
      const fallbackMessages = categoryMessages.filter((m) => !m.conditions || m.conditions.length === 0);
      if (fallbackMessages.length === 0) return null;
      return this.selectAndFormat(fallbackMessages, context);
    }

    return this.selectAndFormat(matchingMessages, context);
  }

  // Check if a message matches all its conditions
  private matchesConditions(message: OwlMessage, context: MessageContext): boolean {
    if (!message.conditions || message.conditions.length === 0) {
      return true;
    }

    return message.conditions.every((condition) => this.checkCondition(condition, context));
  }

  // Check a single condition
  private checkCondition(condition: MessageCondition, context: MessageContext): boolean {
    switch (condition.type) {
      case 'timeOfDay':
        return context.timeOfDay === condition.value;

      case 'streak':
        return this.compareNumber(context.currentStreak || 0, condition.value as number, condition.operator);

      case 'gamesPlayed':
        return this.compareNumber(context.gamesPlayedThisGame || 0, condition.value as number, condition.operator);

      case 'firstTime':
        return (context.gamesPlayedThisGame || 0) === 0 === condition.value;

      case 'winStreak':
        return this.compareNumber(context.winStreak || 0, condition.value as number, condition.operator);

      case 'playerWon':
        return context.playerWon === condition.value;

      default:
        return true;
    }
  }

  // Compare numbers with operator
  private compareNumber(actual: number, expected: number, operator?: string): boolean {
    switch (operator) {
      case 'eq':
        return actual === expected;
      case 'gt':
        return actual > expected;
      case 'lt':
        return actual < expected;
      case 'gte':
        return actual >= expected;
      case 'lte':
        return actual <= expected;
      default:
        return actual === expected;
    }
  }

  // Select a random message and format it
  private selectAndFormat(messages: OwlMessage[], context: MessageContext): OwlMessage {
    // Prioritize high priority messages
    const highPriority = messages.filter((m) => m.priority === 'high');
    const pool = highPriority.length > 0 ? highPriority : messages;

    // Filter out recently seen messages if possible
    const unseenMessages = pool.filter((m) => !storage.hasSeenMessage(m.id));
    const finalPool = unseenMessages.length > 0 ? unseenMessages : pool;

    // Random selection
    const selected = finalPool[Math.floor(Math.random() * finalPool.length)];

    // Format message with context
    return {
      ...selected,
      text: this.formatMessage(selected.text, context),
    };
  }

  // Replace placeholders in message text
  private formatMessage(text: string, context: MessageContext): string {
    return text
      .replace(/{playerName}/g, context.playerName || 'friend')
      .replace(/{gameName}/g, context.gameName || 'this game')
      .replace(/{currentStreak}/g, String(context.currentStreak || 0))
      .replace(/{winStreak}/g, String(context.winStreak || 0))
      .replace(/{totalGamesPlayed}/g, String(context.totalGamesPlayed || 0));
  }

  // Add custom messages (for game-specific messages)
  addMessage(message: OwlMessage): void {
    this.messages.push(message);
  }

  // Get all messages for a category (for testing/debugging)
  getMessagesByCategory(category: OwlEventType): OwlMessage[] {
    return this.messages.filter((m) => m.category === category);
  }
}

// Singleton instance
export const owlMessages = new OwlMessageManager();
