import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function IngredientWiki() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIngredients() {
      const { data } = await supabase.from('ingredients_wiki').select('*').order('name');
      if (data) { setIngredients(data); setFiltered(data); }
      setLoading(false);
    }
    fetchIngredients();
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    const lower = q.toLowerCase();
    setFiltered(ingredients.filter(i => i.name.toLowerCase().includes(lower) || (i.description || '').toLowerCase().includes(lower)));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f8f6f6]">
      <header className="sticky top-0 z-10 bg-[#f8f6f6]/80 backdrop-blur-md border-b border-slate-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/main')} className="p-2 -ml-2 rounded-full active:bg-slate-100">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold">食材百科</h1>
        </div>
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="搜索食材..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] transition-all"
          />
        </div>
      </header>

      <main className="p-4 pb-24 space-y-3">
        {loading ? (
          <div className="text-center text-slate-400 py-12">加载中...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-12">没有找到相关食材</div>
        ) : filtered.map(ingredient => (
          <div key={ingredient.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-start gap-4">
              {ingredient.image_url && (
                <img src={ingredient.image_url} alt={ingredient.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-base">{ingredient.name}</h3>
                {ingredient.description && (
                  <p className="text-slate-500 text-sm mt-1 line-clamp-2">{ingredient.description}</p>
                )}
                {ingredient.benefits && (
                  <div className="mt-2 p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700 font-medium">营养价值：{ingredient.benefits}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
