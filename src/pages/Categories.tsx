import { Search, ArrowLeft, ChevronRight, BookOpen, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <div className="bg-[#f8f6f6] text-slate-900 min-h-screen flex flex-col max-w-md mx-auto">
      <header className="sticky top-0 z-10 bg-[#f8f6f6]/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center p-4 justify-between w-full">
          <div onClick={() => navigate('/main')} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
            <ArrowLeft className="text-slate-700" />
          </div>
          <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">食谱分类</h1>
          <div className="flex w-10 items-center justify-end">
            <button className="flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <Search className="text-slate-700" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pb-24">
        <div className="px-4 pt-6 pb-2">
          <div className="relative h-40 w-full rounded-xl overflow-hidden shadow-sm group bg-gradient-to-r from-[#ec5b13] to-orange-400">
            <div className="absolute inset-0 flex flex-col justify-center px-6 text-white z-10">
              <h2 className="text-2xl font-bold mb-1">今日推荐</h2>
              <p className="text-white/80 text-sm">探索 1,000+ 种健康美味食谱</p>
              <Link to="/curated" className="mt-4 inline-flex items-center gap-2 bg-white text-[#ec5b13] px-4 py-1.5 rounded-full text-sm font-bold w-fit">
                立即探索
              </Link>
            </div>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8WhnPEuzP0YTRWALJEOMHdniIRwXMsq6U_8nGfGgNGsLsL_BycS_0SLnswNN_CnMLQtpZjYcDhzMVRUwfMEpz9CbdxyQl-anqr7LVS5istTU79fxa3i5gUmuwQYzBsny63hLt7ful3renIiIgiO-U7zskOoz7JA1-h4c5he8-2vaQwUUZpXWD2XYpMjaqkGV3qExuncLGQ3nUtOke2QbYZ1iNZeyZ7dJwO3iz5fdTPjY2GFhOux1xIQcuOaMFRMMkH_RHzJjZeiok" alt="Healthy food bowl" className="absolute right-0 top-0 h-full w-1/3 object-cover mix-blend-overlay" />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-3 pt-6">
          <h2 className="text-slate-900 text-xl font-bold leading-tight">所有类别</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4">
          {loading ? (
            <div className="col-span-2 text-center text-stone-500 py-8">加载中...</div>
          ) : categories.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className={`relative group cursor-pointer overflow-hidden rounded-xl aspect-square flex flex-col items-center justify-center p-4 shadow-sm border border-slate-100 ${cat.color_bg || 'bg-white'}`}>
              <span className="text-5xl mb-3 transition-transform duration-500 group-hover:scale-110">{cat.icon}</span>
              <p className="relative z-20 text-slate-800 text-base font-bold leading-tight">{cat.name}</p>
            </Link>
          ))}
        </div>

        <h3 className="text-slate-900 text-lg font-bold px-4 pb-4 pt-8">更多探索</h3>
        <div className="px-4 space-y-4">
          <Link to="/class" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="w-14 h-14 rounded-lg bg-[#ec5b13]/10 flex items-center justify-center text-[#ec5b13]">
              <BookOpen size={28} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">厨艺课堂</p>
              <p className="text-sm text-slate-500">从零开始学习烹饪技巧</p>
            </div>
            <ChevronRight className="text-slate-400" />
          </Link>
          <Link to="/wiki" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="w-14 h-14 rounded-lg bg-[#ec5b13]/10 flex items-center justify-center text-[#ec5b13]">
              <ShoppingBag size={28} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">食材百科</p>
              <p className="text-sm text-slate-500">了解每种食材的营养价值</p>
            </div>
            <ChevronRight className="text-slate-400" />
          </Link>
        </div>
      </main>
    </div>
  );
}
