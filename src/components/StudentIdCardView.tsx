import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Printer, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import { Student } from '../types';
import { generateQrCodeDataUrl } from '../utils/helpers';

export const StudentIdCardView: React.FC = () => {
  const {
    students,
    classSessions,
    selectedStudentId,
    instituteSettings,
    setCurrentView
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student>(() => {
    return students.find(s => s.id === selectedStudentId) || students[0];
  });
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate QR code for student
  useEffect(() => {
    if (selectedStudent) {
      const verifyText = `STUDENT-VERIFICATION\nInstitute: ${instituteSettings.instituteName}\nRoll: ${selectedStudent.roll}\nName: ${selectedStudent.nameEn}\nMobile: ${selectedStudent.studentMobile}\nCourse: ${selectedStudent.subjectName}\nSession: ${selectedStudent.classSessionName}`;
      generateQrCodeDataUrl(verifyText).then(url => {
        setQrCodeDataUrl(url);
      });
    }
  }, [selectedStudent, instituteSettings]);

  // Filter students
  const filteredStudents = students.filter(s =>
    selectedClassId === 'all' || s.classSessionId === selectedClassId
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Green Banner matching prototype page 29 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between no-print">
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">Student ID Card</h2>
        </div>
        <span className="text-xs text-emerald-100">Official Student Identity Credential</span>
      </div>

      {/* Top Filter & Actions bar matching prototype page 29 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('student-profile')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <label className="text-xs font-semibold text-slate-500">Filter by Class:</label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700"
            >
              <option value="all">All Classes</option>
              {classSessions.map(cs => (
                <option key={cs.id} value={cs.id}>
                  {cs.startingMonth} to {cs.endingMonth} {cs.year} ({cs.duration})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">Student:</label>
            <select
              value={selectedStudent?.id}
              onChange={e => {
                const std = students.find(s => s.id === e.target.value);
                if (std) setSelectedStudent(std);
              }}
              className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 font-bold"
            >
              {filteredStudents.map(s => (
                <option key={s.id} value={s.id}>
                  {s.roll} - {s.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1e293b] hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Export as PDF / Print ID Card</span>
        </button>
      </div>

      {/* ID Card Display Container matching prototype page 29 & 30 */}
      <div className="printable-area max-w-2xl mx-auto space-y-6">
        <div className="text-center no-print text-xs text-slate-500 font-medium">
          Standard High-Resolution PVC Identity Card (CR-80 Format • 3.375" × 2.125")
        </div>

        {/* Dual Card Layout: Front Side & Back Side */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 print:flex-row print:justify-center print:gap-8">
          
          {/* ============ FRONT SIDE ============ */}
          <div className="w-[310px] h-[480px] bg-white rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden flex flex-col justify-between relative print:shadow-none print:border-slate-400 print:rounded-xl">
            {/* Top Header */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-3 text-center relative">
              <div className="w-8 h-8 rounded-full bg-emerald-600 border border-white mx-auto mb-1 flex items-center justify-center text-[10px] font-bold">
                UCTI
              </div>
              <h4 className="text-[11px] font-bold leading-tight">
                {instituteSettings.instituteName || 'Upazila Computer Training Institute'}
              </h4>
              <p className="text-[9px] text-purple-200">
                {instituteSettings.targetLine || 'Jhikargacha, Jashore'}
              </p>
              <p className="text-[9px] font-mono text-emerald-300">
                Mob: {instituteSettings.phone || '01941959600'}
              </p>
            </div>

            {/* Photo & Name */}
            <div className="flex-1 flex flex-col items-center justify-center p-3 text-center">
              <div className="w-24 h-24 rounded-full border-4 border-purple-600 overflow-hidden shadow-md mb-2 bg-slate-100">
                <img
                  src={selectedStudent?.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"}
                  alt={selectedStudent?.nameEn}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-black text-sm text-slate-900 tracking-wide uppercase">
                {selectedStudent?.nameEn}
              </h3>
              <div className="mt-1 bg-purple-100 text-purple-900 font-mono font-bold text-xs px-3 py-0.5 rounded-full">
                Roll: {selectedStudent?.roll}
              </div>

              <div className="mt-3 text-[11px] text-slate-600 leading-tight space-y-0.5">
                <p className="font-semibold text-slate-800">{selectedStudent?.subjectName}</p>
                <p className="text-[10px] text-slate-500">{selectedStudent?.classSessionName}</p>
                <p className="text-[10px] text-slate-500">Group: {selectedStudent?.group} | Blood: {selectedStudent?.bloodGroup}</p>
              </div>
            </div>

            {/* Footer with Signature & QR Code */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-end justify-between">
              <div className="text-left">
                <div className="w-20 border-b border-slate-400 mb-0.5"></div>
                <span className="text-[9px] text-slate-500 font-medium">Authorized Signature</span>
              </div>
              <div className="w-12 h-12 bg-white p-0.5 border border-slate-200 rounded-sm">
                {qrCodeDataUrl && (
                  <img src={qrCodeDataUrl} alt="Student QR" className="w-full h-full object-contain" />
                )}
              </div>
            </div>
          </div>

          {/* ============ BACK SIDE ============ */}
          <div className="w-[310px] h-[480px] bg-white rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden flex flex-col justify-between p-4 text-center relative print:shadow-none print:border-slate-400 print:rounded-xl">
            {/* Top Back Details */}
            <div className="space-y-2 pt-2">
              <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-xs">
                <span className="block text-[10px] text-slate-500 font-semibold uppercase">Guardian Mobile Number</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{selectedStudent?.guardianMobile}</span>
              </div>

              <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-xs">
                <span className="block text-[10px] text-slate-500 font-semibold uppercase">Student Mobile</span>
                <span className="font-mono font-bold text-slate-800 text-xs">{selectedStudent?.studentMobile}</span>
              </div>
            </div>

            {/* Center Instructions notice matching prototype */}
            <div className="my-auto px-2">
              <p className="text-[11px] text-slate-600 leading-relaxed font-serif italic bg-amber-50 p-3 rounded-xl border border-amber-200">
                {instituteSettings.idCardBackSideText ||
                  'If this identity card is found, you are requested to deposit it at the nearest post office or with the institute authorities.'}
              </p>
            </div>

            {/* Bottom Verification QR & Institute Info */}
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <div className="w-16 h-16 mx-auto bg-white p-1 border border-slate-200 rounded-md">
                {qrCodeDataUrl && (
                  <img src={qrCodeDataUrl} alt="Verify QR" className="w-full h-full object-contain" />
                )}
              </div>
              <div className="text-[10px] text-slate-600 leading-tight">
                <p className="font-bold text-slate-800">{instituteSettings.instituteName}</p>
                <p>{instituteSettings.address}</p>
                <p className="font-mono font-semibold text-purple-800">{instituteSettings.phone}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
