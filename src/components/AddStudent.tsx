import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Upload, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const AddStudent: React.FC = () => {
  const {
    students,
    subjects,
    classSessions,
    addStudent,
    setCurrentView,
    setSelectedStudentId
  } = useApp();

  // Find latest roll number to auto-suggest
  const calculateNextRoll = () => {
    const rolls = students
      .map(s => parseInt(s.roll, 10))
      .filter(n => !isNaN(n));
    if (rolls.length === 0) return '260201';
    const maxRoll = Math.max(...rolls);
    return String(maxRoll + 1);
  };

  // Form State
  const [formData, setFormData] = useState({
    // Class Info
    subjectId: subjects[0]?.id || '',
    subjectName: subjects[0]?.name || '',
    classSessionId: classSessions[0]?.id || '',
    classSessionName: classSessions[0] ? `${classSessions[0].startingMonth} to ${classSessions[0].endingMonth} ${classSessions[0].year} (${classSessions[0].duration}) ${classSessions[0].subjectName}` : '',
    group: 'A' as 'A' | 'B' | 'C' | 'D' | 'E',
    roll: calculateNextRoll(),
    admissionDate: new Date().toISOString().split('T')[0],

    // Personal Info
    nameEn: '',
    nameBn: '',
    fatherName: '',
    motherName: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    religion: 'Islam' as 'Islam' | 'Hindu' | 'Kristian' | 'Buddha' | 'Others',
    bloodGroup: 'A+' as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
    physicalDisability: 'No' as 'Yes' | 'No',
    identityType: 'NID' as 'NID' | 'BRC',
    identityNumber: '',

    // Contact Info
    studentMobile: '',
    guardianMobile: '',
    whatsappNo: '',
    address: '',

    // Academic Info
    academicType: 'SSC',
    academicYear: '2024',
    academicRoll: '',
    academicReg: '',
    academicResult: '',
    schoolName: '',

    // Attachments
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    documentUrl: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [createdStudentId, setCreatedStudentId] = useState<string | null>(null);

  // Handle subject change & auto sync session
  const handleSubjectChange = (subId: string) => {
    const sub = subjects.find(s => s.id === subId);
    const relatedSession = classSessions.find(cs => cs.subjectId === subId) || classSessions[0];
    setFormData(prev => ({
      ...prev,
      subjectId: subId,
      subjectName: sub ? sub.name : '',
      classSessionId: relatedSession?.id || '',
      classSessionName: relatedSession ? `${relatedSession.startingMonth} to ${relatedSession.endingMonth} ${relatedSession.year} (${relatedSession.duration}) ${relatedSession.subjectName}` : ''
    }));
  };

  // Handle Photo upload preview (data URL or validation)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024) {
        setErrorMsg('Photo size exceeds 200 KB limit! Please choose a smaller photo.');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Document upload preview
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        setErrorMsg('Document size exceeds 500 KB limit! Please upload under 500 KB.');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, documentUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (!formData.nameEn.trim()) {
      setErrorMsg('Student English Name is required.');
      return;
    }
    if (!formData.fatherName.trim()) {
      setErrorMsg('Father Name is required.');
      return;
    }
    if (!formData.motherName.trim()) {
      setErrorMsg('Mother Name is required.');
      return;
    }
    if (!formData.studentMobile.trim()) {
      setErrorMsg('Student Mobile Number is required.');
      return;
    }
    if (!formData.guardianMobile.trim()) {
      setErrorMsg('Guardian Mobile Number is required.');
      return;
    }
    if (!formData.roll.trim()) {
      setErrorMsg('Class Roll number is required.');
      return;
    }

    // Check duplicate roll
    const existingRoll = students.find(s => s.roll === formData.roll.trim());
    if (existingRoll) {
      setErrorMsg(`Roll "${formData.roll}" already exists for student "${existingRoll.nameEn}". Please choose a unique Roll number.`);
      return;
    }

    // Check duplicate mobile warning
    const existingMobile = students.find(s => s.studentMobile === formData.studentMobile.trim());
    if (existingMobile) {
      // warning, proceed or prompt
      console.warn('Warning: Mobile number already in use by student:', existingMobile.nameEn);
    }

    // Format date to dd/mm/yyyy
    const parts = formData.admissionDate.split('-');
    const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : formData.admissionDate;

    const newStudent = addStudent({
      ...formData,
      roll: formData.roll.trim(),
      admissionDate: formattedDate
    });

    setCreatedStudentId(newStudent.id);
    setSuccessMsg(`Student "${newStudent.nameEn}" (Roll: ${newStudent.roll}) has been successfully admitted!`);
  };

  return (
    <div className="space-y-6">
      {/* Green Banner matching Prototype page 9 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">Admission Form</h2>
        </div>
        <span className="text-xs text-emerald-100">Student Enrollment Portal</span>
      </div>

      {successMsg ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
          <h3 className="text-xl font-bold text-emerald-900">{successMsg}</h3>
          <p className="text-xs text-emerald-700 max-w-md mx-auto">
            The student profile has been created and connected to Class Management, Fee Collection, Attendance, and Results.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (createdStudentId) {
                  setSelectedStudentId(createdStudentId);
                  setCurrentView('student-profile');
                }
              }}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2"
            >
              View Student Profile <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSuccessMsg('');
                setCreatedStudentId(null);
                setFormData(prev => ({
                  ...prev,
                  roll: calculateNextRoll(),
                  nameEn: '',
                  nameBn: '',
                  fatherName: '',
                  motherName: '',
                  studentMobile: '',
                  guardianMobile: '',
                  whatsappNo: '',
                  address: '',
                  academicRoll: '',
                  academicReg: '',
                  academicResult: ''
                }));
              }}
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl"
            >
              Admit Another Student
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-8">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Class Info matching prototype page 9/10 */}
          <div>
            <div className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg mb-4">
              Class Info
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Training Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={formData.subjectId}
                  onChange={e => handleSubjectChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>
                      {sub.code} {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Group</label>
                <select
                  value={formData.group}
                  onChange={e => setFormData({ ...formData, group: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>

              {/* Class Roll */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Roll <span className="text-[10px] text-slate-400 font-normal">(Click to edit)</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.roll}
                  onFocus={e => e.target.select()}
                  onChange={e => setFormData({ ...formData, roll: e.target.value })}
                  placeholder="e.g. 260203"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-purple-900 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              {/* Admission Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Date</label>
                <input
                  type="date"
                  required
                  value={formData.admissionDate}
                  onChange={e => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Personal Info matching prototype page 9/10/11 */}
          <div>
            <div className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg mb-4">
              Personal Info
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="Student Name in English"
                  value={formData.nameEn}
                  onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Name (বাংলা)</label>
                <input
                  type="text"
                  placeholder="শিক্ষার্থীর পূর্ণ নাম বাংলায়"
                  value={formData.nameBn}
                  onChange={e => setFormData({ ...formData, nameBn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Father Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Father's full name"
                  value={formData.fatherName}
                  onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mother Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Mother's full name"
                  value={formData.motherName}
                  onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Religion</label>
                  <select
                    value={formData.religion}
                    onChange={e => setFormData({ ...formData, religion: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Kristian">Kristian</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Disability</label>
                  <select
                    value={formData.physicalDisability}
                    onChange={e => setFormData({ ...formData, physicalDisability: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Identity Type</label>
                <select
                  value={formData.identityType}
                  onChange={e => setFormData({ ...formData, identityType: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="NID">NID (National ID)</option>
                  <option value="BRC">BRC (Birth Certificate)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Identity Number</label>
                <input
                  type="text"
                  placeholder="NID or Birth Registration No"
                  value={formData.identityNumber}
                  onChange={e => setFormData({ ...formData, identityNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact Info matching prototype page 9/11/12 */}
          <div>
            <div className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg mb-4">
              Contact Info
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Mobile No *</label>
                <input
                  type="text"
                  required
                  placeholder="017xxxxxxxx"
                  value={formData.studentMobile}
                  onChange={e => setFormData({ ...formData, studentMobile: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Mobile No *</label>
                <input
                  type="text"
                  required
                  placeholder="019xxxxxxxx"
                  value={formData.guardianMobile}
                  onChange={e => setFormData({ ...formData, guardianMobile: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp No</label>
                <input
                  type="text"
                  placeholder="01xxxxxxxxx"
                  value={formData.whatsappNo}
                  onChange={e => setFormData({ ...formData, whatsappNo: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Village, Post, Thana, District"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Academic Info matching prototype page 9/12 */}
          <div>
            <div className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg mb-4">
              Academic Info
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Type *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SSC, HSC, Degree"
                  value={formData.academicType}
                  onChange={e => setFormData({ ...formData, academicType: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
                <input
                  type="text"
                  placeholder="Passing Year (e.g. 2022)"
                  value={formData.academicYear}
                  onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Roll</label>
                <input
                  type="text"
                  placeholder="Board Roll No"
                  value={formData.academicRoll}
                  onChange={e => setFormData({ ...formData, academicRoll: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reg</label>
                <input
                  type="text"
                  placeholder="Board Registration No"
                  value={formData.academicReg}
                  onChange={e => setFormData({ ...formData, academicReg: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Result (GPA / Div)</label>
                <input
                  type="text"
                  placeholder="e.g. 4.50"
                  value={formData.academicResult}
                  onChange={e => setFormData({ ...formData, academicResult: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">School / College Name</label>
                <input
                  type="text"
                  placeholder="Institution Name"
                  value={formData.schoolName}
                  onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Attachments matching prototype page 9/12 */}
          <div>
            <div className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg mb-4">
              Attachments
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Photo Upload */}
              <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white shadow-xs">
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="block text-xs font-bold text-slate-800">Student Photo</span>
                  <p className="text-[10px] text-slate-500 mb-2">Allowed: JPG, PNG, GIF (Max 200 KB)</p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-purple-600" /> Browse File
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Documents Upload */}
              <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200 shrink-0">
                  DOC
                </div>
                <div className="flex-1">
                  <span className="block text-xs font-bold text-slate-800">Documents (Certificates/NID)</span>
                  <p className="text-[10px] text-slate-500 mb-2">Allowed: PDF, JPG, PNG, GIF (Max 500 KB)</p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-purple-600" /> Browse File
                    <input type="file" accept=".pdf,image/*" onChange={handleDocumentUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button matching Prototype page 9 */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-8 py-3 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform active:scale-98"
            >
              Save Student
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
