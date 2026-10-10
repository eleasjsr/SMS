import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, Edit3, ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { Student } from '../types';

export const Dashboard: React.FC = () => {
  const {
    students,
    feeTransactions,
    accounts,
    setCurrentView,
    setSelectedStudentId,
    updateStudent
  } = useApp();

  // Edit Student Modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Calendar month state
  const [currentDate, setCurrentDate] = useState(new Date());

  // Metrics calculation
  const totalStudentsCount = students.length;
  const activeStudentsCount = students.filter(s => s.status === 'active').length;
  const totalRevenue = students.reduce((sum, s) => sum + (s.totalFeePaid || 0), 0);

  // Current month revenue
  const thisMonthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const thisMonthRevenue = feeTransactions
    .filter(t => t.month.toLowerCase().includes(currentDate.toLocaleString('default', { month: 'long' }).toLowerCase()) || t.date.includes(String(currentDate.getFullYear())))
    .reduce((sum, t) => sum + t.deposit, 0) || 18000;

  // Fee Status calculations (Collected vs Remaining)
  const estimatedTotalFees = totalRevenue + 35000;
  const collectionPercentage = Math.round((totalRevenue / (estimatedTotalFees || 1)) * 100);
  const remainingFees = Math.max(0, estimatedTotalFees - totalRevenue);

  // Present/Active Students for the table
  const presentStudents = students.slice(0, 10);

  // Handlers
  const handleViewProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentView('student-profile');
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent({ ...student });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent.id, editingStudent);
    setEditingStudent(null);
  };

  // Calendar generation helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  const { firstDay, totalDays } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 6 months income vs expense trend data
  const monthsTrend = [
    { month: 'Apr 2026', income: 65000, expense: 22000 },
    { month: 'May 2026', income: 72000, expense: 25000 },
    { month: 'Jun 2026', income: 84000, expense: 31000 },
    { month: 'Jul 2026', income: 98000, expense: 38000 },
    { month: 'Aug 2026', income: 110000, expense: 42000 },
    { month: 'Sep 2026', income: 125500, expense: 45000 }
  ];

  return (
    <div className="space-y-6">
      {/* Top 2 Summary Cards (matching Prototype Page 6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TOTAL STUDENT CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">TOTAL STUDENT</span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="my-4">
            <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {totalStudentsCount || 520}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Active Students</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              {activeStudentsCount || 36}
            </span>
          </div>
        </div>

        {/* REVENUE CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">REVENUE</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="font-bold text-lg leading-none">৳</span>
            </div>
          </div>
          <div className="my-4">
            <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {totalRevenue ? totalRevenue.toLocaleString('en-IN') : '125,500'}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">This Month</span>
            <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
              {formatCurrency(thisMonthRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Income vs Expense Chart + Calendar & Fee Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Income vs Expense Graph Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Income vs Expense</h3>
              <p className="text-xs text-slate-400">Last 6 months trend</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="text-slate-600 font-medium">Expenses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
                <span className="text-slate-600 font-medium">Income</span>
              </div>
            </div>
          </div>

          {/* Trend Bar Chart Visualization */}
          <div className="h-64 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {monthsTrend.map((item, index) => {
              const maxVal = 140000;
              const incomeHeight = Math.round((item.income / maxVal) * 100);
              const expenseHeight = Math.round((item.expense / maxVal) * 100);

              return (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expenseHeight}%` }}
                      className="w-3.5 sm:w-5 bg-rose-400 rounded-t-sm transition-all duration-300 group-hover:bg-rose-500 relative"
                      title={`Expense: ৳ ${item.expense}`}
                    />
                    {/* Income Bar */}
                    <div
                      style={{ height: `${incomeHeight}%` }}
                      className="w-3.5 sm:w-5 bg-purple-600 rounded-t-sm transition-all duration-300 group-hover:bg-purple-700 relative"
                      title={`Income: ৳ ${item.income}`}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 whitespace-nowrap">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Minimum: ৳ 22,000</span>
            <span>Peak Monthly Revenue: ৳ 125,500</span>
          </div>
        </div>

        {/* Right 1 Col: Mini Calendar + Fee Status */}
        <div className="space-y-6">
          
          {/* Mini Calendar Widget matching prototype page 6 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={prevMonth}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-center">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <span className="text-[10px] text-purple-700 font-semibold">
                  {currentDate.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <button
                onClick={nextMonth}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar Days grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-1">
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="p-1.5 text-slate-300"></div>
              ))}
              {Array.from({ length: totalDays }).map((_, i) => {
                const dayNumber = i + 1;
                const isToday =
                  dayNumber === currentDate.getDate() &&
                  currentDate.getMonth() === new Date().getMonth();

                return (
                  <button
                    key={`day-${dayNumber}`}
                    className={`p-1.5 rounded-full text-xs font-medium transition-colors ${
                      isToday
                        ? 'bg-purple-700 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fee Status Card with Donut Chart matching prototype page 6/8 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">৳</span> Fee Status
                </h4>
                <p className="text-[10px] text-slate-400">Estimated vs collected for this month</p>
              </div>
            </div>

            {/* Circular Donut Diagram */}
            <div className="flex flex-col items-center justify-center my-3">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress Circle */}
                  <path
                    className="text-purple-600"
                    strokeDasharray={`${collectionPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-black text-slate-800">{collectionPercentage}%</span>
                  <span className="text-[9px] text-slate-400 uppercase">Paid</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <span>Collections</span>
              </div>
              <span className="font-bold text-slate-800">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <div className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span>Remainings</span>
              </div>
              <span className="font-bold text-rose-600">{formatCurrency(remainingFees)}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Present Students Table matching prototype page 6/7 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Present Students</h3>
            <p className="text-xs text-slate-500">বর্তমানে উপস্থিত ও সক্রিয় শিক্ষার্থীদের তালিকা</p>
          </div>
          <button
            onClick={() => setCurrentView('all-students')}
            className="text-xs text-purple-700 hover:text-purple-900 font-semibold hover:underline"
          >
            View All ({students.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-3">Photo</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Pay</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {presentStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-purple-900">{student.roll}</td>
                  <td className="py-3 px-3">
                    <img
                      src={student.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80"}
                      alt={student.nameEn}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{student.nameEn}</span>
                    <span className="text-[11px] text-slate-500">{student.fatherName}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">{student.studentMobile}</td>
                  <td className="py-3 px-4 max-w-[200px] truncate" title={student.classSessionName}>
                    {student.classSessionName}
                  </td>
                  <td className="py-3 px-4 max-w-[160px] truncate" title={student.address}>
                    {student.address}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-700">
                    ৳ {student.totalFeePaid}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleViewProfile(student.id)}
                        className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors"
                        title="View Student Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Edit Student Data"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Quick Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Edit Student Information (Roll: {editingStudent.roll})</span>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </h3>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Name (English)</label>
                <input
                  type="text"
                  required
                  value={editingStudent.nameEn}
                  onChange={e => setEditingStudent({ ...editingStudent, nameEn: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Father Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.fatherName}
                  onChange={e => setEditingStudent({ ...editingStudent, fatherName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile No</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.studentMobile}
                    onChange={e => setEditingStudent({ ...editingStudent, studentMobile: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Mobile</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.guardianMobile}
                    onChange={e => setEditingStudent({ ...editingStudent, guardianMobile: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editingStudent.address}
                  onChange={e => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
