import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardCheck, CheckCircle2, UserCheck, Calendar, Check, X } from 'lucide-react';
import { getCurrentDateFormatted } from '../utils/helpers';

export const AttendanceManagement: React.FC = () => {
  const {
    students,
    classSessions,
    saveAttendance
  } = useApp();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [selectedClassId, setSelectedClassId] = useState(classSessions[0]?.id || 'ses-1');
  const [successNotice, setSuccessNotice] = useState('');

  // Target class session info
  const targetSession = classSessions.find(cs => cs.id === selectedClassId) || classSessions[0];

  // Students belonging to this session or all if session not strictly filtered
  const sessionStudents = students.filter(s =>
    !selectedClassId || s.classSessionId === selectedClassId || selectedClassId === 'all'
  );

  // Current attendance state: map studentId -> 'Present' | 'Leave' | 'Absent'
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'Present' | 'Leave' | 'Absent'>>(() => {
    const initial: Record<string, 'Present' | 'Leave' | 'Absent'> = {};
    students.forEach(s => {
      initial[s.id] = 'Present'; // default to Present
    });
    return initial;
  });

  const handleStatusChange = (studentId: string, status: 'Present' | 'Leave' | 'Absent') => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'Present' | 'Leave' | 'Absent') => {
    setAttendanceMap(prev => {
      const updated = { ...prev };
      sessionStudents.forEach(s => {
        updated[s.id] = status;
      });
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parts = selectedDate.split('-');
    const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : selectedDate;

    const records = sessionStudents.map(s => ({
      studentId: s.id,
      roll: s.roll,
      name: s.nameEn,
      status: attendanceMap[s.id] || 'Present'
    }));

    saveAttendance(formattedDate, selectedClassId, records);
    setSuccessNotice(`Attendance for ${formattedDate} (${sessionStudents.length} students) has been successfully saved!`);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  // Metrics
  const presentCount = sessionStudents.filter(s => (attendanceMap[s.id] || 'Present') === 'Present').length;
  const leaveCount = sessionStudents.filter(s => attendanceMap[s.id] === 'Leave').length;
  const absentCount = sessionStudents.filter(s => attendanceMap[s.id] === 'Absent').length;

  return (
    <div className="space-y-6">
      {/* Green Banner matching prototype page 20 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ClipboardCheck className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">Student Attendance</h2>
        </div>
        <span className="text-xs text-emerald-100">Daily Attendance Tracker</span>
      </div>

      {successNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Select Date & Class Bar matching prototype page 20 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
          Select Date &amp; Class
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
            >
              <option value="all">All Enrolled Students</option>
              {classSessions.map(cs => (
                <option key={cs.id} value={cs.id}>
                  {cs.startingMonth} to {cs.endingMonth} {cs.year} ({cs.duration}) - {cs.subjectName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick bulk action buttons & Attendance stats */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">Quick Actions:</span>
            <button
              type="button"
              onClick={() => handleMarkAll('Present')}
              className="px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg font-semibold"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll('Absent')}
              className="px-3 py-1 bg-rose-100 text-rose-800 hover:bg-rose-200 rounded-lg font-semibold"
            >
              All Absent
            </button>
          </div>

          <div className="flex items-center gap-3 font-semibold">
            <span className="text-emerald-700">Present: {presentCount}</span>
            <span className="text-amber-700">Leave: {leaveCount}</span>
            <span className="text-rose-700">Absent: {absentCount}</span>
          </div>
        </div>
      </div>

      {/* Main Student Attendance List matching prototype page 20 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {targetSession?.startingMonth}-{targetSession?.endingMonth} {targetSession?.year} ({targetSession?.duration})
            </h3>
            <p className="text-xs text-slate-500">
              {sessionStudents.length} Students registered in this batch
            </p>
          </div>
          <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-3 py-1 rounded-lg">
            Date: {selectedDate}
          </span>
        </div>

        {/* 2-Column Student Cards Grid matching prototype page 20 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessionStudents.map(student => {
            const currentStatus = attendanceMap[student.id] || 'Present';

            return (
              <div
                key={student.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
              >
                {/* Student Photo and Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={student.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80"}
                    alt={student.nameEn}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 truncate">
                    <p className="font-bold text-slate-900 text-xs truncate uppercase tracking-tight">
                      {student.nameEn}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate font-mono">
                      {student.roll} • {student.fatherName}
                    </p>
                  </div>
                </div>

                {/* Status Toggle Buttons: P, L, A */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Present */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'Present')}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                      currentStatus === 'Present'
                        ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                    title="Mark Present"
                  >
                    P
                  </button>

                  {/* Leave */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'Leave')}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                      currentStatus === 'Leave'
                        ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                    title="Mark Leave"
                  >
                    L
                  </button>

                  {/* Absent */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'Absent')}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                      currentStatus === 'Absent'
                        ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-300'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                    title="Mark Absent"
                  >
                    A
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Bottom Submit Attendance Button matching prototype page 20 */}
        <div className="flex justify-center pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-10 py-3 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform active:scale-98"
          >
            Submit Attendance
          </button>
        </div>
      </form>
    </div>
  );
};
