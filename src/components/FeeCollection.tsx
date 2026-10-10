import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Search, Plus, Trash2, Printer, CheckCircle2, AlertCircle, Banknote } from 'lucide-react';
import { FeeItem, Student } from '../types';
import { getCurrentDateFormatted } from '../utils/helpers';
import { PaymentSummaryPrint } from './PaymentSummaryPrint';

export const FeeCollection: React.FC = () => {
  const {
    students,
    classSessions,
    addFeeTransaction,
    selectedStudentId,
    setSelectedStudentId,
    setCurrentView
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Currently active student for fee entry
  const [activeStudent, setActiveStudent] = useState<Student | null>(() => {
    return students.find(s => s.id === selectedStudentId) || students[0] || null;
  });

  // Show print modal/view
  const [showPrintView, setShowPrintView] = useState(false);
  const [successAlert, setSuccessAlert] = useState('');

  // Fee Entry Form State
  const [feeMonth, setFeeMonth] = useState('January 2026');
  const [feeDate, setFeeDate] = useState(getCurrentDateFormatted());
  const [items, setItems] = useState<FeeItem[]>([
    { id: '1', particulars: 'Monthly Tuition fees', amount: 500 },
    { id: '2', particulars: 'Admission fee', amount: 550 },
    { id: '3', particulars: 'Registration fee', amount: 550 },
    { id: '4', particulars: 'Id card', amount: 100 },
    { id: '5', particulars: 'Books', amount: 100 }
  ]);
  const [depositAmount, setDepositAmount] = useState<number>(1800);

  // Sync fee particulars when activeStudent changes
  useEffect(() => {
    if (activeStudent) {
      const studentSession = classSessions.find(cs => cs.id === activeStudent.classSessionId);
      const tuitionFee = studentSession?.monthlyTuitionFees || 500;
      
      setItems([
        { id: '1', particulars: 'Monthly Tuition fees', amount: tuitionFee },
        { id: '2', particulars: 'Admission fee', amount: 550 },
        { id: '3', particulars: 'Registration fee', amount: 550 },
        { id: '4', particulars: 'Id card', amount: 100 },
        { id: '5', particulars: 'Books', amount: 100 }
      ]);
      setDepositAmount(tuitionFee + 550 + 550 + 100 + 100);
    }
  }, [activeStudent, classSessions]);

  // Recalculate total
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const previousBalance = activeStudent?.totalFeePaid || 0;
  const totalDeposit = previousBalance + (Number(depositAmount) || 0);

  // Filter students for search table
  const searchResults = students.filter(s => {
    const matchesSearch =
      !searchQuery ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentMobile.includes(searchQuery);

    const matchesClass =
      classFilter === 'all' ||
      s.classSessionId === classFilter ||
      s.classSessionName.toLowerCase().includes(classFilter.toLowerCase());

    return matchesSearch && matchesClass;
  });

  const handleSelectStudent = (student: Student) => {
    setActiveStudent(student);
    setSelectedStudentId(student.id);
  };

  const handleItemChange = (id: string, field: 'particulars' | 'amount', value: any) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item
      )
    );
  };

  const handleAddItem = () => {
    const newItem: FeeItem = {
      id: String(Date.now()),
      particulars: 'Miscellaneous fee',
      amount: 100
    };
    setItems(prev => [...prev, newItem]);
    setDepositAmount(prev => prev + 100);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    const removedItem = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    if (removedItem) {
      setDepositAmount(prev => Math.max(0, prev - removedItem.amount));
    }
  };

  const handleSubmitFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;

    addFeeTransaction({
      studentId: activeStudent.id,
      studentRoll: activeStudent.roll,
      studentName: activeStudent.nameEn,
      studentFather: activeStudent.fatherName,
      className: activeStudent.classSessionName,
      month: feeMonth,
      date: feeDate,
      items,
      total: totalAmount,
      deposit: Number(depositAmount),
      previousBalance,
      totalDeposit,
      balanceRemaining: Math.max(0, totalAmount - Number(depositAmount))
    });

    setSuccessAlert(`Fee payment of ৳ ${depositAmount} for ${activeStudent.nameEn} (Roll: ${activeStudent.roll}) has been recorded!`);
    setTimeout(() => setSuccessAlert(''), 4000);
  };

  if (showPrintView && activeStudent) {
    return <PaymentSummaryPrint onBack={() => setShowPrintView(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Green Banner matching prototype page 17 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">Fees Collections</h2>
        </div>
        <span className="text-xs text-emerald-100">Fee Entry &amp; Receipt Manager</span>
      </div>

      {successAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successAlert}</span>
          </div>
          <button
            onClick={() => setShowPrintView(true)}
            className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800"
          >
            View / Print Receipt
          </button>
        </div>
      )}

      {/* Top Search & Filter Bar matching prototype page 17 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-4">
        {/* Student Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student by Name or Roll..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
        </div>

        {/* Filter by class */}
        <div className="min-w-[200px]">
          <select
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-purple-600 focus:outline-none"
          >
            <option value="all">Filter by class (All)</option>
            {classSessions.map(cs => (
              <option key={cs.id} value={cs.id}>
                {cs.startingMonth} to {cs.endingMonth} {cs.year} ({cs.duration})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matched Students Table matching prototype page 17 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Father Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Total Pay</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {searchResults.slice(0, 5).map(student => (
                <tr
                  key={student.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    activeStudent?.id === student.id ? 'bg-purple-50/70 font-medium' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold text-purple-900">{student.roll}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{student.nameEn}</td>
                  <td className="py-3 px-4 text-slate-600">{student.fatherName}</td>
                  <td className="py-3 px-4 max-w-[220px] truncate">{student.classSessionName}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">৳ {student.totalFeePaid}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleSelectStudent(student)}
                      className={`p-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1 transition-all ${
                        activeStudent?.id === student.id
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Enter Fees for Student"
                    >
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Fee Entry</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Fee Entry Panel for Selected Student matching prototype page 17 */}
      {activeStudent && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          {/* Header of fee entry with student name and roll */}
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-purple-950">
                Fees Entry — {activeStudent.nameEn} (Roll: {activeStudent.roll})
              </h3>
              <p className="text-xs text-purple-700 mt-0.5">
                Class: {activeStudent.classSessionName} • Group: {activeStudent.group}
              </p>
            </div>

            <button
              onClick={() => setShowPrintView(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1e293b] hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Payment Summary</span>
            </button>
          </div>

          <form onSubmit={handleSubmitFee} className="space-y-6">
            {/* Month & Date Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Month</label>
                <input
                  type="text"
                  required
                  value={feeMonth}
                  onChange={e => setFeeMonth(e.target.value)}
                  placeholder="e.g. January 2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  required
                  value={feeDate}
                  onChange={e => setFeeDate(e.target.value)}
                  placeholder="e.g. 05 Jan 2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Particulars Table matching prototype page 17 */}
            <div>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-4 w-16">Sr.</th>
                      <th className="py-2.5 px-4">Particulars</th>
                      <th className="py-2.5 px-4 text-right w-36">Amount (৳)</th>
                      <th className="py-2.5 px-4 text-center w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-mono text-slate-500">{index + 1}</td>
                        <td className="py-2 px-4">
                          <input
                            type="text"
                            required
                            value={item.particulars}
                            onChange={e => handleItemChange(item.id, 'particulars', e.target.value)}
                            className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </td>
                        <td className="py-2 px-4 text-right">
                          <input
                            type="number"
                            min="0"
                            required
                            value={item.amount}
                            onChange={e => handleItemChange(item.id, 'amount', e.target.value)}
                            className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-right font-mono font-bold"
                          />
                        </td>
                        <td className="py-2 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* + ADD MORE button matching prototype page 17 */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> ADD MORE
                </button>
              </div>
            </div>

            {/* Calculations Summary Box matching prototype page 17 */}
            <div className="max-w-xs ml-auto space-y-2.5 text-xs border border-slate-200 rounded-xl p-4 bg-slate-50/60">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold">Total</span>
                <span className="font-mono font-bold text-slate-900">{totalAmount}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold">Deposit</span>
                <input
                  type="number"
                  min="0"
                  value={depositAmount}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                  className="w-24 p-1 text-right border border-slate-300 rounded-lg text-xs font-mono font-bold bg-white"
                />
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold">Previous Balance</span>
                <span className="font-mono font-bold text-slate-700">{previousBalance}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-300 text-sm font-bold text-purple-950">
                <span>Total Deposit</span>
                <span className="font-mono">{totalDeposit}</span>
              </div>
            </div>

            {/* Bottom Actions matching prototype page 17 */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="px-8 py-3 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform active:scale-98"
              >
                Submit Fees
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
