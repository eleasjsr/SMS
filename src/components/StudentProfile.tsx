import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  Search,
  Download,
  CreditCard,
  FileText,
  Printer,
  FileCheck,
  Calendar,
  Share2,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { downloadVCard } from '../utils/helpers';
import { Student } from '../types';

export const StudentProfile: React.FC = () => {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    setCurrentView,
    instituteSettings
  } = useApp();

  const [searchRoll, setSearchRoll] = useState('');
  const [downloadNotice, setDownloadNotice] = useState('');

  // Current active student
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handleSearchStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRoll.trim()) return;
    const found = students.find(
      s => s.roll === searchRoll.trim() || s.nameEn.toLowerCase().includes(searchRoll.toLowerCase())
    );
    if (found) {
      setSelectedStudentId(found.id);
      setSearchRoll('');
    }
  };

  const handleSaveVCard = () => {
    if (!currentStudent) return;
    downloadVCard(currentStudent, instituteSettings.instituteName);
    setDownloadNotice(`vCard (.vcf) contact for ${currentStudent.nameEn} downloaded!`);
    setTimeout(() => setDownloadNotice(''), 3000);
  };

  if (!currentStudent) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">No student selected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Green Banner matching prototype page 24 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between no-print">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">Student Profile</h2>
        </div>
        <span className="text-xs text-emerald-100">Full Academic &amp; Personal Record</span>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Top Search bar to quickly switch student */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4 no-print">
        <form onSubmit={handleSearchStudent} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchRoll}
            onChange={e => setSearchRoll(e.target.value)}
            placeholder="Search student by Roll (e.g. 260202) or Name..."
            className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold"
          >
            Find
          </button>
        </form>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Select Student:</label>
          <select
            value={currentStudent.id}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-bold"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.roll} - {s.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Profile Card Container matching prototype page 24 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 printable-area">
        
        {/* Top Header Section matching page 24 */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          {/* Avatar and Primary Identity */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-purple-200 overflow-hidden shadow-sm shrink-0">
              <img
                src={currentStudent.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"}
                alt={currentStudent.nameEn}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentStudent.nameEn}
              </h2>
              <p className="text-xs font-semibold text-purple-800 mt-0.5">
                {currentStudent.subjectName}
              </p>
              <p className="text-xs text-slate-500">
                Class: {currentStudent.classSessionName}
              </p>
            </div>
          </div>

          {/* Gender & ADM date tags */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
              <span className="text-blue-600">♂</span>
              <span>{currentStudent.gender.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-900 rounded-xl">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>ADM: {currentStudent.admissionDate}</span>
            </div>
          </div>

          {/* Action Buttons matching prototype page 24 & 26 */}
          <div className="flex items-center gap-2 flex-wrap no-print">
            {/* Save V-Card */}
            <button
              onClick={handleSaveVCard}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              title="Download Contact as vCard"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save V-Card</span>
            </button>

            {/* Student ID Card */}
            <button
              onClick={() => setCurrentView('id-card-view')}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              title="Open Student ID Card"
            >
              <CreditCard className="w-3.5 h-3.5 text-purple-200" />
              <span>Student ID Card</span>
            </button>

            {/* Admission Letter */}
            <button
              onClick={() => setCurrentView('admission-letter-print')}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              title="Print Official Admission Letter"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span>Admission Letter</span>
            </button>

            {/* Print */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1e293b] hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              title="Print Student Profile Record"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Print</span>
            </button>

            {/* Payment Summary */}
            <button
              onClick={() => setCurrentView('payment-print')}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              title="Print Payment Summary"
            >
              <FileText className="w-3.5 h-3.5 text-amber-200" />
              <span>Payment Receipt</span>
            </button>
          </div>
        </div>

        {/* 2-Column Body: Left Metric Badges + Right Info Sections matching page 24 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Metric Badges (Roll, Attendance, Fees, Grade, Attachment) */}
          <div className="md:col-span-3 space-y-4">
            {/* Roll Badge */}
            <div className="border border-slate-300 rounded-xl p-3 text-center bg-slate-50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Student Roll</span>
              <span className="text-xl font-mono font-black text-purple-900">{currentStudent.roll}</span>
              {/* Simulated barcode */}
              <div className="mt-2 text-center text-xs font-mono tracking-widest text-slate-600">
                |||| ||| ||||| || |||
              </div>
            </div>

            {/* Attendance % Badge */}
            <div className="border border-slate-200 rounded-xl p-3.5 text-center bg-slate-50/70">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
                <span>Attendance</span>
              </div>
              <div className="text-2xl font-black text-emerald-700">
                {currentStudent.attendancePercentage}%
              </div>
            </div>

            {/* Fees Badge */}
            <div className="border border-slate-200 rounded-xl p-3.5 text-center bg-slate-50/70">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
                <span>Fees</span>
              </div>
              <div className="text-2xl font-black text-purple-900">
                ৳ {currentStudent.totalFeePaid}
              </div>
            </div>

            {/* Grade Badge */}
            <div className="border border-slate-200 rounded-xl p-3.5 text-center bg-slate-50/70">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
                <span>Grade</span>
              </div>
              <div className="text-2xl font-black text-emerald-600">
                {currentStudent.resultGrade}
              </div>
            </div>

            {/* Attachment Badge */}
            <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50 flex items-center justify-center gap-2 text-slate-600 text-xs">
              <Paperclip className="w-4 h-4 text-purple-600" />
              <span>Attachments (2)</span>
            </div>
          </div>

          {/* Right Column: Personal Info, Contact Info, Academic Info matching page 24 & 25 */}
          <div className="md:col-span-9 space-y-6">
            
            {/* 1. Personal Information */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-200">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs">
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">Name (English):</span>
                  <span className="font-bold text-slate-900">{currentStudent.nameEn}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">Name (বাংলা):</span>
                  <span className="font-semibold text-slate-800">{currentStudent.nameBn || currentStudent.nameEn}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">Father Name:</span>
                  <span className="font-semibold text-slate-800">{currentStudent.fatherName}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">Mother Name:</span>
                  <span className="font-semibold text-slate-800">{currentStudent.motherName}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">Date of Birth:</span>
                  <span className="font-semibold text-slate-800">10 Aug 1992</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">Religion:</span>
                  <span className="font-semibold text-slate-800">{currentStudent.religion}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">Blood Group:</span>
                  <span className="font-bold text-purple-900">{currentStudent.bloodGroup}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">{currentStudent.identityType || 'NID'} Number:</span>
                  <span className="font-mono font-semibold text-slate-800">{currentStudent.identityNumber || '6889145268'}</span>
                </div>
              </div>
            </div>

            {/* 2. Contact Information matching page 24 & 25 */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-200">
                Contact Information
              </h3>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2.5 text-xs flex-1">
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-36">Student Mobile:</span>
                    <span className="font-mono font-bold text-slate-900">{currentStudent.studentMobile}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-36">Guardian Mobile:</span>
                    <span className="font-mono font-semibold text-slate-800">{currentStudent.guardianMobile}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-36">WhatsApp No:</span>
                    <span className="font-mono font-semibold text-slate-800">{currentStudent.whatsappNo || currentStudent.studentMobile}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-36">Address:</span>
                    <span className="font-semibold text-slate-800">{currentStudent.address}</span>
                  </div>
                </div>

                {/* Barcode box matching prototype page 24 */}
                <div className="border border-slate-300 rounded-xl p-3 bg-white text-center self-start sm:w-56 shrink-0">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Student Mobile Barcode</span>
                  <div className="font-mono text-sm tracking-widest text-slate-800 py-1 font-bold">
                    |||||| ||||| |||| |||||
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">{currentStudent.studentMobile}</span>
                </div>
              </div>
            </div>

            {/* 3. Academic Information matching page 24 & 25 */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-200">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs">
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">Academic Type:</span>
                  <span className="font-bold text-slate-900">{currentStudent.academicType || 'SSC'}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">Passing Year:</span>
                  <span className="font-semibold text-slate-800">{currentStudent.academicYear || '2007'}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">Board Roll:</span>
                  <span className="font-mono font-semibold text-slate-800">{currentStudent.academicRoll || '231809'}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4">
                  <span className="text-slate-500 w-32">Results (GPA):</span>
                  <span className="font-bold text-emerald-700">{currentStudent.academicResult || '4.50'}</span>
                </div>
                <div className="flex justify-between sm:justify-start gap-4 sm:col-span-2">
                  <span className="text-slate-500 w-32">School / College:</span>
                  <span className="font-semibold text-slate-800">{currentStudent.schoolName || 'Balla High School.'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
