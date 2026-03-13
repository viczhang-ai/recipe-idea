import { ArrowLeft, Camera, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('图片大小不能超过 5MB'); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { setError('用户名不能为空'); return; }
    setSaving(true);
    setError('');

    let newAvatarUrl = profile?.avatar_url;

    // Upload avatar if changed
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        setError('头像上传失败：' + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      newAvatarUrl = urlData.publicUrl;
    }

    // Update profile in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username: username.trim(),
        bio: bio.trim(),
        avatar_url: newAvatarUrl,
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/main/profile'), 1200);
    }
    setSaving(false);
  };

  const displayAvatar = avatarPreview;
  const initials = username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#f8f6f6] max-w-md mx-auto">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100 p-4 flex items-center justify-between">
        <button onClick={() => navigate('/main/profile')} className="p-2 -ml-2 rounded-full active:bg-slate-100">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">编辑个人资料</h1>
        <button
          form="edit-profile-form"
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 text-[#ec5b13] font-bold text-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          保存
        </button>
      </header>

      <main className="p-6 pb-24">
        {/* Avatar Editor */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#ec5b13]/20 bg-orange-100 flex items-center justify-center">
              {displayAvatar ? (
                <img src={displayAvatar} alt="头像" className="w-full h-full object-cover" />
              ) : (
                <span className="text-orange-500 text-4xl font-bold">{initials}</span>
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#ec5b13] rounded-full flex items-center justify-center border-2 border-white shadow">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-[#ec5b13] text-sm font-bold hover:underline"
          >
            更换头像
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <p className="text-slate-400 text-xs mt-1">支持 JPG / PNG，最大 5MB</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            ✅ 保存成功！正在跳转...
          </div>
        )}

        <form id="edit-profile-form" onSubmit={handleSave} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">用户名</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              maxLength={30}
              placeholder="设置你的用户名"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] transition-all"
            />
            <p className="text-xs text-slate-400 mt-1.5 text-right">{username.length}/30</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">个性签名</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={100}
              rows={3}
              placeholder="介绍一下你自己，分享你的美食故事..."
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] transition-all resize-none"
            />
            <p className="text-xs text-slate-400 mt-1.5 text-right">{bio.length}/100</p>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">邮箱地址</label>
            <input
              type="email"
              value={user.email || ''}
              readOnly
              className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1.5">邮箱地址不可修改</p>
          </div>
        </form>
      </main>
    </div>
  );
}
