import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountManagement() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-stone-100 rounded-full text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-stone-900">账号管理</h1>
        <div className="w-9"></div>
      </header>
      <main className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex justify-between items-center">
            <span className="text-stone-700">手机号</span>
            <span className="text-stone-400 text-sm">138****8888</span>
          </div>
          <div className="p-4 border-b border-stone-100 flex justify-between items-center">
            <span className="text-stone-700">修改密码</span>
            <span className="text-stone-400 text-sm">&gt;</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-red-500">注销账号</span>
            <span className="text-stone-400 text-sm">&gt;</span>
          </div>
        </div>
      </main>
    </div>
  );
}
