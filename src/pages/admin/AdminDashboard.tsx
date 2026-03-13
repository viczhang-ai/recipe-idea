import React, { useEffect, useState } from 'react';
import { Users, BookOpen, MessageSquare, Plus, Activity, Tag, ArrowUpRight, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, recipes: 0, reviews: 0, loading: true });
  const [categories, setCategories] = useState<any[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [u, r, v, c, rec] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('recipes').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('name, icon, color_bg'),
        supabase.from('recipes').select('id, title, created_at, rating').order('created_at', { ascending: false }).limit(5)
      ]);
      
      setStats({
        users: u.count || 0,
        recipes: r.count || 0,
        reviews: v.count || 0,
        loading: false
      });
      setCategories(c.data || []);
      setRecentRecipes(rec.data || []);
    }
    fetchData();
  }, []);

  // Simple growth chart data (Mocked trend for last 7 days)
  const growthData = [45, 52, 49, 62, 58, 75, 82]; 

  return (
    <AdminLayout>
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: '活跃用户', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12%' },
          { label: '本月食谱', value: stats.recipes, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50', change: '+18%' },
          { label: '实时评价', value: stats.reviews, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', change: '+5%' },
        ].map(s => (
          <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${s.bg} ${s.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                <s.icon size={22} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">
                <ArrowUpRight size={12} /> {s.change}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{s.label}</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.loading ? '...' : s.value.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Analytics Chart (SVG) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">增长趋势</h3>
              <p className="text-xs text-slate-400">近 7 天用户活跃度分析</p>
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ec5b13]"></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">活跃度</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between relative px-2">
            {/* Simple SVG Line Chart representation via CSS bars for clean look */}
            {growthData.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group w-full">
                <div 
                  className="w-8 bg-slate-100 rounded-t-xl relative overflow-hidden group-hover:bg-[#ec5b13]/10 transition-colors"
                  style={{ height: `${(val / 100) * 200}px` }}
                >
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#ec5b13] to-orange-400 rounded-t-xl transition-all duration-1000 ease-out"
                    style={{ height: '0%', animation: `grow-up 1s forwards ${i * 0.1}s` }}
                  />
                  <style>{`
                    @keyframes grow-up {
                      to { height: 100%; }
                    }
                  `}</style>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {val}%
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-2">D{i+1}</span>
              </div>
            ))}
            {/* Simple Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none -z-10 opacity-5 border-b border-slate-900">
              <div className="border-t border-slate-900 w-full h-px"></div>
              <div className="border-t border-slate-900 w-full h-px"></div>
              <div className="border-t border-slate-900 w-full h-px"></div>
              <div className="border-t border-slate-900 w-full h-px"></div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-6">分类分布</h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {categories.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-3 group cursor-default">
                <div className={`w-10 h-10 rounded-xl ${cat.color_bg || 'bg-slate-50'} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{Math.floor(Math.random() * 20) + 10}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-200 transition-all duration-1000" 
                      style={{ width: '0%', animation: `slide-right 1s forwards ${i * 0.15}s` }}
                    />
                    <style>{`
                      @keyframes slide-right {
                        to { width: ${Math.random() * 60 + 20}%; }
                      }
                    `}</style>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-3 bg-slate-50 text-slate-500 text-xs font-bold rounded-2xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
            <Activity size={14} /> 查看完整报告
          </button>
        </div>
      </div>

      {/* Quick Actions & Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between uppercase tracking-wider">
            <h3 className="text-xs font-black text-slate-400">近期发布的食谱</h3>
            <Link to="/admin/recipes" className="text-xs font-bold text-[#ec5b13] hover:underline">全部管理</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentRecipes.map(r => (
              <div key={r.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#ec5b13]">
                  <BookOpen size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{r.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-400 font-bold text-xs">
                    ★ {r.rating || 5.0}
                  </div>
                </div>
              </div>
            ))}
            {recentRecipes.length === 0 && <div className="p-10 text-center text-slate-400 text-sm italic">暂无近期食谱数据</div>}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
          <h3 className="font-bold text-lg mb-6">快捷操作</h3>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/admin/recipes" className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all group">
              <div className="w-10 h-10 bg-[#ec5b13] rounded-xl flex items-center justify-center text-white"><Plus size={20} /></div>
              <div className="flex-1">
                <p className="text-sm font-bold">发布新食谱</p>
                <p className="text-[10px] text-white/50">支持内容预览与自动保存</p>
              </div>
            </Link>
            <Link to="/admin/categories" className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all group">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white"><Tag size={20} /></div>
              <div className="flex-1">
                <p className="text-sm font-bold">分类与标签管理</p>
                <p className="text-[10px] text-white/50">调整网站核心分类结构</p>
              </div>
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all group">
              <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center text-white"><Settings size={20} /></div>
              <div className="flex-1">
                <p className="text-sm font-bold">系统参数配置</p>
                <p className="text-[10px] text-white/50">安全、通知及全局选项</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
