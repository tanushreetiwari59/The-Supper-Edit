import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

export function ThemedSelect({
  options,
  value,
  onChange,
  placeholder,
  variant = 'underline',
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  variant?: 'underline' | 'card';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const triggerClass =
    variant === 'card'
      ? 'w-full flex items-center justify-between bg-brand-beige border border-brand-pink/20 rounded-2xl px-5 py-3 text-base font-serif italic text-brand-brown shadow-sm hover:border-brand-pink/40 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-pink/30'
      : 'w-full flex items-center justify-between bg-transparent border-b border-brand-brown/10 py-3 text-lg font-serif italic text-brand-brown hover:border-brand-pink/40 transition-colors cursor-pointer focus:outline-none';

  const displayValue = value || placeholder;
  const isPlaceholder = !value && placeholder;

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} className={triggerClass}>
        <span className={isPlaceholder ? 'opacity-40' : ''}>{displayValue}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} className="text-brand-pink flex-shrink-0" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 z-[200] bg-[#FDFBF7] border border-brand-pink/15 rounded-2xl shadow-[0_12px_40px_rgba(61,43,31,0.12)] overflow-y-auto max-h-56 overscroll-contain"
          >
            {placeholder && (
              <li>
                <button
                  type="button"
                  onClick={() => { onChange(''); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-5 py-3 text-left font-serif italic text-brand-brown/40 hover:bg-brand-pink/5 transition-colors ${!value ? 'bg-brand-pink/5' : ''}`}
                >
                  <span>{placeholder}</span>
                  {!value && <Check size={13} className="text-brand-pink flex-shrink-0" />}
                </button>
              </li>
            )}
            {options.map(opt => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-5 py-3 text-left font-serif italic text-brand-brown/80 hover:bg-brand-pink/8 hover:text-brand-brown transition-colors ${opt === value ? 'text-brand-brown font-semibold bg-brand-pink/5' : ''}`}
                >
                  <span>{opt}</span>
                  {opt === value && <Check size={13} className="text-brand-pink flex-shrink-0" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
