import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Shield, 
  ShieldOff, 
  MoreVertical,
  Loader2,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function ManageUsers() {
  const { profile: currentAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('*')
      .order('id');

    if (searchQuery) {
      query = query.ilike('username', `%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (data) setUsers(data);
    if (error) console.error('Error fetching users:', error);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (userId === currentAdmin?.id) {
      alert('你不能取消自己的管理员权限！');
      return;
    }
    
    const confirmMsg = currentStatus 
      ? '确定要取消该用户的管理员权限吗？' 
      : '确定要将该用户设为管理员吗？此用户将拥有管理全站的权限。';
      
    if (!confirm(confirmMsg)) return;
    
    setUpdatingId(userId);
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId);
      
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: !currentStatus } : u));
    } else {
      alert('操作失败：' + error.message);
    }
    setUpdatingId(null);
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索用户名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">用户</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">权限状态</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">最后活跃 (本地)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">管理</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    加载中...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    未找到相关用户
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-bold">
                              {u.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate">{u.username || '匿名用户'}</p>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                            <Mail size={12} /> {u.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.is_admin ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                          <Shield size={12} /> 管理员
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                          <Users size={12} /> 普通用户
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {u.id === currentAdmin?.id ? '当前在线' : '---'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleAdmin(u.id, u.is_admin)}
                        disabled={updatingId === u.id || u.id === currentAdmin?.id}
                        className={`p-2 rounded-lg transition-all ${
                          u.is_admin 
                            ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100' 
                            : 'text-[#ec5b13] hover:bg-orange-50'
                        } disabled:opacity-30`}
                        title={u.is_admin ? '取消管理员' : '设为管理员'}
                      >
                        {updatingId === u.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : u.is_admin ? (
                          <ShieldOff size={18} />
                        ) : (
                          <Shield size={18} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-sm text-slate-500">
            共计 <span className="font-bold">{users.length}</span> 名注册用户
          </p>
          <div className="flex items-center gap-2">
             {/* Pagination placeholder */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
