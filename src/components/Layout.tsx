import { Outlet, NavLink } from 'react-router-dom';
import { Home, Utensils, Plus, Bookmark, User } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 pb-20">
      <Outlet />
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-stone-100 py-2 flex justify-between items-center z-50 px-6 max-w-md mx-auto">
        <NavLink to="/main" end className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-orange-500' : 'text-stone-400'}`}>
          <Home size={24} />
          <span className="text-[10px] mt-1 font-bold">首页</span>
        </NavLink>
        
        <NavLink to="/main/categories" className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-orange-500' : 'text-stone-400'}`}>
          <Utensils size={24} />
          <span className="text-[10px] mt-1 font-bold">食谱</span>
        </NavLink>
        
        <div className="flex items-center justify-center -mt-8 relative z-10">
          <NavLink to="/publish" className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30 border-4 border-white active:scale-95 transition-transform">
            <Plus size={28} />
          </NavLink>
        </div>
        
        <NavLink to="/main/favorites" className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-orange-500' : 'text-stone-400'}`}>
          <Bookmark size={24} />
          <span className="text-[10px] mt-1 font-bold">收藏</span>
        </NavLink>
        
        <NavLink to="/main/profile" className={({ isActive }) => `flex flex-col items-center ${isActive ? 'text-orange-500' : 'text-stone-400'}`}>
          <User size={24} />
          <span className="text-[10px] mt-1 font-bold">我的</span>
        </NavLink>
      </nav>
    </div>
  );
}
