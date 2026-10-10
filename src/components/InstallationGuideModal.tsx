import React from 'react';
import { X, Server, Globe, Download, CheckCircle2, Copy, BookOpen, Printer, AlertTriangle, Code, Database } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallationGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'xampp' | 'web' | 'sql'>('xampp');
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const htaccessCode = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`;

  const sqlCode = `-- Training Institute Student Management System Database Schema
CREATE DATABASE IF NOT EXISTS \`training_institute_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`training_institute_db\`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`username\` VARCHAR(100) NOT NULL UNIQUE,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`full_name\` VARCHAR(150) NOT NULL,
  \`gender\` VARCHAR(20) DEFAULT 'Male',
  \`role\` VARCHAR(50) DEFAULT 'Admin',
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`avatar_url\` TEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS \`subjects\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`code\` VARCHAR(20) NOT NULL UNIQUE,
  \`name\` VARCHAR(150) NOT NULL
);

-- 3. Class Sessions Table
CREATE TABLE IF NOT EXISTS \`class_sessions\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`starting_month\` VARCHAR(20) NOT NULL,
  \`ending_month\` VARCHAR(20) NOT NULL,
  \`year\` VARCHAR(10) NOT NULL,
  \`subject_id\` VARCHAR(50),
  \`duration\` VARCHAR(50) NOT NULL,
  \`monthly_tuition_fees\` DECIMAL(10,2) DEFAULT 0,
  \`is_active\` BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (\`subject_id\`) REFERENCES \`subjects\`(\`id\`) ON DELETE SET NULL
);

-- 4. Students Table
CREATE TABLE IF NOT EXISTS \`students\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`roll\` VARCHAR(50) NOT NULL UNIQUE,
  \`name_en\` VARCHAR(150) NOT NULL,
  \`name_bn\` VARCHAR(150),
  \`father_name\` VARCHAR(150) NOT NULL,
  \`mother_name\` VARCHAR(150) NOT NULL,
  \`gender\` VARCHAR(20) NOT NULL,
  \`religion\` VARCHAR(50),
  \`blood_group\` VARCHAR(10),
  \`student_mobile\` VARCHAR(30) NOT NULL,
  \`guardian_mobile\` VARCHAR(30) NOT NULL,
  \`whatsapp_no\` VARCHAR(30),
  \`address\` TEXT,
  \`class_session_id\` VARCHAR(50),
  \`group_name\` VARCHAR(10) DEFAULT 'A',
  \`total_fee_paid\` DECIMAL(10,2) DEFAULT 0,
  \`attendance_percentage\` INT DEFAULT 100,
  \`result_grade\` VARCHAR(10) DEFAULT 'Pending',
  \`result_marks\` INT DEFAULT 0,
  \`admission_date\` VARCHAR(30),
  \`photo_url\` TEXT,
  FOREIGN KEY (\`class_session_id\`) REFERENCES \`class_sessions\`(\`id\`) ON DELETE SET NULL
);

-- 5. Fee Transactions Table
CREATE TABLE IF NOT EXISTS \`fee_transactions\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`receipt_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`student_id\` VARCHAR(50),
  \`student_roll\` VARCHAR(50),
  \`month\` VARCHAR(50),
  \`date\` VARCHAR(50),
  \`deposit\` DECIMAL(10,2) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE
);

-- Default Admin User (Password: admin123)
INSERT INTO \`users\` (\`id\`, \`username\`, \`email\`, \`full_name\`, \`gender\`, \`role\`, \`password_hash\`)
VALUES ('usr-admin-1', 'admin', 'admin@institute.gov.bd', 'Eleas Kanchon', 'Male', 'Admin', 'admin123')
ON DUPLICATE KEY UPDATE \`username\`=\`username\`;`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">System Installation &amp; Deployment Manual</h3>
              <p className="text-xs text-purple-200">XAMPP ও লাইভ ওয়েব সার্ভারে ইনস্টল করার সম্পূর্ণ স্টেপ-বাই-স্টেপ নিয়মাবলী</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Download Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs text-emerald-950 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>XAMPP Ready ZIP Package (291 KB):</strong> সরাসরি htdocs ফোল্ডারে পেস্ট করে চালানোর জন্য সম্পূর্ণ রেডি প্যাকেজ।</span>
          </div>
          <a
            href="/training_institute_system.zip"
            download="training_institute_system.zip"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-transform hover:scale-105"
          >
            <Download className="w-3.5 h-3.5" />
            Download ZIP Package
          </a>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('xampp')}
            className={`flex items-center gap-2 px-5 py-2.5 font-medium text-xs rounded-t-lg transition-all border-b-2 ${
              activeTab === 'xampp'
                ? 'border-purple-600 text-purple-700 bg-white shadow-xs font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4 text-orange-600" />
            XAMPP Local Server
          </button>
          <button
            onClick={() => setActiveTab('web')}
            className={`flex items-center gap-2 px-5 py-2.5 font-medium text-xs rounded-t-lg transition-all border-b-2 ${
              activeTab === 'web'
                ? 'border-purple-600 text-purple-700 bg-white shadow-xs font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            Live Web Server (cPanel)
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 px-5 py-2.5 font-medium text-xs rounded-t-lg transition-all border-b-2 ${
              activeTab === 'sql'
                ? 'border-purple-600 text-purple-700 bg-white shadow-xs font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-purple-600" />
            MySQL Schema &amp; .htaccess
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* TAB 1: XAMPP Local Server */}
          {activeTab === 'xampp' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 flex gap-3">
                <span className="text-lg">📌</span>
                <div>
                  <h4 className="font-bold text-amber-950 mb-0.5">XAMPP লোকাল সার্ভারের প্রাথমিক প্রস্তুতি:</h4>
                  <p className="text-[11px] leading-relaxed">
                    সফটওয়্যার রিকোয়ারমেন্ট: XAMPP Control Panel (Apache &amp; MySQL চালু থাকতে হবে), যেকোনো আধুনিক ব্রাউজার (Chrome, Edge, Firefox), এবং প্রজেক্ট ফাইল।
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs">1</span>
                  XAMPP চালু করা (Apache ও MySQL Start)
                </h4>
                <p className="text-slate-600">
                  আপনার কম্পিউটারে <strong>XAMPP Control Panel</strong> ওপেন করুন। তারপর <strong>Apache</strong> এবং <strong>MySQL</strong> মডিউলের পাশে থাকা <span className="font-bold text-emerald-700">"Start"</span> বাটনে ক্লিক করুন। নিশ্চিত করুন যে উভয় মডিউলের ব্যাকগ্রাউন্ড সবুজ হয়ে পোর্ট নাম্বার দেখাচ্ছে (Apache: 80, 443 | MySQL: 3306)।
                </p>
              </div>

              {/* Step 2 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs">2</span>
                  প্রজেক্টের ফাইল htdocs ফোল্ডারে পেস্ট করা
                </h4>
                <p className="text-slate-600">
                  আপনার কম্পিউটারের <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono">C:\xampp\htdocs\</code> ডিরেক্টরিতে যান।
                </p>
                <p className="text-slate-600">
                  সেখানে একটি নতুন ফোল্ডার তৈরি করুন, উদাহরণস্বরূপ: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono">training_institute</code>। তৈরি করা প্রজেক্টের বিল্ড ফাইলসমূহ (যেমন: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">dist</code> ফোল্ডারের ভেতরের সমস্ত ফাইল ও সাবফোল্ডার) এই ফোল্ডারে কপি করে রাখুন।
                </p>
              </div>

              {/* Step 3 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs">3</span>
                    phpMyAdmin-এ ডাটাবেস তৈরি ও ইম্পোর্ট
                  </h4>
                  <button
                    onClick={() => setActiveTab('sql')}
                    className="text-xs text-purple-700 hover:underline font-semibold flex items-center gap-1"
                  >
                    View SQL Script
                  </button>
                </div>
                <p className="text-slate-600">
                  ব্রাউজারে গিয়ে <code className="text-purple-700 font-bold font-mono">http://localhost/phpmyadmin</code> লিখে এন্টার চাপুন।
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>বামপাশের <strong>"New"</strong> বাটনে ক্লিক করুন।</li>
                  <li>Database Name দিন: <code className="font-bold text-slate-900 font-mono">training_institute_db</code>।</li>
                  <li>Collation নির্বাচন করুন: <code className="font-mono">utf8mb4_unicode_ci</code> এবং <strong>"Create"</strong> বাটনে ক্লিক করুন।</li>
                  <li>উপরের <strong>"Import"</strong> ট্যাবে যান অথবা সিস্টেমে থাকা "Database Backup" সেকশন থেকে নেওয়া ব্যাকআপ ফাইলটি ইম্পোর্ট করুন।</li>
                </ol>
              </div>

              {/* Step 4 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs">4</span>
                  লোকালহোস্টে অ্যাপ্লিকেশন ব্রাউজ করা
                </h4>
                <p className="text-slate-600">
                  ব্রাউজারের এড্রেস বারে নিচের ইউআরএলটি লিখে এন্টার চাপুন:
                </p>
                <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center justify-between font-mono font-bold text-emerald-950">
                  <span>http://localhost/training_institute</span>
                  <span className="text-[11px] font-sans text-slate-600 font-normal">Login: admin / admin123</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Live Web Server (cPanel) */}
          {activeTab === 'web' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900 flex gap-3">
                <span className="text-lg">🌐</span>
                <div>
                  <h4 className="font-bold text-blue-950 mb-0.5">লাইভ ওয়েব হোস্টিং (cPanel / Shared / Cloud VPS) গাইড:</h4>
                  <p className="text-[11px] leading-relaxed">
                    আপনার ক্রয়কৃত ডোমেইন এবং সিপ্যানেল হোস্টিংয়ে সিস্টেমটি লাইভ রান করার জন্য নিচের ধাপগুলো যথাযথভাবে অনুসরণ করুন।
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">1</span>
                  প্রজেক্ট প্রোডাকশন বিল্ড তৈরি
                </h4>
                <p className="text-slate-600">
                  টার্মিনালে <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">npm run build</code> কমান্ড চালিয়ে <code className="font-mono">dist</code> ফোল্ডারটি প্রস্তুত করুন। তারপর <code className="font-mono">dist</code> ফোল্ডারের ফাইলসমূহ একটি ZIP ফাইলে জিপ করুন।
                </p>
              </div>

              {/* Step 2 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">2</span>
                  cPanel File Manager-এ আপলোড ও Extract
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>আপনার হোস্টিংয়ের cPanel-এ লগইন করুন এবং <strong>File Manager</strong> ওপেন করুন।</li>
                  <li>মেইন ডোমেইনের জন্য <strong>public_html</strong> ফোল্ডারে অথবা সাবডোমেইনের ফোল্ডারে প্রবেশ করুন।</li>
                  <li>উপরে থাকা <strong>Upload</strong> বাটনে ক্লিক করে প্রস্তুতকৃত ZIP ফাইলটি আপলোড করুন।</li>
                  <li>আপলোড সম্পন্ন হলে ফাইলটিতে রাইট ক্লিক করে <strong>Extract</strong> (আনজিপ) করুন।</li>
                </ol>
              </div>

              {/* Step 3 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">3</span>
                  MySQL Database Wizard দিয়ে ডাটাবেস ও ইউজার তৈরি
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>cPanel ড্যাশবোর্ডে <strong>MySQL® Database Wizard</strong>-এ ক্লিক করুন।</li>
                  <li>নতুন ডাটাবেসের নাম দিন (যেমন: <code className="font-mono">cpuser_ucti_db</code>)।</li>
                  <li>ডাটাবেস ইউজারনেম ও শক্তিশালী পাসওয়ার্ড প্রদান করে ইউজার তৈরি করুন।</li>
                  <li>ইউজার পারমিশন ধাপে <strong>ALL PRIVILEGES</strong> চেকবক্সে টিক দিয়ে Next বাটনে চাপুন।</li>
                  <li>এবার <strong>phpMyAdmin</strong>-এ গিয়ে ডাটাবেসটিতে SQL ফাইল ইম্পোর্ট করুন।</li>
                </ol>
              </div>

              {/* Step 4 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">4</span>
                  .htaccess ফাইল কনফিগারেশন (রাউটিং ও SSL)
                </h4>
                <p className="text-slate-600">
                  React SPA রাউটিং যাতে ব্রাউজার রিফ্রেশে 404 নট ফাউন্ড না দেয় সেজন্য <code className="font-mono">.htaccess</code> ফাইল তৈরি করে রিরুল কোড পেস্ট করুন (ট্যাব ৩-এ কোড দেওয়া আছে)।
                </p>
                <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-xs">
                  https://yourdomain.com/
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MySQL Schema & .htaccess */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              {/* .htaccess block */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Code className="w-4 h-4 text-purple-700" />
                    .htaccess Configuration (Apache / cPanel)
                  </h4>
                  <button
                    onClick={() => copyCode(htaccessCode, 'ht1')}
                    className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold text-xs"
                  >
                    {copiedSection === 'ht1' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy .htaccess
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto font-mono text-[11px] leading-relaxed">
                  {htaccessCode}
                </pre>
              </div>

              {/* SQL Schema block */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-700" />
                    MySQL Database Schema Script (SQL)
                  </h4>
                  <button
                    onClick={() => copyCode(sqlCode, 'sql1')}
                    className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold text-xs"
                  >
                    {copiedSection === 'sql1' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy SQL Script
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto font-mono text-[10px] leading-relaxed max-h-60">
                  {sqlCode}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-medium">
            Upazila Computer Training Institute — Deployment Engine
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print Manual
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
