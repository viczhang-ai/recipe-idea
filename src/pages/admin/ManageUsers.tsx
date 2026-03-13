import React, { useEffect, useState } from 'react';
import { Users, Shield, ShieldOff, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('profiles').select('*').order('id');
      if (data) setUsers(data);
      setLoading(false);
    }
    fetch();
  }, []);

  const toggleAdmin = async (u: any) => {
    const { error } = await supabase.from('profiles').update({ is_admin: !u.is_admin }).eq('id', u.id);
    if (!error) setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_admin: !u.is_admin } : x));
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500">用户</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500">状态</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">权限控制</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={3} className="p-10 text-center text-slate-400">加载中...</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{u.username || '匿名'}</td>
                <td className="px-6 py-4">
                  {u.is_admin ? (
                    <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold">管理员</span>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-bold">普通用户</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => toggleAdmin(u)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg">
                    {u.is_admin ? <ShieldOff size={18}/> : <Shield size={18}/>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
