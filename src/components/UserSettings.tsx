import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCog, Upload, Plus, Edit, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Role } from '../types';

export const UserSettings: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    roles,
    addRole,
    updateRole,
    deleteRole
  } = useApp();

  // Account Edit Form State
  const [accountForm, setAccountForm] = useState({
    username: currentUser?.username || 'admin',
    email: currentUser?.email || 'admin@institute.gov.bd',
    fullName: currentUser?.fullName || 'Eleas Kanchon',
    gender: currentUser?.gender || 'Male',
    avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    currentPassword: '',
    newPassword: '',
    reEnterPassword: ''
  });

  // Selected Role for Permission Matrix
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'role-admin');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAccountForm(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    // If changing password, validate
    if (accountForm.newPassword) {
      if (accountForm.newPassword !== accountForm.reEnterPassword) {
        setErrorMsg('New Password and Re-Enter Password do not match!');
        return;
      }
      if (!accountForm.currentPassword) {
        setErrorMsg('Current Password is required to set a new password.');
        return;
      }
      updateCurrentUser({
        username: accountForm.username,
        email: accountForm.email,
        fullName: accountForm.fullName,
        gender: accountForm.gender,
        avatarUrl: accountForm.avatarUrl,
        passwordHash: accountForm.newPassword
      });
    } else {
      updateCurrentUser({
        username: accountForm.username,
        email: accountForm.email,
        fullName: accountForm.fullName,
        gender: accountForm.gender,
        avatarUrl: accountForm.avatarUrl
      });
    }

    setMessage('User profile settings updated successfully!');
    setAccountForm(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      reEnterPassword: ''
    }));
    setTimeout(() => setMessage(''), 3500);
  };

  const handleTogglePermission = (permissionKey: string) => {
    if (!selectedRole) return;
    const currentVal = !!selectedRole.permissions[permissionKey];
    const updatedPermissions = {
      ...selectedRole.permissions,
      [permissionKey]: !currentVal
    };
    updateRole(selectedRole.id, selectedRole.title, updatedPermissions);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;

    addRole(newRoleTitle.trim(), {
      Root: false,
      Administrator: false,
      'Income Expense': false,
      Attendance: true,
      'Institute Settings': false,
      'Class Management': false,
      'Fee Collection': false,
      'Database Backup': false,
      User: false
    });

    setNewRoleTitle('');
    setShowAddRoleModal(false);
    setMessage(`Role "${newRoleTitle}" added!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const permissionsList = [
    'Root',
    'Administrator',
    'Income Expense',
    'Attendance',
    'Institute Settings',
    'Class Management',
    'Fee Collection',
    'Database Backup',
    'User'
  ];

  return (
    <div className="space-y-6">
      {/* Green Banner matching prototype page 33 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <UserCog className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">User Settings</h2>
        </div>
        <span className="text-xs text-emerald-100">Profile &amp; Role-based Access Control</span>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Top Section: Edit Account matching prototype page 33 & 34 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <UserCog className="w-4 h-4 text-purple-700" /> Edit Account
        </h3>

        <form onSubmit={handleUpdateAccount} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Left Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Username / Email *</label>
                <input
                  type="text"
                  required
                  value={accountForm.username}
                  onChange={e => setAccountForm({ ...accountForm, username: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={accountForm.fullName}
                  onChange={e => setAccountForm({ ...accountForm, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                <select
                  value={accountForm.gender}
                  onChange={e => setAccountForm({ ...accountForm, gender: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={accountForm.newPassword}
                  onChange={e => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Right Inputs with Photo */}
            <div className="space-y-4">
              {/* Photo Upload & Preview */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-600 shrink-0 bg-white">
                  <img
                    src={accountForm.avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="block font-bold text-slate-800 mb-1">Profile Photo</span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-purple-600" /> Browse File
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, GIF under 200KB</p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  value={accountForm.currentPassword}
                  onChange={e => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Re-Enter Password *</label>
                <input
                  type="password"
                  value={accountForm.reEnterPassword}
                  onChange={e => setAccountForm({ ...accountForm, reEnterPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all"
            >
              Update Settings
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Grid: ROLE Table + PERMISSION Matrix matching prototype page 33 & 34 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: ROLE Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="bg-[#1e293b] text-white p-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center">
            ROLE
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {roles.map(role => (
                  <tr
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      selectedRole.id === role.id ? 'bg-purple-50 font-bold text-purple-900' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span>{role.title}</span>
                      {selectedRole.id === role.id && (
                        <span className="ml-2 text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">Selected</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedRoleId(role.id);
                          }}
                          className="p-1.5 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors"
                          title="Edit Permissions"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {role.title !== 'Admin' && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              deleteRole(role.id);
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Delete Role"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() => setShowAddRoleModal(true)}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> ADD MORE
          </button>
        </div>

        {/* Right: PERMISSION Matrix matching prototype page 33 & 34 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="bg-[#1e293b] text-white p-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center">
            PERMISSION OF "{selectedRole.title}"
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {permissionsList.map(perm => {
                  const isAllowed = !!selectedRole.permissions[perm];

                  return (
                    <tr key={perm} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 font-medium">
                        {perm === 'Root' ? perm : `> ${perm}`}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(perm)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shadow-2xs ${
                            isAllowed
                              ? 'bg-purple-700 text-white hover:bg-purple-800'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {isAllowed ? 'Allow' : 'Deny'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Add New User Role</h3>
            <form onSubmit={handleCreateRole} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Moderator, Lab Assistant"
                  value={newRoleTitle}
                  onChange={e => setNewRoleTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 text-white font-bold rounded-xl"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
