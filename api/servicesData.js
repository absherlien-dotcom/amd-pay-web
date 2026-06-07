export const AMD_PAY_SERVICES_DATA = {
  telecom: [
    "يمن موبايل",
    "يو MTN",
    "واي",
    "سبأفون الشمال",
    "سبأفون الجنوب",
    "يمن نت",
    "يمن نت ADSL",
    "عدن نت",
    "يمن فورجي"
  ],

  games: [
    "PUBG Mobile",
    "Free Fire",
    "Mobile Legends",
    "Roblox",
    "EA FC Mobile",
    "eFootball",
    "Genshin Impact",
    "Lords Mobile",
    "Farlight 84",
    "Blood Strike",
    "Undawn",
    "Minecraft",
    "Fortnite",
    "CrossFire"
  ],

  cards: [
    "iTunes",
    "Razer Gold",
    "PlayStation",
    "Steam",
    "Xbox",
    "Nintendo",
    "Amazon",
    "Netflix",
    "Shahid VIP"
  ],

  apps: [
    "TikTok",
    "Likee",
    "Bigo Live",
    "Poppo",
    "Kwai",
    "Imo",
    "Yalla Ludo",
    "Jawaker",
    "Hiyoo",
    "MIGO",
    "SUGO",
    "Yoki"
  ]
};

export function searchService(userMessage) {
  const text = String(userMessage || "").toLowerCase();

  const allServices = [
    ...AMD_PAY_SERVICES_DATA.telecom,
    ...AMD_PAY_SERVICES_DATA.games,
    ...AMD_PAY_SERVICES_DATA.cards,
    ...AMD_PAY_SERVICES_DATA.apps
  ];

  return allServices.filter(service =>
    text.includes(service.toLowerCase()) ||
    service.toLowerCase().includes(text)
  );
}
