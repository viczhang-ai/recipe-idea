import { ArrowLeft, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function CuratedList() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-stone-100 rounded-full text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-stone-900">今日推荐</h1>
        <div className="w-9"></div>
      </header>

      <main className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <Link key={item} to={`/recipe/${item}`} className="flex bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 p-3">
              <img src={`https://picsum.photos/seed/curated${item}/200/200`} alt="Recipe" className="w-24 h-24 rounded-xl object-cover" />
              <div className="ml-4 flex-1 py-1">
                <h3 className="font-bold text-stone-900 mb-1">主厨精选推荐菜品 {item}</h3>
                <p className="text-xs text-stone-500 line-clamp-2 mb-2">这是一道非常适合今天享用的美味佳肴，营养丰富，口感极佳。</p>
                <div className="flex items-center text-stone-400 text-xs">
                  <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
                  <span>4.9</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
