import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, FileSpreadsheet, CheckCircle2, Award, Printer } from 'lucide-react';
import { calculateGrade, exportToCSV } from '../utils/helpers';

export const ResultsManagement: React.FC = () => {
  const {
    students,
    classSessions,
    saveStudentResult,
    updateStudent
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState(classSessions[0]?.id || 'ses-1');
  const [successMessage, setSuccessMessage] = useState('');

  // Target class session
  const targetSession = classSessions.find(cs => cs.id === selectedClassId) || classSessions[0];

  // Students belonging to class
  const classStudents = students.filter(s =>
    !selectedClassId || s.classSessionId === selectedClassId || selectedClassId === 'all'
  );

  // Local state for marks inputs (studentId -> marks)
  const [marksState, setMarksState] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    students.forEach(s => {
      initial[s.id] = s.resultMarks || 420;
    });
    return initial;
  });

  const handleMarksChange = (studentId: string, value: string) => {
    const num = Math.min(500, Math.max(0, parseInt(value, 10) || 0));
    setMarksState(prev => ({ ...prev, [studentId]: num }));
  };

  const handleSaveAllResults = (e: React.FormEvent) => {
    e.preventDefault();
    classStudents.forEach(s => {
      const marks = marksState[s.id] || s.resultMarks || 0;
      saveStudentResult(s.id, selectedClassId, marks);
    });

    setSuccessMessage(`Academic results for ${classStudents.length} students have been saved and grades calculated!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleExport = () => {
    const exportData = classStudents.map(s => {
      const marks = marksState[s.id] || s.resultMarks || 0;
      return {
        Roll: s.roll,
        Name: s.nameEn,
        FatherName: s.fatherName,
        Class: s.classSessionName,
        Marks: marks,
        Grade: calculateGrade(marks)
      };
    });
    exportToCSV(`results_${targetSession?.subjectCode || 'batch'}_2026`, exportData);
  };

  return (
    <div className="space-y-6">
      {/* Green Banner matching prototype page 22 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">Results Entry</h2>
        </div>
        <span className="text-xs text-emerald-100">Marks Entry &amp; Automated Grading</span>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Top Filter & Marks Distribution Card matching prototype page 22 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Class filter & Action */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
              Filter by Class / Session
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-purple-600 focus:outline-none min-w-[240px]"
              >
                <option value="all">All Classes</option>
                {classSessions.map(cs => (
                  <option key={cs.id} value={cs.id}>
                    {cs.startingMonth} to {cs.endingMonth} {cs.year} ({cs.duration}) - {cs.subjectName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1e293b] hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export as PDF/Excel</span>
              </button>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Enrolled Students in Session: <strong className="text-slate-800">{classStudents.length}</strong></span>
            <span>Max Score: <strong className="text-slate-800">500</strong></span>
          </div>
        </div>

        {/* Right: Marks Distribution Guide Table matching prototype page 22 & 23 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <h4 className="font-bold text-xs text-slate-700 mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-700" /> Marks Distributions
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-1.5 px-2">To</th>
                  <th className="py-1.5 px-2">From</th>
                  <th className="py-1.5 px-2">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                <tr>
                  <td className="py-1 px-2">400</td>
                  <td className="py-1 px-2">500</td>
                  <td className="py-1 px-2 font-bold text-purple-700">A+</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">350</td>
                  <td className="py-1 px-2">399</td>
                  <td className="py-1 px-2 font-bold text-emerald-700">A</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">300</td>
                  <td className="py-1 px-2">349</td>
                  <td className="py-1 px-2 font-bold text-blue-700">A-</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">250</td>
                  <td className="py-1 px-2">299</td>
                  <td className="py-1 px-2 font-bold text-amber-700">B</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">200</td>
                  <td className="py-1 px-2">249</td>
                  <td className="py-1 px-2 font-bold text-orange-700">C</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">1</td>
                  <td className="py-1 px-2">199</td>
                  <td className="py-1 px-2 font-bold text-rose-700">F</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Main Results Entry Table matching prototype page 22 */}
      <form onSubmit={handleSaveAllResults} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-800">
            Student Examination Records ({targetSession?.subjectName || 'Current Course'})
          </h3>
          <span className="text-xs text-slate-500">Auto Calculates Grade upon entering marks</span>
        </div>

        {/* 2-Column Grid of student marks entry cards matching prototype page 22 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classStudents.map(student => {
            const currentMarks = marksState[student.id] !== undefined ? marksState[student.id] : student.resultMarks || 0;
            const currentGrade = calculateGrade(currentMarks);

            return (
              <div
                key={student.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
              >
                {/* Student Info */}
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

                {/* Marks input & Auto calculated Grade */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={currentMarks || ''}
                      onChange={e => handleMarksChange(student.id, e.target.value)}
                      placeholder="0-500"
                      className="w-20 p-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-center focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="w-10 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg font-bold text-xs shadow-2xs ${
                      currentGrade === 'A+'
                        ? 'bg-purple-100 text-purple-800'
                        : currentGrade === 'A'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentGrade === 'A-'
                        ? 'bg-blue-100 text-blue-800'
                        : currentGrade === 'B'
                        ? 'bg-amber-100 text-amber-800'
                        : currentGrade === 'C'
                        ? 'bg-orange-100 text-orange-800'
                        : currentGrade === 'F'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {currentGrade}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Results Button */}
        <div className="flex justify-center pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-10 py-3 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform active:scale-98"
          >
            Save All Results
          </button>
        </div>
      </form>
    </div>
  );
};
