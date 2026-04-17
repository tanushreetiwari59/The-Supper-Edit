import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Quote, Calendar, ArrowLeft, Camera } from 'lucide-react';
import { User } from '../types';

interface MemoryEntry {
  id: string;
  userId: string;
  title: string;
  editNo: number;
  date: string;
  highlight: string;
  vibeWord: string;
  photo?: string;
}

export default function MemoryFeedPage() {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      navigate('/auth');
      return;
    }
    const u = JSON.parse(storedUser);
    setUser(u);

    const all: MemoryEntry[] = JSON.parse(localStorage.getItem('supperEditMemories') || '[]');
    const filtered = all
      .filter(m => m.userId === u.id && m.highlight)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setMemories(filtered);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 sm:px-8 pt-20 sm:pt-24 pb-32"
    >
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] font-bold text-brand-brown/40 hover:text-brand-pink transition-colors mb-12 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <header className="mb-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-px bg-brand-pink" />
          <span className="text-xs uppercase tracking-[0.5em] font-bold text-brand-pink">Journal</span>
        </motion.div>
        <h2 className="text-4xl md:text-7xl tracking-tighter">Memory Feed</h2>
        <p className="text-xl text-brand-brown/40 mt-4 font-serif italic">A living archive of your intentional gatherings.</p>
      </header>

      {memories.length === 0 ? (
        <div className="text-center py-40 editorial-card glass-panel">
          <div className="w-20 h-20 rounded-full bg-brand-pink/5 flex items-center justify-center mx-auto mb-8">
            <Camera size={32} className="text-brand-pink/40" />
          </div>
          <p className="font-serif italic text-4xl text-brand-brown/30 mb-4">No memories archived yet.</p>
          <p className="text-lg font-serif text-brand-brown/40 mb-12 max-w-md mx-auto">Your first supper memory will appear here once you've captured it in the Journal.</p>
          <Link to="/dashboard" className="btn-secondary">Go to Dashboard</Link>
        </div>
      ) : (
        <div className="space-y-16 md:space-y-32 relative md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-px md:before:bg-brand-brown/5 md:before:-translate-x-1/2">
          {memories.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col md:flex-row items-center gap-16 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="flex-1 w-full">
                <div className={`editorial-card glass-panel relative group ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="mb-8">
                    <div className={`flex items-center gap-3 mb-4 ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <Calendar size={14} className="text-brand-pink" />
                      <span className="text-[10px] uppercase tracking-[0.4em] text-brand-pink font-bold">
                        {new Date(m.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-4xl tracking-tight mb-3 group-hover:text-brand-pink transition-colors duration-500">{m.title}</h3>
                    <div className={`flex items-center gap-2 opacity-30 ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Edit No. {m.editNo}</span>
                    </div>
                  </div>

                  <div className="mb-10 relative">
                    <Quote size={32} className={`text-brand-pink/10 absolute -top-4 ${i % 2 === 0 ? '-right-4' : '-left-4'}`} />
                    <p className="font-serif italic text-2xl leading-relaxed text-brand-brown/80 relative z-10">
                      "{m.highlight}"
                    </p>
                  </div>

                  <div className={`flex items-center gap-6 pt-8 border-t border-brand-brown/5 ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className={i % 2 === 0 ? 'text-right' : 'text-left'}>
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/30 block mb-1">The Vibe</span>
                      <p className="text-xl font-serif italic text-brand-pink">{m.vibeWord}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block relative z-10 w-6 h-6 rounded-full bg-brand-pink border-[6px] border-brand-beige shadow-xl ring-8 ring-brand-pink/5" />

              <div className="flex-1 w-full">
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 0 }}
                  className={`aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] transition-all duration-700 ${i % 2 === 0 ? 'rotate-3' : '-rotate-3'}`}
                >
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.title}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-brown/5 flex flex-col items-center justify-center p-12 text-center">
                      <Camera size={48} className="text-brand-brown/10 mb-6" />
                      <p className="font-serif italic text-brand-brown/20 text-xl">A moment captured in the heart, but not the lens.</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <footer className="mt-40 text-center">
        <div className="w-px h-24 bg-brand-brown/10 mx-auto mb-12" />
        <p className="text-xs uppercase tracking-[0.5em] font-bold text-brand-brown/20">End of Journal</p>
      </footer>
    </motion.div>
  );
}
