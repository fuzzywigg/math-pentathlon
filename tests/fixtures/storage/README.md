# Storage golden fixtures (burn-1008-mp-save-migration)

On-disk save shapes reconstructed from git history of the serializers.

## Provenance

| Fixture | Source |
| --- | --- |
| `progress/v1-canonical-full.json` | Current `ProgressData` at `CURRENT_DATA_VERSION` (1), matching `createDefaultProgress` field set from commit `173e03d6` (storage birth) through tip |
| `progress/v0-sparse-pre-settings.json` | Sparse blob accepted by original `ensureDefaults` (`\|\|` fallbacks in `173e03d6` storage.ts): `version: 0`, profile + one gameStats entry, no settings/owl/streak |
| `progress/v0-full-fields.json` | Full field set written with `version: 0` (migrate stamp path) |
| `progress/missing-version-partial-settings.json` | No `version` key; only partial `settings` (historical import / hand-edited shape) |
| `progress/wrong-typed-fields.json` | Parseable object with wrong-typed nested fields (pre-sanitize defensive path) |
| `progress/hostile-profile-control-chars.json` | Profile strings with control chars / oversized avatar (post-#514 sanitize) |
| `progress/non-object-root.json` | JSON array root — rejected, fresh defaults |
| `progress/truncated-object.txt` | Truncated JSON — rejected, fresh defaults |
| `kings/v1-midgame.json` | Kings & Quadraphages `SerializedGameState` at `SAVE_VERSION` 1 (export serializer; not localStorage) |
| `kings/v0-unsupported.json` | Same shape with `version: 0` — must reject (throw), not silently corrupt |

## Persisted localStorage keys (runtime)

See PR body / `src/core/storage` + feature-flag modules. IndexedDB is unused.
