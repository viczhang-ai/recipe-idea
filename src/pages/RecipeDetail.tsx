import { ChevronLeft, Heart, Clock, Users, Play } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<any>(null);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    async function fetchRecipe() {
      if (!id) return;
      const [recRes, ingRes] = await Promise.all([
        supabase.from('recipes').select('*').eq('id', id).single(),
        supabase.from('recipe_ingredients').select('*').eq('recipe_id', id),
      ]);
      if (recRes.data) setRecipe(recRes.data);
      if (ingRes.data) setIngredients(ingRes.data);
      setLoading(false);
    }
    fetchRecipe();
  }, [id]);

  // Check if already in favorites
  useEffect(() => {
    async function checkFavorite() {
      if (!user || !id) return;
      const { data } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', Number(id))
        .maybeSingle();
      if (data) setFavoriteId(data.id);
    }
    checkFavorite();
  }, [user, id]);

  // Record view in history
  useEffect(() => {
    async function recordHistory() {
      if (!user || !id) return;
      await supabase.from('user_history').insert({ user_id: user.id, recipe_id: Number(id) });
    }
    recordHistory();
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!user) { navigate('/login'); return; }
    setFavLoading(true);
    if (favoriteId) {
      await supabase.from('user_favorites').delete().eq('id', favoriteId);
      setFavoriteId(null);
    } else {
      const { data } = await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, recipe_id: Number(id) })
        .select('id')
        .single();
      if (data) setFavoriteId(data.id);
    }
    setFavLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">加载中...</div>;
  if (!recipe) return <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">找不到此食谱</div>;

  const isFavorited = favoriteId !== null;

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#2D3142] pb-10 max-w-md mx-auto">
      <header className="relative w-full h-[35vh] overflow-hidden rounded-b-[40px] shadow-lg bg-gradient-to-br from-[#FF6B35] to-[#F7C59F]/40 flex items-center justify-center">
        {recipe.image_url && (
          <img src={recipe.image_url} alt={recipe.title} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/40 to-transparent z-10">
          <button onClick={() => navigate('/main')} className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md">
            <ChevronLeft className="h-6 w-6 text-[#2D3142]" />
          </button>
          <button
            onClick={toggleFavorite}
            disabled={favLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${isFavorited ? 'bg-[#EF476F]' : 'bg-white/90'}`}
          >
            <Heart className={`h-6 w-6 transition-colors ${isFavorited ? 'text-white fill-white' : 'text-[#EF476F]'}`} />
          </button>
        </div>
      </header>

      <main className="px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-orange-100/50">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold leading-tight flex-1 pr-4">{recipe.title}</h1>
            <div className="flex flex-col items-center bg-[#F7C59F]/20 p-2 rounded-xl min-w-[60px]">
              <span className="text-[#EF476F] font-bold text-lg">
                {recipe.reviews_count >= 1000 ? (recipe.reviews_count / 1000).toFixed(1) + 'k' : recipe.reviews_count}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">点赞</span>
            </div>
          </div>

          <div className="flex gap-4 mt-4 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.prep_time_minutes} 分钟</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>2 人份</span>
            </div>
          </div>

          {isFavorited && (
            <div className="mt-3 text-xs text-[#EF476F] font-semibold flex items-center gap-1">
              <Heart className="w-3 h-3 fill-current" />
              已收藏
            </div>
          )}
        </div>

        <section className="mt-8">
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="text-xl font-bold">食材清单</h2>
            <span className="text-[#FF6B35] text-sm font-semibold">共 {ingredients.length} 项</span>
          </div>
          <div className="space-y-3">
            {ingredients.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#F7C59F]/20 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B35]"></div>
                  <span className="font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-[#2D3142] font-semibold">{item.amount}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 space-y-3">
          <Link to={`/recipe/${recipe.id}/cook/1`} className="w-full py-5 bg-[#FF6B35] text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
            <Play className="h-6 w-6 fill-white" />
            开始烹饪
          </Link>
          <Link to={`/recipe/${recipe.id}/reviews`} className="w-full py-4 bg-[#F7C59F]/30 text-[#2D3142] rounded-2xl font-semibold text-base active:scale-95 transition-transform border border-[#F7C59F]/50 flex items-center justify-center">
            查看优化与评价
          </Link>
        </div>
      </main>
    </div>
  );
}
