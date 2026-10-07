import { chromium } from '@playwright/test';
const BASE = 'http://127.0.0.1:5173';
const GAMES = [
  'hex','calla','contig-60','juggle','fab-a-diffy','sum-dominoes','par-55',
  'ramrod','stars-bars','frac-fact','fraction-pinball','remainder-islands'
];
const browser = await chromium.launch({ headless: true });
const results = [];
for (const id of GAMES) {
  const page = await browser.newPage();
  const msgs = [];
  page.on('console', m => { if (m.type()==='error'||m.type()==='warning') msgs.push({type:m.type(),text:m.text()}); });
  page.on('pageerror', e => msgs.push({type:'pageerror',text:String(e)}));
  await page.addInitScript(() => {
    window.__r = [];
    window.addEventListener('unhandledrejection', e => window.__r.push(String(e.reason)));
  });
  try {
    await page.goto(`${BASE}/#/game/${id}`);
    await page.getByTestId('game-loading').waitFor({state:'hidden',timeout:15000}).catch(()=>{});
    await page.locator('#new-game-btn').click();
    await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
    const easy = page.locator('.difficulty-btn.easy');
    if (await easy.isVisible().catch(()=>false)) await easy.click();
    await page.locator('#start-game-btn').click();
    await page.waitForTimeout(200);
    // quick human action if obvious
    const clickables = page.locator('.hex-cell-group, .calla-pit-valid, .contig-roll-btn, .juggle-roll-btn, .fab-bar-wrapper, .sd-roll-btn, .par55-hand-block.clickable, .ramrod-rod-wrapper.selectable, .stars-card:not(.disabled), .frac-choice-btn, .pinball-choice-btn, .remainder-btn-roll');
    if (await clickables.first().isVisible().catch(()=>false)) {
      await clickables.first().click({force:true}).catch(()=>{});
    }
    await page.waitForTimeout(100); // mid-AI
    await page.goto(`${BASE}/#/`);
    await page.waitForTimeout(1500); // let stale timers fire
    const rej = await page.evaluate(() => window.__r || []);
    results.push({id, msgs, rej});
    console.log(id, 'msgs', msgs.length, 'rej', rej.length, msgs.slice(0,3));
  } catch (e) {
    results.push({id, fatal: String(e)});
    console.log(id, 'FATAL', e.message);
  }
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
