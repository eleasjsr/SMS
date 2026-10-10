import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AddStudent } from './components/AddStudent';
import { AllStudents } from './components/AllStudents';
import { StudentProfile } from './components/StudentProfile';
import { ClassManagement } from './components/ClassManagement';
import { FeeCollection } from './components/FeeCollection';
import { AttendanceManagement } from './components/AttendanceManagement';
import { ResultsManagement } from './components/ResultsManagement';
import { AccountsModule } from './components/AccountsModule';
import { UserSettings } from './components/UserSettings';
import { InstituteSettings } from './components/InstituteSettings';
import { DatabaseBackup } from './components/DatabaseBackup';
import { StudentIdCardView } from './components/StudentIdCardView';
import { AdmissionLetterPrint } from './components/AdmissionLetterPrint';
import { PaymentSummaryPrint } from './components/PaymentSummaryPrint';
import { InstallationGuideModal } from './components/InstallationGuideModal';

const MainAppContent: React.FC = () => {
  const {
    isAuthenticated,
    currentView,
    isCapsuleSidebar,
    showInstallGuide,
    setShowInstallGuide
  } = useApp();

  // If not logged in, show Login Screen (Page 3)
  if (!isAuthenticated) {
    return <Login />;
  }

  // Render content according to currentView
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'add-student':
        return <AddStudent />;
      case 'all-students':
        return <AllStudents />;
      case 'student-profile':
        return <StudentProfile />;
      case 'class-management':
        return <ClassManagement />;
      case 'fee-collection':
        return <FeeCollection />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'results':
        return <ResultsManagement />;
      case 'reports':
        return <AccountsModule />;
      case 'user':
        return <UserSettings />;
      case 'institute-settings':
        return <InstituteSettings />;
      case 'database-backup':
        return <DatabaseBackup />;
      case 'id-card-view':
        return <StudentIdCardView />;
      case 'admission-letter-print':
        return <AdmissionLetterPrint />;
      case 'payment-print':
        return <PaymentSummaryPrint />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Fixed Top Header (Page 4 & 5) */}
      <Header />

      {/* Main Body Layout with Left Sidebar + Content */}
      <div className="flex flex-1 pt-16">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Content Area with smooth transition when capsule mode is toggled */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ease-in-out ${
            isCapsuleSidebar ? 'lg:ml-20' : 'lg:ml-60'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

      {/* XAMPP & Web Installation Guide Modal (Page 1) */}
      <InstallationGuideModal
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
