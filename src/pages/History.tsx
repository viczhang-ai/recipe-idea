import { ArrowLeft, History as HistoryIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    async function fetchHistory() {
      const { data } = await supabase
        .from('user_history')
        .select('*, recipes(*)')
        .eq('user_id', user!.id)
        .order('viewed_at', { ascending: false })
        .limit(30);
      if (data) setHistory(data);
      setLoading(false);
    }
    fetchHistory();
  }, [user]);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100 p-4 flex items-center gap-3">
        <button onClick={() => navigate('/main/profile')} className="p-2 -ml-2 rounded-full active:bg-slate-100">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">浏览历史</h1>
      </header>

      <main className="p-4">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <HistoryIcon className="w-12 h-12 opacity-40" />
            <p>登录后查看浏览历史</p>
            <button onClick={() => navigate('/login')} className="text-[#ec5b13] font-bold">去登录</button>
          </div>
        ) : loading ? (
          <div className="text-center text-slate-400 py-12">加载中...</div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <HistoryIcon className="w-12 h-12 opacity-40" />
            <p>暂无浏览记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map(h => {
              const recipe = h.recipes;
              if (!recipe) return null;
              return (
                <Link key={h.id} to={`/recipe/${recipe.id}`} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  {recipe.image_url && (
                    <img src={recipe.image_url} alt={recipe.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 line-clamp-1">{recipe.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{recipe.prep_time_minutes} 分钟 · {recipe.author_name}</p>
                    <p className="text-xs text-slate-300 mt-0.5">{new Date(h.viewed_at).toLocaleDateString('zh-CN')}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
