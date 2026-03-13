import React from 'react';
import { 
  Settings, 
  Globe, 
  Bell, 
  Lock, 
  Database,
  Terminal,
  Save,
  Loader2
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminSettings() {
  const [saving, setSaving] = React.useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('设置已保存 (模拟)');
    }, 1000);
  };

  const settingsGroups = [
    {
      title: '常规设置',
      icon: Globe,
      items: [
        { label: '网站名称', type: 'text', value: '美食灵感 (Recipe Idea)' },
        { label: '系统语言', type: 'select', options: ['简体中文', 'English'] },
      ]
    },
    {
      title: '通知与推送',
      icon: Bell,
      items: [
        { label: '启用系统通知', type: 'toggle', value: true },
        { label: '评价自动审核', type: 'toggle', value: false },
      ]
    },
    {
      title: '数据库与安全',
      icon: Lock,
      items: [
        { label: '维护模式', type: 'toggle', value: false },
        { label: '允许新用户注册', type: 'toggle', value: true },
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <header className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
                <group.icon size={20} />
              </div>
              <h3 className="font-bold text-slate-800">{group.title}</h3>
            </header>
            <div className="p-6 space-y-6">
              {group.items.map((item) => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-700 text-sm">{item.label}</p>
                    <p className="text-xs text-slate-400">配置系统的核心参数</p>
                  </div>
                  <div className="flex-shrink-0">
                    {item.type === 'text' ? (
                      <input type="text" defaultValue={item.value as string} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#ec5b13] w-full sm:w-64 text-sm" />
                    ) : item.type === 'select' ? (
                      <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#ec5b13] w-full sm:w-64 text-sm">
                        {((item as any).options as string[]).map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.value as boolean} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ec5b13]"></div>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-4 pt-4">
          <button className="px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            恢复默认
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-[#ec5b13] text-white rounded-2xl font-bold hover:bg-[#d94f0e] transition-all shadow-lg shadow-[#ec5b13]/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
            保存全局设置
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
