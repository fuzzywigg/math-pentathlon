// Storage module exports
export { storage, PROGRESS_STORAGE_KEY } from './storage';
export * from './types';
export {
  ensureProgressDefaults,
  migrateProgressData,
  normalizeLoadedProgress,
  isPlainProgressObject,
} from './migrate';
export {
  sanitizeProfile,
  sanitizeDisplayString,
  sanitizeSettings,
  MAX_PROFILE_NAME_LENGTH,
} from './sanitize';
