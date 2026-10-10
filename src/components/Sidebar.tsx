import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  UserCheck,
  FolderTree,
  CreditCard,
  ClipboardCheck,
  GraduationCap,
  BarChart3,
  UserCog,
  Settings,
  HardDrive,
  LogOut,
  X
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'add-student', label: 'Add Student', icon: UserPlus },
  { id: 'all-students', label: 'All Students', icon: Users },
  { id: 'student-profile', label: 'Student Profile', icon: UserCheck },
  { id: 'class-management', label: 'Class Management', icon: FolderTree },
  { id: 'fee-collection', label: 'Fee Collection', icon: CreditCard },
  { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
  { id: 'results', label: 'Results', icon: GraduationCap },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'user', label: 'User', icon: UserCog },
  { id: 'institute-settings', label: 'Institute Settings', icon: Settings },
  { id: 'database-backup', label: 'Database Backup', icon: HardDrive },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isCapsuleSidebar,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    logout
  } = useApp();

  const handleMenuClick = (itemId: string) => {
    if (itemId === 'logout') {
      logout();
    } else {
      setCurrentView(itemId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs animate-in fade-in"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-16 left-0 bottom-0 bg-[#1e293b] text-slate-300 z-40 transition-all duration-300 ease-in-out flex flex-col border-r border-slate-700/50 shadow-xl no-print
          ${
            // Mobile styling
            isMobileMenuOpen
              ? 'translate-x-0 w-64'
              : '-translate-x-full lg:translate-x-0'
          }
          ${
            // Desktop width based on Capsule mode
            isCapsuleSidebar ? 'lg:w-20' : 'lg:w-60'
          }
        `}
      >
        {/* Mobile Header in Drawer */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-700">
          <span className="font-semibold text-white text-sm">Navigation Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav list */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === 'student-profile' &&
                (currentView === 'id-card-view' || currentView === 'admission-letter-print')) ||
              (item.id === 'fee-collection' && currentView === 'payment-print');

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                title={isCapsuleSidebar ? `${index + 1}. ${item.label}` : undefined}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative
                  ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                  ${isCapsuleSidebar ? 'justify-center px-0' : ''}
                `}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-300'
                  }`}
                />
                
                {/* Text Label */}
                {!isCapsuleSidebar && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}

                {/* Capsule Mode Tooltip on hover */}
                {isCapsuleSidebar && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700 hidden lg:block">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        {!isCapsuleSidebar ? (
          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            <p className="font-semibold text-slate-300">UCTI System v2.6</p>
            <p className="text-[10px] text-slate-500">Jhikargacha, Jashore</p>
          </div>
        ) : (
          <div className="p-2 border-t border-slate-800 text-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto" title="System Online"></div>
          </div>
        )}
      </aside>
    </>
  );
};
