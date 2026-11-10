import { prettyDate } from '../utils.js';

function escapePdf(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function formatInr(val) {
  const num = Number(val) || 0;
  return num.toLocaleString('en-IN');
}

/**
 * Builds a standard, RFC-compliant PDF 1.4 document in pure JavaScript.
 * Requires ZERO external dependencies and works completely offline.
 */
export function buildInvoicePdfString({ invoice, user }) {
  const subtotal = Math.round((invoice.amount / 1.18) * 100) / 100;
  const gstAmount = Math.round((invoice.amount - subtotal) * 100) / 100;
  const halfGst = (gstAmount / 2).toFixed(2);
  const formattedSubtotal = subtotal.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedAmount = formatInr(invoice.amount);
  const issueDate = prettyDate(invoice.date);
  const validUntilStr =
    invoice.expiryDate === 'Lifetime' ? 'Lifetime Access' : prettyDate(invoice.expiryDate);

  const streamLines = [
    // Top blue accent bar
    '0.204 0.329 0.820 rg 0 836 595.28 6 re f',

    // Header Logo & Branding
    'BT /F2 22 Tf 0.094 0.137 0.247 rg 40 786 Td (ROJMEL) Tj ET',
    'BT /F1 10 Tf 0.392 0.455 0.545 rg 40 772 Td (Secure Daily Money Ledger & Accounting) Tj ET',

    // Tax Invoice Title & Number
    'BT /F2 18 Tf 0.204 0.329 0.820 rg 390 788 Td (TAX INVOICE) Tj ET',
    'BT /F2 10 Tf 0.094 0.137 0.247 rg 390 772 Td (Invoice #: ) Tj /F1 10 Tf (' +
      escapePdf(invoice.invoiceId) +
      ') Tj ET',
    'BT /F1 9 Tf 0.392 0.455 0.545 rg 390 758 Td (Date: ' +
      escapePdf(issueDate) +
      ') Tj ET',

    // Status Badge
    '0.863 0.988 0.906 rg 390 734 95 18 re f',
    'BT /F2 9 Tf 0.082 0.502 0.239 rg 405 739 Td ([PAID SUCCESS]) Tj ET',

    // Divider line
    '0.886 0.910 0.941 RG 1 w 40 715 m 555 715 l S',

    // Billed By (Provider)
    'BT /F2 10 Tf 0.392 0.455 0.545 rg 40 690 Td (BILLED BY:) Tj ET',
    'BT /F2 11 Tf 0.094 0.137 0.247 rg 40 673 Td (Rojmel Ledger Technologies Pvt. Ltd.) Tj ET',
    'BT /F1 9.5 Tf 0.278 0.333 0.412 rg 40 659 Td (402, Business Hub, Ring Road) Tj ET',
    'BT /F1 9.5 Tf 0.278 0.333 0.412 rg 40 645 Td (Surat, Gujarat - 395002, India) Tj ET',
    'BT /F1 9.5 Tf 0.278 0.333 0.412 rg 40 631 Td (GSTIN: 24AABCR1234F1Z8) Tj ET',
    'BT /F1 9.5 Tf 0.278 0.333 0.412 rg 40 617 Td (Email: support@rojmel.app) Tj ET',

    // Billed To (Customer)
    'BT /F2 10 Tf 0.392 0.455 0.545 rg 320 690 Td (BILLED TO:) Tj ET',
    'BT /F2 11 Tf 0.094 0.137 0.247 rg 320 673 Td (' +
      escapePdf(user?.name || 'Administrator') +
      ') Tj ET',
    'BT /F1 9.5 Tf 0.278 0.333 0.412 rg 320 659 Td (Email: ' +
      escapePdf(user?.email || 'admin@rojmel.app') +
      ') Tj ET',
    'BT /F1 9.5 Tf 0.278 0.333 0.412 rg 320 645 Td (Account: Administrator Ledger) Tj ET',
    'BT /F1 9.5 Tf 0.278 0.333 0.412 rg 320 631 Td (Valid Until: ' +
      escapePdf(validUntilStr) +
      ') Tj ET',
    'BT /F1 9.5 Tf 0.278 0.333 0.412 rg 320 617 Td (Payment Method: Digital / Online) Tj ET',

    // Table Header
    '0.969 0.976 0.984 rg 40 575 515.28 24 re f',
    '0.886 0.910 0.941 RG 1 w 40 575 515.28 24 re S',
    'BT /F2 9.5 Tf 0.278 0.333 0.412 rg',
    '50 583 Td (#) Tj',
    '80 583 Td (DESCRIPTION / SUBSCRIPTION PLAN) Tj',
    '310 583 Td (CYCLE) Tj',
    '380 583 Td (VALIDITY) Tj',
    '475 583 Td (AMOUNT (INR)) Tj',
    'ET',

    // Table Row
    '0.945 0.961 0.976 RG 0.5 w 40 522 515.28 53 re S',
    'BT /F1 10 Tf 0.094 0.137 0.247 rg 50 548 Td (1) Tj ET',
    'BT /F2 11 Tf 0.094 0.137 0.247 rg 80 552 Td (' +
      escapePdf(invoice.planName) +
      ') Tj ET',
    'BT /F1 8.5 Tf 0.392 0.455 0.545 rg 80 538 Td (Full premium ledger features, cloud backup and analytics) Tj ET',
    'BT /F1 10 Tf 0.278 0.333 0.412 rg 310 548 Td (' +
      escapePdf(invoice.cycle) +
      ') Tj ET',
    'BT /F1 9.5 Tf 0.278 0.333 0.412 rg 380 548 Td (' +
      escapePdf(validUntilStr) +
      ') Tj ET',
    'BT /F2 11 Tf 0.094 0.137 0.247 rg 475 548 Td (Rs. ' +
      formattedAmount +
      ') Tj ET',

    // Totals Section Card
    '0.973 0.980 0.988 rg 310 405 245.28 98 re f',
    '0.886 0.910 0.941 RG 1 w 310 405 245.28 98 re S',
    'BT /F1 9.5 Tf 0.392 0.455 0.545 rg 325 482 Td (Taxable Subtotal:) Tj ET',
    'BT /F1 9.5 Tf 0.094 0.137 0.247 rg 460 482 Td (Rs. ' +
      formattedSubtotal +
      ') Tj ET',
    'BT /F1 9.5 Tf 0.392 0.455 0.545 rg 325 464 Td (CGST (9.0%):) Tj ET',
    'BT /F1 9.5 Tf 0.094 0.137 0.247 rg 460 464 Td (Rs. ' +
      halfGst +
      ') Tj ET',
    'BT /F1 9.5 Tf 0.392 0.455 0.545 rg 325 446 Td (SGST (9.0%):) Tj ET',
    'BT /F1 9.5 Tf 0.094 0.137 0.247 rg 460 446 Td (Rs. ' +
      halfGst +
      ') Tj ET',
    '0.886 0.910 0.941 RG 1 w 325 436 m 540 436 l S',
    'BT /F2 11.5 Tf 0.204 0.329 0.820 rg 325 418 Td (Total Amount Paid:) Tj ET',
    'BT /F2 12.5 Tf 0.204 0.329 0.820 rg 460 418 Td (Rs. ' +
      formattedAmount +
      ') Tj ET',

    // Verification Stamp Card
    '0.957 0.969 0.996 rg 40 405 240 98 re f',
    '0.204 0.329 0.820 RG 1 w 40 405 240 98 re S',
    'BT /F2 10 Tf 0.204 0.329 0.820 rg 55 480 Td ([VERIFIED] DIGITALLY CERTIFIED) Tj ET',
    'BT /F1 9 Tf 0.278 0.333 0.412 rg 55 463 Td (Rojmel Online Payment Gateway) Tj ET',
    'BT /F1 8.5 Tf 0.392 0.455 0.545 rg 55 446 Td (Auth Reference: ' +
      escapePdf(invoice.invoiceId) +
      ') Tj ET',
    'BT /F1 8.5 Tf 0.392 0.455 0.545 rg 55 430 Td (Payment Status: Successful) Tj ET',
    'BT /F2 8.5 Tf 0.082 0.502 0.239 rg 55 414 Td (No Physical Signature Required) Tj ET',

    // Terms & Conditions
    '0.886 0.910 0.941 RG 1 w 40 375 m 555 375 l S',
    'BT /F2 8.5 Tf 0.392 0.455 0.545 rg 40 358 Td (TERMS & NOTES:) Tj ET',
    'BT /F1 8 Tf 0.45 0.45 0.45 rg 40 344 Td (1. This is an electronic tax invoice receipt pursuant to the IT Act. All payments are verified.) Tj ET',
    'BT /F1 8 Tf 0.45 0.45 0.45 rg 40 332 Td (2. Subscription benefits remain active until the specified validity date.) Tj ET',
    'BT /F1 8 Tf 0.45 0.45 0.45 rg 40 320 Td (3. For billing assistance or queries, please email billing@rojmel.app.) Tj ET',

    // Bottom copyright
    'BT /F1 8.5 Tf 0.6 0.6 0.6 rg 170 50 Td (Copyright 2026 Rojmel Ledger Technologies. All rights reserved.) Tj ET',
  ];

  const streamData = streamLines.join('\n');
  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(streamData).length;

  const obj1 = '<< /Type /Catalog /Pages 2 0 R >>';
  const obj2 = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
  const obj3 =
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>';
  const obj4 = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  const obj5 = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  const obj6 =
    '<< /Length ' + streamBytes + ' >>\nstream\n' + streamData + '\nendstream';

  const allObjs = [obj1, obj2, obj3, obj4, obj5, obj6];

  let out = '%PDF-1.4\n';
  const offsets = [];
  allObjs.forEach((content, idx) => {
    offsets.push(encoder.encode(out).length);
    out += idx + 1 + ' 0 obj\n' + content + '\nendobj\n';
  });

  const xrefOffset = encoder.encode(out).length;
  out += 'xref\n';
  out += '0 ' + (allObjs.length + 1) + '\n';
  out += '0000000000 65535 f \n';
  offsets.forEach((off) => {
    out += String(off).padStart(10, '0') + ' 00000 n \n';
  });
  out += 'trailer\n';
  out += '<< /Size ' + (allObjs.length + 1) + ' /Root 1 0 R >>\n';
  out += 'startxref\n' + xrefOffset + '\n%%EOF';

  return out;
}

/**
 * Directly downloads the invoice as a genuine .pdf file to the user's computer.
 * Does NOT open any browser print dialog.
 */
export function downloadDirectInvoicePdf(invoice, user) {
  const pdfString = buildInvoicePdfString({ invoice, user });
  const blob = new Blob([pdfString], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${invoice.invoiceId}.pdf`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1500);
}

