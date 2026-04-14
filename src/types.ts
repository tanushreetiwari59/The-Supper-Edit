export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Gathering {
  id: string;
  userId: string;
  title: string;
  archetype: string;
  guestCount: number;
  socialIntent: string;
  inviteMode: string;
  date: string;
  hostName?: string;
  accentColor?: string;
  decorIcon?: string;
  theme?: 'Minimal' | 'Editorial' | 'Romantic' | 'Vintage';
  warmupPrompt?: string;
  customHostingStyle?: string;
  selectedRitualId?: string;
  customRitualText?: string;
  seasonalMenu?: string;
  seasonalAtmosphere?: string;
  seasonalSoundscape?: string;
  customMenu?: string[];
  customDecor?: string;
  customSeasonName?: string;
  typographyStyle?: 'Editorial' | 'Modern' | 'Romantic Script' | 'Minimal';
  frameStyle?: string;
  memory?: {
    photo?: string;
    highlight?: string;
    vibeWord?: string;
  };
  guestSlug?: string;
  atmospherePhoto?: string;
  customArchetype?: string;
}

export const HOST_PERSONALITIES = {
  "Wine & Small Plates": {
    title: "The Curator",
    description: "You have an eye for detail and a palate for the unexpected. Your gatherings are a gallery of flavors and fine moments."
  },
  "Slow Brunch Social": {
    title: "The Connector",
    description: "You believe the best conversations happen over coffee and morning light. You bring people together with warmth and ease."
  },
  "Experimental Tasting Evening": {
    title: "The Explorer",
    description: "You treat every meal as a voyage. You're not afraid to push boundaries and invite your guests into a new sensory world."
  },
  "Comfort Supper Gathering": {
    title: "The Host",
    description: "You are the heart of the home. Your gatherings are built on tradition, deep comfort, and the simple joy of being together."
  }
};

export const SUPPER_RITUALS = [
  {
    title: "The First Pour",
    description: "Each guest shares one highlight from their week before the first drink is served."
  },
  {
    title: "The Table Question",
    description: "The host asks a meaningful question to start the conversation—something that can't be answered in one word."
  },
  {
    title: "The Memory Bite",
    description: "Each guest shares a dish that reminds them of childhood or a significant travel memory."
  },
  {
    title: "The Gratitude Round",
    description: "Before dessert, each person takes a moment to thank someone else at the table for something specific."
  }
];

export const SEASONAL_POOLS = {
  Spring: {
    menu: ["citrus desserts", "fresh garden salads", "pea and mint crostini", "lemon herb chicken"],
    decor: ["floral table accents", "bright linens", "open windows with natural light", "pastel ceramics"],
    playlist: ["acoustic indie", "soft morning jazz", "nature soundscapes", "folk instrumentals"]
  },
  Summer: {
    menu: ["chilled stone fruits", "grilled herbs", "heirloom tomato salad", "iced botanical teas"],
    decor: ["natural light", "wild meadow flowers", "outdoor terrace setting", "linen textures"],
    playlist: ["upbeat bossa nova", "sunset soul", "tropical house", "reggae classics"]
  },
  Autumn: {
    menu: ["roasted vegetable platters", "spiced tarts", "pumpkin risotto", "mulled cider"],
    decor: ["candlelight tables", "deep earth tones", "dried leaf arrangements", "golden hour lighting"],
    playlist: ["warm jazz", "nostalgic folk", "cello suites", "indie acoustic"]
  },
  Winter: {
    menu: ["slow-cooked stews", "dark chocolate", "rustic bread boards", "red wine reductions"],
    decor: ["heavy linen runners", "soft amber lighting", "cozy dim lighting", "pine accents"],
    playlist: ["classical piano", "ambient drone", "holiday classics", "deep soul"]
  }
};

export const WARMUP_PROMPTS = [
  "Bring a song recommendation that feels like this evening.",
  "Bring a childhood food memory to share.",
  "Bring a question for the table.",
  "Bring a small object that represents your current mood."
];

export const THEMES = {
  Minimal: {
    font: 'font-sans',
    border: 'border-none',
    color: '#3D2B1F'
  },
  Editorial: {
    font: 'font-serif',
    border: 'border-[1px] border-brand-brown/10',
    color: '#FF69B4'
  },
  Romantic: {
    font: 'font-serif italic',
    border: 'border-[8px] border-double border-brand-pink/20',
    color: '#E67E22'
  },
  Vintage: {
    font: 'font-serif',
    border: 'border-[12px] border-brand-beige',
    color: '#3D2B1F'
  }
};

export const VIBE_POOLS = {
  menu: [
    "Burrata with roasted grapes",
    "Ricotta crostini",
    "Citrus marinated olives",
    "Fig & honey cheese board",
    "Charred peach salad",
    "Heirloom tomato galette",
    "Sourdough with cultured butter",
    "Seasonal fruit platter",
    "Shakshuka with feta"
  ],
  arrival: [
    "soft jazz",
    "ambient piano",
    "indie instrumental",
    "Jazz instrumentals",
    "Soft acoustic",
    "Minimalist electronic"
  ],
  peak: [
    "upbeat bossa nova",
    "disco classics",
    "soulful R&B",
    "Warm funk",
    "Experimental synth",
    "Indie folk"
  ],
  closing: [
    "acoustic folk",
    "dreamy electronic",
    "Ambient soul",
    "Classical piano",
    "Deep drone",
    "Nostalgic ballads"
  ],
  decor: [
    "Use oversized wooden serving boards layered with soft linen runners. Add mismatched vintage glassware and tapered candles in warm tones to create a relaxed yet intimate table setting.",
    "Layer neutral linen table runners with ceramic plates and natural wood accents. Add a few candles or small floral stems to create a warm, conversational dinner atmosphere.",
    "Create a moody, candlelit environment using deep burgundy tapered candles and dark linen napkins. Scatter small herb sprigs across the table for a subtle, organic touch.",
    "Opt for a minimalist approach with a clean white linen tablecloth and architectural floral arrangements. Use focused spotlighting to highlight the textures of your ceramic dinnerware.",
    "Bring the outdoors in with wild meadow flowers in simple ceramic jars. Use bright linen napkins and natural morning light to create a fresh, airy social atmosphere.",
    "Set a rustic tone with heavy linen runners and antique silverware. Use warm string lights and cozy throws on chairs to ensure guests feel comfortable and at home.",
    "Focus on tactile elements like textured ceramic plates and rough-hewn wooden accents. Add a single, dramatic floral stem in a tall glass vase for a touch of refined elegance.",
    "Embrace a vintage aesthetic with lace table runners and delicate porcelain plates. Use soft amber lighting and small clusters of dried flowers to evoke a sense of nostalgia."
  ]
};

export const ARCHETYPES = [
  "Wine & Small Plates",
  "Slow Brunch Social",
  "Experimental Tasting Evening",
  "Comfort Supper Gathering"
];

export const SOCIAL_INTENTS = [
  "Bonding",
  "Creative Exchange",
  "Networking",
  "Chill Catch-up",
  "Cultural Exploration"
];

export const INVITE_MODES = ["Private", "Request-based"];

export const TYPOGRAPHY_STYLES = [
  { id: 'Editorial', label: 'Editorial', fontClass: 'font-serif' },
  { id: 'Modern', label: 'Modern', fontClass: 'font-sans font-bold uppercase tracking-tight' },
  { id: 'Romantic Script', label: 'Romantic Script', fontClass: 'font-script text-4xl' },
  { id: 'Minimal', label: 'Minimal', fontClass: 'font-sans font-light tracking-widest uppercase text-sm' },
] as const;

export const VIBE_DATA = {
  "Wine & Small Plates": {
    menu: ["Burrata with stone fruit", "Heirloom tomato galette", "Sourdough with cultured butter", "Natural wine pairings"],
    playlist: { arrival: "Jazz instrumentals", peak: "Upbeat bossa nova", closing: "Ambient soul" },
    decor: "Use mismatched vintage glassware and tapered candles in deep burgundy. Add low linen runners to create a relaxed yet intimate gallery-like setting for your wine pairings."
  },
  "Slow Brunch Social": {
    menu: ["Shakshuka with feta", "Seasonal fruit platter", "Cold brew and mimosas", "Almond croissants"],
    playlist: { arrival: "Soft acoustic", peak: "Indie folk", closing: "Classical piano" },
    decor: "Fill simple ceramic jars with wildflowers and use bright linen napkins. Let natural morning light flood the space to create a warm, airy atmosphere for your brunch."
  },
  "Experimental Tasting Evening": {
    menu: ["Deconstructed miso soup", "Beetroot tartare", "Smoked cauliflower", "Infused botanical spirits"],
    playlist: { arrival: "Minimalist electronic", peak: "Experimental synth", closing: "Deep drone" },
    decor: "Create a monochromatic table setting with architectural floral arrangements. Use focused spotlighting to highlight the experimental nature of your tasting menu."
  },
  "Comfort Supper Gathering": {
    menu: ["Slow-cooked ragu", "Polenta with parmesan", "Bitter leaf salad", "Dark chocolate torte"],
    playlist: { arrival: "Classic soul", peak: "Warm funk", closing: "Nostalgic ballads" },
    decor: "Layer oversized wooden serving boards with warm string lights. Add cozy throws on chairs to ensure your guests feel deeply comfortable and at home."
  }
};
