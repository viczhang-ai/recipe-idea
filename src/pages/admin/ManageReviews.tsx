import React, { useEffect, useState } from 'react';
import { MessageSquare, Trash2, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';

export default function ManageReviews() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('reviews').select('*, profiles(username)').order('created_at', { ascending: false });
      if (data) setReviews(data);
    }
    fetch();
  }, []);

  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        {reviews.map(r => (
          <div key={r.id} className="p-6 border-b border-slate-50 flex justify-between items-start gap-6 hover:bg-slate-50 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-slate-800 text-sm">{r.profiles?.username}</span>
                <span className="text-yellow-400 text-xs">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">"{r.content}"</p>
            </div>
            <button className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
