import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  Tag,
  Palette
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';

export default function ManageCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    color_bg: '',
    description: ''
  });

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (data) setCategories(data);
    if (error) console.error('Error fetching categories:', error);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        icon: category.icon,
        color_bg: category.color_bg,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', icon: '', color_bg: 'bg-white', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (editingCategory) {
      const { error } = await supabase
        .from('categories')
        .update(formData)
        .eq('id', editingCategory.id);
      if (!error) await fetchCategories();
      else alert('更新失败：' + error.message);
    } else {
      const { error } = await supabase
        .from('categories')
        .insert(formData);
      if (!error) await fetchCategories();
      else alert('创建失败：' + error.message);
    }
    
    setSaving(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？这可能会影响到关联的食谱。')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) setCategories(prev => prev.filter(c => c.id !== id));
    else alert('删除失败：' + error.message);
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-slate-800">全部分类</h3>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#ec5b13] text-white rounded-xl text-sm font-bold hover:bg-[#d94f0e] transition-colors"
          >
            <Plus size={16} /> 新增分类
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
              加载中...
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400">暂无分类数据</div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="group p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm ${cat.color_bg || 'bg-white'}`}>
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate">{cat.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{cat.description || '暂无描述'}</p>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <header className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">{editingCategory ? '编辑分类' : '新增分类'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </header>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">名称</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#ec5b13] outline-none" 
                  placeholder="例如：川菜"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">图标 (Emoji)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.icon}
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#ec5b13] outline-none" 
                    placeholder="例如：🍲"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">背景色 (Tailwind Class)</label>
                  <select 
                    value={formData.color_bg}
                    onChange={e => setFormData({...formData, color_bg: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#ec5b13] outline-none"
                  >
                    <option value="bg-white">白色</option>
                    <option value="bg-red-50">浅红</option>
                    <option value="bg-blue-50">浅蓝</option>
                    <option value="bg-green-50">浅绿</option>
                    <option value="bg-orange-50">浅橙</option>
                    <option value="bg-purple-50">浅紫</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">描述 (可选)</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#ec5b13] outline-none resize-none" 
                  rows={3}
                  placeholder="简单的分类描述..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-[#ec5b13] text-white rounded-2xl font-bold hover:bg-[#d94f0e] disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
