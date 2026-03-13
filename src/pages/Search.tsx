import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, Star, Clock } from 'lucide-react';

const ALL_RECIPES = [
  {
    id: 1,
    title: '夏日牛油果藜麦碗',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Xy57bfz60Xy5Dl1BmQU6WecyADt3D-eC6SYCJhpy-Dq4p9HWRicink0SyK-6GbtkhUcamxgc-aRiFYY873WQvmmQxWVCMm7QCD-dHoUgKnwsbhtnwCtEgzKU8RnVwZ0yJzFNiUS_xkWPXOK2Q_24TY9Z7PSss3kXZ-h0uj2mIgq8EaG8VdJ_EJDSkZ_fWj51EqyyNYOl_ASTO_mGNDKGsPRdhgRglOe43tlBQNsXavd4C0WhOOuhef5SzQ14fUf70mW9PuC0Y5lj',
    time: '25 分钟',
    rating: '4.9',
    reviews: '1.2k',
    description: '清新的奶油牛油果、富含蛋白质的藜麦和有机时令蔬菜的完美搭配。',
    author: 'Chef Isabella',
    category: '午餐',
  },
  {
    id: 2,
    title: '蒜香黄油肋眼牛排',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_4bFUEYwomdm5UdTfiBXO_KQZuReiVXKPO8pQoOdPptq5lXpk4k9Ihj8WB2V1H5taTXUsAcKTxm7lYASrp-pjBDZfgR2VJqW76X7ctKm4oaeWoMckMTqmvEZt6ciQ_bj8VLdiEJ5tphbmJWAcXQND_x-9x9o8HpafJNSn3QX_w5Wvm2xLI7-tdjZDtOP0oGJnrIf_C7tfjyTYrB5so32tMukX5o-2T1hIl0Q-cXdtkOieVEUe6T9PaU3k2g0d4bivgcCU9SZEnZZe',
    time: '45 分钟',
    rating: '4.8',
    reviews: '850',
    description: '完美煎制的肋眼牛排，佐以芳香的大蒜、黄油和新鲜迷迭香。',
    author: 'Chef Marco',
    category: '晚餐',
  },
  {
    id: 3,
    title: '麻婆豆腐',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy0TzKZIbtAmwIlEWaB7NlO4a65JWB1mErFZT9YVOdY268qMSvPF0gdWgALu19aWXDRakJmFbZPGEHal4bPNGxlTRj7165Ud9v0IkRaCIbE5Z7eJPzUCOdbLu_7UUDb9wXGIGinMnTizznDs8Hdut8aKR3XCz4DMOzaDazPetvEDQEMixdYgHi1QWgM1cMB5Su-R0b0ax5xocC3FO3lp23hi84mKfWRFbqnmWjP01B43uhsmJJy-60ngWVCtTzyNnbQLUwnXFTb5gC',
    time: '30分钟',
    rating: '4.8',
    reviews: '120',
    description: '经典川菜，麻辣鲜香，下饭神器。',
    author: '川菜大师',
    category: '晚餐',
  },
  {
    id: 4,
    title: '宫保鸡丁',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlc_V1N5XXfVrliVOQFd4gB5Ibt_Gr109nMs4w5GV-67hlXF4zahIrvwV8jGrhZs3jpfOI40DgVjIBG9BjTx-wQok4X9gFFozkENXvl9sld3hp3oY0vpVSS_U-YsdRI9a38JE8KWXmBBllk4WqpwbvkqB4sNzN45iDjWoT0K0mkMUIR-p6aA_VO6-WdNX6VExUc80iNSFZLXUBXbeRnpB1Xsdwp-Uv0UYoC_-7Rcmu8Am5jnGrUVX4YNqsfO4N5dSoiy1UV90wl0G4',
    time: '20分钟',
    rating: '4.7',
    reviews: '95',
    description: '酸甜微辣，鸡肉滑嫩，花生香脆。',
    author: '家常菜小能手',
    category: '午餐',
  },
  {
    id: 5,
    title: '红烧肉',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXZxBDNTvKPJPhEmZk_mAw4fV9hkixqEMskDW4FCAlRJRNB01O2BEt6l7u3p-BdKRj9bUudlKX1SZA9g8gloOaENPcYGTPBxeEA-SrhaMFK4RyG9p7t6lquzZFjS6eJeiLiFYmCC7gas0iuO8Fg2WyV2xQePqGwxzOO8mkwI2IxYRT7THRNiO5elC9ypm5v20cb5i06cNb_UuxWuEJMSOVDBqU0n_pgpmNh0AXm8ZkKyCusPUFyRaJ9tMzQb4UiF2vonOAiBsyVWA1',
    time: '60分钟',
    rating: '4.9',
    reviews: '210',
    description: '肥而不腻，入口即化，色泽红亮。',
    author: '美食探险家',
    category: '晚餐',
  },
  {
    id: 6,
    title: '清蒸鱼',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgg8MkIcnIiBkMFcpb7GPxg_JK60hzWjPaMuG-gws8dyAC9b41QfsjkXW7yR0F6o4IuXOmmDlu_xsUIWa9poeFoij1ItyrOCIrtDJI7S9fgrI9IASIZBMr2huarvuPJ3rqBdhuo3tDQDqsj-pS__hgKE7xLf4Uy31rAEoPWBWwl0a5beuyOSvkRgVrol9FBNB6EZRWyMHQKov1XGCwxEyML6RYyf_Nn7vZ7BzoDFtnGT-RXzHo3w6sHsKyWA-Af5XDtJyADqzfFH7C',
    time: '25分钟',
    rating: '4.6',
    reviews: '80',
    description: '原汁原味，鱼肉鲜嫩，做法简单。',
    author: '海鲜达人',
    category: '晚餐',
  }
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    } else {
      setSearchParams({});
    }
  };

  const results = ALL_RECIPES.filter(recipe => 
    recipe.title.toLowerCase().includes(query.toLowerCase()) ||
    recipe.description.toLowerCase().includes(query.toLowerCase()) ||
    recipe.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto bg-stone-50 min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-stone-100 rounded-full text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <form onSubmit={handleSearch} className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-stone-400" />
          </div>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="block w-full pl-9 pr-3 py-2.5 border-none bg-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 placeholder-stone-400 transition-all duration-200" 
            placeholder="搜索食谱、食材..." 
            autoFocus
          />
        </form>
      </header>

      <main className="p-6">
        {query ? (
          <div>
            <h2 className="text-sm font-bold text-stone-500 mb-4">
              找到 {results.length} 个关于 "{query}" 的结果
            </h2>
            
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map(recipe => (
                  <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="flex bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 group">
                    <div className="w-1/3 h-28 relative flex-shrink-0">
                      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm group-hover:text-orange-500 transition-colors line-clamp-1">{recipe.title}</h3>
                        <p className="text-xs text-stone-500 line-clamp-1 mt-1">{recipe.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-stone-400 text-xs gap-2">
                          <span className="flex items-center"><Star className="w-3 h-3 text-yellow-400 mr-0.5 fill-yellow-400" /> {recipe.rating}</span>
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-0.5" /> {recipe.time}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-stone-300" />
                </div>
                <h3 className="text-stone-900 font-bold mb-1">未找到相关食谱</h3>
                <p className="text-stone-500 text-sm">尝试使用其他关键词搜索</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-bold text-stone-900 mb-4">热门搜索</h2>
            <div className="flex flex-wrap gap-2">
              {['早餐', '牛肉', '减脂餐', '快手菜', '甜点', '鸡胸肉'].map(term => (
                <button 
                  key={term}
                  onClick={() => {
                    setInputValue(term);
                    setSearchParams({ q: term });
                  }}
                  className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-stone-700 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
