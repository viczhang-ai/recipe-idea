import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: '概览', path: '/admin' },
    { icon: BookOpen, label: '食谱管理', path: '/admin/recipes' },
    { icon: Users, label: '用户管理', path: '/admin/users' },
    { icon: MessageSquare, label: '评论审核', path: '/admin/reviews' },
    { icon: Settings, label: '系统设置', path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#ec5b13] rounded-lg flex items-center justify-center">
            <Settings className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 text-lg">美食管理后台</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-[#ec5b13]/10 text-[#ec5b13]' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <button 
            onClick={() => navigate('/main/profile')}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            返回前台
          </button>
          <button 
            onClick={signOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="md:hidden p-2 rounded-full hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 md:ml-4">
              {menuItems.find(i => i.path === location.pathname)?.label || '管理后台'}
            </h1>
          </div>
          <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="admin" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-bold">A</div>
              )}
            </div>
            <span className="text-sm font-bold text-slate-700 hidden sm:inline">{profile?.username}</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-[#ec5b13] text-white rounded font-bold uppercase">Admin</span>
          </div>
        </header>

        <main className="p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
