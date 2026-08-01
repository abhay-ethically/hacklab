'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';

export default function TrophyCelebration({
  show,
  flag,
}: {
  show: boolean;
  flag?: string;
}) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(t);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center bg-hack-bg/85 p-4 text-center"
        >
          <Trophy className="mb-3 h-16 w-16 text-hack-amber" />
          <p className="font-mono text-2xl font-bold text-hack-amber">FLAG CAPTURED</p>
          {flag && (
            <p className="mt-2 font-mono text-hack-green">{flag}</p>
          )}
          <pre className="mt-3 font-mono text-[10px] leading-tight text-slate-400">
            {`  ██╗  ██╗ █████╗  ██████╗
  ██║  ██║██╔══██╗██╔════╝
  ███████║███████║██║     
  ██╔══██║██╔══██║██║     
  ██║  ██║██║  ██║╚██████╗
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝`}
          </pre>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
