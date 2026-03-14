import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { User } from '../types';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        alert('User not found. Please sign up.');
      }
    } else {
      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
      };
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,105,180,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(255,105,180,0.05),transparent_50%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <div className="w-16 h-16 rounded-full bg-brand-pink flex items-center justify-center text-white shadow-2xl shadow-brand-pink/20 group hover:scale-110 transition-transform duration-500">
              <span className="text-2xl font-bold tracking-tighter">SE</span>
            </div>
          </Link>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-5xl tracking-tighter mb-4">{isLogin ? 'Welcome Back' : 'Join the Table'}</h2>
            <p className="text-brand-brown/40 font-serif italic">The art of intentional hosting starts here.</p>
          </motion.div>
        </div>

        <div className="editorial-card glass-panel p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                    <UserIcon size={12} className="text-brand-pink" /> Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full bg-transparent border-b border-brand-brown/10 py-3 text-lg font-serif italic focus:outline-none focus:border-brand-pink transition-colors placeholder:text-brand-brown/10"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                <Mail size={12} className="text-brand-pink" /> Email Address
              </label>
              <input
                required
                type="email"
                placeholder="jane@example.com"
                className="w-full bg-transparent border-b border-brand-brown/10 py-3 text-lg font-serif italic focus:outline-none focus:border-brand-pink transition-colors placeholder:text-brand-brown/10"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/40">
                <Lock size={12} className="text-brand-pink" /> Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-brand-brown/10 py-3 text-lg font-serif italic focus:outline-none focus:border-brand-pink transition-colors placeholder:text-brand-brown/10"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary w-full py-5 text-lg shadow-xl shadow-brand-pink/20 group">
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs uppercase tracking-[0.2em] font-bold text-brand-brown/40 hover:text-brand-pink transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-brand-brown/20 font-bold">The Supper Edit • Est. 2024</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
