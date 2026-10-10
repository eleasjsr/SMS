import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Subject,
  ClassSession,
  FeeTransaction,
  AttendanceRecord,
  StudentResult,
  AccountTransaction,
  InstituteSettings,
  User,
  Role,
  DatabaseBackupRecord
} from '../types';
import { calculateGrade } from '../utils/helpers';

interface AppContextType {
  // Navigation & View State
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  isCapsuleSidebar: boolean;
  setIsCapsuleSidebar: (val: boolean | ((prev: boolean) => boolean)) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  showInstallGuide: boolean;
  setShowInstallGuide: (val: boolean) => void;

  // Auth State
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateCurrentUser: (userData: Partial<User>) => void;

  // Data Collections
  students: Student[];
  subjects: Subject[];
  classSessions: ClassSession[];
  feeTransactions: FeeTransaction[];
  attendanceRecords: AttendanceRecord[];
  results: StudentResult[];
  accounts: AccountTransaction[];
  roles: Role[];
  instituteSettings: InstituteSettings;
  backupHistory: DatabaseBackupRecord[];

  // Student CRUD
  addStudent: (student: Omit<Student, 'id' | 'totalFeePaid' | 'attendancePercentage' | 'resultGrade' | 'resultMarks' | 'status'>) => Student;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
  getStudentByRoll: (roll: string) => Student | undefined;

  // Class & Subject CRUD
  addSubject: (code: string, name: string) => void;
  updateSubject: (id: string, code: string, name: string) => void;
  deleteSubject: (id: string) => void;
  addClassSession: (session: Omit<ClassSession, 'id' | 'totalStudents' | 'maleCount' | 'femaleCount'>) => void;
  updateClassSession: (id: string, updated: Partial<ClassSession>) => void;
  deleteClassSession: (id: string) => void;
  toggleClassSessionActive: (id: string) => void;

  // Fee Collection
  addFeeTransaction: (transaction: Omit<FeeTransaction, 'id' | 'receiptNumber' | 'createdAt'>) => FeeTransaction;
  
  // Attendance
  saveAttendance: (date: string, classSessionId: string, records: { studentId: string; roll: string; name: string; status: 'Present' | 'Leave' | 'Absent' }[]) => void;

  // Results
  saveStudentResult: (studentId: string, classSessionId: string, marks: number) => void;

  // Accounts
  addAccountTransaction: (tx: Omit<AccountTransaction, 'id'>) => void;
  deleteAccountTransaction: (id: string) => void;

  // Roles & Permissions
  addRole: (title: string, permissions: { [key: string]: boolean }) => void;
  updateRole: (id: string, title: string, permissions: { [key: string]: boolean }) => void;
  deleteRole: (id: string) => void;

  // Institute Settings
  updateInstituteSettings: (settings: Partial<InstituteSettings>) => void;

  // Database Backup, Restore, Reset
  exportDatabaseJSON: () => string;
  restoreDatabaseJSON: (jsonString: string) => boolean;
  resetDatabaseToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Default Institute Settings
const DEFAULT_INSTITUTE_SETTINGS: InstituteSettings = {
  instituteName: 'Upazila Computer Training Institute',
  targetLine: 'Jhikargacha, Jashore.',
  phone: '01941959600',
  website: 'fb.com/groups/cecjhikargacha',
  address: 'Upazila Porishod, Jhikargacha, Jessore.',
  country: 'Bangladesh',
  email: 'ucec.gov.bd@gmail.com',
  currency: '৳',
  admissionLetterRulesText: `Students have the responsibility:
To attend school regularly
To respect the right of others to learn
To respect their peers and teachers regardless of ethnicity, religion or gender
To respect the property and equipment of the school and others
To carry out reasonable instructions to the best of their ability
To conduct themselves in a courteous and appropriate manner in school and in public
To keep the school environment and the local community free from litter
To observe the uniform code of the school
To read all school notices and bring them to their parents'/guardians' attention`,
  idCardBackSideText: 'If this identity card is found, you are requested to deposit it at the nearest post office or with the institute authorities.',
  invoiceText: '----------------- Thanks to pay -----------------',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
  qrCodeUrl: '',
  loginBackgroundUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80'
};

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sub-1', code: '76', name: 'Computer Office Applications' },
  { id: 'sub-2', code: '79', name: 'Database Programming' },
  { id: 'sub-3', code: '81', name: 'Graphic Design & Multimedia' },
];

const DEFAULT_SESSIONS: ClassSession[] = [
  {
    id: 'ses-1',
    startingMonth: 'Jul',
    endingMonth: 'Dec',
    year: '2026',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    subjectCode: '76',
    duration: '6 Month',
    monthlyTuitionFees: 500,
    groups: ['A', 'B', 'C'],
    isActive: true,
    totalStudents: 45,
    maleCount: 23,
    femaleCount: 22
  },
  {
    id: 'ses-2',
    startingMonth: 'Jul',
    endingMonth: 'Sep',
    year: '2026',
    subjectId: 'sub-2',
    subjectName: 'Database Programming',
    subjectCode: '79',
    duration: '3 Month',
    monthlyTuitionFees: 600,
    groups: ['A', 'B'],
    isActive: false,
    totalStudents: 38,
    maleCount: 20,
    femaleCount: 18
  },
  {
    id: 'ses-3',
    startingMonth: 'Jan',
    endingMonth: 'Jun',
    year: '2026',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    subjectCode: '76',
    duration: '6 Month',
    monthlyTuitionFees: 500,
    groups: ['A', 'B', 'C', 'D'],
    isActive: false,
    totalStudents: 50,
    maleCount: 26,
    femaleCount: 24
  }
];

const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'std-260202',
    roll: '260202',
    admissionDate: '12/06/2026',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    classSessionId: 'ses-3',
    classSessionName: 'Jan to Jun 2026 (6 Month) Computer Office Applications',
    group: 'A',
    nameEn: 'Eleas Kanchon',
    nameBn: 'ইলিয়াস কাঞ্চন',
    fatherName: 'Md Abdul Awal Molla',
    motherName: 'Saleha Begum',
    gender: 'Male',
    religion: 'Islam',
    bloodGroup: 'O+',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '6889145268',
    studentMobile: '01923862251',
    guardianMobile: '01932274790',
    whatsappNo: '01517850737',
    address: 'Balla, Jhikargacha, Jashore.',
    academicType: 'SSC',
    academicYear: '2007',
    academicRoll: '231809',
    academicReg: '891234',
    academicResult: '4.50',
    schoolName: 'Balla High School.',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2800,
    attendancePercentage: 75,
    resultGrade: 'A+',
    resultMarks: 450,
    status: 'active'
  },
  {
    id: 'std-260201',
    roll: '260201',
    admissionDate: '07/06/2026',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    classSessionId: 'ses-3',
    classSessionName: 'Jan to Jun 2026 (6 Month) Computer Office Applications',
    group: 'A',
    nameEn: 'Arifa Yeasmin',
    nameBn: 'আরিফা ইয়াসমিন',
    fatherName: 'Md. Yunus Ali',
    motherName: 'Rabeya Khatun',
    gender: 'Female',
    religion: 'Islam',
    bloodGroup: 'A+',
    physicalDisability: 'No',
    identityType: 'BRC',
    identityNumber: '19985512345678901',
    studentMobile: '01517850737',
    guardianMobile: '01712345678',
    whatsappNo: '01517850737',
    address: 'Fire service, Jhikargacha, Jashore.',
    academicType: 'HSC',
    academicYear: '2020',
    academicRoll: '110294',
    academicReg: '772109',
    academicResult: '4.80',
    schoolName: 'Jhikargacha Mohila College',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 1000,
    attendancePercentage: 80,
    resultGrade: 'A',
    resultMarks: 380,
    status: 'active'
  },
  {
    id: 'std-250206',
    roll: '250206',
    admissionDate: '10/07/2025',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'A',
    nameEn: 'ASFAQUR RAHMAN',
    nameBn: 'আশফাকুর রহমান',
    fatherName: 'MD. RAFIQUR RAHMAN',
    motherName: 'Shamsun Nahar',
    gender: 'Male',
    religion: 'Islam',
    bloodGroup: 'B+',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '4455667788',
    studentMobile: '01711223344',
    guardianMobile: '01711223399',
    whatsappNo: '01711223344',
    address: 'Krishnanagar, Jhikargacha',
    academicType: 'SSC',
    academicYear: '2021',
    academicRoll: '412030',
    academicReg: '556677',
    academicResult: '5.00',
    schoolName: 'Jhikargacha Pilot High School',
    photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2500,
    attendancePercentage: 70,
    resultGrade: 'A+',
    resultMarks: 470,
    status: 'active'
  },
  {
    id: 'std-250212',
    roll: '250212',
    admissionDate: '12/07/2025',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'A',
    nameEn: 'BABU HOSSAIN',
    nameBn: 'বাবু হোসেন',
    fatherName: 'MD. ABDUL MAZID',
    motherName: 'Fatema Begum',
    gender: 'Male',
    religion: 'Islam',
    bloodGroup: 'O+',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '1122334455',
    studentMobile: '01822334455',
    guardianMobile: '01822334400',
    whatsappNo: '01822334455',
    address: 'Chowgacha Road, Jhikargacha',
    academicType: 'HSC',
    academicYear: '2022',
    academicRoll: '502911',
    academicReg: '665544',
    academicResult: '4.25',
    schoolName: 'Shahid Mashiur Rahman Degree College',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2200,
    attendancePercentage: 72,
    resultGrade: 'A',
    resultMarks: 380,
    status: 'active'
  },
  {
    id: 'std-250214',
    roll: '250214',
    admissionDate: '15/07/2025',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'B',
    nameEn: 'EMON DAS',
    nameBn: 'ইমন দাস',
    fatherName: 'KOMOL DAS',
    motherName: 'Shikha Rani Das',
    gender: 'Male',
    religion: 'Hindu',
    bloodGroup: 'AB+',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '9988776655',
    studentMobile: '01933445566',
    guardianMobile: '01933445511',
    whatsappNo: '01933445566',
    address: 'Magurapotti, Jhikargacha',
    academicType: 'SSC',
    academicYear: '2023',
    academicRoll: '610293',
    academicReg: '887766',
    academicResult: '4.67',
    schoolName: 'Jhikargacha High School',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2800,
    attendancePercentage: 75,
    resultGrade: 'A+',
    resultMarks: 420,
    status: 'active'
  },
  {
    id: 'std-250217',
    roll: '250217',
    admissionDate: '18/07/2025',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'B',
    nameEn: 'FARJANA AKTER SUMI',
    nameBn: 'ফারজানা আক্তার সুমি',
    fatherName: 'ALAMGIR HOSEN',
    motherName: 'Rina Begum',
    gender: 'Female',
    religion: 'Islam',
    bloodGroup: 'A+',
    physicalDisability: 'No',
    identityType: 'BRC',
    identityNumber: '20015522334455667',
    studentMobile: '01744556677',
    guardianMobile: '01744556622',
    whatsappNo: '01744556677',
    address: 'Station Road, Jhikargacha',
    academicType: 'HSC',
    academicYear: '2023',
    academicRoll: '720194',
    academicReg: '334455',
    academicResult: '4.50',
    schoolName: 'Jhikargacha Degree College',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 3000,
    attendancePercentage: 67,
    resultGrade: 'A',
    resultMarks: 360,
    status: 'active'
  },
  {
    id: 'std-250218',
    roll: '250218',
    admissionDate: '20/07/2025',
    subjectId: 'sub-2',
    subjectName: 'Database Programming',
    classSessionId: 'ses-2',
    classSessionName: 'Jul to Sep 2026 (3 Month) Database Programming',
    group: 'A',
    nameEn: 'MD TAHASIN HASAN',
    nameBn: 'মো: তাহসিন হাসান',
    fatherName: 'MD TARIQUL ISLAM',
    motherName: 'Momena Khatun',
    gender: 'Male',
    religion: 'Islam',
    bloodGroup: 'B+',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '3344112288',
    studentMobile: '01855667788',
    guardianMobile: '01855667711',
    whatsappNo: '01855667788',
    address: 'Shankarpur, Jashore',
    academicType: 'Diploma',
    academicYear: '2023',
    academicRoll: '819201',
    academicReg: '112288',
    academicResult: '3.75',
    schoolName: 'Jashore Polytechnic Institute',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2000,
    attendancePercentage: 65,
    resultGrade: 'A+',
    resultMarks: 470,
    status: 'active'
  },
  {
    id: 'std-250222',
    roll: '250222',
    admissionDate: '22/07/2025',
    subjectId: 'sub-3',
    subjectName: 'Graphic Design & Multimedia',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'C',
    nameEn: 'MD TANVIR HOSSEN',
    nameBn: 'মো: তানভীর হোসেন',
    fatherName: 'MD ROWSHAN BISWAS',
    motherName: 'Kohinur Begum',
    gender: 'Male',
    religion: 'Islam',
    bloodGroup: 'O+',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '8877221144',
    studentMobile: '01966778899',
    guardianMobile: '01966778822',
    whatsappNo: '01966778899',
    address: 'Puratan Kosba, Jashore',
    academicType: 'HSC',
    academicYear: '2022',
    academicRoll: '554411',
    academicReg: '223344',
    academicResult: '4.42',
    schoolName: 'Cantt College Jashore',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 3200,
    attendancePercentage: 88,
    resultGrade: 'A',
    resultMarks: 380,
    status: 'active'
  },
  {
    id: 'std-250225',
    roll: '250225',
    admissionDate: '25/07/2025',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'A',
    nameEn: 'MOHAMMAD SHORIF',
    nameBn: 'মোহাম্মদ শরিফ',
    fatherName: 'MD ANISUR RAHMAN',
    motherName: 'Nasima Begum',
    gender: 'Male',
    religion: 'Islam',
    bloodGroup: 'A-',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '7766554433',
    studentMobile: '01777889900',
    guardianMobile: '01777889911',
    whatsappNo: '01777889900',
    address: 'Bakchar, Jashore',
    academicType: 'SSC',
    academicYear: '2021',
    academicRoll: '332211',
    academicReg: '445566',
    academicResult: '4.80',
    schoolName: 'Jashore Zilla School',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2100,
    attendancePercentage: 74,
    resultGrade: 'A+',
    resultMarks: 420,
    status: 'active'
  },
  {
    id: 'std-250227',
    roll: '250227',
    admissionDate: '28/07/2025',
    subjectId: 'sub-2',
    subjectName: 'Database Programming',
    classSessionId: 'ses-2',
    classSessionName: 'Jul to Sep 2026 (3 Month) Database Programming',
    group: 'B',
    nameEn: 'MOYMUNA AKTAR BITHI',
    nameBn: 'ময়মুনা আক্তার বীথি',
    fatherName: 'MD MOFAZAL HOSSEN',
    motherName: 'Rehana Parvin',
    gender: 'Female',
    religion: 'Islam',
    bloodGroup: 'B-',
    physicalDisability: 'No',
    identityType: 'BRC',
    identityNumber: '20025544332211009',
    studentMobile: '01888990011',
    guardianMobile: '01888990022',
    whatsappNo: '01888990011',
    address: 'Ganganandapur, Jhikargacha',
    academicType: 'HSC',
    academicYear: '2023',
    academicRoll: '442299',
    academicReg: '551122',
    academicResult: '3.50',
    schoolName: 'Ganganandapur College',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2400,
    attendancePercentage: 82,
    resultGrade: 'B',
    resultMarks: 270,
    status: 'active'
  },
  {
    id: 'std-250230',
    roll: '250230',
    admissionDate: '30/07/2025',
    subjectId: 'sub-3',
    subjectName: 'Graphic Design & Multimedia',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'B',
    nameEn: 'MST MEHANAZ AKTER',
    nameBn: 'মোছা: মেহনাজ আক্তার',
    fatherName: 'MD BABUL ISLAM',
    motherName: 'Rokeya Begum',
    gender: 'Female',
    religion: 'Islam',
    bloodGroup: 'O+',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '6655112233',
    studentMobile: '01999001122',
    guardianMobile: '01999001133',
    whatsappNo: '01999001122',
    address: 'Bankra, Jhikargacha',
    academicType: 'SSC',
    academicYear: '2022',
    academicRoll: '556611',
    academicReg: '334411',
    academicResult: '4.17',
    schoolName: 'Bankra High School',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2600,
    attendancePercentage: 79,
    resultGrade: 'A-',
    resultMarks: 335,
    status: 'active'
  },
  {
    id: 'std-250235',
    roll: '250235',
    admissionDate: '01/08/2025',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'A',
    nameEn: 'MST SANIA ALAM ASHA',
    nameBn: 'মোছা: সানিয়া আলম আশা',
    fatherName: 'MD ALAMGIR KABIR',
    motherName: 'Taslima Akter',
    gender: 'Female',
    religion: 'Islam',
    bloodGroup: 'A+',
    physicalDisability: 'No',
    identityType: 'BRC',
    identityNumber: '20014433221199887',
    studentMobile: '01700112233',
    guardianMobile: '01700112244',
    whatsappNo: '01700112233',
    address: 'Shimulia, Jhikargacha',
    academicType: 'HSC',
    academicYear: '2023',
    academicRoll: '667788',
    academicReg: '998811',
    academicResult: '4.60',
    schoolName: 'Shimulia Degree College',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2900,
    attendancePercentage: 85,
    resultGrade: 'A',
    resultMarks: 375,
    status: 'active'
  },
  {
    id: 'std-250238',
    roll: '250238',
    admissionDate: '05/08/2025',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'A',
    nameEn: 'NAFIZIQBALL TARIUQ',
    nameBn: 'নাফিজ ইকবাল তারিক',
    fatherName: 'MD HASAN ALI',
    motherName: 'Morium Begum',
    gender: 'Male',
    religion: 'Islam',
    bloodGroup: 'B+',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '2211334455',
    studentMobile: '01811223344',
    guardianMobile: '01811223355',
    whatsappNo: '01811223344',
    address: 'Kashipur, Jashore',
    academicType: 'SSC',
    academicYear: '2022',
    academicRoll: '221199',
    academicReg: '443322',
    academicResult: '4.89',
    schoolName: 'Kashipur High School',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2500,
    attendancePercentage: 78,
    resultGrade: 'A+',
    resultMarks: 475,
    status: 'active'
  },
  {
    id: 'std-250240',
    roll: '250240',
    admissionDate: '08/08/2025',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'C',
    nameEn: 'PREM BISWAS',
    nameBn: 'প্রেম বিশ্বাস',
    fatherName: 'UTTAM BISWAS',
    motherName: 'Anjana Biswas',
    gender: 'Male',
    religion: 'Hindu',
    bloodGroup: 'O+',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '8899112233',
    studentMobile: '01922334455',
    guardianMobile: '01922334466',
    whatsappNo: '01922334455',
    address: 'Gadkhali, Jhikargacha',
    academicType: 'HSC',
    academicYear: '2023',
    academicRoll: '443311',
    academicReg: '887722',
    academicResult: '4.75',
    schoolName: 'Gadkhali Degree College',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2200,
    attendancePercentage: 71,
    resultGrade: 'A+',
    resultMarks: 450,
    status: 'active'
  },
  {
    id: 'std-250245',
    roll: '250245',
    admissionDate: '10/08/2025',
    subjectId: 'sub-2',
    subjectName: 'Database Programming',
    classSessionId: 'ses-2',
    classSessionName: 'Jul to Sep 2026 (3 Month) Database Programming',
    group: 'A',
    nameEn: 'RUHANI AMRIN PRIONTI',
    nameBn: 'রুহানী আমরিন প্রিয়ন্তী',
    fatherName: 'MD SHAHJAHAN KABIR',
    motherName: 'Afroza Begum',
    gender: 'Female',
    religion: 'Islam',
    bloodGroup: 'AB+',
    physicalDisability: 'No',
    identityType: 'BRC',
    identityNumber: '20021122334455667',
    studentMobile: '01733445566',
    guardianMobile: '01733445577',
    whatsappNo: '01733445566',
    address: 'Navaron, Sharsha, Jashore',
    academicType: 'SSC',
    academicYear: '2023',
    academicRoll: '331188',
    academicReg: '992211',
    academicResult: '3.67',
    schoolName: 'Navaron High School',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2700,
    attendancePercentage: 80,
    resultGrade: 'B',
    resultMarks: 280,
    status: 'active'
  },
  {
    id: 'std-250248',
    roll: '250248',
    admissionDate: '12/08/2025',
    subjectId: 'sub-3',
    subjectName: 'Graphic Design & Multimedia',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'A',
    nameEn: 'RUP KUMARY DAS',
    nameBn: 'রূপ কুমারী দাস',
    fatherName: 'KANGAL DAS',
    motherName: 'Subarna Das',
    gender: 'Female',
    religion: 'Hindu',
    bloodGroup: 'A+',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '4433221188',
    studentMobile: '01844556677',
    guardianMobile: '01844556688',
    whatsappNo: '01844556677',
    address: 'Mollapara, Jashore',
    academicType: 'HSC',
    academicYear: '2022',
    academicRoll: '661122',
    academicReg: '332211',
    academicResult: '4.33',
    schoolName: 'Jashore Govt Women College',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2300,
    attendancePercentage: 76,
    resultGrade: 'A-',
    resultMarks: 340,
    status: 'active'
  },
  {
    id: 'std-250250',
    roll: '250250',
    admissionDate: '15/08/2025',
    subjectId: 'sub-1',
    subjectName: 'Computer Office Applications',
    classSessionId: 'ses-1',
    classSessionName: 'July to December 2025 (6 Month) Computer Office Applications',
    group: 'B',
    nameEn: 'SAKIBUL HASAN',
    nameBn: 'সাকিবুল হাসান',
    fatherName: 'MD MUKLESHUR RAHMAN',
    motherName: 'Salma Begum',
    gender: 'Male',
    religion: 'Islam',
    bloodGroup: 'B+',
    physicalDisability: 'No',
    identityType: 'NID',
    identityNumber: '5566442211',
    studentMobile: '01955667788',
    guardianMobile: '01955667799',
    whatsappNo: '01955667788',
    address: 'Kadirpara, Jhikargacha',
    academicType: 'SSC',
    academicYear: '2021',
    academicRoll: '772211',
    academicReg: '114422',
    academicResult: '4.50',
    schoolName: 'Kadirpara High School',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    totalFeePaid: 2600,
    attendancePercentage: 83,
    resultGrade: 'A',
    resultMarks: 380,
    status: 'active'
  }
];

const DEFAULT_TRANSACTIONS: FeeTransaction[] = [
  {
    id: 'ftx-1',
    receiptNumber: 'REC-2026-001',
    studentId: 'std-260202',
    studentRoll: '260202',
    studentName: 'Eleas Kanchon',
    studentFather: 'Md Abdul Awal Molla',
    className: 'July to December 2025 (6 Month) Computer Office Applications',
    month: 'January 2026',
    date: '05 Jan 2026',
    items: [
      { id: 'item-1', particulars: 'Monthly Tuition fees', amount: 500 },
      { id: 'item-2', particulars: 'Admission fee', amount: 550 },
      { id: 'item-3', particulars: 'Registration fee', amount: 550 },
      { id: 'item-4', particulars: 'Id card', amount: 100 },
      { id: 'item-5', particulars: 'Books', amount: 100 }
    ],
    total: 1800,
    deposit: 1800,
    previousBalance: 1000,
    totalDeposit: 2800,
    balanceRemaining: 0,
    createdAt: '2026-01-05T10:00:00.000Z'
  },
  {
    id: 'ftx-2',
    receiptNumber: 'REC-2026-002',
    studentId: 'std-260201',
    studentRoll: '260201',
    studentName: 'Arifa Yeasmin',
    studentFather: 'Md. Yunus Ali',
    className: 'Jan to Jun 2026 (6 Month) Computer Office Applications',
    month: 'January 2026',
    date: '08 Jan 2026',
    items: [
      { id: 'item-1', particulars: 'Monthly Tuition fees', amount: 500 },
      { id: 'item-2', particulars: 'Admission fee', amount: 500 }
    ],
    total: 1000,
    deposit: 1000,
    previousBalance: 0,
    totalDeposit: 1000,
    balanceRemaining: 0,
    createdAt: '2026-01-08T11:15:00.000Z'
  }
];

const DEFAULT_ACCOUNTS: AccountTransaction[] = [
  { id: 'acc-1', date: '05/01/2026', type: 'income', description: 'Student Fees - Eleas Kanchon (Roll: 260202)', amount: 1800, category: 'Student Fees', referenceStudentId: 'std-260202' },
  { id: 'acc-2', date: '08/01/2026', type: 'income', description: 'Student Fees - Arifa Yeasmin (Roll: 260201)', amount: 1000, category: 'Student Fees', referenceStudentId: 'std-260201' },
  { id: 'acc-3', date: '10/01/2026', type: 'expense', description: 'Electricity Bill & Internet Connection', amount: 1200, category: 'Utilities' },
  { id: 'acc-4', date: '12/01/2026', type: 'expense', description: 'Computer Lab Maintenance & Keyboards', amount: 1500, category: 'Hardware' },
  { id: 'acc-5', date: '15/01/2026', type: 'income', description: 'New Admissions Processing', amount: 3500, category: 'Admissions' },
  { id: 'acc-6', date: '20/01/2026', type: 'expense', description: 'Office Printing Paper & Cartridge Refill', amount: 800, category: 'Office Supplies' },
  { id: 'acc-7', date: '28/01/2026', type: 'income', description: 'Special Graphic Design Workshop Fees', amount: 4500, category: 'Workshops' },
  { id: 'acc-8', date: '02/02/2026', type: 'income', description: 'Student Monthly Fees Batch-76', amount: 9500, category: 'Tuition' },
  { id: 'acc-9', date: '15/02/2026', type: 'expense', description: 'Staff Refreshments and Tea Snacks', amount: 650, category: 'Refreshment' }
];

const DEFAULT_ROLES: Role[] = [
  {
    id: 'role-admin',
    title: 'Admin',
    permissions: {
      Root: true,
      Administrator: true,
      'Income Expense': true,
      Attendance: true,
      'Institute Settings': true,
      'Class Management': true,
      'Fee Collection': true,
      'Database Backup': true,
      User: true
    }
  },
  {
    id: 'role-teacher',
    title: 'Teacher',
    permissions: {
      Root: false,
      Administrator: false,
      'Income Expense': false,
      Attendance: true,
      'Institute Settings': false,
      'Class Management': true,
      'Fee Collection': false,
      'Database Backup': false,
      User: false
    }
  },
  {
    id: 'role-accountant',
    title: 'Accountant',
    permissions: {
      Root: false,
      Administrator: false,
      'Income Expense': true,
      Attendance: false,
      'Institute Settings': false,
      'Class Management': false,
      'Fee Collection': true,
      'Database Backup': false,
      User: false
    }
  }
];

const DEFAULT_USER: User = {
  id: 'usr-admin-1',
  username: 'admin',
  email: 'admin@institute.gov.bd',
  fullName: 'Eleas Kanchon',
  gender: 'Male',
  role: 'Admin',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  passwordHash: 'admin123'
};

const DEFAULT_BACKUPS: DatabaseBackupRecord[] = [
  {
    id: 'bk-1',
    fileName: 'backup_ucti_2026_10_06.json',
    timestamp: 'Tue, Oct 06, 2026 05:09 PM',
    fileSize: '48.2 KB',
    notes: 'Pre-scheduled automated system backup'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>('std-260202');
  const [isCapsuleSidebar, setIsCapsuleSidebar] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showInstallGuide, setShowInstallGuide] = useState<boolean>(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ucti_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ucti_auth') === 'true';
  });

  // Data Collections with LocalStorage hydration
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ucti_students');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('ucti_subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [classSessions, setClassSessions] = useState<ClassSession[]>(() => {
    const saved = localStorage.getItem('ucti_class_sessions');
    return saved ? JSON.parse(saved) : DEFAULT_SESSIONS;
  });

  const [feeTransactions, setFeeTransactions] = useState<FeeTransaction[]>(() => {
    const saved = localStorage.getItem('ucti_fee_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('ucti_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [results, setResults] = useState<StudentResult[]>(() => {
    const saved = localStorage.getItem('ucti_results');
    return saved ? JSON.parse(saved) : [];
  });

  const [accounts, setAccounts] = useState<AccountTransaction[]>(() => {
    const saved = localStorage.getItem('ucti_accounts');
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  });

  const [roles, setRoles] = useState<Role[]>(() => {
    const saved = localStorage.getItem('ucti_roles');
    return saved ? JSON.parse(saved) : DEFAULT_ROLES;
  });

  const [instituteSettings, setInstituteSettings] = useState<InstituteSettings>(() => {
    const saved = localStorage.getItem('ucti_institute_settings');
    return saved ? JSON.parse(saved) : DEFAULT_INSTITUTE_SETTINGS;
  });

  const [backupHistory, setBackupHistory] = useState<DatabaseBackupRecord[]>(() => {
    const saved = localStorage.getItem('ucti_backups');
    return saved ? JSON.parse(saved) : DEFAULT_BACKUPS;
  });

  // Sync to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('ucti_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ucti_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('ucti_class_sessions', JSON.stringify(classSessions));
  }, [classSessions]);

  useEffect(() => {
    localStorage.setItem('ucti_fee_transactions', JSON.stringify(feeTransactions));
  }, [feeTransactions]);

  useEffect(() => {
    localStorage.setItem('ucti_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('ucti_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('ucti_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('ucti_roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('ucti_institute_settings', JSON.stringify(instituteSettings));
  }, [instituteSettings]);

  useEffect(() => {
    localStorage.setItem('ucti_backups', JSON.stringify(backupHistory));
  }, [backupHistory]);

  // Auth Functions
  const login = (username: string, pass: string): boolean => {
    if (
      (username === 'admin' || username === currentUser?.username || username === currentUser?.email) &&
      (pass === 'admin123' || pass === currentUser?.passwordHash)
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('ucti_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ucti_auth');
    setCurrentView('dashboard');
  };

  const updateCurrentUser = (userData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...userData };
    setCurrentUser(updated);
    localStorage.setItem('ucti_user', JSON.stringify(updated));
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'totalFeePaid' | 'attendancePercentage' | 'resultGrade' | 'resultMarks' | 'status'>): Student => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      totalFeePaid: 0,
      attendancePercentage: 100,
      resultGrade: 'Pending',
      resultMarks: 0,
      status: 'active'
    };
    setStudents(prev => [newStudent, ...prev]);

    // Update session counts
    if (newStudent.classSessionId) {
      setClassSessions(prev =>
        prev.map(s => {
          if (s.id === newStudent.classSessionId) {
            return {
              ...s,
              totalStudents: s.totalStudents + 1,
              maleCount: newStudent.gender === 'Male' ? s.maleCount + 1 : s.maleCount,
              femaleCount: newStudent.gender === 'Female' ? s.femaleCount + 1 : s.femaleCount
            };
          }
          return s;
        })
      );
    }
    return newStudent;
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const getStudentById = (id: string) => {
    return students.find(s => s.id === id);
  };

  const getStudentByRoll = (roll: string) => {
    return students.find(s => s.roll === roll);
  };

  // Subject CRUD
  const addSubject = (code: string, name: string) => {
    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      code: code.trim(),
      name: name.trim()
    };
    setSubjects(prev => [...prev, newSub]);
  };

  const updateSubject = (id: string, code: string, name: string) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, code, name } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // Class Session CRUD
  const addClassSession = (sessionData: Omit<ClassSession, 'id' | 'totalStudents' | 'maleCount' | 'femaleCount'>) => {
    const newSession: ClassSession = {
      ...sessionData,
      id: `ses-${Date.now()}`,
      totalStudents: 0,
      maleCount: 0,
      femaleCount: 0
    };
    setClassSessions(prev => [newSession, ...prev]);
  };

  const updateClassSession = (id: string, updated: Partial<ClassSession>) => {
    setClassSessions(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteClassSession = (id: string) => {
    setClassSessions(prev => prev.filter(s => s.id !== id));
  };

  const toggleClassSessionActive = (id: string) => {
    setClassSessions(prev =>
      prev.map(s => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Fee Collection
  const addFeeTransaction = (data: Omit<FeeTransaction, 'id' | 'receiptNumber' | 'createdAt'>): FeeTransaction => {
    const receiptNum = `REC-2026-${String(feeTransactions.length + 1).padStart(3, '0')}`;
    const newTx: FeeTransaction = {
      ...data,
      id: `ftx-${Date.now()}`,
      receiptNumber: receiptNum,
      createdAt: new Date().toISOString()
    };

    setFeeTransactions(prev => [newTx, ...prev]);

    // Update student total fee paid
    setStudents(prev =>
      prev.map(st => {
        if (st.id === data.studentId || st.roll === data.studentRoll) {
          return {
            ...st,
            totalFeePaid: (st.totalFeePaid || 0) + data.deposit
          };
        }
        return st;
      })
    );

    // Auto add to Accounts as income
    const accountEntry: AccountTransaction = {
      id: `acc-${Date.now()}`,
      date: data.date,
      type: 'income',
      description: `Fee Receipt ${receiptNum} - ${data.studentName} (Roll: ${data.studentRoll})`,
      amount: data.deposit,
      category: 'Student Fees',
      referenceStudentId: data.studentId
    };
    setAccounts(prev => [accountEntry, ...prev]);

    return newTx;
  };

  // Attendance
  const saveAttendance = (date: string, classSessionId: string, records: { studentId: string; roll: string; name: string; status: 'Present' | 'Leave' | 'Absent' }[]) => {
    const newRec: AttendanceRecord = {
      id: `att-${Date.now()}`,
      date,
      classSessionId,
      records
    };
    setAttendanceRecords(prev => [newRec, ...prev]);

    // Recalculate attendance percentage for each affected student
    records.forEach(r => {
      // Find all past attendance records for this student
      const allStudentEntries = [...attendanceRecords, newRec].flatMap(rec =>
        rec.records.filter(sr => sr.studentId === r.studentId)
      );
      if (allStudentEntries.length > 0) {
        const presentCount = allStudentEntries.filter(e => e.status === 'Present').length;
        const pct = Math.round((presentCount / allStudentEntries.length) * 100);
        updateStudent(r.studentId, { attendancePercentage: pct });
      }
    });
  };

  // Results
  const saveStudentResult = (studentId: string, classSessionId: string, marks: number) => {
    const grade = calculateGrade(marks);
    const existingIndex = results.findIndex(r => r.studentId === studentId && r.classSessionId === classSessionId);
    const targetStudent = getStudentById(studentId);

    if (existingIndex >= 0) {
      setResults(prev =>
        prev.map((r, idx) => (idx === existingIndex ? { ...r, marks, grade } : r))
      );
    } else {
      const newRes: StudentResult = {
        id: `res-${Date.now()}`,
        classSessionId,
        studentId,
        roll: targetStudent?.roll || '',
        name: targetStudent?.nameEn || '',
        fatherName: targetStudent?.fatherName || '',
        marks,
        grade
      };
      setResults(prev => [...prev, newRes]);
    }

    // Update on student record
    updateStudent(studentId, { resultMarks: marks, resultGrade: grade });
  };

  // Accounts
  const addAccountTransaction = (tx: Omit<AccountTransaction, 'id'>) => {
    const newTx: AccountTransaction = {
      ...tx,
      id: `acc-${Date.now()}`
    };
    setAccounts(prev => [newTx, ...prev]);
  };

  const deleteAccountTransaction = (id: string) => {
    setAccounts(prev => prev.filter(t => t.id !== id));
  };

  // Roles
  const addRole = (title: string, permissions: { [key: string]: boolean }) => {
    const newRole: Role = {
      id: `role-${Date.now()}`,
      title,
      permissions
    };
    setRoles(prev => [...prev, newRole]);
  };

  const updateRole = (id: string, title: string, permissions: { [key: string]: boolean }) => {
    setRoles(prev => prev.map(r => (r.id === id ? { ...r, title, permissions } : r)));
  };

  const deleteRole = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  // Institute Settings
  const updateInstituteSettings = (newSettings: Partial<InstituteSettings>) => {
    setInstituteSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Database Backup & Restore
  const exportDatabaseJSON = (): string => {
    const fullDatabase = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      instituteSettings,
      users: [currentUser],
      roles,
      subjects,
      classSessions,
      students,
      feeTransactions,
      attendanceRecords,
      results,
      accounts
    };
    const jsonStr = JSON.stringify(fullDatabase, null, 2);

    // Add to backup history
    const d = new Date();
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newBackupRec: DatabaseBackupRecord = {
      id: `bk-${Date.now()}`,
      fileName: `backup_ucti_${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, '0')}_${String(d.getDate()).padStart(2, '0')}.json`,
      timestamp: `${dateStr} ${timeStr}`,
      fileSize: `${(new Blob([jsonStr]).size / 1024).toFixed(1)} KB`,
      notes: 'Manual system backup by Admin'
    };
    setBackupHistory(prev => [newBackupRec, ...prev]);

    return jsonStr;
  };

  const restoreDatabaseJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.students && Array.isArray(data.students)) setStudents(data.students);
      if (data.subjects && Array.isArray(data.subjects)) setSubjects(data.subjects);
      if (data.classSessions && Array.isArray(data.classSessions)) setClassSessions(data.classSessions);
      if (data.feeTransactions && Array.isArray(data.feeTransactions)) setFeeTransactions(data.feeTransactions);
      if (data.attendanceRecords && Array.isArray(data.attendanceRecords)) setAttendanceRecords(data.attendanceRecords);
      if (data.results && Array.isArray(data.results)) setResults(data.results);
      if (data.accounts && Array.isArray(data.accounts)) setAccounts(data.accounts);
      if (data.roles && Array.isArray(data.roles)) setRoles(data.roles);
      if (data.instituteSettings) setInstituteSettings(data.instituteSettings);
      return true;
    } catch (e) {
      console.error('Failed to parse and restore database JSON:', e);
      return false;
    }
  };

  const resetDatabaseToDefault = () => {
    setStudents(DEFAULT_STUDENTS);
    setSubjects(DEFAULT_SUBJECTS);
    setClassSessions(DEFAULT_SESSIONS);
    setFeeTransactions(DEFAULT_TRANSACTIONS);
    setAccounts(DEFAULT_ACCOUNTS);
    setRoles(DEFAULT_ROLES);
    setInstituteSettings(DEFAULT_INSTITUTE_SETTINGS);
    setAttendanceRecords([]);
    setResults([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedStudentId,
        setSelectedStudentId,
        isCapsuleSidebar,
        setIsCapsuleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        showInstallGuide,
        setShowInstallGuide,
        currentUser,
        isAuthenticated,
        login,
        logout,
        updateCurrentUser,
        students,
        subjects,
        classSessions,
        feeTransactions,
        attendanceRecords,
        results,
        accounts,
        roles,
        instituteSettings,
        backupHistory,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
        getStudentByRoll,
        addSubject,
        updateSubject,
        deleteSubject,
        addClassSession,
        updateClassSession,
        deleteClassSession,
        toggleClassSessionActive,
        addFeeTransaction,
        saveAttendance,
        saveStudentResult,
        addAccountTransaction,
        deleteAccountTransaction,
        addRole,
        updateRole,
        deleteRole,
        updateInstituteSettings,
        exportDatabaseJSON,
        restoreDatabaseJSON,
        resetDatabaseToDefault
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
