import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Gathering, SUPPER_RITUALS, VIBE_DATA } from '../types';

export default function GuestPage() {
  const { slug } = useParams<{ slug: string }>();
  const [gathering, setGathering] = useState<Gathering | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const all: Gathering[] = JSON.parse(localStorage.getItem('gatherings') || '[]');
    const found = all.find(g => g.guestSlug === slug);
    if (found) {
      setGathering(found);
    } else {
      setNotFound(true);
    }
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-brand-beige flex flex-col items-center justify-center px-8">
        <p className="text-2xl font-serif italic text-brand-brown/40">This gathering couldn't be found.</p>
        <p className="mt-4 text-sm text-brand-brown/30 tracking-widest uppercase">Made with The Supper Edit</p>
      </div>
    );
  }

  if (!gathering) return null;

  const formattedDate = new Date(gathering.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const selectedRitual = SUPPER_RITUALS.find(r => r.title === gathering.selectedRitualId) || null;
  const atmosphereText =
    gathering.seasonalAtmosphere ||
    gathering.customDecor ||
    VIBE_DATA[gathering.archetype as keyof typeof VIBE_DATA]?.decor ||
    null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-brand-beige flex flex-col items-center justify-start px-6 py-24"
    >
      <div className="w-full max-w-xl space-y-8">

        {/* Card 1 — Invitation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-[2rem] shadow-[0_30px_80px_-10px_rgba(61,43,31,0.08)] px-12 py-16 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-brand-pink/20" />
          <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-brand-pink/20" />
          <div className="absolute bottom-6 left-6 w-10 h-10 border-b border-l border-brand-pink/20" />
          <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-brand-pink/20" />

          <span className="text-[10px] uppercase tracking-[0.6em] font-bold text-brand-pink/60 mb-10">
            You are cordially invited
          </span>

          <h1 className="text-5xl font-serif leading-tight tracking-tight text-brand-brown mb-8">
            {gathering.title}
          </h1>

          <div className="w-12 h-px bg-brand-brown/10 mb-8" />

          <div className="space-y-3">
            <p className="text-xl font-serif text-brand-brown">
              Hosted by {gathering.hostName || 'Your Host'}
            </p>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-brown/40 font-bold">
              {formattedDate}
            </p>
            {gathering.theme && (
              <p className="text-xs uppercase tracking-[0.3em] text-brand-pink/60 font-bold mt-4">
                {gathering.theme} · {gathering.archetype}
              </p>
            )}
          </div>
        </motion.div>

        {/* Card 2 — The Edit */}
        {(atmosphereText || selectedRitual || gathering.customRitualText) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="bg-white rounded-[2rem] shadow-[0_30px_80px_-10px_rgba(61,43,31,0.08)] px-12 py-14 space-y-10"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-brand-pink" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-pink">The Edit</span>
            </div>

            {atmosphereText && (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] font-bold text-brand-brown/30">Atmosphere</p>
                <p className="font-serif italic text-brand-brown/60 leading-relaxed text-base">
                  This evening is designed to feel like{' '}
                  <span className="text-brand-brown/80">
                    {atmosphereText.charAt(0).toLowerCase() + atmosphereText.slice(1)}
                  </span>
                </p>
              </div>
            )}

            {(selectedRitual || gathering.customRitualText) && (
              <div className="space-y-3 pt-2 border-t border-brand-brown/5">
                <p className="text-xs uppercase tracking-[0.35em] font-bold text-brand-brown/30">Evening Ritual</p>
                <p className="text-xl font-serif text-brand-brown">
                  {selectedRitual?.title || 'A Shared Moment'}
                </p>
                <p className="font-serif italic text-brand-brown/50 leading-relaxed text-sm">
                  "{gathering.customRitualText || selectedRitual?.description}"
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-[11px] uppercase tracking-[0.4em] text-brand-brown/25 font-bold pt-4"
        >
          Made with The Supper Edit
        </motion.p>
      </div>
    </motion.div>
  );
}
