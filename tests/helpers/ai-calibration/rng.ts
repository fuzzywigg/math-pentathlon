/**
 * AI-calibration RNG entrypoint — re-exports the shared test RNG helpers.
 */
export {
  withSeededRandom,
  installSeededRandom,
  plySeed,
  pickRandom,
  createSeededRng,
  mulberry32,
} from '../rng';
