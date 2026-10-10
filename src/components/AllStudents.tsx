import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  UploadCloud,
  UserPlus,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { exportToCSV, parseCSV } from '../utils/helpers';
import { Student } from '../types';

export const AllStudents: React.FC = () => {
  const {
    students,
    classSessions,
    deleteStudent,
    updateStudent,
    addStudent,
    setCurrentView,
    setSelectedStudentId
  } = useApp();

  // Filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importNotice, setImportNotice] = useState<string>('');

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesClass =
      selectedClassFilter === 'all' ||
      student.classSessionName.toLowerCase().includes(selectedClassFilter.toLowerCase()) ||
      student.classSessionId === selectedClassFilter;

    const matchesSearch =
      !searchQuery ||
      student.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentMobile.includes(searchQuery) ||
      student.fatherName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesClass && matchesSearch;
  });

  // Export to Excel handler
  const handleExportExcel = () => {
    const exportData = filteredStudents.map(s => ({
      Roll: s.roll,
      Name: s.nameEn,
      NameBn: s.nameBn,
      FatherName: s.fatherName,
      MotherName: s.motherName,
      Mobile: s.studentMobile,
      GuardianMobile: s.guardianMobile,
      Class: s.classSessionName,
      Group: s.group,
      TotalPayment: s.totalFeePaid,
      AttendancePct: `${s.attendancePercentage}%`,
      ResultGrade: s.resultGrade,
      ResultMarks: s.resultMarks,
      AdmissionDate: s.admissionDate,
      Address: s.address
    }));

    exportToCSV(`students_list_${new Date().toISOString().slice(0, 10)}`, exportData);
  };

  // Import CSV Template download
  const handleDownloadTemplate = () => {
    const sampleTemplate = [
      {
        Roll: '260210',
        Name: 'Sabbir Ahmed',
        NameBn: 'সাব্বির আহমেদ',
        FatherName: 'Md Rafiqul Islam',
        MotherName: 'Nasima Begum',
        Mobile: '01712345678',
        GuardianMobile: '01912345678',
        Class: 'Computer Office Applications',
        Group: 'A',
        Address: 'Jhikargacha, Jashore',
        Gender: 'Male',
        AdmissionDate: '10/01/2026'
      }
    ];
    exportToCSV('students_import_template', sampleTemplate);
  };

  // Import Excel / CSV File Handler
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const rows = parseCSV(text);
        if (!rows.length) {
          setImportNotice('No valid rows found in CSV!');
          return;
        }

        let addedCount = 0;
        rows.forEach(row => {
          const roll = row.Roll || row.roll || String(Date.now()).slice(-6);
          const nameEn = row.Name || row.nameEn || row.NameEnglish || 'New Student';
          const fatherName = row.FatherName || row.fatherName || 'Guardian';
          const studentMobile = row.Mobile || row.studentMobile || '01700000000';

          addStudent({
            roll,
            nameEn,
            nameBn: row.NameBn || '',
            fatherName,
            motherName: row.MotherName || '',
            gender: (row.Gender as any) || 'Male',
            religion: 'Islam',
            bloodGroup: 'A+',
            physicalDisability: 'No',
            identityType: 'NID',
            identityNumber: '',
            studentMobile,
            guardianMobile: row.GuardianMobile || studentMobile,
            whatsappNo: studentMobile,
            address: row.Address || 'Jashore',
            academicType: 'SSC',
            academicYear: '2023',
            academicRoll: '',
            academicReg: '',
            academicResult: '4.50',
            schoolName: '',
            subjectId: 'sub-1',
            subjectName: 'Computer Office Applications',
            classSessionId: classSessions[0]?.id || 'ses-1',
            classSessionName: row.Class || classSessions[0]?.subjectName || 'Computer Office Applications',
            group: (row.Group as any) || 'A',
            admissionDate: row.AdmissionDate || '01/01/2026',
            photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
          });
          addedCount++;
        });

        setImportNotice(`Successfully imported ${addedCount} student records into the database!`);
        setTimeout(() => {
          setShowImportModal(false);
          setImportNotice('');
        }, 1800);
      } catch (err) {
        setImportNotice('Failed to parse file. Please ensure valid CSV format.');
      }
    };
    reader.readAsText(file);
  };

  const handleView = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentView('student-profile');
  };

  const handleEdit = (student: Student) => {
    setEditingStudent({ ...student });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent.id, editingStudent);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-5">
      {/* Green Banner matching prototype page 13 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">All Student</h2>
        </div>
        <span className="text-xs text-emerald-100">Total Enrolled: {students.length} Students</span>
      </div>

      {/* Action Controls Bar matching prototype page 13 & 14 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Filter by Class */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">Filter by Class:</label>
          <select
            value={selectedClassFilter}
            onChange={e => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600 min-w-[200px]"
          >
            <option value="all">All Classes & Sessions</option>
            {classSessions.map(cs => (
              <option key={cs.id} value={cs.id}>
                {cs.startingMonth} to {cs.endingMonth} {cs.year} ({cs.duration}) {cs.subjectName}
              </option>
            ))}
          </select>
        </div>

        {/* Center: Search */}
        <div className="relative flex-1 max-w-xs min-w-[180px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Roll, Name, Mobile..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Right Action Buttons matching prototype page 13 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Export as Excel */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1e293b] hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            title="Download full student database as Excel / CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export as Excel</span>
          </button>

          {/* Import From Excel with tooltip & modal */}
          <div className="relative group">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-200" />
              <span>Import From Excel</span>
            </button>

            {/* Hover Tooltip showing template fields per prototype requirement! */}
            <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-slate-900 text-slate-200 rounded-xl shadow-xl text-[11px] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
              <p className="font-bold text-white mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-indigo-400" /> Required Column Headers:
              </p>
              <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                Roll, Name, FatherName, MotherName, Mobile, GuardianMobile, Class, Group, Address
              </p>
              <span className="text-[9px] text-indigo-300 mt-1 block">Click to open import wizard</span>
            </div>
          </div>

          {/* Add Student */}
          <button
            onClick={() => setCurrentView('add-student')}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Main Students Table matching prototype page 13 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3.5 px-4">Name/Roll/Father</th>
                <th className="py-3.5 px-2 text-center">View</th>
                <th className="py-3.5 px-2 text-center">Edit</th>
                <th className="py-3.5 px-2 text-center">Delete</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Attendant</th>
                <th className="py-3.5 px-4">Results</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No students match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name / Roll / Father with Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80"}
                          alt={student.nameEn}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block uppercase tracking-wide">
                            {student.nameEn}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {student.roll} • {student.fatherName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* View (Eye Icon) */}
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => handleView(student.id)}
                        className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors inline-block"
                        title="View Student Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Edit (Pencil Icon) */}
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors inline-block"
                        title="Edit Student Data"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Delete (Trash Icon) */}
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => setStudentToDelete(student)}
                        className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors inline-block"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Class */}
                    <td className="py-3 px-4 max-w-[220px]">
                      <span className="text-slate-800 font-medium block leading-snug">
                        {student.classSessionName}
                      </span>
                      <span className="text-[10px] text-slate-400">Group {student.group}</span>
                    </td>

                    {/* Payment */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ৳ {student.totalFeePaid}
                    </td>

                    {/* Attendance % */}
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        student.attendancePercentage >= 75
                          ? 'text-emerald-700'
                          : student.attendancePercentage >= 60
                          ? 'text-amber-700'
                          : 'text-rose-600'
                      }`}>
                        {student.attendancePercentage}%
                      </span>
                    </td>

                    {/* Results */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-xs ${
                        student.resultGrade === 'A+'
                          ? 'bg-purple-100 text-purple-800'
                          : student.resultGrade === 'A'
                          ? 'bg-emerald-100 text-emerald-800'
                          : student.resultGrade === 'A-'
                          ? 'bg-blue-100 text-blue-800'
                          : student.resultGrade === 'B'
                          ? 'bg-amber-100 text-amber-800'
                          : student.resultGrade === 'Pending'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {student.resultGrade}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredStudents.length} of {students.length} students</span>
          <span>Currency: ৳ (BDT) | Report Size: A4</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-slate-800 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-center text-slate-900 text-base mb-1">Delete Student?</h4>
            <p className="text-xs text-center text-slate-500 mb-4">
              Are you sure you want to delete <strong>{studentToDelete.nameEn}</strong> (Roll: {studentToDelete.roll})? This action will remove all related records.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="flex-1 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Edit Student — Roll: {editingStudent.roll}</span>
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
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.fatherName}
                    onChange={e => setEditingStudent({ ...editingStudent, fatherName: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mother Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.motherName}
                    onChange={e => setEditingStudent({ ...editingStudent, motherName: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile No</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.studentMobile}
                    onChange={e => setEditingStudent({ ...editingStudent, studentMobile: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Mobile</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.guardianMobile}
                    onChange={e => setEditingStudent({ ...editingStudent, guardianMobile: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editingStudent.address}
                  onChange={e => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import From Excel Wizard Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-600" /> Import Students from Excel / CSV
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-900 space-y-2">
              <p className="font-semibold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-700" /> Excel Column Format Guidelines:
              </p>
              <p className="text-[11px] text-indigo-800 leading-relaxed font-mono">
                Roll, Name, FatherName, MotherName, Mobile, GuardianMobile, Class, Group, Address
              </p>
              <button
                onClick={handleDownloadTemplate}
                className="mt-2 text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
              >
                📥 Download CSV Template Format
              </button>
            </div>

            {importNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importNotice}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select CSV / Excel File:
              </label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileImport}
                className="w-full p-2.5 border border-dashed border-slate-300 rounded-xl text-xs bg-slate-50 cursor-pointer"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
