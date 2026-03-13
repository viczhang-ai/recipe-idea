import { ArrowLeft, Star, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function PublishReview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (rating === 0) { setError('请先选择评分'); return; }
    if (!content.trim()) { setError('请填写评价内容'); return; }

    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('reviews').insert({
      recipe_id: Number(id),
      user_id: user.id,
      rating,
      content: content.trim(),
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      navigate(`/recipe/${id}/reviews`);
    }
  };

  return (
    <div className="relative flex h-screen w-full max-w-md mx-auto flex-col bg-[#f8f6f6] overflow-x-hidden border-x border-[#ec5b13]/10">
      <header className="flex items-center bg-white sticky top-0 z-10 p-4 border-b border-[#ec5b13]/10 justify-between">
        <div onClick={() => navigate(id ? `/recipe/${id}/reviews` : '/main')} className="text-slate-900 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-[#ec5b13]/10 cursor-pointer">
          <ArrowLeft size={24} />
        </div>
        <h2 className="text-slate-900 text-lg font-bold leading-tight flex-1 text-center">发布评价</h2>
        <div className="flex w-10 items-center justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="text-[#ec5b13] text-base font-bold leading-normal tracking-wide bg-[#ec5b13]/10 px-4 py-1.5 rounded-full hover:bg-[#ec5b13] hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? '发布中' : '发布'}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        {!user && (
          <div className="mx-4 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
            请先<button onClick={() => navigate('/login')} className="font-bold underline mx-1">登录</button>，才能发布评价。
          </div>
        )}

        {error && (
          <div className="mx-4 mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 p-6 bg-white mt-2">
          <div className="text-[#ec5b13] text-4xl font-black leading-tight tracking-tight">
            {hoverRating || rating || '–'}
          </div>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(s => (
              <Star
                key={s}
                className={`w-8 h-8 cursor-pointer transition-colors ${s <= (hoverRating || rating) ? 'text-[#ec5b13] fill-current' : 'text-slate-300'}`}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
              />
            ))}
          </div>
          <p className="text-slate-500 text-sm font-medium">点击星星为这道菜评分</p>
        </div>

        <div className="px-4 py-4">
          <p className="text-slate-900 text-sm font-bold mb-3">印象标签</p>
          <div className="flex flex-wrap gap-2">
            {['容易上手', '味道很棒', '卖相极佳', '步骤详细'].map(tag => (
              <button
                key={tag}
                onClick={() => setContent(prev => prev + (prev ? '，' : '') + tag)}
                className="px-4 py-2 rounded-full border border-[#ec5b13] text-[#ec5b13] text-sm font-medium bg-[#ec5b13]/5 hover:bg-[#ec5b13]/10 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-2">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full rounded-xl text-slate-900 border border-slate-200 bg-white focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] min-h-[160px] placeholder:text-slate-400 p-4 text-base leading-relaxed"
            placeholder="在这里分享你的烹饪心得和美味成果吧..."
          />
        </div>
      </main>
    </div>
  );
}
