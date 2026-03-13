import { ArrowLeft, Camera, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Publish() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f6f6] max-w-md mx-auto">
      <header className="sticky top-0 z-10 flex items-center bg-white p-4 border-b border-[#ec5b13]/10 justify-between">
        <div onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-[#ec5b13]/10 transition-colors cursor-pointer">
          <ArrowLeft className="text-slate-900" />
        </div>
        <h1 className="text-lg font-bold flex-1 text-center">发布菜谱</h1>
        <button className="text-[#ec5b13] text-base font-bold bg-[#ec5b13]/10 px-4 py-1.5 rounded-full hover:bg-[#ec5b13] hover:text-white transition-colors">
          发布
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="bg-white p-4 mb-2">
          <div className="relative w-full aspect-video bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 cursor-pointer hover:border-[#ec5b13]/50 transition-colors mb-4">
            <Camera className="text-slate-400 w-10 h-10 mb-2" />
            <span className="text-slate-500 text-sm font-medium">添加成品图/视频</span>
          </div>

          <input type="text" placeholder="添加菜谱名称..." className="w-full text-xl font-bold text-slate-900 placeholder:text-slate-400 border-none focus:ring-0 p-0 mb-4" />
          
          <textarea placeholder="分享这道菜背后的故事，或者一些烹饪小贴士..." className="w-full text-base text-slate-700 placeholder:text-slate-400 border-none focus:ring-0 p-0 min-h-[100px] resize-none"></textarea>
        </div>

        <div className="bg-white p-4 mb-2">
          <h2 className="text-lg font-bold text-slate-900 mb-4">食材清单</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <input type="text" placeholder="食材名 (如: 鸡蛋)" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13]" />
              <input type="text" placeholder="用量 (如: 2个)" className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13]" />
              <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="食材名 (如: 西红柿)" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13]" />
              <input type="text" placeholder="用量 (如: 1个)" className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13]" />
              <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#ec5b13]/30 rounded-xl text-[#ec5b13] font-medium hover:bg-[#ec5b13]/5 transition-colors">
            <Plus className="w-5 h-5" />
            添加一行食材
          </button>
        </div>

        <div className="bg-white p-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">制作步骤</h2>
          
          <div className="space-y-6 mb-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#ec5b13] text-white flex items-center justify-center text-xs font-bold">1</div>
                <div className="w-px h-full bg-slate-200 my-1"></div>
              </div>
              <div className="flex-1">
                <div className="w-full aspect-video bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 mb-2 cursor-pointer hover:bg-slate-200 transition-colors">
                  <Camera className="text-slate-400 w-6 h-6" />
                </div>
                <textarea placeholder="添加步骤说明..." className="w-full text-sm text-slate-700 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 min-h-[80px] focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] resize-none"></textarea>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#ec5b13] text-white flex items-center justify-center text-xs font-bold">2</div>
              </div>
              <div className="flex-1">
                <div className="w-full aspect-video bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 mb-2 cursor-pointer hover:bg-slate-200 transition-colors">
                  <Camera className="text-slate-400 w-6 h-6" />
                </div>
                <textarea placeholder="添加步骤说明..." className="w-full text-sm text-slate-700 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 min-h-[80px] focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] resize-none"></textarea>
              </div>
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#ec5b13]/30 rounded-xl text-[#ec5b13] font-medium hover:bg-[#ec5b13]/5 transition-colors">
            <Plus className="w-5 h-5" />
            添加下一步
          </button>
        </div>
      </main>
    </div>
  );
}
