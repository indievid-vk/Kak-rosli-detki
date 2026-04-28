import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { DIALOG_MODAL_STYLES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface StatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'success' | 'error';
}

export function StatusDialog({ isOpen, onClose, title, message, type = 'success' }: StatusDialogProps) {
  const isSuccess = type === 'success';
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className={`${DIALOG_MODAL_STYLES} p-0 overflow-hidden`}>
        <div className={`h-2.5 ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'} w-full relative z-10`} />
        
        <div className="p-8 pt-12 flex flex-col items-center text-center bg-white">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${
              isSuccess ? 'bg-emerald-50' : 'bg-rose-50'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-500" strokeWidth={2} />
            ) : (
              <AlertCircle className="w-12 h-12 text-rose-500" strokeWidth={2} />
            )}
          </motion.div>
          
          <DialogHeader className="mb-4">
            <DialogTitle className="text-3xl font-black text-slate-800 tracking-tight">
              {title || (isSuccess ? 'Успешно' : 'Ошибка')}
            </DialogTitle>
          </DialogHeader>
          
          <p className="text-slate-500 text-lg font-medium leading-tight mb-10 max-w-[240px]">
            {message}
          </p>
          
          <motion.div 
            className="w-full"
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={onClose}
              className={`w-full h-16 rounded-[2rem] text-xl font-bold text-white shadow-xl shadow-emerald-200 transition-all ${
                isSuccess 
                  ? 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700' 
                  : 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-rose-200'
              }`}
            >
              Принято
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
