/**
 * Tiny fixture for hermetic --fail / reportOnly coverage (q-mp-1457).
 * Not under tests/ — tip walks never see this file.
 */
it('pins Coming Soon for fail-mode assertions', () => {
  const badge = document.querySelector('.game-card-badge');
  expect(badge?.textContent).toBe('Coming Soon');
});
