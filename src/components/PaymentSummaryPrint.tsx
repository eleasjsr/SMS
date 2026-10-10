import React from 'react';
import { useApp } from '../context/AppContext';
import { Printer, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import { FeeTransaction } from '../types';

interface Props {
  transaction?: FeeTransaction;
  onBack?: () => void;
}

export const PaymentSummaryPrint: React.FC<Props> = ({ transaction, onBack }) => {
  const {
    students,
    feeTransactions,
    instituteSettings,
    selectedStudentId,
    setCurrentView
  } = useApp();

  // Find target student & transaction
  const student = students.find(s => s.id === selectedStudentId) || students[0];
  const tx =
    transaction ||
    feeTransactions.find(t => t.studentId === student?.id || t.studentRoll === student?.roll) ||
    feeTransactions[0];

  const handlePrint = () => {
    window.print();
  };

  const receiptDate = tx?.date || '05 Jan 2026';
  const receiptMonth = tx?.month || 'January 2026';

  // Render Single Receipt Slip (Reusable for Student Copy and Office Copy)
  const renderReceiptSlip = (copyType: 'Student Copy' | 'Office Copy') => (
    <div className="border border-slate-300 rounded-2xl p-6 bg-white relative print:border-slate-800 print:rounded-none print:p-4 print:mb-6">
      {/* Top Tag */}
      <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-lg border border-emerald-500">
            UCTI
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-tight">
              {instituteSettings.instituteName || 'Upazila Computer Training Institute'}
            </h3>
            <p className="text-xs text-slate-600">
              {instituteSettings.targetLine || 'Jhikargacha, Jashore'} • Mob: {instituteSettings.phone || '01941959600'}
            </p>
            <p className="text-[11px] text-slate-500">Email: {instituteSettings.email || 'ucec.gov.bd@gmail.com'}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-purple-700 text-white text-xs font-bold rounded-lg uppercase tracking-wider mb-1">
            Payment Summary
          </span>
          <p className="text-[11px] font-bold text-slate-600 block">{copyType}</p>
        </div>
      </div>

      {/* Student Meta Grid */}
      <div className="grid grid-cols-2 gap-4 text-xs mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 print:bg-transparent print:border-none">
        <div>
          <p className="text-sm font-bold text-slate-900">{student?.nameEn || tx?.studentName}</p>
          <p className="text-slate-600">{student?.subjectName || 'Computer Office Applications'}</p>
          <p className="text-slate-500 text-[11px]">{student?.classSessionName || tx?.className}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-800 font-mono">Class Roll: {student?.roll || tx?.studentRoll}</p>
          <p className="text-slate-600">Adm Date: {student?.admissionDate || '07 Jun 2026'}</p>
          <p className="text-slate-600 font-semibold">Group: {student?.group || 'A'}</p>
        </div>
      </div>

      {/* Transaction Details Table */}
      <table className="w-full text-left border-collapse text-xs mb-4">
        <thead>
          <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 print:bg-slate-200">
            <th className="py-2 px-3">S.N</th>
            <th className="py-2 px-3">DATE</th>
            <th className="py-2 px-3">MONTH</th>
            <th className="py-2 px-3">DESCRIPTION</th>
            <th className="py-2 px-3 text-right">AMOUNT</th>
            <th className="py-2 px-3 text-right">BALANCE</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {tx?.items && tx.items.length > 0 ? (
            tx.items.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="py-2 px-3 font-mono text-slate-500">{idx + 1}</td>
                <td className="py-2 px-3">{receiptDate}</td>
                <td className="py-2 px-3">{receiptMonth}</td>
                <td className="py-2 px-3 font-medium">{item.particulars}</td>
                <td className="py-2 px-3 text-right font-mono font-semibold">৳ {item.amount}</td>
                <td className="py-2 px-3 text-right font-mono text-slate-500">৳ 0</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-2 px-3 font-mono">1</td>
              <td className="py-2 px-3">{receiptDate}</td>
              <td className="py-2 px-3">{receiptMonth}</td>
              <td className="py-2 px-3 font-medium">Registration Fee, Monthly Tuition &amp; Materials</td>
              <td className="py-2 px-3 text-right font-mono font-semibold">৳ {tx?.deposit || 1800}</td>
              <td className="py-2 px-3 text-right font-mono text-slate-500">৳ 0</td>
            </tr>
          )}
          <tr className="border-t-2 border-slate-300 font-bold bg-slate-50 print:bg-transparent">
            <td colSpan={4} className="py-2 px-3 text-right">Total Deposit:</td>
            <td className="py-2 px-3 text-right font-mono text-purple-900 text-sm">
              ৳ {tx?.deposit || 1800}
            </td>
            <td className="py-2 px-3 text-right font-mono">
              ৳ {tx?.balanceRemaining || 0}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer Signatures matching prototype page 18 */}
      <div className="flex items-end justify-between pt-6 text-xs text-slate-600 mt-4">
        <div className="text-center">
          <div className="w-32 border-t border-slate-400 mb-1"></div>
          <span className="text-[11px] font-medium">Sign Cashier</span>
        </div>

        <div className="text-center italic text-[11px] text-slate-500">
          {instituteSettings.invoiceText || '------- Thanks to pay -------'}
        </div>

        <div className="text-center">
          <div className="w-32 border-t border-slate-400 mb-1"></div>
          <span className="text-[11px] font-medium">Stamp Institute</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Bar for Action (hidden during print) */}
      <div className="no-print flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={onBack || (() => setCurrentView('fee-collection'))}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Fee Collections
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <Printer className="w-4 h-4" /> Print Payment Summary (A4)
          </button>
        </div>
      </div>

      {/* Printable A4 Container with 2 slips matching Prototype Page 18 */}
      <div className="printable-area max-w-3xl mx-auto space-y-6 print:space-y-8 print:max-w-none">
        {/* Slip 1: Student Copy */}
        {renderReceiptSlip('Student Copy')}

        {/* Divider cut line */}
        <div className="no-print border-b-2 border-dashed border-slate-300 my-4 text-center">
          <span className="bg-slate-100 text-[10px] text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest relative -top-3">
            ✂ Cut along line ✂
          </span>
        </div>

        {/* Slip 2: Office Copy */}
        {renderReceiptSlip('Office Copy')}
      </div>
    </div>
  );
};
