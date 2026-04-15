import React, { useState, useEffect } from 'react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsShown(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
        setIsShown(false);
      });
    }
  };

  if (!isShown) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl border border-slate-100">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Установка приложения</h2>
        <p className="mb-6 text-slate-600">Для установки приложения нажмите кнопку</p>
        <button 
          onClick={handleInstall}
          className="w-full bg-orange-400 text-white font-bold py-3 rounded-full hover:bg-orange-500 transition-colors"
        >
          Установить
        </button>
      </div>
    </div>
  );
}
