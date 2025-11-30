/**
 * Timer Logic
 * Countdown and count-up timer functionality
 */

import type { TimerConfig, TimerInstance, TimerDisplayOptions } from './types';
import { DEFAULT_TIMER_CONFIG, DEFAULT_TIMER_DISPLAY } from './types';

/**
 * Create a new timer instance
 */
export function createTimer(config: Partial<TimerConfig> = {}): TimerInstance {
  const fullConfig: TimerConfig = { ...DEFAULT_TIMER_CONFIG, ...config };

  return {
    config: fullConfig,
    state: 'stopped',
    elapsed: 0,
    remaining: fullConfig.initialTime,
    startTime: null,
    pauseTime: null,
    intervalId: null,
  };
}

/**
 * Start or resume a timer
 */
export function startTimer(timer: TimerInstance): TimerInstance {
  if (timer.state === 'running') {
    return timer;
  }

  const now = Date.now();
  let startTime = now;

  // If resuming from pause, adjust start time
  if (timer.state === 'paused' && timer.pauseTime !== null) {
    const pauseDuration = now - timer.pauseTime;
    startTime = (timer.startTime ?? now) + pauseDuration;
  }

  const newTimer: TimerInstance = {
    ...timer,
    state: 'running',
    startTime,
    pauseTime: null,
  };

  // Start the tick interval
  const tickInterval = timer.config.tickInterval ?? 100;
  const intervalId = window.setInterval(() => {
    tickTimer(newTimer);
  }, tickInterval);

  newTimer.intervalId = intervalId;

  return newTimer;
}

/**
 * Pause a running timer
 */
export function pauseTimer(timer: TimerInstance): TimerInstance {
  if (timer.state !== 'running') {
    return timer;
  }

  // Clear the interval
  if (timer.intervalId !== null) {
    clearInterval(timer.intervalId);
  }

  return {
    ...timer,
    state: 'paused',
    pauseTime: Date.now(),
    intervalId: null,
  };
}

/**
 * Stop and reset a timer
 */
export function stopTimer(timer: TimerInstance): TimerInstance {
  // Clear the interval
  if (timer.intervalId !== null) {
    clearInterval(timer.intervalId);
  }

  return {
    ...timer,
    state: 'stopped',
    elapsed: 0,
    remaining: timer.config.initialTime,
    startTime: null,
    pauseTime: null,
    intervalId: null,
  };
}

/**
 * Reset timer to initial state without stopping callbacks
 */
export function resetTimer(timer: TimerInstance): TimerInstance {
  const wasRunning = timer.state === 'running';
  const stopped = stopTimer(timer);

  if (wasRunning) {
    return startTimer(stopped);
  }

  return stopped;
}

/**
 * Internal tick function - updates timer state
 */
function tickTimer(timer: TimerInstance): void {
  if (timer.state !== 'running' || timer.startTime === null) {
    return;
  }

  const now = Date.now();
  const newElapsed = now - timer.startTime;

  timer.elapsed = newElapsed;

  if (timer.config.direction === 'down') {
    timer.remaining = Math.max(0, timer.config.initialTime - newElapsed);

    // Check thresholds
    const { warningThreshold, criticalThreshold } = timer.config;

    if (criticalThreshold && timer.remaining <= criticalThreshold && timer.remaining > 0) {
      timer.config.onCritical?.();
    } else if (warningThreshold && timer.remaining <= warningThreshold && timer.remaining > criticalThreshold!) {
      timer.config.onWarning?.();
    }

    // Check completion
    if (timer.remaining === 0) {
      timer.config.onComplete?.();
      if (timer.intervalId !== null) {
        clearInterval(timer.intervalId);
        timer.intervalId = null;
      }
      timer.state = 'stopped';
    }
  } else {
    timer.remaining = newElapsed; // For count-up, remaining is just elapsed
  }

  // Call tick callback
  timer.config.onTick?.(timer.config.direction === 'down' ? timer.remaining : timer.elapsed);
}

/**
 * Get current timer value in milliseconds
 */
export function getTimerValue(timer: TimerInstance): number {
  if (timer.config.direction === 'down') {
    return timer.remaining;
  }
  return timer.elapsed;
}

/**
 * Check if timer is in warning state
 */
export function isTimerWarning(timer: TimerInstance): boolean {
  if (timer.config.direction !== 'down') return false;
  const { warningThreshold, criticalThreshold } = timer.config;
  if (!warningThreshold) return false;

  return timer.remaining <= warningThreshold && timer.remaining > (criticalThreshold ?? 0);
}

/**
 * Check if timer is in critical state
 */
export function isTimerCritical(timer: TimerInstance): boolean {
  if (timer.config.direction !== 'down') return false;
  const { criticalThreshold } = timer.config;
  if (!criticalThreshold) return false;

  return timer.remaining <= criticalThreshold && timer.remaining > 0;
}

/**
 * Check if timer has completed
 */
export function isTimerComplete(timer: TimerInstance): boolean {
  if (timer.config.direction !== 'down') return false;
  return timer.remaining === 0 && timer.elapsed > 0;
}

/**
 * Add time to a timer (for bonuses, penalties, etc.)
 */
export function addTime(timer: TimerInstance, milliseconds: number): TimerInstance {
  if (timer.config.direction === 'down') {
    return {
      ...timer,
      remaining: Math.max(0, timer.remaining + milliseconds),
    };
  }
  // For count-up, adding time doesn't make sense in the same way
  return timer;
}

/**
 * Set timer to a specific value
 */
export function setTimerValue(timer: TimerInstance, milliseconds: number): TimerInstance {
  if (timer.config.direction === 'down') {
    return {
      ...timer,
      remaining: Math.max(0, milliseconds),
      config: {
        ...timer.config,
        initialTime: milliseconds,
      },
    };
  }
  return timer;
}

/**
 * Format time in milliseconds to display string
 */
export function formatTime(
  milliseconds: number,
  options: TimerDisplayOptions = DEFAULT_TIMER_DISPLAY
): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10); // Show centiseconds

  let result = '';

  if (options.padMinutes) {
    result += String(minutes).padStart(2, '0');
  } else {
    result += String(minutes);
  }

  result += options.separator;

  if (options.padSeconds) {
    result += String(seconds).padStart(2, '0');
  } else {
    result += String(seconds);
  }

  if (options.showMilliseconds) {
    result += '.' + String(ms).padStart(2, '0');
  }

  return result;
}

/**
 * Parse time string to milliseconds
 */
export function parseTime(timeString: string): number {
  const parts = timeString.split(':');

  if (parts.length === 2) {
    // MM:SS format
    const [minutes, secondsPart] = parts;
    const [seconds, ms] = secondsPart.split('.');
    return (
      parseInt(minutes, 10) * 60000 +
      parseInt(seconds, 10) * 1000 +
      (ms ? parseInt(ms, 10) * 10 : 0)
    );
  } else if (parts.length === 3) {
    // HH:MM:SS format
    const [hours, minutes, secondsPart] = parts;
    const [seconds, ms] = secondsPart.split('.');
    return (
      parseInt(hours, 10) * 3600000 +
      parseInt(minutes, 10) * 60000 +
      parseInt(seconds, 10) * 1000 +
      (ms ? parseInt(ms, 10) * 10 : 0)
    );
  }

  return parseInt(timeString, 10) || 0;
}

/**
 * Create a simple countdown timer with callback
 */
export function countdown(
  durationMs: number,
  onTick: (remaining: number) => void,
  onComplete: () => void
): { stop: () => void; pause: () => void; resume: () => void } {
  let timer = createTimer({
    direction: 'down',
    initialTime: durationMs,
    onTick,
    onComplete,
  });

  timer = startTimer(timer);

  return {
    stop: () => {
      timer = stopTimer(timer);
    },
    pause: () => {
      timer = pauseTimer(timer);
    },
    resume: () => {
      timer = startTimer(timer);
    },
  };
}

/**
 * Create a simple stopwatch (count-up timer)
 */
export function stopwatch(
  onTick: (elapsed: number) => void
): { stop: () => number; pause: () => void; resume: () => void; lap: () => number } {
  let timer = createTimer({
    direction: 'up',
    initialTime: 0,
    onTick,
  });

  timer = startTimer(timer);
  const laps: number[] = [];

  return {
    stop: () => {
      const elapsed = timer.elapsed;
      timer = stopTimer(timer);
      return elapsed;
    },
    pause: () => {
      timer = pauseTimer(timer);
    },
    resume: () => {
      timer = startTimer(timer);
    },
    lap: () => {
      const lapTime = timer.elapsed - (laps[laps.length - 1] ?? 0);
      laps.push(timer.elapsed);
      return lapTime;
    },
  };
}

/**
 * Get percentage of time remaining/elapsed
 */
export function getTimerProgress(timer: TimerInstance): number {
  if (timer.config.initialTime === 0) return 0;

  if (timer.config.direction === 'down') {
    return (timer.remaining / timer.config.initialTime) * 100;
  }
  return Math.min((timer.elapsed / timer.config.initialTime) * 100, 100);
}
