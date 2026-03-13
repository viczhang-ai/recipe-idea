import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function MyRecipes() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-stone-100 rounded-full text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-stone-900">我的菜谱</h1>
        <Link to="/publish" className="p-2 -mr-2 bg-orange-100 rounded-full text-orange-600">
          <Plus className="w-5 h-5" />
        </Link>
      </header>

      <main className="p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">还没有发布过菜谱</h2>
          <p className="text-stone-500 text-sm mb-6">分享你的独家美味，让更多人看到你的厨艺</p>
          <Link to="/publish" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
            发布第一篇菜谱
          </Link>
        </div>
      </main>
    </div>
  );
}
