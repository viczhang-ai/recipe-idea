import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationSettings() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-stone-100 rounded-full text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-stone-900">消息通知</h1>
        <div className="w-9"></div>
      </header>
      <main className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex justify-between items-center">
            <span className="text-stone-700">新粉丝提醒</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="p-4 border-b border-stone-100 flex justify-between items-center">
            <span className="text-stone-700">点赞与收藏提醒</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-stone-700">评论与回复提醒</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
        </div>
      </main>
    </div>
  );
}
