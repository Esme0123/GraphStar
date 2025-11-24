const fs = require('fs');
const path = require('path');

const header = '%PDF-1.4\n';
const objects = [];
const offsets = [];

const addObject = (str) => {
  offsets.push(Buffer.byteLength(header + objects.join('')));
  objects.push(str);
};

addObject('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
addObject('2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n');
addObject('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n');

const contentLines = [
  'BT',
  '/F1 18 Tf',
  '72 720 Td',
  '(GraphStar - Manual MATLAB y Fuzzy) Tj',
  '0 -24 Td',
  '(Consulta Matlab_Manual.html para la version completa.) Tj',
  '0 -24 Td',
  '(Esta version PDF se genera ligero para acompanarte offline.) Tj',
  'ET',
];
const content = contentLines.join('\n');
const contentStream = `4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`;
addObject(contentStream);

addObject('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

let pdf = header + objects.join('');
const xrefOffset = Buffer.byteLength(pdf);

const toPadded = (n) => n.toString().padStart(10, '0');
let xref = 'xref\n0 6\n';
xref += '0000000000 65535 f \n';
for (const off of offsets) {
  xref += `${toPadded(off)} 00000 n \n`;
}

const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
pdf += xref + trailer;

const out = path.resolve(__dirname, '../public/manuals/Matlab_Manual.pdf');
fs.writeFileSync(out, pdf, 'binary');
console.log('PDF generado en', out);
