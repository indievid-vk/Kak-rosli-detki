import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup with a small delay after load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[320px] p-0 overflow-hidden bg-white border-0 rounded-[2rem] shadow-2xl">
        <div className="relative p-8 flex flex-col items-center text-center bg-gradient-to-b from-pink-50 to-white">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            className="mb-6 relative"
          >
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-pink-500 fill-pink-500" />
            </div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1] 
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center"
            >
              <Heart className="w-3 h-3 text-white fill-white" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Привет!
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed mb-6 px-2">
              Рады видеть вас снова. Пусть каждый момент с вашими детьми будет особенным ❤️
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(false)}
            className="w-full py-4 bg-orange-400 hover:bg-orange-500 text-white rounded-2xl font-bold transition-colors shadow-lg shadow-orange-100"
          >
            Начать
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
