const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateReport = (res, labStats) => {
  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(18).text('Lab Summary Report', { align: 'center' });
  doc.moveDown();

  labStats.forEach(stat => {
    doc.fontSize(14).text(`Lab: ${stat.lab}`);
    doc.fontSize(12).text(`Faults: ${stat.faults}`);
    doc.fontSize(12).text(`Equipment: ${stat.equipment}`);
    doc.moveDown();
  });

  doc.end();
};
