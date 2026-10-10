/**
 * Type definitions for Training Institute Student Management System
 */

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  gender: string;
  role: string;
  avatarUrl: string;
  passwordHash: string;
}

export interface Role {
  id: string;
  title: string;
  permissions: { [key: string]: boolean };
}

export interface Student {
  id: string;
  roll: string; // e.g., '260202'
  admissionDate: string; // dd/mm/yyyy
  subjectId: string;
  subjectName: string;
  classSessionId: string;
  classSessionName: string; // e.g., 'Jan to Jun 2026 (6 Month) Computer Office Applications'
  group: 'A' | 'B' | 'C' | 'D' | 'E';
  
  // Personal Info
  nameEn: string;
  nameBn: string;
  fatherName: string;
  motherName: string;
  gender: 'Male' | 'Female' | 'Other';
  religion: 'Islam' | 'Hindu' | 'Kristian' | 'Buddha' | 'Others';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  physicalDisability: 'Yes' | 'No';
  identityType: 'NID' | 'BRC';
  identityNumber: string;
  
  // Contact Info
  studentMobile: string;
  guardianMobile: string;
  whatsappNo: string;
  address: string;
  
  // Academic Info
  academicType: string; // e.g., 'SSC', 'HSC'
  academicYear: string;
  academicRoll: string;
  academicReg: string;
  academicResult: string;
  schoolName: string;
  
  // Attachments
  photoUrl: string;
  documentUrl?: string;
  
  // Financial & Academic summary
  totalFeePaid: number;
  attendancePercentage: number;
  resultGrade: string; // e.g., 'A+', 'A', 'Pending'
  resultMarks: number;
  status: 'active' | 'inactive';
}

export interface Subject {
  id: string;
  code: string; // e.g., '76', '79', '81'
  name: string; // e.g., 'Computer Office Applications'
}

export interface ClassSession {
  id: string;
  startingMonth: string;
  endingMonth: string;
  year: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  duration: string; // '3 Month', '6 Month', '1 Year'
  monthlyTuitionFees: number;
  groups: string[]; // ['A', 'B', 'C']
  isActive: boolean;
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
}

export interface FeeItem {
  id: string;
  particulars: string;
  amount: number;
}

export interface FeeTransaction {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  studentFather: string;
  className: string;
  month: string;
  date: string;
  items: FeeItem[];
  total: number;
  deposit: number;
  previousBalance: number;
  totalDeposit: number;
  balanceRemaining: number;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // dd/mm/yyyy
  classSessionId: string;
  records: {
    studentId: string;
    roll: string;
    name: string;
    status: 'Present' | 'Leave' | 'Absent';
  }[];
}

export interface StudentResult {
  id: string;
  classSessionId: string;
  studentId: string;
  roll: string;
  name: string;
  fatherName: string;
  marks: number;
  grade: 'A+' | 'A' | 'A-' | 'B' | 'C' | 'F' | 'Pending';
}

export interface AccountTransaction {
  id: string;
  date: string; // dd/mm/yyyy
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  referenceStudentId?: string;
}

export interface InstituteSettings {
  instituteName: string;
  targetLine: string; // slogan or subtitle
  phone: string;
  website: string;
  address: string;
  country: string;
  email: string;
  currency: string; // '৳'
  admissionLetterRulesText: string;
  idCardBackSideText: string;
  invoiceText: string;
  logoUrl: string;
  qrCodeUrl: string;
  loginBackgroundUrl: string;
}

export interface DatabaseBackupRecord {
  id: string;
  timestamp: string;
  fileName: string;
  fileSize: string;
  notes?: string;
}
