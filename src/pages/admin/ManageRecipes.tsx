import React, { useEffect, useState } from 'react';
import { Search, Trash2, BookOpen, Loader2, Plus, Edit2, Star, Clock, Filter, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import RecipeForm from './RecipeForm';

export default function ManageRecipes() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRecipe, setEditingRecipe] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('recipes')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    if (data) setRecipes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定要删除食谱 "${title}" 吗？此操作不可撤销。`)) return;
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (!error) {
      setRecipes(prev => prev.filter(r => r.id !== id));
    } else {
      alert('删除失败: ' + error.message);
    }
  };

  const handleEdit = (recipe: any) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingRecipe(null);
    setIsFormOpen(true);
  };

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.author_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="按照食谱名称或作者搜索..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#ec5b13] focus:ring-4 focus:ring-[#ec5b13]/5 transition-all text-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
              <Filter size={18} />
            </button>
          </div>
          
          <button 
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#ec5b13] text-white rounded-2xl font-bold hover:bg-[#d94f0e] shadow-lg shadow-[#ec5b13]/20 transition-all active:scale-95"
          >
            <Plus size={18} /> 发布新食谱
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">食谱信息</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">分类</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">评分 / 时间</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">作者</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">管理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-slate-200" />
                    <p className="mt-4 text-slate-400 text-sm font-medium">同步云端数据中...</p>
                  </td>
                </tr>
              ) : filteredRecipes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <BookOpen size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 text-sm italic">未找到匹配的食谱</p>
                  </td>
                </tr>
              ) : filteredRecipes.map(r => (
                <tr key={r.id} className="group hover:bg-slate-50/80 transition-all border-l-4 border-transparent hover:border-l-[#ec5b13]">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm border border-slate-200">
                        <img src={r.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-800 text-sm mb-1 truncate max-w-[200px]">{r.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID: {String(r.id).split('-')[0]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden md:table-cell">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                      {r.categories?.name || '未分类'}
                    </span>
                  </td>
                  <td className="px-6 py-5 hidden lg:table-cell">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={i < Math.floor(r.rating || 5) ? 'fill-current' : 'text-slate-200'} />
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                        <Clock size={12} /> {r.prep_time || r.prep_time_minutes || 0} MINS
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-800">{r.author_name || '系统管理员'}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '未知日期'}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleEdit(r)}
                        className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                        title="编辑食谱"
                      >
                        <Edit2 size={18}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(r.id, r.title)}
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="删除食谱"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Overlay Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="scale-95 animate-in zoom-in-95 duration-200 w-full max-w-4xl">
            <RecipeForm 
              recipe={editingRecipe} 
              onSave={() => {
                setIsFormOpen(false);
                fetchRecipes();
              }}
              onCancel={() => setIsFormOpen(false)} 
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
