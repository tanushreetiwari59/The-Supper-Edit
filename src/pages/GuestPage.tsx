import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';

type GuestSnapshot = {
  title: string;
  date: string;
  hostName: string;
  archetype: string;
  socialIntent: string;
  atmosphereText: string | null;
  atmospherePhoto: string | null;
  selectedRitualId: string | null;
  ritualTitle: string | null;
  ritualDescription: string | null;
  menu: string[];
  theme: string;
  typographyStyle: string;
  warmupPrompt: string;
};

export default function GuestPage() {
  const { slug } = useParams<{ slug: string }>();
  const [snapshot, setSnapshot] = useState<GuestSnapshot | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); return; }

    // Primary lookup: dedicated guest snapshot saved when host copies the link
    const raw = localStorage.getItem(`guestGathering_${slug}`);
    if (raw) {
      try {
        setSnapshot(JSON.parse(raw));
        return;
      } catch { /* malformed — fall through */ }
    }

    setNotFound(true);
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-brand-beige flex flex-col items-center justify-center px-8 text-center">
        <p className="text-2xl font-serif italic text-brand-brown/40 mb-4">This gathering couldn't be found.</p>
        <p className="text-sm text-brand-brown/30 leading-relaxed max-w-sm">
          This gathering link may have expired or the host needs to copy the guest link again from their invitation page.
        </p>
        <p className="mt-10 text-[11px] uppercase tracking-[0.4em] text-brand-brown/20 font-bold">Made with The Supper Edit</p>
      </div>
    );
  }

  if (!snapshot) return null;

  const formattedDate = new Date(snapshot.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const hasEditCard =
    snapshot.atmospherePhoto ||
    snapshot.atmosphereText ||
    snapshot.menu.length > 0 ||
    snapshot.ritualTitle ||
    snapshot.ritualDescription;

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
            {snapshot.title}
          </h1>

          <div className="w-12 h-px bg-brand-brown/10 mb-8" />

          <div className="space-y-3">
            <p className="text-xl font-serif text-brand-brown">
              Hosted by {snapshot.hostName || 'Your Host'}
            </p>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-brown/40 font-bold">
              {formattedDate}
            </p>
            {snapshot.theme && (
              <p className="text-xs uppercase tracking-[0.3em] text-brand-pink/60 font-bold mt-4">
                {snapshot.theme} · {snapshot.archetype}
              </p>
            )}
          </div>

          {snapshot.warmupPrompt && (
            <div className="mt-10 p-6 bg-brand-beige/30 rounded-[1.5rem] border border-brand-brown/5 w-full max-w-xs">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/30 mb-3">Guest Warm-up</p>
              <p className="font-serif italic text-brand-brown/60 leading-relaxed text-sm">"{snapshot.warmupPrompt}"</p>
            </div>
          )}
        </motion.div>

        {/* Card 2 — The Edit */}
        {hasEditCard && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="bg-white rounded-[2rem] shadow-[0_30px_80px_-10px_rgba(61,43,31,0.08)] overflow-hidden"
          >
            {snapshot.atmospherePhoto && (
              <div className="w-full h-48 overflow-hidden">
                <img src={snapshot.atmospherePhoto} alt="Evening atmosphere" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="px-12 py-14 space-y-10">
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-brand-pink" />
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-pink">The Edit</span>
              </div>

              {snapshot.atmosphereText && (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.35em] font-bold text-brand-brown/30">Atmosphere</p>
                  <p className="font-serif italic text-brand-brown/60 leading-relaxed text-base">
                    This evening is designed to feel like{' '}
                    <span className="text-brand-brown/80">
                      {snapshot.atmosphereText.charAt(0).toLowerCase() + snapshot.atmosphereText.slice(1)}
                    </span>
                  </p>
                </div>
              )}

              {snapshot.menu.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-brand-brown/5">
                  <p className="text-xs uppercase tracking-[0.35em] font-bold text-brand-brown/30">The Menu</p>
                  <ol className="space-y-3">
                    {snapshot.menu.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-brand-pink/40 font-serif italic text-sm mt-0.5">0{i + 1}</span>
                        <span className="font-serif italic text-brand-brown/70 text-base">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {(snapshot.ritualTitle || snapshot.ritualDescription) && (
                <div className="space-y-3 pt-2 border-t border-brand-brown/5">
                  <p className="text-xs uppercase tracking-[0.35em] font-bold text-brand-brown/30">Evening Ritual</p>
                  {snapshot.ritualTitle && (
                    <p className="text-xl font-serif text-brand-brown">{snapshot.ritualTitle}</p>
                  )}
                  {snapshot.ritualDescription && (
                    <p className="font-serif italic text-brand-brown/50 leading-relaxed text-sm">
                      "{snapshot.ritualDescription}"
                    </p>
                  )}
                </div>
              )}
            </div>
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
