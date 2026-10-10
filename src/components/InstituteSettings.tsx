import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Upload, CheckCircle2, BookOpen } from 'lucide-react';

export const InstituteSettings: React.FC = () => {
  const {
    instituteSettings,
    updateInstituteSettings,
    setShowInstallGuide
  } = useApp();

  const [formData, setFormData] = useState({ ...instituteSettings });
  const [successNotice, setSuccessNotice] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, qrCodeUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, loginBackgroundUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstituteSettings(formData);
    setSuccessNotice('Institute settings and profile updated successfully!');
    setTimeout(() => setSuccessNotice(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Green Banner matching prototype page 31 */}
      <div className="bg-[#15803d] text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5" />
          <h2 className="text-base font-bold tracking-wide">Institute Profile</h2>
        </div>
        <button
          onClick={() => setShowInstallGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Installation Guide</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Main Form matching prototype page 31 & 32 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6 text-xs">
        <p className="text-[11px] text-slate-400 italic mb-2">* indicates required fields</p>

        {/* Top Grid: Logo & Primary contact fields */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-6 border-b border-slate-200">
          
          {/* Logo Section */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Institute Logo</span>
            <div className="w-24 h-24 rounded-full border-2 border-emerald-500 overflow-hidden shadow-sm mb-3 bg-white p-1">
              <img
                src={formData.logoUrl || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80"}
                alt="Institute Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
              <Upload className="w-3.5 h-3.5 text-purple-600" /> Change Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            <p className="text-[10px] text-slate-400 mt-2">JPG, PNG, Max 500KB</p>
          </div>

          {/* Core Info Fields matching prototype page 31 */}
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">PHONE NUMBER *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WEBSITE</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NAME OF INSTITUTE *</label>
              <input
                type="text"
                required
                value={formData.instituteName}
                onChange={e => setFormData({ ...formData, instituteName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">TARGET LINE / SLOGAN *</label>
                <input
                  type="text"
                  required
                  value={formData.targetLine}
                  onChange={e => setFormData({ ...formData, targetLine: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">COUNTRY *</label>
                <select
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ADDRESS *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Text Templates matching prototype page 31 & 32 */}
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wide mb-1">
              Admission Letter Rules Text
            </label>
            <textarea
              rows={6}
              value={formData.admissionLetterRulesText}
              onChange={e => setFormData({ ...formData, admissionLetterRulesText: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono text-[11px] leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wide mb-1">
              ID Card Back Side Text
            </label>
            <textarea
              rows={2}
              value={formData.idCardBackSideText}
              onChange={e => setFormData({ ...formData, idCardBackSideText: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none text-[11px]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wide mb-1">
              Invoice Text
            </label>
            <input
              type="text"
              value={formData.invoiceText}
              onChange={e => setFormData({ ...formData, invoiceText: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono text-[11px]"
            />
          </div>
        </div>

        {/* QR Code and Login Background uploads matching page 31 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Institute QR */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
            <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg flex items-center justify-center p-1 shrink-0">
              <span className="text-[10px] text-slate-400 font-mono">QR</span>
            </div>
            <div>
              <span className="block font-bold text-slate-800 mb-1">Institute QR Code</span>
              <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-purple-600" /> Browse File
                <input type="file" accept="image/*" onChange={handleQrUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Login Background */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
            <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={formData.loginBackgroundUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&auto=format&fit=crop&q=80"}
                alt="BG"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="block font-bold text-slate-800 mb-1">Login Screen Background</span>
              <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-purple-600" /> Browse File
                <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button matching prototype page 31 */}
        <div className="flex justify-center pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-10 py-3 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform active:scale-98"
          >
            Update Settings
          </button>
        </div>
      </form>
    </div>
  );
};
