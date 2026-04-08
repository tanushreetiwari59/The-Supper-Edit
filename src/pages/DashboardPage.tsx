import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, ArrowRight, Trash2, Edit3, Mail, Camera, Printer, Plus, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Gathering, User } from '../types';

export default function DashboardPage() {
  const [gatherings, setGatherings] = useState<Gathering[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [printingGathering, setPrintingGathering] = useState<Gathering | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      navigate('/auth');
      return;
    }
    const u = JSON.parse(storedUser);
    setUser(u);

    const data = JSON.parse(localStorage.getItem('gatherings') || '[]');
    setGatherings(data.filter((g: Gathering) => g.userId === u.id));
  }, [navigate]);

  const deleteGathering = (id: string) => {
    const all = JSON.parse(localStorage.getItem('gatherings') || '[]');
    const updated = all.filter((g: Gathering) => g.id !== id);
    localStorage.setItem('gatherings', JSON.stringify(updated));
    setGatherings(updated.filter((g: Gathering) => g.userId === user?.id));
  };

  const selectGathering = (id: string, path: string) => {
    localStorage.setItem('currentGatheringId', id);
    navigate(path);
  };

  const handlePrint = (g: Gathering) => {
    setPrintingGathering(g);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const getStatus = (g: Gathering) => {
    const date = new Date(g.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if (date < now) return 'Completed';
    if (g.hostName) return 'Invitations Sent';
    return 'Planning';
  };

  const upcoming = gatherings.filter(g => getStatus(g) !== 'Completed').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = gatherings.filter(g => getStatus(g) === 'Completed').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-8 pt-24 pb-32"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-brand-pink" />
            <span className="text-xs uppercase tracking-[0.4em] font-bold text-brand-pink">Welcome back, {user?.name}</span>
          </motion.div>
          <h2 className="text-7xl tracking-tighter">Your Gatherings</h2>
        </div>
        <Link to="/create" className="btn-primary flex items-center gap-3 group">
          Start Designing <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
        </Link>
      </header>

      {gatherings.length === 0 ? (
        <div className="text-center py-40 editorial-card glass-panel">
          <p className="font-serif italic text-4xl text-brand-brown/40 mb-6">Your table is empty.</p>
          <p className="font-serif text-brand-brown/60 mb-10 max-w-md mx-auto leading-relaxed">Every great evening starts with a single intentional thought. Begin your hosting journey today.</p>
          <Link to="/create" className="btn-primary">Start Designing</Link>
        </div>
      ) : (
        <div className="space-y-24">
          {upcoming.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-12">
                <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-brand-brown/30">Upcoming</h3>
                <div className="flex-1 h-px bg-brand-brown/5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {upcoming.map(g => {
                  const status = getStatus(g);
                  return (
                    <motion.div
                      layout
                      key={g.id}
                      className="editorial-card group relative flex flex-col h-full"
                    >
                      <button 
                        onClick={() => deleteGathering(g.id)}
                        className="absolute top-6 right-6 text-brand-brown/10 hover:text-red-400 transition-colors z-10"
                      >
                        <Trash2 size={20} />
                      </button>
                      
                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-pink font-bold">
                            {g.archetype}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-brand-brown/20" />
                          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-brown/40 font-bold">
                            {status}
                          </span>
                        </div>
                        <h3 className="text-4xl leading-[1.1] tracking-tight mb-4 group-hover:text-brand-pink transition-colors duration-500">{g.title}</h3>
                      </div>

                      <div className="space-y-4 mb-10 text-sm font-serif italic text-brand-brown/60">
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-brand-pink/40" />
                          <span>{new Date(g.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users size={16} className="text-brand-pink/40" />
                          <span>{g.guestCount} Guests • {g.socialIntent}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-8 border-t border-brand-brown/5">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          {[
                            { icon: Edit3, label: 'Edit', onClick: () => navigate(`/create?edit=${g.id}`) },
                            { icon: Mail, label: 'Invite', onClick: () => selectGathering(g.id, '/invitation') },
                            { icon: Camera, label: 'Memory', onClick: () => selectGathering(g.id, '/memory') }
                          ].map((action, i) => (
                            <button 
                              key={i}
                              onClick={action.onClick}
                              className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 hover:text-brand-pink transition-colors"
                            >
                              <action.icon size={18} />
                              <span>{action.label}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handlePrint(g)}
                            className="flex-1 py-4 rounded-2xl bg-brand-brown/5 text-brand-brown text-[10px] uppercase font-bold tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-brand-brown hover:text-white transition-all"
                          >
                            <Printer size={14} /> Print
                          </button>
                          <button 
                            onClick={() => selectGathering(g.id, '/vibe-studio')}
                            className="flex-1 py-4 rounded-2xl bg-brand-pink text-white text-[10px] uppercase font-bold tracking-[0.2em] flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand-pink/30 transition-all group/btn"
                          >
                            View <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-12">
                <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-brand-brown/30">Past</h3>
                <div className="flex-1 h-px bg-brand-brown/5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {past.map(g => (
                  <motion.div
                    layout
                    key={g.id}
                    className="editorial-card group relative flex flex-col h-full opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <button 
                      onClick={() => deleteGathering(g.id)}
                      className="absolute top-6 right-6 text-brand-brown/10 hover:text-red-400 transition-colors z-10"
                    >
                      <Trash2 size={20} />
                    </button>
                    
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-brand-brown/40 font-bold">
                          {g.archetype}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-brand-brown/20" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-brand-brown/40 font-bold">
                          Completed
                        </span>
                      </div>
                      <h3 className="text-4xl leading-[1.1] tracking-tight mb-4">{g.title}</h3>
                    </div>

                    <div className="mt-auto pt-8 border-t border-brand-brown/5">
                      <button 
                        onClick={() => selectGathering(g.id, '/memory')}
                        className="w-full py-4 rounded-2xl bg-brand-brown/5 text-brand-brown text-[10px] uppercase font-bold tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-brand-brown hover:text-white transition-all"
                      >
                        <Camera size={14} /> View Memories
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Printable Event Sheet */}
      {printingGathering && (
        <div className="print-only fixed inset-0 bg-white z-[100] p-16 flex flex-col items-center">
          <div className="w-full max-w-4xl border-[1px] border-brand-brown/10 p-16 min-h-[1000px] flex flex-col">
            <header className="text-center mb-16">
              <span className="text-[10px] uppercase tracking-[0.4em] text-brand-brown/40 mb-4 font-bold block">Event Summary Sheet</span>
              <h1 className="text-6xl mb-4 leading-tight">{printingGathering.title}</h1>
              <div className="flex items-center justify-center gap-8 text-sm uppercase tracking-widest text-brand-brown/60">
                <span>{new Date(printingGathering.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="w-1 h-1 bg-brand-brown/20 rounded-full" />
                <span>Hosted by {printingGathering.hostName || 'The Host'}</span>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-16 mb-16">
              <section className="space-y-8">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-brand-pink font-bold mb-4">The Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="opacity-40">Archetype:</span> {printingGathering.archetype}</p>
                    <p><span className="opacity-40">Guest Count:</span> {printingGathering.guestCount}</p>
                    <p><span className="opacity-40">Social Intent:</span> {printingGathering.socialIntent}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-brand-pink font-bold mb-4">The Ritual</h3>
                  <p className="text-sm font-serif italic leading-relaxed">
                    {printingGathering.selectedRitualId === 'skip' ? 'No ritual selected' : (printingGathering.customRitualText || 'No ritual details')}
                  </p>
                </div>
              </section>

              <section className="space-y-8">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-brand-pink font-bold mb-4">The Menu</h3>
                  <ul className="space-y-4">
                    {printingGathering.seasonalMenu ? (
                      <li className="text-sm font-serif italic">{printingGathering.seasonalMenu}</li>
                    ) : (
                      <li className="text-sm opacity-40 italic">Menu not yet finalized</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-brand-pink font-bold mb-4">Atmosphere</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="opacity-40">Decor:</span> {printingGathering.seasonalAtmosphere || 'Standard'}</p>
                    <p><span className="opacity-40">Soundscape:</span> {printingGathering.seasonalSoundscape || 'Ambient'}</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-auto pt-16 border-t border-brand-brown/5 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">Designed with The Supper Edit</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
