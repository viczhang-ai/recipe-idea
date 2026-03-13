import { Search, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [catsRes, recsRes] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('recipes').select('*').limit(5)
      ]);
      
      if (catsRes.data) setCategories(catsRes.data);
      if (recsRes.data) setRecipes(recsRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">早上好</p>
            <h1 className="text-2xl font-serif font-bold text-stone-900">今天做点什么？</h1>
          </div>
          <Link to="/main/profile" className="h-10 w-10 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center overflow-hidden">
            <span className="text-orange-500 font-bold">JD</span>
          </Link>
        </div>
        
        <form onSubmit={handleSearch} className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-stone-400" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border-none bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 placeholder-stone-400 transition-all duration-200" 
            placeholder="搜索食谱、食材..." 
          />
        </form>
      </header>

      <main className="px-6 mt-4">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">分类</h2>
            <Link to="/main/categories" className="text-orange-500 text-sm font-semibold">查看全部</Link>
          </div>
          <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
            {loading ? (
              <div className="text-sm text-stone-500 py-4">加载中...</div>
            ) : categories.map((cat) => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="flex flex-col items-center flex-shrink-0 group">
                <div className={`w-16 h-16 rounded-2xl ${cat.color_bg || 'bg-stone-100'} flex items-center justify-center mb-2 group-active:scale-95 transition-transform`}>
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <span className="text-xs font-medium text-stone-600">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold mb-4">热门食谱</h2>
          
          {loading ? (
            <div className="text-stone-500 py-4">加载中...</div>
          ) : recipes.map(recipe => (
            <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="block bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 mb-6 group transition-all">
              <div className="relative h-64 w-full">
                <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-stone-800">
                  {recipe.prep_time_minutes} 分钟
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-orange-500 transition-colors">{recipe.title}</h3>
                  <div className="flex items-center text-stone-400 text-sm">
                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                    <span>{recipe.rating} ({recipe.reviews_count >= 1000 ? (recipe.reviews_count / 1000).toFixed(1) + 'k' : recipe.reviews_count})</span>
                  </div>
                </div>
                <p className="text-stone-500 text-sm line-clamp-2">{recipe.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-stone-200"></div>
                    <span className="text-xs font-semibold text-stone-700 italic">作者：{recipe.author_name}</span>
                  </div>
                  {recipe.category_id && (
                    <span className="text-xs font-bold text-orange-500 bg-orange-100 px-3 py-1 rounded-full">{recipe.category_id === 'lunch' ? '午餐' : recipe.category_id === 'dinner' ? '晚餐' : recipe.category_id === 'breakfast' ? '早餐' : '推荐'}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
