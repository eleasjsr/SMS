import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username.trim(), password);
    if (!success) {
      setError('Invalid User ID or Password! Please use default: admin / admin123');
    }
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#3b0764] p-4 font-sans relative overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card matching prototype page 3 */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase tracking-wider font-bold text-purple-700">Student Portal</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Login System</h2>
            <p className="text-xs text-slate-500 mt-1">Upazila Computer Training Institute, Jhikargacha</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User ID Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">User ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter User ID or Email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forget Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-purple-700 hover:text-purple-900 font-medium transition-colors"
              >
                Forget password?
              </button>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#1e293b] hover:bg-slate-900 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2"
              >
                LOGIN
              </button>
            </div>
          </form>

          {/* Helper quick credential fill */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Demo Admin: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-purple-700">admin / admin123</code>
            </span>
            <button
              onClick={handleQuickFill}
              className="text-[11px] font-semibold text-purple-700 hover:underline flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Auto-fill
            </button>
          </div>
        </div>

        {/* Right Side: Hero Visual matching Prototype Page 3 */}
        <div className="w-full md:w-1/2 bg-gradient-to-tr from-purple-900 via-indigo-900 to-slate-900 p-8 flex flex-col items-center justify-center relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Graduate Photo Card */}
          <div className="relative z-10 w-64 h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80"
              alt="Graduating Student"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Certified Program</span>
              <h4 className="text-base font-bold text-white">Govt. Certified Training</h4>
            </div>
          </div>

          <div className="relative z-10 mt-6 text-center max-w-xs">
            <h3 className="font-bold text-base text-purple-100">উপজেলা কম্পিউটার প্রশিক্ষণ ইনস্টিটিউট</h3>
            <p className="text-xs text-purple-300 mt-1">
              ডিজিটাল বাংলাদেশের দক্ষ জনশক্তি গড়ার প্রত্যয়ে বাস্তবভিত্তিক প্রশিক্ষণ।
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-slate-800 shadow-2xl">
            <h4 className="font-bold text-lg text-slate-900 mb-2">Password Recovery</h4>
            <p className="text-xs text-slate-600 mb-4">
              Default administrator credentials are set to:
            </p>
            <div className="bg-slate-100 rounded-xl p-3 font-mono text-xs space-y-1 text-slate-800 mb-4">
              <p><strong>User ID:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">
              You can also change your password anytime under <em>User Settings</em> once logged in.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
