import { ArrowLeft, UserMinus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Following() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    async function fetchFollowing() {
      const { data } = await supabase
        .from('user_follows')
        .select('id, following_id, profiles!user_follows_following_id_fkey(id, username, avatar_url)')
        .eq('follower_id', user!.id);
      if (data) setFollowing(data);
      setLoading(false);
    }
    fetchFollowing();
  }, [user]);

  const handleUnfollow = async (followId: number) => {
    await supabase.from('user_follows').delete().eq('id', followId);
    setFollowing(prev => prev.filter(f => f.id !== followId));
  };

  return (
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => navigate('/main/profile')} className="p-2 -ml-2 bg-stone-100 rounded-full text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-stone-900">关注 ({following.length})</h1>
        <div className="w-9"></div>
      </header>

      <main className="p-6">
        {!user ? (
          <div className="text-center text-slate-400 py-12">登录后查看关注列表</div>
        ) : loading ? (
          <div className="text-center text-slate-400 py-12">加载中...</div>
        ) : following.length === 0 ? (
          <div className="text-center text-slate-400 py-12">还没有关注任何人</div>
        ) : (
          <div className="space-y-4">
            {following.map((item) => {
              const profile = item.profiles;
              if (!profile) return null;
              const username = profile.username || '未知用户';
              return (
                <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center text-orange-500 font-bold">
                      {profile.avatar_url
                        ? <img src={profile.avatar_url} alt={username} className="w-full h-full object-cover" />
                        : username[0].toUpperCase()
                      }
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-stone-900 text-sm">{username}</h3>
                      <p className="text-xs text-stone-500">已关注</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnfollow(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    取消关注
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
