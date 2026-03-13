import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Loader2,
  Star,
  User,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import { Link } from 'react-router-dom';

export default function ManageReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (username, avatar_url),
        recipes:recipe_id (title)
      `)
      .order('created_at', { ascending: false });

    if (data) setReviews(data);
    if (error) console.error('Error fetching reviews:', error);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条评价吗？')) return;
    setDeletingId(id);
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
      setReviews(prev => prev.filter(r => r.id !== id));
    } else {
      alert('删除失败：' + error.message);
    }
    setDeletingId(null);
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-slate-800">评价审核</h3>
          </div>
          <div className="text-sm text-slate-500">
            共 <span className="font-bold text-[#ec5b13]">{reviews.length}</span> 条评价
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
              加载中...
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-20 text-center text-slate-400">暂无评价数据</div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row gap-6">
                {/* User & Rating */}
                <div className="w-full md:w-48 flex-shrink-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                      {review.profiles?.avatar_url ? (
                        <img src={review.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-bold text-xs">
                          {review.profiles?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-slate-800 text-sm truncate">{review.profiles?.username || '用户'}</span>
                  </div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400">{new Date(review.created_at).toLocaleString()}</p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 mr-2 tracking-wider">针对食谱:</span>
                    <Link to={`/recipe/${review.recipe_id}`} target="_blank" className="text-sm font-bold text-[#ec5b13] hover:underline inline-flex items-center gap-1">
                      {review.recipes?.title} <ExternalLink size={12} />
                    </Link>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                    "{review.content}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-start justify-end gap-2 md:w-24">
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                    title="删除评价"
                  >
                    {deletingId === review.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
                  <button className="p-2 text-slate-300 hover:text-slate-400 rounded-lg">
                    <AlertCircle size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
