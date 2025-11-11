const fs = require('fs');
const path = require('path');

(async () => {
  const puppeteer = require('puppeteer');
  const kruskalHtmlPath = path.resolve(__dirname, '../public/manuals/Kruskal_Manual.html');
  const kruskalPdfPath = path.resolve(__dirname, '../public/manuals/Kruskal_Manual.pdf');
  const northwestHtmlPath = path.resolve(__dirname, '../public/manuals/NorthWest_Manual.html');
  const northwestPdfPath = path.resolve(__dirname, '../public/manuals/NorthWest_Manual.pdf');

  if (!fs.existsSync(kruskalHtmlPath)) {
    console.error('No se encontró el HTML de Kruskal en:', kruskalHtmlPath);
    process.exit(1);
  }
  if (!fs.existsSync(northwestHtmlPath)) {
    console.error('No se encontró el HTML de NorthWest en:', northwestHtmlPath);
    process.exit(1);
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  // Generar PDF de Kruskal
  const page = await browser.newPage();
  await page.goto('file://' + kruskalHtmlPath, { waitUntil: 'networkidle0' });
  await page.pdf({ path: kruskalPdfPath, format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm' } });
  console.log('PDF Kruskal generado en:', kruskalPdfPath);
  
  // Generar PDF de NorthWest
  await page.goto('file://' + northwestHtmlPath, { waitUntil: 'networkidle0' });
  await page.pdf({ path: northwestPdfPath, format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm' } });
  console.log('PDF NorthWest generado en:', northwestPdfPath);
  
  await browser.close();
})();
