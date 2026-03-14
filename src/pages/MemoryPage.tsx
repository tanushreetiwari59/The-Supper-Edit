import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Heart, Quote, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Gathering } from '../types';

export default function MemoryPage() {
  const [gathering, setGathering] = useState<Gathering | null>(null);
  const [highlight, setHighlight] = useState('');
  const [vibeWord, setVibeWord] = useState('');
  const [photo, setPhoto] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('currentGatheringId');
    const all = JSON.parse(localStorage.getItem('gatherings') || '[]');
    const found = all.find((g: Gathering) => g.id === id);
    if (found) {
      setGathering(found);
      if (found.memory) {
        setHighlight(found.memory.highlight || '');
        setVibeWord(found.memory.vibeWord || '');
        setPhoto(found.memory.photo || '');
      }
    }
  }, []);

  const saveMemory = () => {
    if (!gathering) return;
    const all = JSON.parse(localStorage.getItem('gatherings') || '[]');
    const updated = all.map((g: Gathering) => 
      g.id === gathering.id ? { ...g, memory: { highlight, vibeWord, photo } } : g
    );
    localStorage.setItem('gatherings', JSON.stringify(updated));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const generatePhoto = () => {
    setPhoto(`https://picsum.photos/seed/${Date.now()}/800/800`);
  };

  if (!gathering) return (
    <div className="pt-32 text-center">
      <p className="text-2xl font-serif italic text-brand-brown/40 mb-8">Select a gathering first.</p>
      <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-8 pt-24 pb-32"
    >
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] font-bold text-brand-brown/40 hover:text-brand-pink transition-colors mb-12 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <section className="lg:col-span-5 space-y-12">
          <header>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-px bg-brand-pink" />
              <span className="text-xs uppercase tracking-[0.5em] font-bold text-brand-pink">Step 03</span>
            </motion.div>
            <h2 className="text-6xl tracking-tighter">Memory Capsule</h2>
            <p className="text-lg text-brand-brown/40 mt-4 font-serif italic">Archive the magic before it fades into the night.</p>
          </header>

          <div className="editorial-card glass-panel space-y-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                <Quote size={14} className="text-brand-pink" /> One Highlight
              </label>
              <textarea
                className="w-full bg-brand-brown/5 border border-brand-brown/5 rounded-2xl p-6 text-xl font-serif italic leading-relaxed text-brand-brown/70 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 min-h-[150px] transition-all placeholder:text-brand-brown/20"
                placeholder="What was the most magical moment?"
                value={highlight}
                onChange={e => setHighlight(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                <Sparkles size={14} className="text-brand-pink" /> Vibe Word
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-brand-brown/10 py-3 text-2xl font-serif italic focus:outline-none focus:border-brand-pink transition-colors placeholder:text-brand-brown/20"
                placeholder="e.g. Luminous, Raw, Ethereal"
                value={vibeWord}
                onChange={e => setVibeWord(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                <Camera size={14} className="text-brand-pink" /> Snapshot
              </label>
              <button 
                onClick={generatePhoto}
                className="w-full py-4 rounded-2xl border border-dashed border-brand-brown/20 flex items-center justify-center gap-3 text-brand-brown/40 hover:border-brand-pink hover:text-brand-pink transition-all group"
              >
                <Camera size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-xs uppercase tracking-widest font-bold">{photo ? 'Change Photo' : 'Capture a Moment'}</span>
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button onClick={saveMemory} className="btn-primary w-full py-6 text-lg shadow-xl shadow-brand-pink/20 relative overflow-hidden group">
              <AnimatePresence mode="wait">
                {isSaved ? (
                  <motion.div
                    key="saved"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Check size={20} /> Memory Sealed
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Heart size={20} /> Seal the Capsule
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </section>

        <section className="lg:col-span-7 flex items-center justify-center">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 2 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            className="w-full max-w-md editorial-card p-6 bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative group transition-all duration-700"
          >
            <div className="aspect-square bg-brand-brown/5 overflow-hidden rounded-xl mb-8 relative">
              <AnimatePresence mode="wait">
                {photo ? (
                  <motion.img 
                    key={photo}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    src={photo} 
                    alt="Memory" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-brand-brown/10 p-12 text-center">
                    <Camera size={48} className="mb-4 opacity-20" />
                    <p className="font-serif italic text-xl">Waiting for a moment to be captured...</p>
                  </div>
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-brand-pink/5 mix-blend-overlay pointer-events-none" />
            </div>

            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 mb-6">
                <Quote size={16} className="text-brand-pink" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-brown/30">The Highlight</span>
              </div>
              
              <p className="font-serif italic text-2xl mb-12 leading-relaxed text-brand-brown/80">
                "{highlight || 'The evening was a blur of laughter and light...'}"
              </p>

              <div className="flex justify-between items-end border-t border-brand-brown/5 pt-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/30 block mb-1">The Vibe</span>
                  <p className="text-3xl font-serif italic text-brand-pink">{vibeWord || 'Intentional'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/30 block mb-1">Date</span>
                  <p className="text-sm font-bold opacity-40">{new Date(gathering.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
            
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center text-white shadow-2xl -rotate-12 z-20"
            >
              <Heart size={24} fill="currentColor" />
            </motion.div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
}
