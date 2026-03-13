import { ArrowLeft, Heart, Clock, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Favorites() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    async function fetchFavorites() {
      const { data } = await supabase
        .from('user_favorites')
        .select('*, recipes(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (data) setFavorites(data);
      setLoading(false);
    }
    fetchFavorites();
  }, [user]);

  const removeFavorite = async (favoriteId: number) => {
    await supabase.from('user_favorites').delete().eq('id', favoriteId);
    setFavorites(prev => prev.filter(f => f.id !== favoriteId));
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f6f6] max-w-md mx-auto">
      <header className="sticky top-0 z-10 flex items-center bg-[#f8f6f6] p-4 border-b border-[#ec5b13]/10">
        <div onClick={() => navigate('/main/profile')} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-[#ec5b13]/10 transition-colors cursor-pointer">
          <ArrowLeft className="text-slate-900" />
        </div>
        <h1 className="text-lg font-bold flex-1 text-center pr-10">我的收藏</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 p-4">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Heart className="w-12 h-12 opacity-40" />
            <p>登录后查看收藏内容</p>
            <button onClick={() => navigate('/login')} className="text-[#ec5b13] font-bold">去登录</button>
          </div>
        ) : loading ? (
          <div className="text-center text-slate-400 py-12">加载中...</div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Heart className="w-12 h-12 opacity-40" />
            <p>还没有收藏任何食谱</p>
            <button onClick={() => navigate('/main')} className="text-[#ec5b13] font-bold">去探索</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favorites.map((fav) => {
              const recipe = fav.recipes;
              if (!recipe) return null;
              return (
                <div key={fav.id} className="flex flex-col gap-2 pb-4 group">
                  <Link to={`/recipe/${recipe.id}`} className="relative w-full aspect-square overflow-hidden rounded-xl bg-slate-200">
                    {recipe.image_url && (
                      <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); removeFavorite(fav.id); }}
                      className="absolute top-2 right-2 size-8 bg-white/90 rounded-full flex items-center justify-center text-[#ec5b13] shadow-sm"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </Link>
                  <div>
                    <p className="text-base font-bold leading-tight line-clamp-1">{recipe.title}</p>
                    <div className="flex items-center gap-1 text-slate-500 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <p className="text-xs">{recipe.prep_time_minutes} 分钟</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#ec5b13] mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <p className="text-xs font-medium">{recipe.rating}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
