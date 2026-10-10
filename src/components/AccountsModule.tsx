import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  PlusCircle,
  FileSpreadsheet,
  Printer,
  Copy,
  Trash2,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { exportToCSV, formatCurrency } from '../utils/helpers';
import { AccountTransaction } from '../types';

export const AccountsModule: React.FC = () => {
  const {
    accounts,
    addAccountTransaction,
    deleteAccountTransaction
  } = useApp();

  // Modal / Form toggle state
  const [modalType, setModalType] = useState<'income' | 'expense' | null>(null);
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().split('T')[0]);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [amountInput, setAmountInput] = useState<number | ''>('');
  const [categoryInput, setCategoryInput] = useState('Tuition');
  const [toastMessage, setToastMessage] = useState('');

  // Date range filter
  const [dateRange, setDateRange] = useState('all');

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descriptionInput.trim() || !amountInput || Number(amountInput) <= 0) return;

    const parts = dateInput.split('-');
    const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateInput;

    addAccountTransaction({
      date: formattedDate,
      type: modalType || 'income',
      description: descriptionInput.trim(),
      amount: Number(amountInput),
      category: categoryInput
    });

    setToastMessage(`${modalType === 'income' ? 'Income' : 'Expense'} of ৳ ${amountInput} added!`);
    setModalType(null);
    setDescriptionInput('');
    setAmountInput('');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Calculate totals
  const totalIncome = accounts
    .filter(a => a.type === 'income')
    .reduce((sum, a) => sum + a.amount, 0);

  const totalExpense = accounts
    .filter(a => a.type === 'expense')
    .reduce((sum, a) => sum + a.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Running balance calculator
  let runningBalance = 0;
  const recordsWithBalance = accounts.map(item => {
    if (item.type === 'income') {
      runningBalance += item.amount;
    } else {
      runningBalance -= item.amount;
    }
    return {
      ...item,
      runningBalance
    };
  });

  // Export handlers
  const handleExportCSV = () => {
    const exportData = accounts.map(a => ({
      Date: a.date,
      Description: a.description,
      Category: a.category,
      Type: a.type,
      Expense: a.type === 'expense' ? a.amount : 0,
      Income: a.type === 'income' ? a.amount : 0
    }));
    exportToCSV(`account_statement_${new Date().toISOString().slice(0, 10)}`, exportData);
  };

  const handleCopyClipboard = () => {
    const text = accounts.map(a => `${a.date}\t${a.description}\t${a.type}\t৳ ${a.amount}`).join('\n');
    navigator.clipboard.writeText(text);
    setToastMessage('Statement records copied to clipboard!');
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Green Banner matching prototype page 27 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between no-print">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">Accounts</h2>
        </div>
        <span className="text-xs text-emerald-100">Financial Reports &amp; Ledger</span>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Controls: Add Income, Add Expense, Mini Trend matching page 27 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        
        {/* Left Column: Quick Entry Buttons & Summary Cards */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setModalType('income');
                setCategoryInput('Student Fees');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Add Income
            </button>

            <button
              onClick={() => {
                setModalType('expense');
                setCategoryInput('Utilities');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Add Expense
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">Total Income</span>
              <span className="text-lg sm:text-xl font-mono font-black text-purple-900">{formatCurrency(totalIncome)}</span>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Total Expense</span>
              <span className="text-lg sm:text-xl font-mono font-black text-rose-900">{formatCurrency(totalExpense)}</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Net Balance</span>
              <span className="text-lg sm:text-xl font-mono font-black text-emerald-900">{formatCurrency(netBalance)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Trend Box */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800">Income vs Expense</h4>
            <span className="text-[10px] text-slate-400">Monthly</span>
          </div>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Income Collection Rate</span>
                <span className="font-bold text-purple-700">74%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '74%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Operating Overhead</span>
                <span className="font-bold text-rose-600">26%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '26%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Student fee collections auto-synced</span>
            <span className="text-emerald-600 font-bold">Live</span>
          </div>
        </div>

      </div>

      {/* Statement Records Table matching prototype page 27 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden printable-area">
        
        {/* Table Top Controls Bar matching page 27 */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-800 mr-2">Statement Records</span>
            
            <button
              onClick={handleCopyClipboard}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-[#1e293b] hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-purple-50 text-purple-800 text-xs font-semibold rounded-lg border border-purple-200">
              Sep 1, 2026 - Sep 28, 2026
            </span>
          </div>
        </div>

        {/* The Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">DESCRIPTION</th>
                <th className="py-3 px-4 text-right">EXPENSE</th>
                <th className="py-3 px-4 text-right">INCOME</th>
                <th className="py-3 px-4 text-right">NET BALANCE</th>
                <th className="py-3 px-3 text-center no-print">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recordsWithBalance.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-slate-500 whitespace-nowrap">{record.date}</td>
                  <td className="py-2.5 px-4 font-medium text-slate-800">{record.description}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-rose-600">
                    {record.type === 'expense' ? `৳ ${record.amount}` : '-'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-purple-700">
                    {record.type === 'income' ? `৳ ${record.amount}` : '-'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                    ৳ {record.runningBalance}
                  </td>
                  <td className="py-2.5 px-3 text-center no-print">
                    <button
                      onClick={() => deleteAccountTransaction(record.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Totals Row matching prototype page 27 */}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-300 text-slate-900">
                <td colSpan={2} className="py-3 px-4 text-right uppercase tracking-wider text-xs">
                  Totals
                </td>
                <td className="py-3 px-4 text-right font-mono text-rose-700 text-sm">
                  ৳ {totalExpense}
                </td>
                <td className="py-3 px-4 text-right font-mono text-purple-800 text-sm">
                  ৳ {totalIncome}
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-800 text-sm">
                  ৳ {netBalance}
                </td>
                <td className="no-print"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Income/Expense Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {modalType === 'income' ? 'Record New Income' : 'Record New Expense'}
            </h3>

            <form onSubmit={handleSaveTransaction} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">DATE *</label>
                <input
                  type="date"
                  required
                  value={dateInput}
                  onChange={e => setDateInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">DESCRIPTION *</label>
                <input
                  type="text"
                  required
                  placeholder={modalType === 'income' ? 'Income Description' : 'Expense Description'}
                  value={descriptionInput}
                  onChange={e => setDescriptionInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">AMOUNT (৳) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="0"
                  value={amountInput}
                  onChange={e => setAmountInput(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CATEGORY</label>
                <select
                  value={categoryInput}
                  onChange={e => setCategoryInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {modalType === 'income' ? (
                    <>
                      <option value="Student Fees">Student Fees</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Workshops">Workshops</option>
                      <option value="Certificates">Certificates</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Utilities">Utilities &amp; Electricity</option>
                      <option value="Hardware">Hardware &amp; Maintenance</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Refreshment">Refreshment</option>
                      <option value="Rent">Rent &amp; Facility</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-xl shadow-xs ${
                    modalType === 'income' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
