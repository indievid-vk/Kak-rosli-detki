import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from '@/components/ui/button';
import { Download, Upload, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { exportData, importData } from '../lib/db';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';

export function BackupFooter() {
  const { refreshData, isAboutOpen, children, isModalOpen } = useStore();
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (isAboutOpen || isModalOpen || children.length === 0) return null;

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      await exportData();
      setAlert({ message: "Резервная копия успешно создана и скачивается!", type: 'success' });
    } catch(e) {
      setAlert({ message: "Ошибка при создании резервной копии. Попробуйте еще раз.", type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      await importData(file);
      await refreshData();
      setAlert({ message: "Ура! Все ваши моменты успешно восстановлены!", type: 'success' });
    } catch(err) {
      setAlert({ message: "Упс, ошибка при восстановлении данных. Проверьте файл.", type: 'error' });
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-0 right-0 z-[100] px-4 pointer-events-none print:hidden">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="max-w-fit mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-1.5 flex items-center gap-1 sm:gap-2 pointer-events-auto ring-1 ring-black/5">
            <div className="hidden sm:flex items-center gap-2 pl-4 pr-2 text-stone-500 py-2">
              <div className="relative">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white" 
                />
              </div>
              <span className="text-[12px] font-extrabold tracking-tight uppercase text-stone-400">Хранилище</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Button 
                onClick={handleExport} 
                disabled={isProcessing}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-bold h-11 px-6 flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Сохранить</span>
              </Button>
              
              <div className="relative group">
                <Button 
                  disabled={isProcessing}
                  variant="outline"
                  size="sm"
                  className="bg-stone-50/50 border-stone-200 text-stone-600 hover:bg-white hover:border-stone-300 rounded-[2rem] font-bold h-11 px-6 flex items-center gap-2 transition-all active:scale-95 text-sm border-dashed"
                >
                  <Upload className="w-4 h-4" />
                  <span>Загрузить</span>
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImport}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={!!alert} onOpenChange={() => setAlert(null)}>
        <DialogContent className="sm:max-w-[400px] border-0 bg-white/95 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
          <div className={`h-2 ${alert?.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <div className="p-8 pt-10 text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${alert?.type === 'success' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              {alert?.type === 'success' ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <AlertCircle className="w-8 h-8 text-rose-500" />
              )}
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4 text-stone-800">
                {alert?.type === 'success' ? 'Все готово!' : 'Ой, ошибка'}
              </DialogTitle>
            </DialogHeader>
            <p className="text-stone-500 leading-relaxed font-medium px-4 mb-8">
              {alert?.message}
            </p>
            <Button 
              onClick={() => setAlert(null)} 
              className={`w-full py-6 rounded-2xl font-bold transition-all shadow-lg text-lg ${
                alert?.type === 'success' 
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' 
                : 'bg-rose-500 hover:bg-rose-600 shadow-rose-100'
              } text-white`}
            >
              Принято
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
