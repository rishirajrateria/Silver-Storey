const { chromium } = require('playwright');
const [,, input, output] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + input, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: output, format: 'A4', printBackground: true, preferCSSPageSize: true, margin: {top:0,right:0,bottom:0,left:0} });
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
