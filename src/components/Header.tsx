import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, ChevronDown, UserCheck, Settings, LogOut, HelpCircle, HardDrive, Phone, Download } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    logout,
    setCurrentView,
    isCapsuleSidebar,
    setIsCapsuleSidebar,
    setIsMobileMenuOpen,
    setShowInstallGuide,
    instituteSettings
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#6b21a8] text-white z-40 shadow-md flex items-center justify-between px-4 sm:px-6 transition-all no-print">
      {/* Left: Hamburger / Capsule toggle + Institute Brand */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-lg bg-purple-800/80 hover:bg-purple-700 text-white transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Capsule Toggle Button */}
        <button
          onClick={() => setIsCapsuleSidebar(prev => !prev)}
          className="hidden lg:flex p-2 rounded-xl bg-purple-800/80 hover:bg-purple-700 text-white transition-all items-center justify-center border border-purple-600/40 shadow-xs"
          title={isCapsuleSidebar ? "Expand Sidebar Menu" : "Capsule Collapse Sidebar Menu"}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Institute Crest & Info matching prototype */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-emerald-300 flex items-center justify-center p-1 text-white shadow-xs shrink-0 overflow-hidden">
            <svg viewBox="0 0 48 48" fill="none" className="w-full h-full text-white" stroke="currentColor">
              <circle cx="24" cy="24" r="22" strokeWidth="2.5" fill="#047857" />
              <rect x="13" y="14" width="22" height="14" rx="2" strokeWidth="2" stroke="white" fill="#065f46" />
              <line x1="20" y1="32" x2="28" y2="32" strokeWidth="2.5" stroke="white" />
              <line x1="24" y1="28" x2="24" y2="32" strokeWidth="2" stroke="white" />
              <path d="M10 24 C10 16, 14 10, 24 10" stroke="#facc15" strokeWidth="1.5" strokeDasharray="2 2" />
              <path d="M38 24 C38 16, 34 10, 24 10" stroke="#facc15" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>
          </div>
          <div className="leading-tight select-none">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white drop-shadow-xs">
              {instituteSettings.instituteName || 'Upazila Computer Training Institute'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-purple-200">
              <span className="truncate max-w-[150px] sm:max-w-none">{instituteSettings.targetLine || 'Jhikargacha, Jashore'}</span>
              <span className="hidden xs:inline">•</span>
              <span className="flex items-center gap-1 font-mono font-medium">
                <Phone className="w-3 h-3 text-emerald-300 inline" />
                {instituteSettings.phone || '01941959600'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: User Profile & Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
        {/* Direct XAMPP ZIP Download Button */}
        <a
          href="/training_institute_system.zip"
          download="training_institute_system.zip"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm border border-emerald-400/80 transition-all hover:scale-105"
          title="Download full project ZIP ready for XAMPP / cPanel"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download ZIP</span>
        </a>

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-purple-900/60 hover:bg-purple-900/90 border border-purple-400/30 transition-all text-left"
        >
          <img
            src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
            alt="User profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400"
          />
          <div className="hidden md:block leading-tight pr-1">
            <p className="text-xs font-bold text-white">{currentUser?.fullName || 'Eleas Kanchon'}</p>
            <p className="text-[11px] text-emerald-300 font-medium">{currentUser?.role || 'Admin'}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-purple-300 transition-transform duration-200" />
        </button>

        {/* User Profile Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-4 top-16 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs text-slate-500">Signed in as</p>
              <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.fullName || 'Eleas Kanchon'}</p>
              <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-semibold bg-purple-100 text-purple-800 rounded-full">
                {currentUser?.role || 'Administrator'}
              </span>
            </div>

            <div className="py-1 text-xs">
              <a
                href="/training_institute_system.zip"
                download="training_institute_system.zip"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-bold transition-colors border-b border-emerald-100"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                Download Project ZIP (XAMPP Ready)
              </a>

              <button
                onClick={() => {
                  setCurrentView('user');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-purple-600" />
                User Profile Settings
              </button>

              <button
                onClick={() => {
                  setCurrentView('institute-settings');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <Settings className="w-4 h-4 text-purple-600" />
                Institute Settings
              </button>

              <button
                onClick={() => {
                  setCurrentView('database-backup');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <HardDrive className="w-4 h-4 text-purple-600" />
                Database Backup
              </button>

              <button
                onClick={() => {
                  setShowInstallGuide(true);
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                XAMPP & Web Install Guide
              </button>
            </div>

            <div className="border-t border-slate-100 pt-1 mt-1">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                Logout (সাইন আউট)
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
