import { ArrowLeft, Share2, Star, Plus } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Reviews() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const [recRes, revRes] = await Promise.all([
        supabase.from('recipes').select('title, rating, reviews_count').eq('id', id).single(),
        supabase.from('reviews').select('*, profiles(username, avatar_url)').eq('recipe_id', id).order('created_at', { ascending: false })
      ]);
      if (recRes.data) setRecipe(recRes.data);
      if (revRes.data) setReviews(revRes.data);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const avgRating = recipe?.rating || 0;

  return (
    <main className="max-w-md mx-auto min-h-screen bg-white shadow-sm pb-10">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between">
        <button onClick={() => navigate('/main')} className="p-2 -ml-2 rounded-full active:bg-slate-100">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold tracking-tight">社区反馈</h1>
        <button className="p-2 -mr-2 rounded-full active:bg-slate-100">
          <Share2 className="h-6 w-6" />
        </button>
      </header>

      <section className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-slate-900">{avgRating}</span>
            <span className="text-slate-400 font-medium">/ 5</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-orange-500">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-sm text-slate-500 mt-1">{recipe?.reviews_count || reviews.length} 条评价</span>
          </div>
        </div>
      </section>

      <section className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">全部评价</h2>
          <Link to={`/recipe/${id}/review/new`} className="text-sm text-emerald-600 font-semibold">写评价</Link>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-8">加载中...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-slate-400 py-8">还没有评价，快来第一个评价吧！</div>
        ) : (
          <div className="space-y-8">
            {reviews.map((review) => {
              const username = review.profiles?.username || '匿名用户';
              const avatarUrl = review.profiles?.avatar_url;
              const timeAgo = new Date(review.created_at).toLocaleDateString('zh-CN');
              return (
                <div key={review.id} className="flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center text-orange-500 font-bold">
                        {avatarUrl ? <img src={avatarUrl} alt={username} className="w-full h-full object-cover" /> : username[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{username}</h4>
                        <div className="flex text-orange-500 scale-75 origin-left">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{timeAgo}</span>
                  </div>
                  <p className="text-slate-600 text-[15px] leading-relaxed">{review.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="fixed bottom-6 right-6">
        <Link to={`/recipe/${id}/review/new`} className="bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all">
          <Plus className="h-6 w-6" />
          <span className="font-bold pr-1">评价</span>
        </Link>
      </div>
    </main>
  );
}
