import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FolderTree, Check, X, Edit, Trash2, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { ClassSession, Subject } from '../types';

export const ClassManagement: React.FC = () => {
  const {
    classSessions,
    subjects,
    addClassSession,
    updateClassSession,
    deleteClassSession,
    toggleClassSessionActive,
    addSubject,
    updateSubject,
    deleteSubject
  } = useApp();

  // Class Session Form state
  const [sessionForm, setSessionForm] = useState({
    startingMonth: 'Jan',
    endingMonth: 'Jun',
    year: '2026',
    subjectId: subjects[0]?.id || '',
    duration: '6 Month',
    monthlyTuitionFees: 500,
    groups: ['A', 'B'] as string[]
  });

  // Subject Form state
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: ''
  });

  // Edit states
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [msg, setMsg] = useState('');

  // Handle group checkbox toggles
  const handleGroupToggle = (groupLetter: string) => {
    setSessionForm(prev => {
      const exists = prev.groups.includes(groupLetter);
      const updatedGroups = exists
        ? prev.groups.filter(g => g !== groupLetter)
        : [...prev.groups, groupLetter];
      return { ...prev, groups: updatedGroups };
    });
  };

  // Submit new Session
  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === sessionForm.subjectId) || subjects[0];
    if (!sub) return;

    if (editingSession) {
      updateClassSession(editingSession.id, {
        startingMonth: sessionForm.startingMonth,
        endingMonth: sessionForm.endingMonth,
        year: sessionForm.year,
        subjectId: sub.id,
        subjectName: sub.name,
        subjectCode: sub.code,
        duration: sessionForm.duration,
        monthlyTuitionFees: Number(sessionForm.monthlyTuitionFees),
        groups: sessionForm.groups
      });
      setEditingSession(null);
      setMsg('Session updated successfully!');
    } else {
      addClassSession({
        startingMonth: sessionForm.startingMonth,
        endingMonth: sessionForm.endingMonth,
        year: sessionForm.year,
        subjectId: sub.id,
        subjectName: sub.name,
        subjectCode: sub.code,
        duration: sessionForm.duration,
        monthlyTuitionFees: Number(sessionForm.monthlyTuitionFees),
        groups: sessionForm.groups,
        isActive: false
      });
      setMsg('New Class Session added successfully!');
    }

    setTimeout(() => setMsg(''), 3000);
  };

  // Submit new Subject
  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.name.trim() || !subjectForm.code.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, subjectForm.code.trim(), subjectForm.name.trim());
      setEditingSubject(null);
      setMsg('Subject updated successfully!');
    } else {
      addSubject(subjectForm.code.trim(), subjectForm.name.trim());
      setMsg('Subject added successfully!');
    }

    setSubjectForm({ name: '', code: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Green Banner matching prototype page 15 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FolderTree className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">Class Management</h2>
        </div>
        <span className="text-xs text-emerald-100">Sessions &amp; Subjects Curriculum</span>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Class Summary Cards matching prototype page 15 */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Active &amp; Scheduled Class Sessions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classSessions.map(session => (
            <div
              key={session.id}
              className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between shadow-xs ${
                session.isActive
                  ? 'bg-gradient-to-br from-cyan-50 via-sky-50 to-white border-cyan-300 ring-2 ring-cyan-400/50'
                  : 'bg-gradient-to-br from-amber-50/50 via-slate-50 to-white border-slate-200'
              }`}
            >
              {/* Card Header info */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">
                    {session.startingMonth} to {session.endingMonth} {session.year} ({session.duration})
                  </span>
                  {session.isActive && (
                    <span className="text-[10px] uppercase font-bold bg-cyan-600 text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-purple-800">
                  {session.subjectCode} {session.subjectName}
                </p>
              </div>

              {/* Big student count */}
              <div className="my-3 text-center">
                <div className="text-4xl font-black text-slate-800">
                  {session.totalStudents}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-1">
                  <span>Male: <strong className="text-slate-700">{session.maleCount}</strong></span>
                  <span>Female: <strong className="text-slate-700">{session.femaleCount}</strong></span>
                </div>
              </div>

              {/* Action Buttons on card matching prototype page 15 */}
              <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-200/80">
                {/* Active / Inactive check toggle */}
                <button
                  onClick={() => toggleClassSessionActive(session.id)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    session.isActive
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-xs'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                  title={session.isActive ? 'Active Session (Click to Deactivate)' : 'Set as Active Session'}
                >
                  <Check className="w-4 h-4" />
                </button>

                {/* Edit */}
                <button
                  onClick={() => {
                    setEditingSession(session);
                    setSessionForm({
                      startingMonth: session.startingMonth,
                      endingMonth: session.endingMonth,
                      year: session.year,
                      subjectId: session.subjectId,
                      duration: session.duration,
                      monthlyTuitionFees: session.monthlyTuitionFees,
                      groups: session.groups
                    });
                  }}
                  className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 transition-colors"
                  title="Edit Session"
                >
                  <Edit className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteClassSession(session.id)}
                  className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                  title="Delete Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form 1: Add Class & Session matching prototype page 15 & 16 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide mb-4 flex items-center justify-between">
          <span>{editingSession ? 'Edit Class & Session' : 'Add Class & Session'}</span>
          {editingSession && (
            <button
              onClick={() => setEditingSession(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-normal"
            >
              Cancel Edit
            </button>
          )}
        </h3>

        <form onSubmit={handleSaveSession} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Starting Month */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Starting Month</label>
              <select
                value={sessionForm.startingMonth}
                onChange={e => setSessionForm({ ...sessionForm, startingMonth: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Ending Month */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ending Month</label>
              <select
                value={sessionForm.endingMonth}
                onChange={e => setSessionForm({ ...sessionForm, endingMonth: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Year</label>
              <input
                type="text"
                required
                value={sessionForm.year}
                onChange={e => setSessionForm({ ...sessionForm, year: e.target.value })}
                placeholder="2026"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
              />
            </div>

            {/* Subject Dropdown populated from Class Management Database */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={sessionForm.subjectId}
                onChange={e => setSessionForm({ ...sessionForm, subjectId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration</label>
              <select
                value={sessionForm.duration}
                onChange={e => setSessionForm({ ...sessionForm, duration: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
              >
                <option value="3 Month">3 Month</option>
                <option value="6 Month">6 Month</option>
                <option value="1 Year">1 Year</option>
              </select>
            </div>

            {/* Monthly Tuition Fees */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Tuition Fees (৳)</label>
              <input
                type="number"
                min="0"
                required
                value={sessionForm.monthlyTuitionFees}
                onChange={e => setSessionForm({ ...sessionForm, monthlyTuitionFees: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Groups Checkboxes A, B, C, D, E matching prototype page 15 */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Groups</label>
            <div className="flex items-center gap-3">
              {['A', 'B', 'C', 'D', 'E'].map(grp => {
                const isSelected = sessionForm.groups.includes(grp);
                return (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => handleGroupToggle(grp)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {grp}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all"
            >
              {editingSession ? 'Update Session' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Form 2 & Subject Table matching prototype page 15 & 16 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Add Subject Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide mb-4 flex items-center justify-between">
            <span>{editingSubject ? 'Edit Subject' : 'Add Subject'}</span>
            {editingSubject && (
              <button
                onClick={() => setEditingSubject(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-normal"
              >
                Cancel
              </button>
            )}
          </h3>

          <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Graphic Design & Multimedia"
                value={subjectForm.name}
                onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject Code</label>
              <input
                type="text"
                required
                placeholder="e.g. 81"
                value={subjectForm.code}
                onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all"
              >
                {editingSubject ? 'Update Subject' : 'Save Subject'}
              </button>
            </div>
          </form>
        </div>

        {/* Current Subject Table matching prototype page 15 & 16 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 overflow-hidden">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide mb-4">
            Current Subjects
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">S.N</th>
                  <th className="py-2.5 px-3">Subject Code</th>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {subjects.map((sub, index) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-purple-900">
                      {sub.code}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      {sub.name}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingSubject(sub);
                            setSubjectForm({ name: sub.name, code: sub.code });
                          }}
                          className="p-1.5 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors"
                          title="Edit Subject"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSubject(sub.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
