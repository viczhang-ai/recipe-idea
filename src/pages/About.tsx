import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-stone-100 rounded-full text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-stone-900">关于我们</h1>
        <div className="w-9"></div>
      </header>

      <main className="p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-6 mt-8">
          <span className="text-5xl text-white">👨‍🍳</span>
        </div>
        <h2 className="text-2xl font-black text-stone-900 mb-2">美味食谱</h2>
        <p className="text-stone-500 mb-8">版本 1.0.0</p>

        <div className="w-full text-left space-y-6 text-stone-600 leading-relaxed">
          <p>
            我们致力于为全球美食爱好者提供一个分享、发现和学习烹饪的平台。无论你是厨房新手还是经验丰富的大厨，这里都有适合你的灵感。
          </p>
          <p>
            通过精美的图文和视频，我们让烹饪变得简单而有趣。加入我们的社区，一起探索食物的无限可能。
          </p>
        </div>

        <div className="mt-12 w-full space-y-4">
          <button className="w-full py-3 text-stone-700 font-medium border border-stone-200 rounded-xl active:bg-stone-50">
            用户协议
          </button>
          <button className="w-full py-3 text-stone-700 font-medium border border-stone-200 rounded-xl active:bg-stone-50">
            隐私政策
          </button>
        </div>
        
        <p className="mt-12 text-xs text-stone-400">
          © 2026 美味食谱 App. All rights reserved.
        </p>
      </main>
    </div>
  );
}
