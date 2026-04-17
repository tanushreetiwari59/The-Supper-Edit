import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LayoutDashboard, Sparkles, Mail, Camera, Home, LogOut, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import CreatePage from './pages/CreatePage';
import DashboardPage from './pages/DashboardPage';
import VibeStudioPage from './pages/VibeStudioPage';
import InvitationPage from './pages/InvitationPage';
import MemoryPage from './pages/MemoryPage';
import MemoryFeedPage from './pages/MemoryFeedPage';
import AuthPage from './pages/AuthPage';
import GuestPage from './pages/GuestPage';
import { User } from './types';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, [location]);

  if (location.pathname === '/' || location.pathname === '/auth' || location.pathname.startsWith('/g/')) return null;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/create', icon: Plus, label: 'New' },
    { path: '/vibe-studio', icon: Sparkles, label: 'Vibe' },
    { path: '/invitation', icon: Mail, label: 'Invite' },
    { path: '/memory', icon: Camera, label: 'Memory' },
    { path: '/feed', icon: BookOpen, label: 'Journal' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-brown text-brand-beige px-3 sm:px-6 py-3 rounded-full flex items-center gap-2 sm:gap-5 shadow-2xl z-50">
      <Link to="/" className="hover:text-brand-pink transition-colors p-1">
        <Home size={20} />
      </Link>
      <div className="w-px h-4 bg-brand-beige/20" />
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center gap-1 transition-colors p-1 ${
            location.pathname.startsWith(item.path) ? 'text-brand-pink' : 'hover:text-brand-pink'
          }`}
        >
          <item.icon size={20} />
          <span className="hidden sm:inline text-[10px] uppercase tracking-tighter font-semibold">{item.label}</span>
        </Link>
      ))}
      <div className="w-px h-4 bg-brand-beige/20" />
      <button onClick={handleLogout} className="hover:text-red-400 transition-colors flex flex-col items-center gap-1 p-1">
        <LogOut size={20} />
        <span className="hidden sm:inline text-[10px] uppercase tracking-tighter font-semibold">Exit</span>
      </button>
    </nav>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vibe-studio" element={<VibeStudioPage />} />
        <Route path="/invitation" element={<InvitationPage />} />
        <Route path="/memory" element={<MemoryPage />} />
        <Route path="/feed" element={<MemoryFeedPage />} />
        <Route path="/g/:slug" element={<GuestPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-32">
        <Navigation />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}
