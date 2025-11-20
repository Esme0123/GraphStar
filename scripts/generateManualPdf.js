const fs = require('fs');
const path = require('path');

(async () => {
  const puppeteer = require('puppeteer');
  const manuals = [
    { name: 'Kruskal', file: 'Kruskal_Manual' },
    { name: 'NorthWest', file: 'NorthWest_Manual' },
    { name: 'Dijkstra', file: 'Dijkstra_Manual' },
  ];

  manuals.forEach(({ name, file }) => {
    const htmlPath = path.resolve(__dirname, `../public/manuals/${file}.html`);
    if (!fs.existsSync(htmlPath)) {
      console.error(`No se encontró el HTML de ${name} en:`, htmlPath);
      process.exit(1);
    }
  });

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  for (const { name, file } of manuals) {
    const htmlPath = path.resolve(__dirname, `../public/manuals/${file}.html`);
    const pdfPath = path.resolve(__dirname, `../public/manuals/${file}.pdf`);
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm' },
    });
    console.log(`PDF ${name} generado en:`, pdfPath);
  }

  await browser.close();
})();
