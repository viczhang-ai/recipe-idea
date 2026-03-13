import { ArrowLeft, Bell, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    async function fetchNotifications() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (data) setNotifications(data);
      setLoading(false);
    }
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id: number) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div className="max-w-md mx-auto bg-white flex flex-col h-screen">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100 p-4 flex items-center gap-3">
        <button onClick={() => navigate('/main/profile')} className="p-2 -ml-2 rounded-full active:bg-slate-100">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">消息通知</h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        {!user ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <Bell className="w-12 h-12 opacity-40" />
            <p>登录后查看消息通知</p>
            <button onClick={() => navigate('/login')} className="text-[#ec5b13] font-bold">去登录</button>
          </div>
        ) : loading ? (
          <div className="text-center text-slate-400 py-12">加载中...</div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 py-20">
            <Bell className="w-12 h-12 opacity-40" />
            <p>暂无消息通知</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 cursor-pointer transition-colors ${n.is_read ? 'bg-white' : 'bg-orange-50'}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.is_read ? 'bg-transparent' : 'bg-[#ec5b13]'}`}></div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">{n.title}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{n.content}</p>
                  <p className="text-slate-400 text-xs mt-1">{new Date(n.created_at).toLocaleDateString('zh-CN')}</p>
                </div>
                {n.is_read && <CheckCircle className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
