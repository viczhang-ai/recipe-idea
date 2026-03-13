import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Timer, ChefHat, PartyPopper } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Cooking() {
  const { id, step } = useParams();
  const navigate = useNavigate();
  const currentStep = parseInt(step || '1', 10);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSteps() {
      if (!id) return;
      const { data } = await supabase
        .from('recipe_steps')
        .select('*')
        .eq('recipe_id', id)
        .order('step_number', { ascending: true });
      if (data) setSteps(data);
      setLoading(false);
    }
    fetchSteps();
  }, [id]);

  const totalSteps = steps.length || 1;
  const stepData = steps[currentStep - 1];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      navigate(`/recipe/${id}/cook/${currentStep + 1}`);
    } else {
      navigate('/main');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      navigate(`/recipe/${id}/cook/${currentStep - 1}`);
    } else {
      navigate('/main');
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full max-w-md mx-auto flex-col bg-[#f8f6f6] overflow-x-hidden shadow-xl">
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-[#f8f6f6]/90 backdrop-blur-md z-10">
        <div onClick={() => navigate('/main')} className="text-slate-900 flex size-12 shrink-0 items-center justify-start cursor-pointer">
          <ArrowLeft size={24} />
        </div>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">
          步骤 {currentStep}/{totalSteps}
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-slate-700 text-base font-semibold">烹饪进度</p>
          <p className="text-[#ec5b13] text-sm font-bold">{Math.round((currentStep / totalSteps) * 100)}%</p>
        </div>
        <div className="rounded-full bg-[#ec5b13]/10 h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#ec5b13] transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="px-6 pb-32">
        {loading ? (
          <div className="text-center text-slate-400 py-16">加载中...</div>
        ) : steps.length === 0 ? (
          <div className="text-center text-slate-400 py-16 flex flex-col items-center gap-4">
            <ChefHat className="w-12 h-12 text-[#ec5b13]/40" />
            <p>该食谱尚未添加步骤</p>
          </div>
        ) : stepData ? (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="text-[#ec5b13] w-6 h-6" />
              <h3 className="text-slate-900 tracking-tight text-2xl font-bold">第 {stepData.step_number} 步</h3>
            </div>
            {stepData.image_url && (
              <img src={stepData.image_url} alt={`步骤 ${stepData.step_number}`} className="w-full rounded-xl object-cover aspect-video mb-6" />
            )}
            <p className="text-slate-600 text-base leading-relaxed mb-6">{stepData.instruction}</p>
            {stepData.duration_minutes && (
              <div className="p-4 rounded-xl bg-[#ec5b13]/5 border border-[#ec5b13]/10 flex items-center gap-3">
                <Timer className="text-[#ec5b13]" />
                <span className="text-slate-800 font-medium">预计时间：{stepData.duration_minutes} 分钟</span>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#f8f6f6]/80 backdrop-blur-md border-t border-[#ec5b13]/10 max-w-md mx-auto z-20">
        <div className="flex gap-4">
          <button onClick={prevStep} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-[#ec5b13] text-[#ec5b13] font-bold hover:bg-[#ec5b13]/5 transition-colors">
            <ArrowLeft size={20} />
            返回
          </button>
          <button onClick={nextStep} className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#ec5b13] text-white font-bold hover:bg-[#ec5b13]/90 shadow-lg shadow-[#ec5b13]/20 transition-all">
            {currentStep === totalSteps ? '完成' : '下一步'}
            {currentStep === totalSteps ? <PartyPopper size={20} /> : <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
