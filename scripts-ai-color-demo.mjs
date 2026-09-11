import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('/opt/cursor/artifacts/screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
async function startMode(modeLabel) {
  await page.click('#new-game-btn');
  await page.waitForFunction(() => !document.getElementById('new-game-modal')?.classList.contains('hidden'));
  await page.locator('.mode-option', { hasText: modeLabel }).click();
  await page.click('#start-game-btn');
  await page.waitForFunction(() => document.getElementById('new-game-modal')?.classList.contains('hidden'));
  await page.waitForTimeout(300);
}
await page.goto('http://127.0.0.1:5173/#/game/kings-quadraphages');
await page.waitForSelector('#board .cell');
await startMode('Play vs AI');
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/kings-vs-ai-purple.png', fullPage: false });
await startMode('2 Player');
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/kings-2p-blue-red.png', fullPage: false });
await browser.close();
console.log('screenshots updated');
