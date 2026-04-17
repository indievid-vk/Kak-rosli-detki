import { useEffect, useState } from 'react';
import { Download, MoreVertical, X } from 'lucide-react';

// Типизация события для Chrome
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Проверяем, не установлено ли приложение уже (режим standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setIsInstalled(true);
      return; // Если уже установлено — выходим, ничего не показываем
    }

    // 2. Ловим событие системной установки Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // 3. ПРИНУДИТЕЛЬНО показываем наше UI-окно через 1.5 секунды, 
    // чтобы пользователь точно увидел предложение
    const timer = setTimeout(() => {
      // Покажем только если не закрывали ранее в эту сессию (чтобы не бесить)
      if (!sessionStorage.getItem('installPromptDismissed')) {
        setShowPrompt(true);
      }
    }, 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Сценарий А: Chrome дал разрешение. Вызываем системное окно!
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`System Install Prompt outcome: ${outcome}`);
      setDeferredPrompt(null);
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
    } else {
      // Сценарий Б: Chrome скрыл событие (баг кэша, инкогнито и т.д.)
      // Показываем пользователю fallback-руководство
      setShowManualFallback(true);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('installPromptDismissed', 'true');
    setShowPrompt(false);
    setShowManualFallback(false);
  };

  // Если приложение УЖЕ на рабочем столе (или мы его скрыли) — рендерим пустоту
  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 pb-8 bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-stone-100 transition-transform duration-500 transform-gpu animate-in slide-in-from-bottom">
      <div className="max-w-md mx-auto relative">
        <button 
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 p-2 bg-stone-100 rounded-full text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0">
             <Download className="w-7 h-7 text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-stone-800 leading-tight">Установить приложение</h3>
            <p className="text-sm text-stone-500 mt-0.5">Добавьте на главный экран для быстрого доступа</p>
          </div>
        </div>

        {/* Fallback инструкция: показывается только если нажать Установить, а системы нет */}
        {showManualFallback ? (
          <div className="bg-orange-50 p-4 rounded-2xl mb-4 border border-orange-100 animate-in fade-in">
            <p className="text-sm text-stone-700 font-medium mb-2">Автоматическая установка заблокирована браузером.</p>
            <ol className="text-sm text-stone-600 space-y-2 list-decimal list-inside">
              <li>Нажмите на три точки <MoreVertical className="inline w-4 h-4 text-stone-500" /> в верхнем правом углу браузера.</li>
              <li>Выберите пункт <strong>«Добавить на гл. экран»</strong>.</li>
            </ol>
          </div>
        ) : null}

        <button 
          onClick={handleInstallClick}
          className="w-full bg-orange-500 text-white py-3.5 rounded-2xl font-bold shadow-md hover:bg-orange-600 active:scale-[0.98] transition-all"
        >
          {showManualFallback ? 'Понятно' : 'Установить'}
        </button>
      </div>
    </div>
  );
};