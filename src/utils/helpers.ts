import QRCode from 'qrcode';
import { Student } from '../types';

export function calculateGrade(marks: number): 'A+' | 'A' | 'A-' | 'B' | 'C' | 'F' | 'Pending' {
  if (marks === undefined || marks === null || isNaN(marks) || marks <= 0) {
    return 'Pending';
  }
  if (marks >= 400 && marks <= 500) return 'A+';
  if (marks >= 350 && marks < 400) return 'A';
  if (marks >= 300 && marks < 350) return 'A-';
  if (marks >= 250 && marks < 300) return 'B';
  if (marks >= 200 && marks < 250) return 'C';
  if (marks >= 1 && marks < 200) return 'F';
  return 'Pending';
}

export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '৳ 0';
  return `৳ ${amount.toLocaleString('en-IN')}`;
}

export function formatDateDDMMYYYY(dateInput: Date | string): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    // If it's already string like dd/mm/yyyy return it
    if (typeof dateInput === 'string' && dateInput.includes('/')) return dateInput;
    return String(dateInput);
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getCurrentDateFormatted(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export async function generateQrCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 160,
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

/**
 * Generates and triggers download of a standardized vCard (.vcf)
 */
export function downloadVCard(student: Student, instituteName: string = 'Upazila Computer Training Institute') {
  const vcfContent = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${student.nameEn}`,
    `N:;${student.nameEn};;;`,
    `ORG:${instituteName}`,
    `TITLE:Student (Roll: ${student.roll})`,
    `TEL;TYPE=CELL,VOICE:${student.studentMobile || ''}`,
    `TEL;TYPE=HOME,VOICE:${student.guardianMobile || ''}`,
    `ADR;TYPE=HOME:;;${student.address || ''};;;;Bangladesh`,
    `NOTE:Subject: ${student.subjectName || ''} | Session: ${student.classSessionName || ''}`,
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${student.roll}_${student.nameEn.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export table data to CSV / Excel readable file
 */
export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => {
        let val = row[header];
        if (val === null || val === undefined) val = '';
        val = String(val).replace(/"/g, '""');
        if (val.includes(',') || val.includes('\n') || val.includes('"')) {
          val = `"${val}"`;
        }
        return val;
      }).join(',')
    )
  ].join('\r\n');

  // Prepend UTF-8 BOM so Excel opens Bengali and English characters perfectly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse CSV string into array of object records
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split(/\r\n|\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const results: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple split handling quotes
    const values: string[] = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    const record: Record<string, string> = {};
    headers.forEach((h, index) => {
      record[h] = values[index] ? values[index].replace(/^"|"$/g, '') : '';
    });
    results.push(record);
  }

  return results;
}
