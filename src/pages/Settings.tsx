import { ArrowLeft, ChevronRight, Bell, Lock, Eye, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  const sections = [
    {
      title: '账号与安全',
      items: [
        { icon: <Lock className="w-5 h-5" />, label: '账号管理', path: '/settings/account' },
        { icon: <Eye className="w-5 h-5" />, label: '隐私设置', path: '/settings/privacy' },
      ]
    },
    {
      title: '通用',
      items: [
        { icon: <Bell className="w-5 h-5" />, label: '消息通知', path: '/settings/notifications' },
        { icon: <span className="w-5 h-5 flex items-center justify-center font-bold text-lg">A</span>, label: '字体大小', path: '/settings/fontsize' },
        { icon: <span className="w-5 h-5 flex items-center justify-center font-bold text-lg">🌙</span>, label: '深色模式', path: '/settings/darkmode' },
      ]
    },
    {
      title: '关于',
      items: [
        { icon: <HelpCircle className="w-5 h-5" />, label: '帮助与客服', path: '/settings/help' },
        { icon: <span className="w-5 h-5 flex items-center justify-center font-bold text-lg">ℹ️</span>, label: '关于我们', path: '/about' },
      ]
    }
  ];

  return (
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-stone-100 rounded-full text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-stone-900">设置</h1>
        <div className="w-9"></div>
      </header>

      <main className="p-6">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 pl-2">{section.title}</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">
              {section.items.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => item.path && navigate(item.path)}
                  className={`flex items-center justify-between p-4 ${i !== section.items.length - 1 ? 'border-b border-stone-100' : ''} ${item.path ? 'cursor-pointer active:bg-stone-50' : ''}`}
                >
                  <div className="flex items-center text-stone-700">
                    <div className="text-stone-400 mr-3">{item.icon}</div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-300" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button 
          onClick={() => navigate('/login')}
          className="w-full mt-4 bg-white text-red-500 font-bold py-4 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-center active:bg-stone-50"
        >
          <LogOut className="w-5 h-5 mr-2" />
          退出登录
        </button>
      </main>
    </div>
  );
}
