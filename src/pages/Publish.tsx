import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Plus, X, Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Publish() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const stepFileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    ingredients: [{ name: '', amount: '' }],
    instructions: [{ text: '', image_url: '' }],
    category_id: '88888888-8888-8888-8888-888888888888'
  });

  const handleMainImageClick = () => mainFileInputRef.current?.click();

  const handleMainFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setMainImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/main_${fileName}`;

      const { error } = await supabase.storage.from('recipes').upload(filePath, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('recipes').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error: any) {
      alert('图片上传失败: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleStepImageClick = (index: number) => {
    setActiveStepIndex(index);
    stepFileInputRef.current?.click();
  };

  const handleStepFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeStepIndex === null) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/step_${activeStepIndex}_${fileName}`;

      const { error } = await supabase.storage.from('recipes').upload(filePath, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('recipes').getPublicUrl(filePath);
      
      const newSteps = [...formData.instructions];
      newSteps[activeStepIndex] = { ...newSteps[activeStepIndex], image_url: publicUrl };
      setFormData(prev => ({ ...prev, instructions: newSteps }));
    } catch (error: any) {
      alert('步骤图片上传失败: ' + error.message);
    } finally {
      setUploadingImage(false);
      setActiveStepIndex(null);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '' }]
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const newIng = [...formData.ingredients];
    newIng[index][field] = value;
    setFormData(prev => ({ ...prev, ingredients: newIng }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, { text: '', image_url: '' }]
    }));
  };

  const removeStep = (index: number) => {
    if (formData.instructions.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateStepText = (index: number, value: string) => {
    const newSteps = [...formData.instructions];
    newSteps[index] = { ...newSteps[index], text: value };
    setFormData(prev => ({ ...prev, instructions: newSteps }));
  };

  const handleSubmit = async () => {
    if (!formData.title) return alert('请输入菜谱名称');
    if (!formData.image_url && !mainImagePreview) return alert('请上传菜谱大图');
    
    setLoading(true);
    try {
      // Structure the data properly for DB
      const dbData = {
        ...formData,
        // Convert instructions objects to strings or keep as JSON if the schema supports it.
        // Usually, the legacy 'instructions' column is a text array of descriptions.
        // We'll store the full objects which Supabase/Postgres can handle as JSONB.
        author_name: profile?.username || user?.email?.split('@')[0] || '匿名用户',
        rating: 5.0,
        prep_time: 20
      };

      const { error } = await supabase.from('recipes').insert([dbData]);
      if (error) throw error;
      
      alert('发布成功！');
      navigate('/main');
    } catch (error: any) {
      alert('发布失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f6f6] max-w-md mx-auto">
      <header className="sticky top-0 z-20 flex items-center bg-white p-4 border-b border-[#ec5b13]/10 justify-between">
        <div onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-[#ec5b13]/10 transition-colors cursor-pointer">
          <ArrowLeft className="text-slate-900" />
        </div>
        <h1 className="text-lg font-bold flex-1 text-center text-slate-800">发布菜谱</h1>
        <button 
          onClick={handleSubmit}
          disabled={loading || uploadingImage}
          className="text-[#ec5b13] text-sm font-bold bg-[#ec5b13]/10 px-6 py-2 rounded-full hover:bg-[#ec5b13] hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : '完成'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Main Image */}
        <div className="bg-white p-4 mb-2">
          <div 
            onClick={handleMainImageClick}
            className="relative w-full aspect-video bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 cursor-pointer hover:border-[#ec5b13]/40 hover:bg-[#ec5b13]/5 transition-all overflow-hidden"
          >
            {mainImagePreview ? (
              <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="text-slate-300 w-12 h-12 mb-3" />
                <span className="text-slate-400 text-sm font-bold">上传成品大图</span>
              </>
            )}
            {uploadingImage && activeStepIndex === null && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="text-[#ec5b13] animate-spin" size={32} />
              </div>
            )}
          </div>
          <input type="file" ref={mainFileInputRef} onChange={handleMainFileChange} accept="image/*" className="hidden" />

          <input 
            type="text" 
            placeholder="填写菜谱标题..." 
            className="w-full text-2xl font-black text-slate-800 placeholder:text-slate-300 border-none focus:ring-0 p-0 mt-6 mb-4"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          
          <textarea 
            placeholder="分享一下这道菜的故事，或者是你的独门秘籍吧..." 
            className="w-full text-sm text-slate-600 placeholder:text-slate-300 border-none focus:ring-0 p-0 min-h-[80px] resize-none leading-relaxed"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Ingredients */}
        <div className="bg-white p-6 mb-2">
          <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#ec5b13] rounded-full"></span>
            准备食材
          </h2>
          <div className="space-y-4 mb-6">
            {formData.ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <input 
                  type="text" 
                  placeholder="食材: 鸡蛋" 
                  className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#ec5b13]/20 transition-all"
                  value={ing.name}
                  onChange={e => updateIngredient(idx, 'name', e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="2个" 
                  className="w-28 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#ec5b13]/20 transition-all"
                  value={ing.amount}
                  onChange={e => updateIngredient(idx, 'amount', e.target.value)}
                />
                <button onClick={() => removeIngredient(idx)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addIngredient} className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 transition-all">
            <Plus className="w-5 h-5" /> 添加一线食材
          </button>
        </div>

        {/* Steps */}
        <div className="bg-white p-6">
          <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#ec5b13] rounded-full"></span>
            制作步骤
          </h2>
          <div className="space-y-10 mb-6">
            {formData.instructions.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#ec5b13] text-white flex items-center justify-center text-sm font-black shadow-lg shadow-[#ec5b13]/20 shrink-0">
                    {idx + 1}
                  </div>
                  {idx < formData.instructions.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-2"></div>}
                </div>
                <div className="flex-1 space-y-3">
                  <div 
                    onClick={() => handleStepImageClick(idx)}
                    className="relative w-full aspect-video bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 cursor-pointer hover:border-[#ec5b13]/40 group overflow-hidden"
                  >
                    {step.image_url ? (
                      <img src={step.image_url} alt={`Step ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-300 group-hover:text-[#ec5b13]/60 transition-colors">
                        <ImageIcon size={32} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">上传步骤图</span>
                      </div>
                    )}
                    {uploadingImage && activeStepIndex === idx && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="text-[#ec5b13] animate-spin" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="relative group">
                    <textarea 
                      placeholder="这一步要做什么呢？" 
                      className="w-full text-sm text-slate-700 placeholder:text-slate-300 bg-slate-50 border-none rounded-2xl px-4 py-4 min-h-[100px] focus:bg-white focus:ring-2 focus:ring-[#ec5b13]/20 transition-all resize-none leading-relaxed"
                      value={step.text}
                      onChange={e => updateStepText(idx, e.target.value)}
                    />
                    <button onClick={() => removeStep(idx)} className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <input type="file" ref={stepFileInputRef} onChange={handleStepFileChange} accept="image/*" className="hidden" />
          <button onClick={addStep} className="flex items-center justify-center gap-2 w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 shadow-xl shadow-slate-200 transition-all">
            <Plus className="w-5 h-5" /> 添加下一步
          </button>
        </div>
      </main>
    </div>
  );
}
