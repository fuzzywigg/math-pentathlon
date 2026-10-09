# AGENTS.md — math-pentathlon

parent_governance: github.com/fuzzywigg/agents-governance

## Classification
- Tier: A=Active Strategic
- Autonomy: L2=Standard
- Stack: TypeScript, CSS

## Purpose
Math Pentathlon games platform — interactive educational math games and competition tools built with TypeScript. Primary branch is `alpha` (active development).

## Safe Agent Actions
- Update documentation and game copy
- Add or improve tests
- Fix UI/CSS styling issues
- Non-breaking dependency updates

## Local verify
Before opening or updating a draft PR, run `npm run verify` (CI lint-job order: `lint` → `lint:ratchet` → `format:check` → `typecheck` → `typecheck:ratchet` → `check:boundaries`). Then run `npm run test:unit` (and build/e2e as needed). Do not skip Prettier or ratchets — drafts that fail these gates waste tip-owner time.

## Escalate to Human
- Production deploys or branch promotions (alpha → main)
- Game mechanic or scoring logic changes
- Schema/data model changes
- Any changes affecting student-facing scoring or records
