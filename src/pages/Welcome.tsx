import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full max-w-md mx-auto flex-col items-center justify-end overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_4bFUEYwomdm5UdTfiBXO_KQZuReiVXKPO8pQoOdPptq5lXpk4k9Ihj8WB2V1H5taTXUsAcKTxm7lYASrp-pjBDZfgR2VJqW76X7ctKm4oaeWoMckMTqmvEZt6ciQ_bj8VLdiEJ5tphbmJWAcXQND_x-9x9o8HpafJNSn3QX_w5Wvm2xLI7-tdjZDtOP0oGJnrIf_C7tfjyTYrB5so32tMukX5o-2T1hIl0Q-cXdtkOieVEUe6T9PaU3k2g0d4bivgcCU9SZEnZZe")'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-20 flex w-full flex-col items-center px-8 pb-16 text-center">
        <div className="mb-6 rounded-full bg-[#ec5b13] p-4 shadow-lg shadow-[#ec5b13]/40">
          <span className="text-4xl">👨‍🍳</span>
        </div>
        
        <h1 className="mb-4 text-4xl font-black tracking-tight text-white leading-tight">
          发现你的<br />
          <span className="text-[#ec5b13]">专属美味</span>
        </h1>
        
        <p className="mb-10 text-base font-medium text-slate-300 leading-relaxed">
          探索超过 10,000+ 精选食谱，与全球美食爱好者一起分享烹饪的乐趣。
        </p>

        <button
          onClick={() => navigate('/main')}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ec5b13] py-4 text-lg font-bold text-white shadow-lg shadow-[#ec5b13]/30 transition-all hover:bg-[#d94f0e] active:scale-95"
        >
          开始探索
          <ArrowRight className="h-5 w-5" />
        </button>

        <button
          onClick={() => navigate('/login')}
          className="w-full rounded-2xl border-2 border-white/20 bg-white/10 py-4 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
        >
          登录 / 注册
        </button>
      </div>
    </div>
  );
}
