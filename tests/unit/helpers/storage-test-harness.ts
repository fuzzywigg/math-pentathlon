/**
 * Shared harness for StorageManager singleton tests.
 * createDefaultProgress shallow-copies DEFAULT_OWL_STATE, so messagesSeen /
 * tutorialsCompleted arrays are shared — sanitize them between cases.
 */
import { storage, DEFAULT_OWL_STATE } from '../../../src/core/storage';

export function resetStorageHarness(): void {
  DEFAULT_OWL_STATE.messagesSeen.length = 0;
  DEFAULT_OWL_STATE.tutorialsCompleted.length = 0;
  localStorage.clear();
  storage.resetAll();
}
