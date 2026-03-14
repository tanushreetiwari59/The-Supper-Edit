import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Calendar, Users, Target, Send } from 'lucide-react';
import { ARCHETYPES, SOCIAL_INTENTS, INVITE_MODES, Gathering, User, HOST_PERSONALITIES } from '../types';

export default function CreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    archetype: ARCHETYPES[0],
    guestCount: 6,
    socialIntent: SOCIAL_INTENTS[0],
    inviteMode: INVITE_MODES[0],
    date: '',
    customHostingStyle: ''
  });

  const [isEditingStyle, setIsEditingStyle] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      navigate('/auth');
      return;
    }
    setUser(JSON.parse(storedUser));

    const params = new URLSearchParams(location.search);
    const id = params.get('edit');
    if (id) {
      const all = JSON.parse(localStorage.getItem('gatherings') || '[]');
      const found = all.find((g: Gathering) => g.id === id);
      if (found) {
        setFormData({
          title: found.title,
          archetype: found.archetype,
          guestCount: found.guestCount,
          socialIntent: found.socialIntent,
          inviteMode: found.inviteMode,
          date: found.date,
          customHostingStyle: found.customHostingStyle || ''
        });
        setEditId(id);
      }
    }
  }, [navigate, location]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const existing = JSON.parse(localStorage.getItem('gatherings') || '[]');
    let newId = editId || crypto.randomUUID();

    const newGathering: Gathering = {
      ...formData,
      id: newId,
      userId: user.id,
      customHostingStyle: formData.customHostingStyle || HOST_PERSONALITIES[formData.archetype as keyof typeof HOST_PERSONALITIES].description
    };

    if (editId) {
      const updated = existing.map((g: Gathering) => g.id === editId ? newGathering : g);
      localStorage.setItem('gatherings', JSON.stringify(updated));
    } else {
      localStorage.setItem('gatherings', JSON.stringify([...existing, newGathering]));
    }
    
    localStorage.setItem('currentGatheringId', newId);
    navigate('/vibe-studio');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-8 pt-24 pb-32"
    >
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] font-bold text-brand-brown/40 hover:text-brand-pink transition-colors mb-12 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <header className="mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-px bg-brand-pink" />
          <span className="text-xs uppercase tracking-[0.5em] font-bold text-brand-pink">Step 01</span>
        </motion.div>
        <h2 className="text-7xl tracking-tighter">{editId ? 'Refine Your Gathering' : 'Design Your Gathering'}</h2>
        <p className="text-xl text-brand-brown/40 mt-4 font-serif italic">Every great evening starts with a single intentional thought.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
          <div className="editorial-card glass-panel space-y-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                <Sparkles size={14} className="text-brand-pink" /> Event Title
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Midsummer Night's Dream"
                className="w-full bg-transparent border-b border-brand-brown/10 py-4 text-3xl font-serif italic focus:outline-none focus:border-brand-pink transition-colors placeholder:text-brand-brown/10"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                  <Calendar size={14} className="text-brand-pink" /> Date
                </label>
                <input
                  required
                  type="date"
                  className="w-full bg-transparent border-b border-brand-brown/10 py-3 text-lg font-serif focus:outline-none focus:border-brand-pink transition-colors"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                  <Users size={14} className="text-brand-pink" /> Guest Count
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full bg-transparent border-b border-brand-brown/10 py-3 text-lg font-serif focus:outline-none focus:border-brand-pink transition-colors"
                  value={formData.guestCount || ''}
                  onChange={e => {
                    const val = parseInt(e.target.value);
                    setFormData({ ...formData, guestCount: isNaN(val) ? 0 : val });
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                  <Target size={14} className="text-brand-pink" /> Social Intent
                </label>
                <select
                  className="w-full bg-transparent border-b border-brand-brown/10 py-3 text-lg font-serif focus:outline-none focus:border-brand-pink transition-colors cursor-pointer"
                  value={formData.socialIntent}
                  onChange={e => setFormData({ ...formData, socialIntent: e.target.value })}
                >
                  {SOCIAL_INTENTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                  <Send size={14} className="text-brand-pink" /> Invite Mode
                </label>
                <select
                  className="w-full bg-transparent border-b border-brand-brown/10 py-3 text-lg font-serif focus:outline-none focus:border-brand-pink transition-colors cursor-pointer"
                  value={formData.inviteMode}
                  onChange={e => setFormData({ ...formData, inviteMode: e.target.value })}
                >
                  {INVITE_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button type="submit" className="btn-primary w-full text-lg py-6 shadow-2xl shadow-brand-pink/20 group">
              <span>Save & Continue to Vibe Studio</span>
              <Sparkles size={20} className="ml-3 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="editorial-card glass-panel sticky top-32">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/40">Archetype</label>
                <select
                  className="w-full bg-brand-brown/5 border border-brand-brown/5 rounded-2xl px-6 py-4 text-xl font-serif italic focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all cursor-pointer"
                  value={formData.archetype}
                  onChange={e => setFormData({ ...formData, archetype: e.target.value })}
                >
                  {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={formData.archetype}
                className="p-8 bg-brand-pink/5 rounded-[2.5rem] border border-brand-pink/10 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-pink/5 rounded-full blur-3xl" />
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-brand-pink" size={16} />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-brand-pink font-bold">Hosting Style</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsEditingStyle(!isEditingStyle)}
                    className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/30 hover:text-brand-pink transition-colors"
                  >
                    {isEditingStyle ? 'Save' : 'Edit'}
                  </button>
                </div>

                <h4 className="text-4xl font-serif italic mb-6 relative z-10">
                  {HOST_PERSONALITIES[formData.archetype as keyof typeof HOST_PERSONALITIES].title}
                </h4>

                {isEditingStyle ? (
                  <textarea
                    className="w-full bg-white/50 border border-brand-pink/20 rounded-2xl p-6 text-lg font-serif italic leading-relaxed text-brand-brown/70 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 min-h-[150px] relative z-10 shadow-inner"
                    value={formData.customHostingStyle || HOST_PERSONALITIES[formData.archetype as keyof typeof HOST_PERSONALITIES].description}
                    onChange={e => setFormData({ ...formData, customHostingStyle: e.target.value })}
                  />
                ) : (
                  <p className="text-xl font-serif italic text-brand-brown/60 leading-relaxed relative z-10">
                    "{formData.customHostingStyle || HOST_PERSONALITIES[formData.archetype as keyof typeof HOST_PERSONALITIES].description}"
                  </p>
                )}
              </motion.div>

              <div className="p-8 rounded-[2rem] border border-dashed border-brand-brown/10 flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-brand-brown/5 flex items-center justify-center flex-shrink-0">
                  <Users className="text-brand-brown/40" size={20} />
                </div>
                <p className="text-sm text-brand-brown/40 leading-relaxed">
                  Your gathering for <span className="text-brand-brown font-bold">{formData.guestCount} guests</span> will be curated as a <span className="text-brand-brown font-bold">{formData.archetype}</span> experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
