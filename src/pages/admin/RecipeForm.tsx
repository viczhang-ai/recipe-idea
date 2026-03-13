import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Utensils, 
  Clock, 
  Flame, 
  ChevronDown,
  Info,
  Camera
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RecipeFormProps {
  recipe?: any;
  onSave: () => void;
  onCancel: () => void;
}

export default function RecipeForm({ recipe, onSave, onCancel }: RecipeFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Function to normalize ingredients
  const normalizeIngredients = (ing: any) => {
    if (!ing || !Array.isArray(ing)) return [{ name: '', amount: '' }];
    return ing.map(i => typeof i === 'string' ? { name: i, amount: '' } : i);
  };

  // Function to normalize instructions
  const normalizeInstructions = (ins: any) => {
    if (!ins || !Array.isArray(ins)) return [{ text: '', image_url: '' }];
    return ins.map(i => typeof i === 'string' ? { text: i, image_url: '' } : i);
  };
  
  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    description: recipe?.description || '',
    category_id: recipe?.category_id || '',
    ingredients: normalizeIngredients(recipe?.ingredients),
    instructions: normalizeInstructions(recipe?.instructions),
    prep_time: recipe?.prep_time || recipe?.prep_time_minutes || 15,
    difficulty: recipe?.difficulty || '简单',
    rating: recipe?.rating || 5.0,
    image_url: recipe?.image_url || '',
    tags: recipe?.tags || []
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('name');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleIngredientChange = (index: number, field: 'name' | 'amount', value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, { name: '', amount: '' }] });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleStepChange = (index: number, field: 'text' | 'image_url', value: string) => {
    const newSteps = [...formData.instructions];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, instructions: newSteps });
  };

  const addStep = () => {
    setFormData({ ...formData, instructions: [...formData.instructions, { text: '', image_url: '' }] });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.instructions.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, instructions: newSteps });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        prep_time: formData.prep_time,
        difficulty: formData.difficulty,
        rating: formData.rating,
        image_url: formData.image_url,
        tags: formData.tags,
        author_name: recipe?.author_name || '管理员',
        author_role: '官方主厨'
      };

      if (recipe?.id) {
        const { error } = await supabase
          .from('recipes')
          .update(payload)
          .eq('id', recipe.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('recipes')
          .insert([payload]);
        if (error) throw error;
      }
      onSave();
    } catch (error: any) {
      alert('保存失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-black text-slate-800">{recipe ? '编辑食谱' : '发布新食谱'}</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Recipe Management System</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <X className="text-slate-400" size={24} />
        </button>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {/* Basic Info Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4 border-l-4 border-[#ec5b13] pl-3">
            <Info size={18} className="text-[#ec5b13]" />
            <h3 className="font-bold text-slate-800">基本信息</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">食谱名称</label>
              <input 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#ec5b13] focus:ring-4 focus:ring-[#ec5b13]/5 transition-all font-medium"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="例如：黄金蛋炒饭"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">所属分类</label>
              <div className="relative">
                <select 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#ec5b13] appearance-none font-medium"
                  value={formData.category_id}
                  onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">请选择分类</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">简短描述</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#ec5b13] resize-none font-medium leading-relaxed"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="介绍一下这道美味吧..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock size={16} className="text-slate-400" /> 准备时间 (分钟)
              </label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#ec5b13] font-medium"
                value={formData.prep_time}
                onChange={e => setFormData({ ...formData, prep_time: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Flame size={16} className="text-slate-400" /> 难度等级
              </label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#ec5b13] font-medium"
                value={formData.difficulty}
                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option value="简单">简单</option>
                <option value="中等">中等</option>
                <option value="困难">困难</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Camera size={16} className="text-slate-400" /> 封面图片 (URL)
              </label>
              <input 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#ec5b13] font-medium"
                value={formData.image_url}
                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        <hr className="border-slate-50" />

        {/* Ingredients Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4 border-l-4 border-blue-500 pl-3">
            <div className="flex items-center gap-2">
              <Utensils size={18} className="text-blue-500" />
              <h3 className="font-bold text-slate-800">用料清单</h3>
            </div>
            <button 
              type="button" 
              onClick={addIngredient}
              className="text-xs font-bold text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> 添加一行
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 group">
                <input 
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-400 font-medium"
                  value={ing.name}
                  placeholder="食材: 鸡蛋"
                  onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
                />
                <input 
                  className="w-24 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-400 font-medium"
                  value={ing.amount}
                  placeholder="2个"
                  onChange={e => handleIngredientChange(idx, 'amount', e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => removeIngredient(idx)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-50" />

        {/* Steps Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4 border-l-4 border-purple-500 pl-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Plus size={18} className="text-purple-500" /> 烹饪步骤
            </h3>
            <button 
              type="button" 
              onClick={addStep}
              className="text-xs font-bold text-purple-500 hover:bg-purple-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> 添加新步骤
            </button>
          </div>
          
          <div className="space-y-6">
            {formData.instructions.map((step, idx) => (
              <div key={idx} className="flex gap-4 group items-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 mt-1 shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <textarea 
                    rows={2}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-purple-400 resize-none font-medium leading-relaxed"
                    value={step.text}
                    placeholder={`第 ${idx + 1} 步操作说明...`}
                    onChange={e => handleStepChange(idx, 'text', e.target.value)}
                  />
                  <input 
                    className="w-full px-4 py-2 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:border-purple-300 text-[10px] font-mono"
                    value={step.image_url}
                    placeholder="步骤图片 URL (可选)"
                    onChange={e => handleStepChange(idx, 'image_url', e.target.value)}
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeStep(idx)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 mt-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </form>

      <footer className="px-8 py-6 border-t border-slate-100 bg-white flex justify-end gap-4 sticky bottom-0 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <button 
          type="button"
          onClick={onCancel}
          className="px-8 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
        >
          取消
        </button>
        <button 
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-10 py-3 bg-[#ec5b13] text-white rounded-2xl font-bold hover:bg-[#d94f0e] shadow-lg shadow-[#ec5b13]/20 transition-all disabled:opacity-50 active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          确认发布
        </button>
      </footer>
    </div>
  );
}
