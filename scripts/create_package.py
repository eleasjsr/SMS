import os
import shutil
import zipfile

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DIST_DIR = os.path.join(BASE_DIR, "dist")
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
STAGING_DIR = os.path.join(BASE_DIR, "staging_xampp")
OUTPUT_ZIP_PUBLIC = os.path.join(PUBLIC_DIR, "training_institute_system.zip")
OUTPUT_ZIP_DIST = os.path.join(DIST_DIR, "training_institute_system.zip")

print(f"Creating XAMPP package from {BASE_DIR}...")

if os.path.exists(STAGING_DIR):
    shutil.rmtree(STAGING_DIR)
os.makedirs(STAGING_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

# 1. Copy dist contents to staging
if os.path.exists(DIST_DIR):
    for item in os.listdir(DIST_DIR):
        if item.endswith(".zip"):
            continue
        s = os.path.join(DIST_DIR, item)
        d = os.path.join(STAGING_DIR, item)
        if os.path.isdir(s):
            shutil.copytree(s, d)
        else:
            shutil.copy2(s, d)

# 2. Add .htaccess
htaccess_content = """<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . index.html [L]
</IfModule>
"""
with open(os.path.join(STAGING_DIR, ".htaccess"), "w", encoding="utf-8") as f:
    f.write(htaccess_content)

# 3. Add config.php
config_php = """<?php
// Database Configuration for XAMPP / Web Server
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'training_institute_db');

function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
    }
    $conn->set_charset("utf8mb4");
    return $conn;
}
"""
with open(os.path.join(STAGING_DIR, "config.php"), "w", encoding="utf-8") as f:
    f.write(config_php)

# 4. Add database_schema.sql
sql_content = """-- ====================================================================
-- Training Institute Student Management System
-- Upazila Computer Training Institute, Jhikargacha, Jashore
-- Database Schema & Pre-seeded Sample Records
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `training_institute_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `training_institute_db`;

-- Table 1: Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `gender` VARCHAR(20) DEFAULT 'Male',
  `role` VARCHAR(50) DEFAULT 'Admin',
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_url` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Subjects
CREATE TABLE IF NOT EXISTS `subjects` (
  `id` VARCHAR(50) PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL
);

-- Table 3: Class Sessions
CREATE TABLE IF NOT EXISTS `class_sessions` (
  `id` VARCHAR(50) PRIMARY KEY,
  `starting_month` VARCHAR(20) NOT NULL,
  `ending_month` VARCHAR(20) NOT NULL,
  `year` VARCHAR(10) NOT NULL,
  `subject_id` VARCHAR(50),
  `duration` VARCHAR(50) NOT NULL,
  `monthly_tuition_fees` DECIMAL(10,2) DEFAULT 500,
  `is_active` BOOLEAN DEFAULT TRUE,
  `total_students` INT DEFAULT 0,
  `male_count` INT DEFAULT 0,
  `female_count` INT DEFAULT 0,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE SET NULL
);

-- Table 4: Students
CREATE TABLE IF NOT EXISTS `students` (
  `id` VARCHAR(50) PRIMARY KEY,
  `roll` VARCHAR(50) NOT NULL UNIQUE,
  `name_en` VARCHAR(150) NOT NULL,
  `name_bn` VARCHAR(150),
  `father_name` VARCHAR(150) NOT NULL,
  `mother_name` VARCHAR(150) NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `religion` VARCHAR(50),
  `blood_group` VARCHAR(10),
  `physical_disability` VARCHAR(10) DEFAULT 'No',
  `identity_type` VARCHAR(20) DEFAULT 'NID',
  `identity_number` VARCHAR(50),
  `student_mobile` VARCHAR(30) NOT NULL,
  `guardian_mobile` VARCHAR(30) NOT NULL,
  `whatsapp_no` VARCHAR(30),
  `address` TEXT,
  `academic_type` VARCHAR(50),
  `academic_year` VARCHAR(10),
  `academic_roll` VARCHAR(50),
  `academic_reg` VARCHAR(50),
  `academic_result` VARCHAR(20),
  `school_name` VARCHAR(150),
  `class_session_id` VARCHAR(50),
  `group_name` VARCHAR(10) DEFAULT 'A',
  `total_fee_paid` DECIMAL(10,2) DEFAULT 0,
  `attendance_percentage` INT DEFAULT 100,
  `result_grade` VARCHAR(10) DEFAULT 'Pending',
  `result_marks` INT DEFAULT 0,
  `admission_date` VARCHAR(30),
  `photo_url` TEXT,
  FOREIGN KEY (`class_session_id`) REFERENCES `class_sessions`(`id`) ON DELETE SET NULL
);

-- Table 5: Fee Transactions
CREATE TABLE IF NOT EXISTS `fee_transactions` (
  `id` VARCHAR(50) PRIMARY KEY,
  `receipt_number` VARCHAR(50) NOT NULL UNIQUE,
  `student_id` VARCHAR(50),
  `student_roll` VARCHAR(50),
  `student_name` VARCHAR(150),
  `month` VARCHAR(50),
  `date` VARCHAR(50),
  `total` DECIMAL(10,2) NOT NULL,
  `deposit` DECIMAL(10,2) NOT NULL,
  `previous_balance` DECIMAL(10,2) DEFAULT 0,
  `total_deposit` DECIMAL(10,2) NOT NULL,
  `balance_remaining` DECIMAL(10,2) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
);

-- Table 6: Accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` VARCHAR(50) PRIMARY KEY,
  `date` VARCHAR(30) NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `category` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default Admin User (Password: admin123)
INSERT INTO `users` (`id`, `username`, `email`, `full_name`, `gender`, `role`, `password_hash`)
VALUES ('usr-admin-1', 'admin', 'admin@institute.gov.bd', 'Eleas Kanchon', 'Male', 'Admin', 'admin123')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- Default Subjects
INSERT INTO `subjects` (`id`, `code`, `name`) VALUES
('sub-1', '76', 'Computer Office Applications'),
('sub-2', '79', 'Database Programming'),
('sub-3', '81', 'Graphic Design & Multimedia')
ON DUPLICATE KEY UPDATE `name`=`name`;

-- Default Sessions
INSERT INTO `class_sessions` (`id`, `starting_month`, `ending_month`, `year`, `subject_id`, `duration`, `monthly_tuition_fees`, `is_active`, `total_students`, `male_count`, `female_count`) VALUES
('ses-1', 'Jul', 'Dec', '2026', 'sub-1', '6 Month', 500, TRUE, 45, 23, 22),
('ses-2', 'Jul', 'Sep', '2026', 'sub-2', '3 Month', 600, FALSE, 38, 20, 18),
('ses-3', 'Jan', 'Jun', '2026', 'sub-1', '6 Month', 500, FALSE, 50, 26, 24)
ON DUPLICATE KEY UPDATE `is_active`=`is_active`;
"""
with open(os.path.join(STAGING_DIR, "database_schema.sql"), "w", encoding="utf-8") as f:
    f.write(sql_content)

# 5. Add README_INSTALL_XAMPP.txt
readme_content = """====================================================================
Training Institute Student Management System
Upazila Computer Training Institute, Jhikargacha, Jashore
====================================================================

XAMPP-এ সহজে ব্যবহারের নিয়মাবলী (Step by Step):
--------------------------------------------------
১. আপনার কম্পিউটারে XAMPP ওপেন করে Apache এবং MySQL উভয় মডিউল Start করুন।
২. ডাউনলোড করা এই zip ফাইলটি আনজিপ করুন।
৩. আনজিপ করা ফাইল ও ফোল্ডারগুলো কপি করে আপনার কম্পিউটারের
   C:\\xampp\\htdocs\\training_institute\\
   ফোল্ডারের ভেতরে পেস্ট করুন।
৪. ব্রাউজারে গিয়ে http://localhost/phpmyadmin ওপেন করুন।
৫. 'New' বাটনে ক্লিক করে 'training_institute_db' নামে একটি ডাটাবেস তৈরি করুন
   এবং এই জিপ ফাইলে থাকা 'database_schema.sql' ফাইলটি Import করুন।
৬. যেকোনো ব্রাউজারে গিয়ে নিচের লিংকে প্রবেশ করুন:
   http://localhost/training_institute/

লগইন ক্রেডেনশিয়াল (Default Login):
-----------------------------------
User ID : admin
Password: admin123

ফিচারসমূহ:
-----------
- ড্যাশবোর্ড ও আয়-ব্যয় সামারি চার্ট
- নতুন শিক্ষার্থী ভর্তি (Admission Form) ও ফটো আপলোড
- সকল শিক্ষার্থী তালিকা, এক্সেল এক্সপোর্ট ও এক্সেল ইমপোর্ট
- ক্লাস ও সেশন ম্যানেজমেন্ট
- ফি কালেকশন ও ডাবল স্লিপ (Student & Office Copy) রসিদ প্রিন্ট
- শিক্ষার্থীর উপস্থিতি ব্যবস্থাপনা
- রেজাল্ট ও স্বয়ংক্রিয় গ্রেড ক্যালকুলেশন
- স্টুডেন্ট আইডি কার্ড ফ্রন্ট ও ব্যাক সাইড প্রিন্ট
- অ্যাডমিশন লেটার প্রিন্ট
- vCard (.vcf) কন্টাক্ট ডাউনলোড
- ডাটাবেস ব্যাকআপ ও রিস্টোর
====================================================================
"""
with open(os.path.join(STAGING_DIR, "README_INSTALL_XAMPP.txt"), "w", encoding="utf-8") as f:
    f.write(readme_content)

# 6. Also include source_code subfolder inside staging
source_code_dir = os.path.join(STAGING_DIR, "source_code")
os.makedirs(source_code_dir, exist_ok=True)
for src_item in ["src", "package.json", "tsconfig.json", "vite.config.ts", "index.html"]:
    src_path = os.path.join(BASE_DIR, src_item)
    dst_path = os.path.join(source_code_dir, src_item)
    if os.path.isdir(src_path):
        shutil.copytree(src_path, dst_path, ignore=shutil.ignore_patterns("node_modules", ".git", "dist"))
    elif os.path.isfile(src_path):
        shutil.copy2(src_path, dst_path)

# 7. Create ZIP archive
print("Compressing into ZIP archive...")
with zipfile.ZipFile(OUTPUT_ZIP_PUBLIC, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(STAGING_DIR):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, STAGING_DIR)
            zipf.write(file_path, arcname)

# Also copy to dist for direct static serving
if os.path.exists(DIST_DIR):
    shutil.copy2(OUTPUT_ZIP_PUBLIC, OUTPUT_ZIP_DIST)

# Clean up staging directory to keep workspace clean
if os.path.exists(STAGING_DIR):
    shutil.rmtree(STAGING_DIR)

file_size_kb = os.path.getsize(OUTPUT_ZIP_PUBLIC) / 1024
print(f"ZIP package created successfully! Size: {file_size_kb:.2f} KB")
print(f"Saved to: {OUTPUT_ZIP_PUBLIC}")
