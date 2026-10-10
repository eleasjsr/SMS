import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HardDrive, Download, Upload, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DatabaseBackup: React.FC = () => {
  const {
    exportDatabaseJSON,
    restoreDatabaseJSON,
    resetDatabaseToDefault,
    backupHistory,
    students,
    classSessions,
    feeTransactions
  } = useApp();

  const [currentTime, setCurrentTime] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  });

  const [selectedBackupFile, setSelectedBackupFile] = useState<File | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Update clock
  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }) +
          ' ' +
          d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBackupNow = () => {
    const jsonString = exportDatabaseJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date();
    a.href = url;
    a.download = `backup_ucti_${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, '0')}_${String(d.getDate()).padStart(2, '0')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatusMsg({
      text: 'Full database backup successfully generated and downloaded!',
      type: 'success'
    });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedBackupFile(e.target.files[0]);
    }
  };

  const handleRestore = () => {
    if (!selectedBackupFile) {
      setStatusMsg({ text: 'Please select a backup .json file to restore.', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const ok = restoreDatabaseJSON(content);
      if (ok) {
        setStatusMsg({ text: 'Database successfully restored from backup file!', type: 'success' });
        setSelectedBackupFile(null);
      } else {
        setStatusMsg({ text: 'Invalid or corrupted backup file format.', type: 'error' });
      }
    };
    reader.readAsText(selectedBackupFile);
  };

  const handleReset = () => {
    resetDatabaseToDefault();
    setShowResetConfirm(false);
    setStatusMsg({ text: 'Database reset to default prototype records.', type: 'success' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const latestBackupTime = backupHistory[0]?.timestamp || currentTime;

  return (
    <div className="space-y-6">
      {/* Green Banner matching prototype page 35 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <HardDrive className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">Database Backup</h2>
        </div>
        <span className="text-xs text-emerald-100">Disaster Recovery &amp; System Snapshots</span>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border border-rose-300 text-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Top Card: Files & Time Now & Backup Now button matching prototype page 35 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-xs text-slate-600 w-full md:w-auto">
          <div>
            <span className="font-bold text-slate-800 block text-sm">Files:</span>
            <span className="font-mono">{latestBackupTime}</span>
          </div>

          <div>
            <span className="font-bold text-slate-800 block text-sm">Time Now:</span>
            <span className="font-mono text-purple-700 font-bold">{currentTime}</span>
          </div>

          <div className="pt-1">
            <span className="font-bold text-slate-800 block text-sm">Database:</span>
            <span className="font-mono">{latestBackupTime}</span>
          </div>
        </div>

        {/* Database Health Summary */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-600">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Relational Tables Summary:
          </p>
          <p>• Students: <strong className="text-slate-800">{students.length} records</strong></p>
          <p>• Class Sessions: <strong className="text-slate-800">{classSessions.length} sessions</strong></p>
          <p>• Fee Transactions: <strong className="text-slate-800">{feeTransactions.length} receipts</strong></p>
        </div>

        {/* Big Backup Now Button matching prototype page 35 */}
        <button
          onClick={handleBackupNow}
          className="w-full md:w-auto px-10 py-3.5 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Backup Now</span>
        </button>
      </div>

      {/* XAMPP Standalone Deployable ZIP Download Box */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Download Complete Project ZIP (XAMPP Ready)</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              প্রোডাকশন বিল্ড ফাইল, ডাটাবেস SQL স্ক্রিপ্ট, .htaccess এবং সম্পূর্ণ সোর্স কোড সম্বলিত জিপ ফাইল (291 KB)।
            </p>
          </div>
        </div>
        <a
          href="/training_institute_system.zip"
          download="training_institute_system.zip"
          className="w-full md:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-transform hover:scale-105 flex items-center justify-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download XAMPP ZIP (291 KB)</span>
        </a>
      </div>

      {/* Existing Backups / Upload Backup File matching prototype page 35 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div>
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide mb-1">
            Existing Backups / Restore System
          </h3>
          <p className="text-xs text-slate-500">
            Restore system state from a previously saved JSON database snapshot.
          </p>
        </div>

        {/* Upload Backup File & Restore button */}
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
          <label className="block text-xs font-bold text-slate-700">Upload Backup File</label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="w-full sm:flex-1 p-2 bg-white border border-slate-300 rounded-xl text-xs cursor-pointer"
            />
            <button
              onClick={handleRestore}
              className="w-full sm:w-auto px-8 py-2.5 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Restore</span>
            </button>
          </div>
        </div>

        {/* Backup History Table */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Backup Logs &amp; History
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-4">Filename</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Size</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {backupHistory.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-medium text-purple-900">{rec.fileName}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{rec.timestamp}</td>
                    <td className="py-2.5 px-4 font-mono">{rec.fileSize}</td>
                    <td className="py-2.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danger Zone: Reset Database */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Reset System Database</h4>
            <p className="text-[11px] text-slate-500">Restore default demo students, classes, and initial settings.</p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
          >
            Reset Database
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-center text-slate-900 text-base">Reset Database?</h3>
            <p className="text-xs text-center text-slate-500">
              This will restore default student records, classes, and settings from the prototype specification.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
