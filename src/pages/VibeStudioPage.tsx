import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Music, Palette, Info, RefreshCw, Sparkles, CloudSun, Printer, ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Gathering, VIBE_DATA, VIBE_POOLS, SUPPER_RITUALS, SEASONAL_POOLS } from '../types';

const ATMOSPHERE_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', alt: 'Candlelit dinner table' },
  { url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc8a?w=400', alt: 'Wildflowers on linen' },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', alt: 'Elegant table setting' },
  { url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400', alt: 'Morning brunch spread' },
  { url: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400', alt: 'Warm ambient dining room' },
  { url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', alt: 'Wine being poured' },
  { url: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400', alt: 'Rustic table with candles' },
];

export default function VibeStudioPage() {
  const [gathering, setGathering] = useState<Gathering | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'playlist' | 'decor'>('menu');
  const [ritualOptions, setRitualOptions] = useState<{ title: string; description: string }[]>([]);
  const [selectedRitualId, setSelectedRitualId] = useState<string | 'skip' | null>(null);
  const [isEditingRitual, setIsEditingRitual] = useState(true);
  const [isEditingDecor, setIsEditingDecor] = useState(false);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [localMenu, setLocalMenu] = useState<string[]>([]);
  const [menuSaved, setMenuSaved] = useState(false);
  const [atmosphereSaved, setAtmosphereSaved] = useState(false);
  const [isEditingMoodTitle, setIsEditingMoodTitle] = useState(false);
  const [localMoodTitle, setLocalMoodTitle] = useState('');
  const [customRitualText, setCustomRitualText] = useState('');
  const [localDecor, setLocalDecor] = useState('');

  const [season, setSeason] = useState<keyof typeof SEASONAL_POOLS>('Spring');
  const [seasonalSuggestions, setSeasonalSuggestions] = useState({
    menu: '',
    decor: '',
    playlist: ''
  });
  const [isEditingSeason, setIsEditingSeason] = useState<{ menu: boolean; decor: boolean; playlist: boolean }>({
    menu: false,
    decor: false,
    playlist: false
  });

  const [atmospherePhoto, setAtmospherePhoto] = useState<string | null>(null);
  const [selectedPresetUrl, setSelectedPresetUrl] = useState<string | null>(null);
  const atmosphereUploadRef = useRef<HTMLInputElement>(null);

  const [dynamicVibe, setDynamicVibe] = useState<{
    menu: string[];
    playlist: { arrival: string; peak: string; closing: string };
    decor: string;
  } | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('currentGatheringId');
    const all = JSON.parse(localStorage.getItem('gatherings') || '[]');
    const found = all.find((g: Gathering) => g.id === id);
    if (found) {
      setGathering(found);
      const initialVibe = VIBE_DATA[found.archetype as keyof typeof VIBE_DATA] ?? Object.values(VIBE_DATA)[0];
      const decor = found.customDecor || initialVibe.decor;
      setDynamicVibe({
        menu: found.customMenu || initialVibe.menu,
        playlist: initialVibe.playlist,
        decor
      });
      setLocalDecor(decor);

      const shuffled = [...SUPPER_RITUALS].sort(() => 0.5 - Math.random());
      setRitualOptions(shuffled.slice(0, 3));
      setSelectedRitualId(found.selectedRitualId || null);
      setCustomRitualText(found.customRitualText || '');
      if (found.atmospherePhoto) {
        setAtmospherePhoto(found.atmospherePhoto);
        const isPreset = ATMOSPHERE_PRESETS.some(p => p.url === found.atmospherePhoto);
        setSelectedPresetUrl(isPreset ? found.atmospherePhoto : null);
      } else {
        setAtmospherePhoto(ATMOSPHERE_PRESETS[0].url);
        setSelectedPresetUrl(ATMOSPHERE_PRESETS[0].url);
      }

      const date = new Date(found.date);
      const month = date.getMonth();
      let currentSeason: keyof typeof SEASONAL_POOLS = 'Spring';
      if (month >= 2 && month <= 4) currentSeason = 'Spring';
      else if (month >= 5 && month <= 7) currentSeason = 'Summer';
      else if (month >= 8 && month <= 10) currentSeason = 'Autumn';
      else currentSeason = 'Winter';
      setSeason(currentSeason);
      setLocalMoodTitle(found.customSeasonName || currentSeason);

      setSeasonalSuggestions({
        menu: found.seasonalMenu || SEASONAL_POOLS[currentSeason].menu[0],
        decor: found.seasonalAtmosphere || SEASONAL_POOLS[currentSeason].decor[0],
        playlist: found.seasonalSoundscape || SEASONAL_POOLS[currentSeason].playlist[0]
      });
    }
  }, []);

  useEffect(() => {
    if (isEditingMenu && dynamicVibe) {
      setLocalMenu([...dynamicVibe.menu]);
    }
  }, [isEditingMenu]);

  const saveToGathering = (updates: Partial<Gathering>) => {
    if (!gathering) return;
    const all = JSON.parse(localStorage.getItem('gatherings') || '[]');
    const updated = all.map((g: Gathering) => g.id === gathering.id ? { ...g, ...updates } : g);
    localStorage.setItem('gatherings', JSON.stringify(updated));
    setGathering({ ...gathering, ...updates });
  };

  const generateNewSeasonal = () => {
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const newSuggestions = {
      menu: getRandom(SEASONAL_POOLS[season].menu),
      decor: getRandom(SEASONAL_POOLS[season].decor),
      playlist: getRandom(SEASONAL_POOLS[season].playlist)
    };
    setSeasonalSuggestions(newSuggestions);
    saveToGathering({
      seasonalMenu: newSuggestions.menu,
      seasonalAtmosphere: newSuggestions.decor,
      seasonalSoundscape: newSuggestions.playlist
    });
  };

  const generateNewDecor = () => {
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    if (dynamicVibe) {
      const newDecor = getRandom(VIBE_POOLS.decor);
      setDynamicVibe({ ...dynamicVibe, decor: newDecor });
      setLocalDecor(newDecor);
      saveToGathering({ customDecor: newDecor });
    }
  };

  const handleAtmosphereUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setAtmospherePhoto(base64);
      setSelectedPresetUrl(null);
      saveToGathering({ atmospherePhoto: base64 });
      localStorage.setItem('supperEditAtmosphere', base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const selectPreset = (url: string) => {
    setAtmospherePhoto(url);
    setSelectedPresetUrl(url);
    saveToGathering({ atmospherePhoto: url });
    localStorage.setItem('supperEditAtmosphere', url);
  };

  const handleSaveAtmosphere = () => {
    if (dynamicVibe) {
      setDynamicVibe({ ...dynamicVibe, decor: localDecor });
      saveToGathering({ customDecor: localDecor });
    }
    localStorage.setItem('supperEditAtmosphere', localDecor);
    localStorage.setItem('supperEditAtmospherePhoto', atmospherePhoto || '');
    setAtmosphereSaved(true);
    setTimeout(() => setAtmosphereSaved(false), 2000);
  };

  const handleSaveMenu = () => {
    if (!dynamicVibe) return;
    setDynamicVibe({ ...dynamicVibe, menu: localMenu });
    localStorage.setItem('supperEditMenu', JSON.stringify(localMenu));
    saveToGathering({ customMenu: localMenu });
    setMenuSaved(true);
    setTimeout(() => setMenuSaved(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const generateNewIdeas = () => {
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const getRandomMany = (arr: string[], count: number) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const newVibe = {
      menu: getRandomMany(VIBE_POOLS.menu, 4),
      playlist: {
        arrival: getRandom(VIBE_POOLS.arrival),
        peak: getRandom(VIBE_POOLS.peak),
        closing: getRandom(VIBE_POOLS.closing)
      },
      decor: getRandom(VIBE_POOLS.decor)
    };
    setDynamicVibe(newVibe);
    setLocalDecor(newVibe.decor);
    saveToGathering({
      customMenu: newVibe.menu,
      customDecor: newVibe.decor
    });
  };

  if (!gathering || !dynamicVibe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8">
        <Info className="text-brand-pink mb-6" size={64} strokeWidth={1} />
        <h2 className="text-4xl mb-4 tracking-tight">No gathering selected</h2>
        <p className="text-brand-brown/60 mb-10 text-center max-w-md">Please create or select a gathering from your dashboard to begin designing the vibe.</p>
        <Link to="/dashboard" className="btn-primary">Return to Dashboard</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'menu', label: 'Tasting Edit', icon: Utensils },
    { id: 'playlist', label: 'Sonic Arc', icon: Music },
    { id: 'decor', label: 'Atmosphere', icon: Palette },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-8 pt-24 pb-32"
    >
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] font-bold text-brand-brown/40 hover:text-brand-pink transition-colors mb-12 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <header className="mb-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-8 h-px bg-brand-pink/30" />
          <span className="text-xs uppercase tracking-[0.5em] font-bold text-brand-pink">Vibe Studio</span>
          <div className="w-8 h-px bg-brand-pink/30" />
        </motion.div>
        <h2 className="text-7xl tracking-tighter mb-4">{gathering.title}</h2>
        <p className="font-serif italic text-2xl text-brand-brown/40 mb-12">{gathering.archetype}</p>

        <button
          onClick={generateNewIdeas}
          className="btn-secondary flex items-center gap-3 mx-auto group"
        >
          <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
          <span>Refresh All Suggestions</span>
        </button>
      </header>

      <div className="flex justify-center gap-6 mb-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-500 ${
              activeTab === tab.id
                ? 'bg-brand-brown text-white shadow-xl shadow-brand-brown/20 scale-105'
                : 'bg-white/50 text-brand-brown/60 hover:bg-white hover:text-brand-brown border border-brand-brown/5'
            }`}
          >
            <tab.icon size={20} className={activeTab === tab.id ? 'text-brand-pink' : ''} />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <div className="editorial-card glass-panel overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'menu' && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {atmospherePhoto && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full h-40 rounded-2xl overflow-hidden mb-2 relative"
                    >
                      <img src={atmospherePhoto} alt="Evening atmosphere" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/10 to-transparent" />
                      <div className="absolute bottom-4 left-5">
                        <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-brand-brown/50">Tonight's atmosphere</span>
                      </div>
                    </motion.div>
                  )}
                  <div className="flex justify-between items-end border-b border-brand-brown/5 pb-6">
                    <h3 className="text-4xl tracking-tight">The Tasting Edit</h3>
                    <button
                      onClick={() => {
                        if (isEditingMenu) {
                          handleSaveMenu();
                        }
                        setIsEditingMenu(!isEditingMenu);
                      }}
                      className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 hover:text-brand-pink transition-colors"
                    >
                      {isEditingMenu ? 'Save' : 'Edit'}
                    </button>
                  </div>
                  <ul className="space-y-6">
                    {(isEditingMenu ? localMenu : dynamicVibe.menu).map((item, i) => (
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="flex items-center gap-6"
                      >
                        <span className="text-brand-pink font-serif italic text-2xl opacity-40 w-8 shrink-0">0{i + 1}</span>
                        <div className="flex-1">
                          {isEditingMenu ? (
                            <input
                              type="text"
                              className="w-full bg-transparent border-b border-brand-brown/10 py-2 text-2xl font-serif italic text-brand-brown/80 focus:outline-none focus:border-brand-pink transition-colors"
                              value={item}
                              onChange={(e) => {
                                setLocalMenu(localMenu.map((m, j) => j === i ? e.target.value : m));
                              }}
                            />
                          ) : (
                            <>
                              <span className="text-2xl font-serif italic leading-tight text-brand-brown/80">{item}</span>
                              <div className="h-px bg-brand-brown/5 mt-4 w-full" />
                            </>
                          )}
                        </div>
                        {isEditingMenu && (
                          <button
                            onClick={() => {
                              setLocalMenu(localMenu.filter((_, j) => j !== i));
                            }}
                            className="text-brand-brown/20 hover:text-red-400 transition-colors text-xl leading-none flex-none"
                          >
                            ×
                          </button>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                  {isEditingMenu && (
                    <button
                      onClick={() => {
                        setLocalMenu([...localMenu, '']);
                      }}
                      className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/30 hover:text-brand-pink transition-colors flex items-center gap-2 pt-2"
                    >
                      + Add item
                    </button>
                  )}
                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleSaveMenu}
                        className="btn-primary flex items-center gap-2 py-3 px-6 text-sm"
                      >
                        Save Menu
                      </button>
                      {menuSaved && (
                        <motion.span
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[10px] uppercase tracking-widest font-bold text-brand-pink"
                        >
                          Menu saved
                        </motion.span>
                      )}
                    </div>
                    <button
                      onClick={handlePrint}
                      className="btn-secondary flex items-center gap-3 group"
                    >
                      <Printer size={18} />
                      <span>Print Menu Cards</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'playlist' && (
                <motion.div
                  key="playlist"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-16"
                >
                  <div className="flex justify-between items-end border-b border-brand-brown/5 pb-8">
                    <h3 className="text-5xl tracking-tight">Sonic Journey</h3>
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-brand-brown/30">Atmospheric Audio</span>
                  </div>
                  <div className="grid grid-cols-1 gap-10">
                    {[
                      { label: 'Arrival', vibe: dynamicVibe.playlist.arrival, color: 'bg-brand-pink/5' },
                      { label: 'The Peak', vibe: dynamicVibe.playlist.peak, color: 'bg-brand-brown text-white' },
                      { label: 'Closing', vibe: dynamicVibe.playlist.closing, color: 'bg-brand-pink/5' }
                    ].map((phase, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={phase.label}
                        className={`p-10 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-8 ${phase.color}`}
                      >
                        <div className="text-center md:text-left">
                          <span className={`text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block ${phase.color.includes('text-white') ? 'text-brand-pink' : 'text-brand-pink'}`}>
                            {phase.label}
                          </span>
                          <p className="text-4xl font-serif italic tracking-tight">{phase.vibe}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${phase.color.includes('text-white') ? 'border-white/20' : 'border-brand-brown/10'}`}>
                          <Music size={20} className={phase.color.includes('text-white') ? 'text-white' : 'text-brand-brown'} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'decor' && (
                <motion.div
                  key="decor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-10"
                >
                  {/* Large prominent photo — full width */}
                  <AnimatePresence mode="wait">
                    {atmospherePhoto ? (
                      <motion.div
                        key={atmospherePhoto}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.6 }}
                        className="w-full aspect-[16/9] rounded-[2rem] overflow-hidden shadow-xl shadow-brand-brown/15 relative group"
                      >
                        <img
                          src={atmospherePhoto}
                          alt="Atmosphere"
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/30 to-transparent" />
                      </motion.div>
                    ) : (
                      <div className="w-full aspect-[16/9] rounded-[2rem] bg-brand-brown/5 border border-dashed border-brand-brown/10 flex flex-col items-center justify-center gap-3 text-brand-brown/20">
                        <Palette size={36} strokeWidth={1} />
                        <p className="text-[10px] uppercase tracking-widest font-bold">Choose a photo below</p>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Atmosphere description */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-4xl tracking-tight">Atmosphere</h3>
                      <button
                        onClick={() => {
                          if (isEditingDecor) {
                            // Saving: commit localDecor to dynamicVibe and gathering
                            setDynamicVibe({ ...dynamicVibe, decor: localDecor });
                            saveToGathering({ customDecor: localDecor });
                          } else {
                            // Entering edit: sync localDecor from current value
                            setLocalDecor(dynamicVibe.decor);
                          }
                          setIsEditingDecor(!isEditingDecor);
                        }}
                        className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 hover:text-brand-pink transition-colors"
                      >
                        {isEditingDecor ? 'Save' : 'Edit Details'}
                      </button>
                    </div>
                    {isEditingDecor ? (
                      <textarea
                        className="w-full bg-white/50 border border-brand-brown/10 rounded-2xl p-6 text-xl font-serif leading-relaxed text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-pink/20 min-h-[160px] shadow-inner"
                        value={localDecor}
                        onChange={(e) => setLocalDecor(e.target.value)}
                      />
                    ) : (
                      <p className="text-2xl font-serif leading-relaxed text-brand-brown/70 italic">
                        "{dynamicVibe.decor}"
                      </p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="pt-6 border-t border-brand-brown/5 space-y-8">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleSaveAtmosphere}
                        className="btn-primary flex items-center gap-2 py-3 px-6 text-sm"
                      >
                        Save Atmosphere
                      </button>
                      {atmosphereSaved && (
                        <motion.span
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[10px] uppercase tracking-widest font-bold text-brand-pink"
                        >
                          Atmosphere saved
                        </motion.span>
                      )}
                    </div>
                    <button
                      onClick={generateNewDecor}
                      className="btn-secondary flex items-center gap-3 group"
                    >
                      <RefreshCw size={18} className="group-hover:rotate-90 transition-transform" />
                      <span>New Suggestion</span>
                    </button>

                    <div className="space-y-4">
                      <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-brand-brown/30">Choose a photo</p>
                      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                        {ATMOSPHERE_PRESETS.map((preset) => (
                          <button
                            key={preset.url}
                            onClick={() => selectPreset(preset.url)}
                            className={`flex-none w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                              selectedPresetUrl === preset.url
                                ? 'ring-2 ring-brand-pink ring-offset-2 scale-105'
                                : 'opacity-60 hover:opacity-100 hover:scale-105'
                            }`}
                          >
                            <img src={preset.url} alt={preset.alt} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => atmosphereUploadRef.current?.click()}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-brand-brown/40 hover:text-brand-pink transition-colors group"
                      >
                        <Upload size={14} className="group-hover:scale-110 transition-transform" />
                        Upload your own photo
                      </button>
                      <input
                        ref={atmosphereUploadRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAtmosphereUpload}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Spring Mood — separate card below */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="editorial-card glass-panel border-brand-blue/10 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-blue/10 flex items-center justify-center">
                  <CloudSun className="text-brand-blue" size={14} />
                </div>
                {isEditingMoodTitle ? (
                  <input
                    type="text"
                    className="bg-transparent border-b border-brand-blue/30 text-[10px] uppercase tracking-[0.3em] text-brand-blue font-bold focus:outline-none w-28"
                    value={localMoodTitle}
                    onChange={(e) => setLocalMoodTitle(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.3em] text-brand-blue font-bold">{gathering.customSeasonName || season} Mood</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (isEditingMoodTitle) {
                      saveToGathering({ customSeasonName: localMoodTitle });
                    } else {
                      setLocalMoodTitle(gathering.customSeasonName || season);
                    }
                    setIsEditingMoodTitle(!isEditingMoodTitle);
                  }}
                  className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/20 hover:text-brand-blue transition-colors"
                >
                  {isEditingMoodTitle ? 'Save' : 'Edit'}
                </button>
                <button onClick={generateNewSeasonal} className="text-brand-blue/30 hover:text-brand-blue transition-colors group" title="Refresh">
                  <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Seasonal Menu', key: 'menu' as const },
                { label: 'Atmosphere',    key: 'decor' as const },
                { label: 'Soundscape',   key: 'playlist' as const },
              ].map((item) => (
                <div key={item.key} className="group bg-white/60 border border-brand-brown/5 rounded-2xl p-4 hover:border-brand-blue/20 transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-brand-brown/30 font-bold">{item.label}</span>
                    <button
                      onClick={() => {
                        if (isEditingSeason[item.key]) {
                          // Saving: persist the current local value to gathering
                          saveToGathering({
                            [item.key === 'menu' ? 'seasonalMenu' : item.key === 'decor' ? 'seasonalAtmosphere' : 'seasonalSoundscape']: seasonalSuggestions[item.key]
                          });
                        }
                        setIsEditingSeason({ ...isEditingSeason, [item.key]: !isEditingSeason[item.key] });
                      }}
                      className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/20 group-hover:text-brand-blue transition-colors"
                    >
                      {isEditingSeason[item.key] ? 'Save' : 'Edit'}
                    </button>
                  </div>
                  {isEditingSeason[item.key] ? (
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-brand-blue/30 py-1 text-sm font-serif italic focus:outline-none focus:border-brand-blue text-brand-brown"
                      value={seasonalSuggestions[item.key]}
                      onChange={(e) => {
                        setSeasonalSuggestions({ ...seasonalSuggestions, [item.key]: e.target.value });
                      }}
                    />
                  ) : (
                    <p className="text-sm font-serif italic text-brand-brown/70 leading-relaxed">{seasonalSuggestions[item.key]}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        <div className="lg:col-span-5 flex flex-col">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="editorial-card glass-panel flex-1"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-pink/10 flex items-center justify-center">
                  <Sparkles className="text-brand-pink" size={16} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand-pink font-bold">The Ritual</span>
              </div>
              <button
                onClick={() => {
                  setSelectedRitualId('skip');
                  saveToGathering({ selectedRitualId: 'skip' });
                }}
                className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${selectedRitualId === 'skip' ? 'text-brand-pink' : 'text-brand-brown/30 hover:text-brand-pink'}`}
              >
                Skip
              </button>
            </div>

            <p className="text-sm font-serif text-brand-brown/60 mb-8 leading-relaxed">Select a ritual to ground your evening in intention and connection.</p>

            {selectedRitualId !== 'skip' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {ritualOptions.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedRitualId(r.title);
                        setCustomRitualText(r.description);
                        saveToGathering({ selectedRitualId: r.title, customRitualText: r.description });
                      }}
                      className={`w-full text-left p-6 rounded-2xl border transition-all duration-500 group ${
                        selectedRitualId === r.title
                          ? 'bg-brand-pink/5 border-brand-pink shadow-md shadow-brand-pink/10'
                          : 'bg-white/50 border-brand-brown/5 hover:border-brand-pink/20 hover:bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h5 className={`font-serif italic text-2xl transition-colors ${selectedRitualId === r.title ? 'text-brand-pink' : 'text-brand-brown group-hover:text-brand-pink'}`}>
                          {r.title}
                        </h5>
                        {selectedRitualId === r.title && <Sparkles size={16} className="text-brand-pink animate-pulse" />}
                      </div>
                      <p className={`text-sm font-serif leading-relaxed transition-opacity ${selectedRitualId === r.title ? 'text-brand-brown/80' : 'text-brand-brown/50'}`}>
                        {r.description}
                      </p>
                    </button>
                  ))}
                </div>

                {selectedRitualId !== 'skip' && (
                  <div className="pt-8 border-t border-brand-brown/5">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] uppercase tracking-widest text-brand-pink font-bold">Personalize</span>
                      <button
                        onClick={() => {
                          if (isEditingRitual) {
                            saveToGathering({ customRitualText });
                          }
                          setIsEditingRitual(!isEditingRitual);
                        }}
                        className="text-[10px] uppercase tracking-widest font-bold text-brand-brown/40 hover:text-brand-pink transition-colors"
                      >
                        {isEditingRitual ? 'Save' : 'Edit'}
                      </button>
                    </div>
                    {isEditingRitual ? (
                      <textarea
                        className="w-full bg-white/50 border border-brand-brown/10 rounded-xl p-4 text-sm text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-pink/20 min-h-[100px]"
                        placeholder="Add a personal note or intention for your guests..."
                        value={customRitualText}
                        onChange={(e) => setCustomRitualText(e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-serif italic text-brand-brown/70 leading-relaxed bg-brand-pink/5 p-4 rounded-xl border border-brand-pink/10">
                        {customRitualText ? `"${customRitualText}"` : <span className="opacity-40">Add a personal note or intention for your guests...</span>}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center bg-brand-brown/5 rounded-3xl border border-dashed border-brand-brown/10">
                <p className="text-sm font-serif italic text-brand-brown/40 mb-6">Ritual skipped for this gathering.</p>
                <button
                  onClick={() => setSelectedRitualId(null)}
                  className="btn-secondary text-[10px] py-3"
                >
                  Add a Ritual
                </button>
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* Printable Menu Card */}
      <div className="print-only fixed inset-0 bg-white z-[100] p-16 flex flex-col items-center text-center">
        <div className="w-full max-w-2xl border-[1px] border-brand-brown/10 p-16 flex flex-col items-center min-h-[800px]">
          <div className="text-brand-pink mb-12">
            <Utensils size={48} strokeWidth={1} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-brand-brown/40 mb-4 font-bold">The Supper Edit</span>
          <h1 className="text-6xl mb-16 leading-tight tracking-tighter">{gathering.title}</h1>

          <div className="w-12 h-px bg-brand-brown/20 mb-16" />

          <div className="space-y-12 w-full">
            <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-brand-pink mb-8">The Tasting Menu</h2>
            <ul className="space-y-10">
              {dynamicVibe.menu.map((item, i) => (
                <li key={i} className="flex flex-col items-center">
                  <span className="text-3xl font-serif italic mb-3">{item}</span>
                  <div className="w-6 h-px bg-brand-brown/10" />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-16">
            <p className="text-sm font-serif italic text-brand-brown/60">
              {new Date(gathering.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
