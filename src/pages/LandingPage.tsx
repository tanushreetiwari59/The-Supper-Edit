import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="min-h-screen bg-brand-beige relative overflow-hidden selection:bg-brand-pink/30" ref={containerRef}>
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3D2B1F 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      {/* Navigation */}
      <nav className="relative z-30 flex justify-between items-center px-8 py-10 md:px-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 border-2 border-brand-brown flex items-center justify-center rounded-2xl rotate-3 bg-white shadow-sm">
            <span className="font-serif text-brand-brown text-xl font-bold">SE</span>
          </div>
          <span className="font-serif text-2xl tracking-tighter font-bold text-brand-brown hidden sm:block">The Supper Edit</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 sm:gap-10"
        >
          <Link to="/auth" className="text-sm uppercase tracking-[0.2em] font-bold text-brand-brown/60 hover:text-brand-pink transition-colors">Login</Link>
          <Link to="/auth" className="btn-primary py-3 px-8 text-sm">
            Start Hosting
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 md:px-16 pt-12 md:pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-px bg-brand-pink" />
              <span className="text-xs uppercase tracking-[0.4em] font-bold text-brand-pink">Boutique Hosting</span>
            </motion.div>
            
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-serif leading-[0.85] mb-10 tracking-tighter text-brand-brown">
              Curate <br />
              <span className="italic text-brand-pink">Moments</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-serif text-brand-brown/70 mb-12 max-w-lg leading-relaxed">
              Menus, rituals, invitations, and memories — all in one place. Your gathering, beautifully curated for a new generation of hosts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/auth" className="btn-primary text-xl px-12 py-5 group flex items-center justify-center gap-4">
                Start Hosting
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </Link>
              <Link to="/auth" className="btn-secondary text-xl px-12 py-5 flex items-center justify-center">
                Explore Features
              </Link>
            </div>
          </motion.div>

          {/* Right Side: 3D Floating Hero Visual */}
          <div className="relative perspective-1000">
            <motion.div
              style={{ y: y1 }}
              className="relative z-10 floating"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(61,43,31,0.15)] border-[12px] border-white relative group">
                <img 
                  src="https://picsum.photos/seed/gathering-drinks/1200/1500" 
                  alt="People holding drinks and cocktails" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/40 to-transparent opacity-60" />
                
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <span className="font-script text-4xl block mb-2">The Art of Connection</span>
                  <div className="w-12 h-px bg-white/40 mb-4" />
                  <p className="text-xs uppercase tracking-[0.3em] font-bold opacity-80">Curated by The Supper Edit</p>
                </div>
              </div>
            </motion.div>

            {/* Parallax Decorative Elements */}
            <motion.div
              style={{ y: y2 }}
              className="absolute -top-20 -right-10 w-48 h-48 bg-brand-pink/10 rounded-full blur-3xl z-0"
            />
            <motion.div
              style={{ y: y1 }}
              className="absolute -bottom-10 -left-10 w-64 h-64 border-2 border-brand-pink/20 rounded-[3rem] z-0 rotate-12"
            />
            
            {/* Floating UI Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute top-1/4 -right-12 z-20 glass-panel p-6 max-w-[200px] hidden md:block"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/60">Live Now</span>
              </div>
              <p className="font-serif italic text-lg leading-tight mb-2">"The best evening we've had in years."</p>
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-pink">— Sarah J.</span>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer / Subtle Details */}
      <footer className="relative z-10 border-t border-brand-brown/5 py-12 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Est. 2024</span>
          <div className="w-1 h-1 rounded-full bg-brand-brown" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">The Supper Edit</span>
        </div>
        
        <div className="flex gap-12 opacity-40">
          {['Menus', 'Rituals', 'Invites', 'Memories'].map(item => (
            <span key={item} className="text-[10px] uppercase tracking-[0.4em] font-bold hover:text-brand-pink transition-colors cursor-pointer">{item}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
