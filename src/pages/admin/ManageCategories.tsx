import React, { useEffect, useState } from 'react';
import { Tag, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';

export default function ManageCategories() {
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCats(data);
    }
    fetch();
  }, []);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cats.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl shadow-sm ${c.color_bg}`}>{c.icon}</div>
            <div className="flex-1 font-bold text-slate-800">{c.name}</div>
            <div className="flex gap-2">
              <button className="text-blue-500 p-2"><Edit2 size={16}/></button>
              <button className="text-red-500 p-2"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
