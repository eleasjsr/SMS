import React from 'react';
import { useApp } from '../context/AppContext';
import { Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const AdmissionLetterPrint: React.FC = () => {
  const {
    students,
    selectedStudentId,
    instituteSettings,
    setCurrentView
  } = useApp();

  const student = students.find(s => s.id === selectedStudentId) || students[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden during print) */}
      <div className="no-print flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={() => setCurrentView('student-profile')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Printer className="w-4 h-4" /> Print Admission Letter (A4)
        </button>
      </div>

      {/* Official Formal Admission Letter Document */}
      <div className="printable-area max-w-3xl mx-auto bg-white border border-slate-200 shadow-xl p-8 sm:p-12 text-slate-800 font-serif space-y-6 print:border-none print:shadow-none print:p-6 print:max-w-none">
        {/* Letterhead Header */}
        <div className="border-b-2 border-emerald-800 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xl border-2 border-emerald-600 shrink-0">
              UCTI
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-emerald-950 font-sans tracking-tight">
                {instituteSettings.instituteName || 'Upazila Computer Training Institute'}
              </h1>
              <p className="text-xs text-slate-600 font-sans">
                {instituteSettings.targetLine || 'Jhikargacha, Jashore'} • {instituteSettings.address}
              </p>
              <p className="text-xs text-slate-500 font-sans">
                Phone: {instituteSettings.phone || '01941959600'} | Email: {instituteSettings.email || 'ucec.gov.bd@gmail.com'}
              </p>
            </div>
          </div>

          <div className="w-20 h-24 border border-slate-300 rounded overflow-hidden p-1 bg-slate-50 shrink-0">
            <img
              src={student?.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
              alt={student?.nameEn}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Ref & Date */}
        <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
          <span>Ref: UCTI/ADM/{student?.roll || '260202'}/2026</span>
          <span>Date of Issue: {student?.admissionDate || '12/06/2026'}</span>
        </div>

        {/* Title */}
        <div className="text-center py-2">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider inline-block border-b-2 border-purple-800 pb-1 font-sans">
            Official Admission Letter &amp; Enrollment Confirmation
          </h2>
        </div>

        {/* Salutation & Intro */}
        <div className="text-xs leading-relaxed space-y-3 font-sans text-slate-700">
          <p>
            Dear <strong>{student?.nameEn}</strong>,
          </p>
          <p>
            We are pleased to inform you that you have been successfully admitted into the certified computer training curriculum at <strong>{instituteSettings.instituteName}</strong>. Your academic and enrollment records have been documented in the institute management system as follows:
          </p>
        </div>

        {/* Student Data Table */}
        <div className="border border-slate-300 rounded-xl overflow-hidden font-sans text-xs">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-slate-50">
                <td className="py-2 px-4 font-semibold text-slate-600 w-1/3">Student Name (English)</td>
                <td className="py-2 px-4 font-bold text-slate-900">{student?.nameEn}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-slate-600">Student Name (বাংলা)</td>
                <td className="py-2 px-4 font-medium text-slate-800">{student?.nameBn || student?.nameEn}</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="py-2 px-4 font-semibold text-slate-600">Class Roll</td>
                <td className="py-2 px-4 font-mono font-bold text-purple-900">{student?.roll}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-slate-600">Training Course</td>
                <td className="py-2 px-4 font-bold text-slate-900">{student?.subjectName}</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="py-2 px-4 font-semibold text-slate-600">Academic Session</td>
                <td className="py-2 px-4 text-slate-800">{student?.classSessionName} (Group {student?.group})</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-slate-600">Father's Name</td>
                <td className="py-2 px-4 text-slate-800">{student?.fatherName}</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="py-2 px-4 font-semibold text-slate-600">Mother's Name</td>
                <td className="py-2 px-4 text-slate-800">{student?.motherName}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-slate-600">Contact Mobile</td>
                <td className="py-2 px-4 font-mono text-slate-800">{student?.studentMobile} (Guardian: {student?.guardianMobile})</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="py-2 px-4 font-semibold text-slate-600">Residential Address</td>
                <td className="py-2 px-4 text-slate-800">{student?.address}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Code of Conduct / Rules from Institute Settings */}
        <div className="font-sans space-y-2 pt-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Institute Rules &amp; Responsibilities:
          </h3>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-[11px] text-slate-700 leading-relaxed whitespace-pre-line font-mono">
            {instituteSettings.admissionLetterRulesText}
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-12 flex items-end justify-between font-sans text-xs text-slate-700">
          <div className="text-center">
            <div className="w-40 border-t border-slate-500 mb-1"></div>
            <p className="font-semibold">Student Signature</p>
            <p className="text-[10px] text-slate-500">Date: {student?.admissionDate}</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 border-2 border-dashed border-emerald-600 rounded-full flex items-center justify-center text-[10px] text-emerald-800 font-bold mx-auto mb-2 opacity-70">
              OFFICIAL SEAL
            </div>
            <div className="w-44 border-t border-slate-500 mb-1"></div>
            <p className="font-bold text-slate-900">Principal / Director</p>
            <p className="text-[10px] text-slate-500">{instituteSettings.instituteName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
