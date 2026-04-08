import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wine, Sparkles, Flower, Share2, Palette, MessageCircle, Type, Printer, ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Gathering, THEMES, WARMUP_PROMPTS, TYPOGRAPHY_STYLES } from '../types';
import { ThemedSelect } from '../components/ThemedSelect';

export default function InvitationPage() {
  const [gathering, setGathering] = useState<Gathering | null>(null);
  const [hostName, setHostName] = useState('Your Name');
  const [accentColor, setAccentColor] = useState('#FF69B4');
  const [selectedIcon, setSelectedIcon] = useState('wine');
  const [theme, setTheme] = useState<keyof typeof THEMES>('Vintage');
  const [warmupPrompt, setWarmupPrompt] = useState('');
  const [typographyStyle, setTypographyStyle] = useState<string>('Editorial');
  const [frameStyle, setFrameStyle] = useState<string>('none');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('currentGatheringId');
    const all = JSON.parse(localStorage.getItem('gatherings') || '[]');
    const found = all.find((g: Gathering) => g.id === id);
    if (found) {
      setGathering(found);
      if (found.hostName) setHostName(found.hostName);
      if (found.accentColor) setAccentColor(found.accentColor);
      if (found.decorIcon) setSelectedIcon(found.decorIcon);
      if (found.theme) setTheme(found.theme as any);
      if (found.warmupPrompt) setWarmupPrompt(found.warmupPrompt);
      if (found.typographyStyle) setTypographyStyle(found.typographyStyle);
      if (found.frameStyle) setFrameStyle(found.frameStyle);
    }
  }, []);

  const saveChanges = () => {
    if (!gathering) return;
    const all = JSON.parse(localStorage.getItem('gatherings') || '[]');
    const updated = all.map((g: Gathering) => 
      g.id === gathering.id ? { ...g, hostName, accentColor, decorIcon: selectedIcon, theme, warmupPrompt, typographyStyle, frameStyle } : g
    );
    localStorage.setItem('gatherings', JSON.stringify(updated));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!gathering) return (
    <div className="pt-32 text-center">
      <p className="text-2xl font-serif italic text-brand-brown/40 mb-8">Select a gathering first.</p>
      <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
    </div>
  );

  const icons = [
    { id: 'wine', icon: Wine },
    { id: 'sparkle', icon: Sparkles },
    { id: 'flower', icon: Flower },
  ];

  const INVITATION_FRAMES = [
    { id: 'none', label: 'None', class: 'border-transparent' },
    { id: 'classic', label: 'Classic Editorial', class: 'border' },
    { id: 'doodle', label: 'Playful Doodle', class: 'border-2 border-dashed rounded-[3rem]' },
    { id: 'vintage', label: 'Vintage Ornamental', class: 'border-4 border-double rounded-xl' },
    { id: 'minimal', label: 'Minimal', class: 'border-y-2' },
  ];

  const ActiveIcon = icons.find(i => i.id === selectedIcon)?.icon || Wine;
  const currentTheme = THEMES[theme];
  const currentTypography = TYPOGRAPHY_STYLES.find(s => s.id === typographyStyle) || TYPOGRAPHY_STYLES[0];
  const currentFrame = INVITATION_FRAMES.find(f => f.id === frameStyle) || INVITATION_FRAMES[0];

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
              <span className="text-xs uppercase tracking-[0.5em] font-bold text-brand-pink">Step 02</span>
            </motion.div>
            <h2 className="text-6xl tracking-tighter">The Invitation</h2>
            <p className="text-lg text-brand-brown/40 mt-4 font-serif italic">Set the tone before the first guest even arrives.</p>
          </header>

          <div className="editorial-card glass-panel space-y-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                <Palette size={14} className="text-brand-pink" /> Style Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(t);
                      setAccentColor(THEMES[t].color);
                    }}
                    className={`px-4 py-3 rounded-2xl border text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                      theme === t ? 'bg-brand-brown text-brand-beige border-brand-brown shadow-lg' : 'bg-white/50 text-brand-brown border-brand-brown/10 hover:bg-brand-beige'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                <Type size={14} className="text-brand-pink" /> Typography
              </label>
              <div className="grid grid-cols-1 gap-3">
                {TYPOGRAPHY_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setTypographyStyle(style.id)}
                    className={`px-6 py-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      typographyStyle === style.id ? 'bg-brand-brown text-brand-beige border-brand-brown shadow-lg' : 'bg-white/50 text-brand-brown border-brand-brown/10 hover:bg-brand-beige'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-60">{style.label}</span>
                      <p className={`text-xl ${style.fontClass}`}>The Supper Edit</p>
                    </div>
                    {typographyStyle === style.id && <Check size={16} className="text-brand-pink" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                <Sparkles size={14} className="text-brand-pink" /> Invitation Frame Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {INVITATION_FRAMES.map(frame => (
                  <button
                    key={frame.id}
                    onClick={() => setFrameStyle(frame.id)}
                    className={`px-4 py-3 rounded-2xl border text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                      frameStyle === frame.id ? 'bg-brand-brown text-brand-beige border-brand-brown shadow-lg' : 'bg-white/50 text-brand-brown border-brand-brown/10 hover:bg-brand-beige'
                    }`}
                  >
                    {frame.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                <Wine size={14} className="text-brand-pink" /> Host Name
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-brand-brown/10 py-3 text-2xl font-serif italic focus:outline-none focus:border-brand-pink transition-colors"
                value={hostName}
                onChange={e => setHostName(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                <MessageCircle size={14} className="text-brand-pink" /> Guest Warm-up
              </label>
              <ThemedSelect
                options={WARMUP_PROMPTS}
                value={warmupPrompt}
                onChange={setWarmupPrompt}
                placeholder="No prompt selected"
                variant="card"
              />
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">Accent Color</label>
                <div className="flex flex-wrap gap-3">
                  {['#FF69B4', '#3D2B1F', '#4A90E2', '#E67E22', '#27AE60'].map(color => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${accentColor === color ? 'border-brand-brown scale-110 shadow-lg' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">Icon</label>
                <div className="flex gap-3">
                  {icons.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIcon(item.id)}
                      className={`p-3 rounded-xl border transition-all hover:scale-105 ${selectedIcon === item.id ? 'border-brand-brown bg-brand-beige shadow-md' : 'border-brand-brown/10 bg-white/50'}`}
                    >
                      <item.icon size={20} className={selectedIcon === item.id ? 'text-brand-pink' : 'text-brand-brown/40'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button onClick={saveChanges} className="btn-primary w-full py-6 text-lg shadow-xl shadow-brand-pink/20 relative overflow-hidden group">
              <AnimatePresence mode="wait">
                {isSaved ? (
                  <motion.div
                    key="saved"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Check size={20} /> Design Saved
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Sparkles size={20} /> Save Design
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={handlePrint} className="btn-secondary flex items-center justify-center gap-2 py-4">
                <Printer size={18} /> Print
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 py-4">
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>
        </section>

        <section className="lg:col-span-7 flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            {/* Background decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl" />
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={theme + typographyStyle + accentColor + selectedIcon + frameStyle}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                className={`w-full aspect-[3/4] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-sm p-16 flex flex-col items-center text-center relative overflow-hidden transition-all duration-700 ${currentTheme.border}`}
                style={{ borderColor: theme === 'Vintage' ? '#FDFBF7' : `${accentColor}15` }}
              >
                {/* Frame Overlay */}
                <div 
                  className={`absolute inset-4 pointer-events-none transition-all duration-500 ${currentFrame.class}`}
                  style={{ borderColor: accentColor }}
                />
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-16" 
                  style={{ color: accentColor }}
                >
                  <ActiveIcon size={64} strokeWidth={1} />
                </motion.div>
                
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-[10px] uppercase tracking-[0.5em] mb-6 ${currentTypography.fontClass}`} 
                  style={{ color: `${accentColor}99` }}
                >
                  You are cordially invited
                </motion.span>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`text-5xl mb-12 leading-tight tracking-tight ${currentTypography.fontClass}`}
                >
                  {gathering.title}
                </motion.h3>
                
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-16 h-px bg-brand-brown/10 mb-12" 
                />
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <p className={`text-2xl ${currentTypography.fontClass}`}>Hosted by {hostName}</p>
                  <p className={`text-sm tracking-[0.3em] uppercase opacity-60 ${currentTypography.fontClass}`}>
                    {new Date(gathering.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </motion.div>

                {warmupPrompt && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-12 p-8 bg-brand-beige/30 rounded-[2rem] border border-brand-brown/5 max-w-xs"
                  >
                    <div className="flex items-center gap-2 justify-center mb-3">
                      <MessageCircle size={14} className="text-brand-pink" />
                      <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Guest Warm-up</span>
                    </div>
                    <p className="text-base font-serif italic leading-relaxed text-brand-brown/70">"{warmupPrompt}"</p>
                  </motion.div>
                )}
                
                <div className="mt-auto pt-12">
                  <p className="text-[10px] uppercase tracking-[0.4em] opacity-30 font-bold">The Supper Edit • {gathering.archetype}</p>
                </div>

                {/* Decorative corners */}
                {theme !== 'Minimal' && (
                  <>
                    <div className="absolute top-8 left-8 w-12 h-12 border-t border-l opacity-20" style={{ borderColor: accentColor }} />
                    <div className="absolute top-8 right-8 w-12 h-12 border-t border-r opacity-20" style={{ borderColor: accentColor }} />
                    <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l opacity-20" style={{ borderColor: accentColor }} />
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r opacity-20" style={{ borderColor: accentColor }} />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Printable Invitation */}
      <div className="print-only fixed inset-0 bg-white z-[100] p-16 flex flex-col items-center text-center">
        <div className={`w-full max-w-2xl border-[1px] p-20 flex flex-col items-center min-h-[900px] relative ${currentTheme.border}`} style={{ borderColor: theme === 'Vintage' ? '#FDFBF7' : `${accentColor}15` }}>
          {/* Frame Overlay */}
          <div 
            className={`absolute inset-4 pointer-events-none ${currentFrame.class}`}
            style={{ borderColor: accentColor }}
          />
          <div className="mb-16" style={{ color: accentColor }}>
            <ActiveIcon size={64} strokeWidth={1} />
          </div>
          
          <span className={`text-xs uppercase tracking-[0.5em] mb-6 ${currentTypography.fontClass}`} style={{ color: `${accentColor}99` }}>You are cordially invited</span>
          
          <h1 className={`text-6xl mb-12 leading-tight ${currentTypography.fontClass}`}>
            {gathering.title}
          </h1>
          
          <div className="w-16 h-px bg-brand-brown/20 mb-12" />
          
          <p className={`text-2xl mb-4 ${currentTypography.fontClass}`}>Hosted by {hostName}</p>
          <p className={`text-xl tracking-widest uppercase mb-16 ${currentTypography.fontClass}`}>
            {new Date(gathering.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          {warmupPrompt && (
            <div className="mb-16 p-10 bg-brand-beige/30 rounded-3xl border border-brand-brown/5 max-w-md">
              <div className="flex items-center gap-2 justify-center mb-4">
                <MessageCircle size={18} className="text-brand-pink" />
                <span className="text-xs uppercase tracking-widest opacity-40">Guest Warm-up</span>
              </div>
              <p className="text-lg font-serif italic leading-relaxed">"{warmupPrompt}"</p>
            </div>
          )}
          
          <div className="mt-auto">
            <p className="text-sm uppercase tracking-[0.3em] opacity-40">The Supper Edit • {gathering.archetype}</p>
          </div>

          {theme !== 'Minimal' && (
            <>
              <div className="absolute top-8 left-8 w-12 h-12 border-t border-l opacity-20" style={{ borderColor: accentColor }} />
              <div className="absolute top-8 right-8 w-12 h-12 border-t border-r opacity-20" style={{ borderColor: accentColor }} />
              <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l opacity-20" style={{ borderColor: accentColor }} />
              <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r opacity-20" style={{ borderColor: accentColor }} />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
