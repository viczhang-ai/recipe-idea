import { ArrowLeft, Star } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CategoryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const [catRes, recsRes] = await Promise.all([
        supabase.from('categories').select('*').eq('id', id).single(),
        supabase.from('recipes').select('*').eq('category_id', id)
      ]);
      if (catRes.data) setCategory(catRes.data);
      if (recsRes.data) setRecipes(recsRes.data);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const title = category?.name || '分类';

  return (
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => navigate('/main')} className="p-2 -ml-2 bg-stone-100 rounded-full text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-stone-900">{title}</h1>
        <div className="w-9"></div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 text-center text-stone-500 py-8">加载中...</div>
          ) : recipes.length === 0 ? (
            <div className="col-span-2 text-center text-stone-500 py-8">暂无内容</div>
          ) : recipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">
              <div className="relative h-32 w-full">
                <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-stone-900 text-sm mb-1 line-clamp-1">{recipe.title}</h3>
                <div className="flex items-center text-stone-400 text-xs">
                  <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
                  <span>{recipe.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
