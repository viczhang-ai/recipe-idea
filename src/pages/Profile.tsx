import { Edit3, Heart, BookOpen, Clock, Bell, Settings, Info, ChevronRight, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React, { useEffect } from 'react';

export default function Profile() {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  if (!user) return null;

  const username = profile?.username || user.email?.split('@')[0] || '美食家';
  const avatarUrl = profile?.avatar_url;
  const bio = profile?.bio || '唯有爱与美食不可辜负。';

  return (
    <div className="bg-[#f8f6f6] text-slate-900 min-h-screen flex flex-col max-w-md mx-auto">
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-200">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-[#ec5b13]/10 overflow-hidden bg-slate-200">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 text-3xl font-bold">
                    {username[0].toUpperCase()}
                  </div>
                )}
              </div>
              <Link to="/edit-profile" className="absolute bottom-0 right-0 bg-[#ec5b13] text-white p-1 rounded-full border-2 border-white hover:bg-[#d94f0e] transition-colors">
                <Edit3 className="w-4 h-4" />
              </Link>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">{username}</h2>
            <p className="mt-1 text-slate-400 text-xs">{user.email}</p>
            <p className="mt-2 text-slate-500 text-sm text-center max-w-xs leading-relaxed">{bio}</p>
          </div>

          <div className="flex justify-around mt-8 bg-slate-50 rounded-xl py-4">
            <Link to="/followers" className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform">
              <span className="text-xl font-bold text-slate-900">0</span>
              <span className="text-xs text-slate-500">粉丝</span>
            </Link>
            <div className="w-px h-8 bg-slate-200 self-center"></div>
            <Link to="/following" className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform">
              <span className="text-xl font-bold text-slate-900">0</span>
              <span className="text-xs text-slate-500">关注</span>
            </Link>
            <div className="w-px h-8 bg-slate-200 self-center"></div>
            <Link to="/my-recipes" className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform">
              <span className="text-xl font-bold text-slate-900">0</span>
              <span className="text-xs text-slate-500">菜谱</span>
            </Link>
          </div>
        </div>

        <div className="mt-4 px-4 space-y-2">
          {profile?.is_admin && (
            <Link to="/admin" className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-bold text-red-700 text-sm">管理后台</p>
                  <p className="text-[10px] text-red-500">全站管理权限已开启</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-300" />
            </Link>
          )}

          {[
            { icon: <Heart className="w-5 h-5" />, label: '我的收藏', to: '/favorites', color: 'text-[#ec5b13]', bg: 'bg-[#ec5b13]/10' },
            { icon: <BookOpen className="w-5 h-5" />, label: '我的菜谱', to: '/my-recipes', color: 'text-[#ec5b13]', bg: 'bg-[#ec5b13]/10' },
            { icon: <Clock className="w-5 h-5" />, label: '浏览历史', to: '/history', color: 'text-[#ec5b13]', bg: 'bg-[#ec5b13]/10' },
            { icon: <Bell className="w-5 h-5" />, label: '消息通知', to: '/messages', color: 'text-[#ec5b13]', bg: 'bg-[#ec5b13]/10' },
            { divider: true },
            { icon: <Settings className="w-5 h-5" />, label: '设置', to: '/settings', color: 'text-slate-600', bg: 'bg-slate-100' },
            { icon: <Info className="w-5 h-5" />, label: '关于我们', to: '/about', color: 'text-slate-600', bg: 'bg-slate-100' },
          ].map((item: any, i) => item.divider ? (
            <div key={i} className="py-2"></div>
          ) : (
            <Link key={i} to={item.to!} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <span className="font-medium text-sm text-slate-700">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
          ))}
        </div>

        <div className="mt-8 px-4 mb-8">
          <button
            onClick={handleSignOut}
            className="block text-center w-full py-4 rounded-xl border-2 border-[#ec5b13]/20 text-[#ec5b13] font-bold hover:bg-[#ec5b13]/5 transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
