import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'welcome' | 'update_available' | 'updated'>('welcome');

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('welcome_seen');
    const justUpdated = localStorage.getItem('pwa_just_updated');

    // Handle post-update message
    if (justUpdated) {
      setMode('updated');
      setIsOpen(true);
      localStorage.removeItem('pwa_just_updated');
      return;
    }

    // Handle first-time welcome
    if (!hasSeenWelcome) {
      setMode('welcome');
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Listen for PWA update detection
    const handleUpdate = () => {
      setMode('update_available');
      setIsOpen(true);
    };

    window.addEventListener('pwa-update-available', handleUpdate);
    return () => window.removeEventListener('pwa-update-available', handleUpdate);
  }, []);

  const handleAction = () => {
    if (mode === 'update_available') {
      // Set flag so we know we just updated after reload
      localStorage.setItem('pwa_just_updated', 'true');
      window.location.reload();
    } else {
      if (mode === 'welcome') {
        localStorage.setItem('welcome_seen', 'true');
      }
      setIsOpen(false);
    }
  };

  const getContent = () => {
    switch (mode) {
      case 'updated':
        return {
          title: 'Привет!',
          text: 'Приложение обновилось. Стало ещё удобнее.',
          button: 'Отлично'
        };
      case 'update_available':
        return {
          title: 'Обновление!',
          text: 'Доступна новая версия приложения. Нажмите обновить, чтобы применить изменения.',
          button: 'Обновить сейчас'
        };
      default:
        return {
          title: 'Привет!',
          text: 'Надеемся, что приложение поможет сохранить интересные моменты жизни деток!',
          button: 'Начать'
        };
    }
  };

  const content = getContent();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[320px] p-0 overflow-hidden bg-white border-0 rounded-[2rem] shadow-2xl">
        <div className="relative p-8 flex flex-col items-center text-center bg-gradient-to-b from-pink-50 to-white">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="mb-6 relative"
          >
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-pink-500 fill-pink-500" />
            </div>
            {mode === 'update_available' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center border-2 border-white"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
              {content.title}
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed mb-6 px-2">
              {content.text}
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAction}
            className={`w-full py-4 ${mode === 'update_available' ? 'bg-orange-500' : 'bg-orange-400'} hover:opacity-90 text-white rounded-2xl font-bold transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2`}
          >
            {content.button}
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
