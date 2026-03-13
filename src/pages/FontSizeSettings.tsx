import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FontSizeSettings() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-stone-100 rounded-full text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-stone-900">字体大小</h1>
        <div className="w-9"></div>
      </header>
      <main className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden p-6">
          <p className="text-stone-500 mb-8 text-center">拖动滑块调整字体大小</p>
          <div className="flex items-center justify-between">
            <span className="text-sm">A</span>
            <input type="range" min="1" max="5" defaultValue="3" className="w-full mx-4" />
            <span className="text-xl font-bold">A</span>
          </div>
        </div>
      </main>
    </div>
  );
}
