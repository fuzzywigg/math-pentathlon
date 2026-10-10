/**
 * q-mp-663 — Close `router` residual branch gap at getPathParams L68 (tests-only).
 *
 * Spec glob `tests/unit/*router*` measures **90%** branches (9/10) with line 68
 * listed uncovered: the `value !== undefined` else arm never runs because live
 * `:param` patterns always emit a defined capture. Force a truthy match with an
 * undefined capture slot via `String.prototype.match` spy — structural only.
 * No src / copy / ratchet edits. Leave older soft-fail `#422` alone (contained).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getPathParams } from '../../src/core/router';

function matchWithCaptures(
  full: string,
  ...captures: Array<string | undefined>
): RegExpMatchArray {
  return Object.assign([full, ...captures], {
    index: 0,
    input: full,
    groups: undefined,
  }) as unknown as RegExpMatchArray;
}

describe('q-mp-663 router — getPathParams undefined-capture residual', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('skips assigning a param when its capture group is undefined (L68 else)', () => {
    const spy = vi
      .spyOn(String.prototype, 'match')
      .mockReturnValue(matchWithCaptures('/game/hex', undefined));

    expect(getPathParams('/game/:id', '/game/hex')).toEqual({});
    expect(spy).toHaveBeenCalled();
  });

  it('keeps defined captures and skips only undefined slots (mixed arms)', () => {
    vi.spyOn(String.prototype, 'match').mockReturnValue(
      matchWithCaptures('/g/x/y', 'x', undefined)
    );

    expect(getPathParams('/g/:a/:b', '/g/x/y')).toEqual({ a: 'x' });
  });

  it('still maps a normal live match without the spy (true arm stays green)', () => {
    expect(getPathParams('/game/:id', '/game/hex')).toEqual({ id: 'hex' });
    expect(getPathParams('/g/:a/:b', '/g/x')).toEqual({});
  });
});
