# 🦉 Ollie the Owl - AI Mascot System Roadmap

## Executive Summary

This roadmap outlines the implementation of "Ollie the Owl", an AI mascot system designed to increase student engagement, provide personalized encouragement, and gamify the Math Pentathlon practice experience. The system will integrate with our existing 20-game architecture to provide persistent progress tracking, adaptive messaging, achievements, and reward mini-games.

**Timeline**: 6-8 weeks for MVP, 10-12 weeks for full feature set
**Priority**: High - Student engagement is critical for learning outcomes

---

## Current Architecture Assessment

### ✅ What EXISTS (We Can Build On)

| Component | Location | Integration Points |
|-----------|----------|-------------------|
| **20 Complete Games** | `src/games/*/game-controller.ts` | Game start/end hooks, move events |
| **Tutorial System** | `src/core/tutorial.ts` | Message overlay patterns, step-by-step guidance |
| **Game Registry** | `src/core/game-registry.ts` | Game metadata, difficulty levels, divisions |
| **Router** | `src/core/router.ts` | Navigation events, page transitions |
| **AI Opponents** | `src/games/kings-quadraphages/ai.ts` | Difficulty adaptation patterns |
| **Modern UI** | `src/style.css` | Design tokens, animations, CSS patterns |

### ❌ What's MISSING (We Need to Build)

| Component | Priority | Complexity |
|-----------|----------|------------|
| **LocalStorage Persistence** | P0 | Low |
| **Player Profile System** | P0 | Medium |
| **Owl UI Component** | P0 | Medium |
| **Owl Message System** | P0 | Medium |
| **Achievement System** | P1 | Medium |
| **Cross-Game Statistics** | P1 | Medium |
| **Streak Tracking** | P1 | Low |
| **Mini-Games** | P2 | High |
| **Progress Dashboard** | P2 | Medium |

---

## Phase 1: Foundation (Weeks 1-2)

### 1.1 Persistence Layer

**Files to Create:**
- `src/core/storage/storage.ts` - LocalStorage wrapper with versioning
- `src/core/storage/types.ts` - TypeScript interfaces for stored data

**Data Structure:**
```typescript
interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  lastActiveAt: number;
}

interface GameStats {
  gameId: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalPlayTime: number; // seconds
  bestStreak: number;
  lastPlayed: number;
}

interface OwlState {
  mood: 'happy' | 'encouraging' | 'celebrating' | 'thinking';
  lastInteraction: number;
  messagesSeen: string[]; // Prevent repeats
  tutorialsCompleted: string[];
}

interface ProgressData {
  currentStreak: number;
  lastStreakDate: string; // YYYY-MM-DD
  totalGamesPlayed: number;
  totalTimeSpent: number;
  achievements: string[];
  gameStats: Record<string, GameStats>;
  owlState: OwlState;
}
```

**Key Functions:**
- `loadProfile(): PlayerProfile | null`
- `saveProfile(profile: PlayerProfile): void`
- `getProgress(): ProgressData`
- `updateGameStats(gameId: string, result: GameResult): void`
- `checkStreak(): { current: number; isNewDay: boolean }`

### 1.2 Owl UI Component

**Files to Create:**
- `src/ui/owl/owl.ts` - Main Owl component
- `src/ui/owl/owl-messages.ts` - Message content library
- `src/ui/owl/owl-animations.ts` - Animation states

**Owl Visual States:**
```
🦉 Default (idle) - Subtle breathing animation
🎉 Celebrating - Bouncing, confetti effect
🤔 Thinking - Head tilt, eye blink
💪 Encouraging - Wing pump animation
😴 Sleepy - Eyes droopy (long absence)
```

**Owl Positions:**
- Bottom-right corner (floating, collapsible)
- Tutorial integration (replaces generic tooltip speaker)
- Game end celebrations (center screen modal)

### 1.3 Message System

**Message Categories:**
1. **Welcome Messages** - First visit, return after absence
2. **Game Start** - Per-game encouragement
3. **During Play** - Subtle hints (optional, AI-difficulty aware)
4. **Win Messages** - Celebratory, specific to game
5. **Loss Messages** - Encouraging, growth-mindset focused
6. **Streak Messages** - Daily streak updates
7. **Achievement Unlocks** - Special celebration

**Message Selection Logic:**
- Context-aware (game, time of day, player history)
- No repeat messages within session
- Difficulty-adaptive (simpler for younger divisions)

---

## Phase 2: Game Integration (Weeks 3-4)

### 2.1 Game Controller Hooks

**Modify all 20 game controllers** to emit events:

```typescript
// Add to each game-controller.ts
import { owlSystem } from '../core/owl/owl-system';

// On game start
owlSystem.onGameStart(gameId, playerProfile);

// On game end
owlSystem.onGameEnd(gameId, {
  winner: 'player1' | 'player2' | 'ai' | 'draw',
  duration: number,
  moveCount: number,
});

// Optional: On significant moves
owlSystem.onNotableEvent('first_capture', gameId);
```

**Games to Integrate (All 20):**

| Division I | Division II | Division III | Division IV |
|------------|-------------|--------------|--------------|
| kings-quadraphages | sum-dominoes | juggle | prime-gold |
| hex | par-55 | contig-60 | remainder-islands |
| star-track | ramrod | stars-bars | pent-em-in |
| hex-a-gone | kwatro-sinko | fab-a-diffy | frac-fact |
| calla | fiar | queens-guards | fraction-pinball |

### 2.2 Tutorial-Owl Integration

**Modify `src/core/tutorial.ts`:**
- Replace generic tooltip with Owl character
- Owl "speaks" the tutorial messages
- Add voice bubbles with Owl avatar

```typescript
// Tutorial step with Owl personality
interface OwlTutorialStep extends TutorialStep {
  owlMood?: 'explaining' | 'encouraging' | 'celebrating';
  owlAnimation?: string;
}
```

### 2.3 Statistics Tracking

**Track per-game metrics:**
- Win/loss ratio
- Average game duration
- Improvement over time
- Preferred games (time spent)
- Division progress (how many games played in each)

---

## Phase 3: Rewards & Mini-Games (Weeks 5-6)

### 3.1 Achievement System

**Files to Create:**
- `src/core/achievements/achievements.ts`
- `src/core/achievements/achievement-definitions.ts`

**Achievement Categories:**

**🌟 Getting Started**
- First Game Played
- First Win
- Try All Division I Games
- Complete a Tutorial

**🔥 Streak Achievements**
- 3-Day Streak
- 7-Day Streak
- 30-Day Streak

**🎮 Game Mastery (per game)**
- Play 10 games
- Win 5 games
- Win 3 in a row

**🏆 Division Champions**
- Play all Division I games
- Play all Division II games
- Play all Division III games
- Play all Division IV games
- Complete ALL 20 games (at least once)

**🦉 Owl Friendship**
- See 10 Owl messages
- Complete 5 tutorials with Owl
- Play for 1 hour total

### 3.2 Mini-Games System

**Purpose**: Quick 1-2 minute dopamine-hit games as rewards for achievements

**Files to Create:**
- `src/mini-games/star-match/` - Number matching game
- `src/mini-games/quick-math/` - Speed arithmetic
- `src/mini-games/memory-grid/` - Pattern memory

**Star Match Game (Priority 1):**
Based on React Star Match (adapted to vanilla TypeScript):
- 9 numbered stars (1-9)
- Pick combinations that sum to target
- Timer-based scoring
- Simple, addictive, math-reinforcing

**When Mini-Games Unlock:**
- After 5-game streak
- On achievement unlock
- As daily bonus (once per day)
- After completing a tutorial

### 3.3 Streak System

**Daily Streak Logic:**
```typescript
function checkStreak(lastDate: string, today: string): StreakResult {
  const last = new Date(lastDate);
  const now = new Date(today);
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { type: 'same_day', streak: current };
  if (diffDays === 1) return { type: 'continued', streak: current + 1 };
  return { type: 'broken', streak: 1 }; // Reset
}
```

**Streak Rewards:**
- Day 3: Unlock first mini-game
- Day 7: Special Owl animation
- Day 14: Unlock second mini-game
- Day 30: Golden Owl badge

---

## Phase 4: Polish & Dashboard (Weeks 7-8)

### 4.1 Progress Dashboard

**Files to Create:**
- `src/ui/dashboard/dashboard.ts`
- `src/ui/dashboard/stats-display.ts`
- `src/ui/dashboard/achievement-gallery.ts`

**Dashboard Sections:**
1. **Player Card** - Avatar, name, total playtime
2. **Streak Display** - Current streak, calendar heatmap
3. **Division Progress** - Visual bars for each division
4. **Recent Games** - Last 5 games with results
5. **Achievements** - Earned badges, progress to next
6. **Owl Corner** - Owl's current mood, favorite message

### 4.2 Profile Customization

**Avatar Options:**
- 8-10 preset avatars (math-themed)
- Color themes for UI
- Owl "costumes" (unlockable)

### 4.3 Accessibility & Polish

- Reduce motion option for animations
- High contrast mode
- Screen reader support for Owl messages
- Owl message toggle (for focus mode)

---

## Technical Implementation Details

### File Structure

```
src/
├── core/
│   ├── storage/
│   │   ├── storage.ts          # LocalStorage wrapper
│   │   └── types.ts            # Data interfaces
│   ├── owl/
│   │   ├── owl-system.ts       # Main Owl controller
│   │   ├── owl-messages.ts     # Message library
│   │   └── owl-events.ts       # Event types
│   ├── achievements/
│   │   ├── achievements.ts     # Achievement checker
│   │   └── definitions.ts      # All achievements
│   └── streaks/
│       └── streak-tracker.ts   # Streak logic
├── ui/
│   ├── owl/
│   │   ├── owl-component.ts    # Visual component
│   │   ├── owl-bubble.ts       # Speech bubble
│   │   └── owl.css             # Owl styles
│   └── dashboard/
│       ├── dashboard.ts        # Main dashboard
│       └── dashboard.css       # Dashboard styles
└── mini-games/
    ├── star-match/
    │   ├── game.ts             # Game logic
    │   ├── ui.ts               # UI rendering
    │   └── star-match.css      # Styles
    └── quick-math/
        └── ...
```

### Integration Points (Game Controllers)

Each of the 20 game controllers needs these additions:

```typescript
// At game start
private startGame(): void {
  this.gameStartTime = Date.now();
  owlSystem.emit('game:start', { gameId: this.gameId });
  // ... existing code
}

// At game end
private endGame(winner: Player): void {
  const duration = Date.now() - this.gameStartTime;
  owlSystem.emit('game:end', {
    gameId: this.gameId,
    winner,
    duration,
    moveCount: this.moveHistory.length,
  });
  // ... existing code
}
```

### CSS Integration

Add to `src/style.css`:
```css
/* Owl System Design Tokens */
--owl-primary: #8B5CF6;
--owl-secondary: #F59E0B;
--owl-bubble-bg: #FEFCE8;
--owl-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
```

---

## Milestone Checklist

### Week 1-2: Foundation ✅ MVP
- [ ] LocalStorage persistence layer
- [ ] Player profile creation (name, avatar)
- [ ] Basic Owl UI component (floating, collapsible)
- [ ] 10 welcome/encouragement messages
- [ ] Session statistics tracking

### Week 3-4: Integration
- [ ] Hook Owl into all 20 game controllers
- [ ] Per-game custom messages (60 total: 3 per game)
- [ ] Win/loss tracking per game
- [ ] Tutorial-Owl integration
- [ ] Game end celebrations

### Week 5-6: Rewards
- [ ] Achievement system (20 achievements)
- [ ] Streak tracking and display
- [ ] Star Match mini-game
- [ ] Achievement unlock animations
- [ ] Daily streak notifications

### Week 7-8: Polish
- [ ] Progress dashboard
- [ ] Avatar customization
- [ ] Cross-game statistics
- [ ] Accessibility features
- [ ] Performance optimization

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| LocalStorage limits (5MB) | Compress old data, purge old message history |
| Too many messages annoy users | Add "quiet mode" toggle, smart frequency |
| Performance on low-end devices | Lazy load Owl, reduce animations option |
| Message repetition | Track seen messages, large message pool |

---

## Success Metrics

1. **Engagement**: Return rate (day 1, day 7, day 30)
2. **Completion**: % of users who play all 20 games
3. **Retention**: Average streak length
4. **Satisfaction**: Owl message interactions (dismissal rate)

---

## Dependencies

- No external libraries required (pure TypeScript)
- Leverages existing tutorial overlay patterns
- Uses existing CSS design token system
- Compatible with current router and game architecture

---

## Next Steps

1. **Approve this roadmap** ✓
2. **Begin Phase 1**: Create storage layer and basic Owl component
3. **User testing**: Get feedback on Owl personality/frequency
4. **Iterate**: Adjust based on real usage patterns

---

*This roadmap is designed to be modular - each phase delivers value independently. MVP (Weeks 1-4) provides core engagement features. Full implementation (Weeks 5-8) adds gamification depth.*
