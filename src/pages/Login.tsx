import { ArrowLeft, Mail, Lock, EyeOff, Eye, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage('注册成功！请查收邮箱验证邮件，验证后即可登录。');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === 'Invalid login credentials' ? '邮箱或密码错误，请重试。' : error.message);
      } else {
        navigate('/main');
      }
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white max-w-md mx-auto">
      <header className="sticky top-0 z-10 flex items-center p-4 justify-between">
        <div onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
          <ArrowLeft className="text-slate-900" />
        </div>
        <button
          type="button"
          onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
          className="text-[#ec5b13] text-sm font-bold px-4 py-2 rounded-full hover:bg-[#ec5b13]/10 transition-colors"
        >
          {isSignUp ? '已有账号？去登录' : '注册'}
        </button>
      </header>

      <main className="flex-1 px-6 pt-8 pb-24 flex flex-col justify-center">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            {isSignUp ? '创建账号' : '欢迎回来'}
          </h1>
          <p className="text-slate-500 text-sm">
            {isSignUp ? '注册后请验证邮箱，才能正常登录' : '登录以继续探索美味食谱'}
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">邮箱地址</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="请输入您的邮箱"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">密码</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="请输入密码（至少6位）"
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] transition-all"
              />
              <div
                className="absolute right-4 text-slate-400 cursor-pointer hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#ec5b13] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#ec5b13]/30 hover:bg-[#d94f0e] transition-colors mt-8 disabled:opacity-60"
          >
            {loading ? '处理中...' : (isSignUp ? '注册账号' : '登录')}
          </button>
        </form>
      </main>
    </div>
  );
}
