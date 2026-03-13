import { ArrowLeft, BookOpen, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const LEVEL_COLORS: Record<string, string> = {
  'Beginner': 'bg-green-100 text-green-700',
  'Intermediate': 'bg-orange-100 text-orange-700',
  'Advanced': 'bg-red-100 text-red-700',
};

const LEVEL_LABELS: Record<string, string> = {
  'Beginner': '入门',
  'Intermediate': '中级',
  'Advanced': '高级',
};

export default function CookingClass() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      const { data } = await supabase.from('cooking_classes').select('*').order('created_at', { ascending: false });
      if (data) setClasses(data);
      setLoading(false);
    }
    fetchClasses();
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f8f6f6]">
      <header className="sticky top-0 z-10 bg-[#f8f6f6]/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center gap-3">
        <button onClick={() => navigate('/main')} className="p-2 -ml-2 rounded-full active:bg-slate-100">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">厨艺课堂</h1>
      </header>

      <main className="p-4 pb-24 space-y-4">
        {loading ? (
          <div className="text-center text-slate-400 py-12">加载中...</div>
        ) : classes.length === 0 ? (
          <div className="text-center text-slate-400 py-12 flex flex-col items-center gap-3">
            <BookOpen className="w-12 h-12 opacity-40" />
            <p>暂无课程</p>
          </div>
        ) : classes.map(cls => (
          <div key={cls.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            {cls.thumbnail_url && (
              <img src={cls.thumbnail_url} alt={cls.title} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-base flex-1">{cls.title}</h3>
                {cls.level && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${LEVEL_COLORS[cls.level] || 'bg-slate-100 text-slate-600'}`}>
                    {LEVEL_LABELS[cls.level] || cls.level}
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm mt-1">{cls.instructor_name}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                {cls.duration_minutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{cls.duration_minutes} 分钟</span>
                  </div>
                )}
              </div>
              {cls.video_url && (
                <a href={cls.video_url} target="_blank" rel="noreferrer" className="mt-3 block w-full py-3 bg-[#ec5b13] text-white rounded-xl font-bold text-center hover:bg-[#d94f0e] transition-colors">
                  开始学习
                </a>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
