"use client";

import { useState, useRef, DragEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronDown, Smile, ChevronLeft, Image as ImageIcon, X, Loader2, Sparkles, Map, AlertCircle } from 'lucide-react';
import { useAddPostMutation } from './../../../api/postApi';
import { toast } from 'react-hot-toast'; // или любой другой тост

const CreatePage = () => {
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [location, setLocation] = useState('');
  const [altText, setAltText] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAltModal, setShowAltModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [addPost, { isLoading: isPublishing }] = useAddPostMutation();

  const handleImage = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Файл слишком большой. Максимум 10 МБ');
        return;
      }
      
      setIsUploading(true);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Пожалуйста, выберите изображение');
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImage(file);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const handlePublish = async () => {
    if (!imageFile) {
      toast.error('Выберите изображение');
      return;
    }

    const formData = new FormData();
    formData.append('Title', title || caption.slice(0, 100) || 'Новая публикация');
    formData.append('Content', caption);
    formData.append('Images', imageFile);

    try {
      const result = await addPost(formData).unwrap();
      toast.success('Публикация успешно создана!');
      router.refresh();
    } catch (error: any) {
      console.error('Error publishing:', error);
      if (error.status === 401) {
        toast.error('Сессия истекла. Пожалуйста, войдите снова');
        router.push('/login');
      } else {
        toast.error(error.data?.message || 'Ошибка при создании публикации');
      }
    }
  };

  const handleBack = () => {
    if (image || caption) {
      const confirm = window.confirm('Вы уверены? Все несохраненные изменения будут потеряны');
      if (confirm) router.back();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#1c1e21] font-sans selection:bg-blue-100">
      
      <header className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-all font-medium"
          >
            <ChevronLeft size={20} />
            <span>Лента</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">Studio</span>
          </div>
          <button 
            disabled={!image || isPublishing}
            onClick={handlePublish}
            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${
              image && !isPublishing
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md active:scale-95' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isPublishing ? (
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span>Публикация...</span>
              </div>
            ) : (
              'Опубликовать'
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Image Upload Area */}
          <div className="lg:col-span-7">
            <div 
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`relative aspect-square w-full rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-white shadow-xl ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              {!image && !isUploading ? (
                <div className="text-center p-10">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <ImageIcon size={40} className="text-gray-300" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Перетащите фото сюда</h2>
                  <p className="text-gray-500 mb-6 text-sm">PNG, JPG до 10 МБ</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                  >
                    Выбрать файл
                  </button>
                  <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImage(e.target.files[0]);
                      }
                    }} 
                  />
                </div>
              ) : isUploading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-blue-500" size={48} />
                  <p className="text-gray-500">Загрузка изображения...</p>
                </div>
              ) : (
                <div className="relative group w-full h-full">
                  <img src={image!} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-6">
                    <button 
                      onClick={() => {
                        setImage(null);
                        setImageFile(null);
                      }}
                      className="bg-white/90 backdrop-blur-md p-3 rounded-full text-red-500 hover:bg-white shadow-xl transition-transform active:scale-90"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Caption and Settings Area */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full ring-2 ring-blue-50 p-0.5">
                  <img 
                    src="https://ui-avatars.com/api/?name=Dev&background=007AFF&color=fff" 
                    className="rounded-full w-full h-full object-cover" 
                    alt="User" 
                  />
                </div>
                <div>
                  <p className="font-bold text-sm">frontend_developer</p>
                  <p className="text-xs text-gray-400">Личный профиль</p>
                </div>
              </div>

              <div className="relative">
                <textarea
                  placeholder="О чем вы думаете?.."
                  className="w-full min-h-[180px] text-lg outline-none placeholder:text-gray-300 resize-none border-none focus:ring-0"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={2200}
                />
                <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
                  <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <Smile className="text-gray-400 hover:text-yellow-500 transition-colors" size={22} />
                  </button>
                  <span className={`text-xs font-mono ${caption.length > 2000 ? 'text-red-500' : 'text-gray-400'}`}>
                    {caption.length.toLocaleString()} / 2,200
                  </span>
                </div>
              </div>
            </div>

            {/* Settings Buttons */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <div className="p-2 space-y-1">
                <button 
                  onClick={() => setShowLocationModal(true)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                      <MapPin size={20} />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-sm block">Местоположение</span>
                      {location && <span className="text-xs text-gray-500">{location}</span>}
                    </div>
                  </div>
                  <ChevronDown size={18} className="text-gray-300 group-hover:translate-y-0.5 transition-transform" />
                </button>

                <button 
                  onClick={() => setShowAltModal(true)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                      <Map size={20} />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-sm block">Альтернативный текст</span>
                      {altText && <span className="text-xs text-gray-500">Добавлен</span>}
                    </div>
                  </div>
                  <ChevronDown size={18} className="text-gray-300" />
                </button>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-blue-500 mt-0.5" />
                <div className="text-xs text-blue-700">
                  <p className="font-semibold mb-1">Совет:</p>
                  <p>Используйте хэштеги для большей видимости и добавьте локацию, чтобы привлечь больше людей</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowLocationModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Добавить местоположение</h3>
            <input
              type="text"
              placeholder="Поиск места..."
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowLocationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Отмена
              </button>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alt Text Modal */}
      {showAltModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAltModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Альтернативный текст</h3>
            <textarea
              placeholder="Опишите изображение для людей с нарушениями зрения..."
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {altText.length}/500
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAltModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Отмена
              </button>
              <button 
                onClick={() => setShowAltModal(false)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePage;