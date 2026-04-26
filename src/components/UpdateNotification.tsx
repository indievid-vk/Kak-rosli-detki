import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UpdateNotification() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      console.log('[UpdateNotification] Update detected');
      setShow(true);
    };

    window.addEventListener('pwa-update-available', handleUpdate);
    return () => window.removeEventListener('pwa-update-available', handleUpdate);
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-[110] pointer-events-none flex justify-center"
        >
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto max-w-sm w-full border border-slate-800">
            <div className="bg-blue-500/20 p-2 rounded-xl">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin-slow" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">Доступно обновление</h4>
              <p className="text-xs text-slate-400">Нажмите, чтобы обновиться</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleReload}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-8 px-3 font-bold text-xs"
              >
                Обновить
              </Button>
              <button 
                onClick={() => setShow(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
