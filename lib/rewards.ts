export type Reward = {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  tierRequired: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
};

export const REWARDS: Reward[] = [
  {
    id: '1',
    name: 'VIP Sauce Drop',
    description: 'Exclusive access to the limited edition sauce.',
    pointsRequired: 500,
    tierRequired: 1,
    rarity: 'rare',
    icon: '🌶️',
  },
  {
    id: '2',
    name: 'Double Shot Multiplier',
    description: '2x points for 24 hours.',
    pointsRequired: 1000,
    tierRequired: 2,
    rarity: 'epic',
    icon: '⚡',
  },
  {
    id: '3',
    name: 'Priority Line Access',
    description: 'Skip the queue at any location.',
    pointsRequired: 5000,
    tierRequired: 3,
    rarity: 'legendary',
    icon: '🎫',
  },
  {
    id: '4',
    name: 'Free Drink',
    description: 'One free drink of your choice.',
    pointsRequired: 100,
    tierRequired: 0,
    rarity: 'common',
    icon: '🥤',
  },
  {
    id: '5',
    name: 'Mystery Sticker Pack',
    description: 'A pack of random stickers.',
    pointsRequired: 200,
    tierRequired: 0,
    rarity: 'common',
    icon: '🏷️',
  },
  {
    id: '6',
    name: 'Golden Ticket',
    description: 'Entry into the grand prize draw.',
    pointsRequired: 10000,
    tierRequired: 5,
    rarity: 'legendary',
    icon: '🎫',
  },
  {
    id: '7',
    name: 'Secret Menu Access',
    description: 'Unlock hidden items on the menu.',
    pointsRequired: 2500,
    tierRequired: 2,
    rarity: 'epic',
    icon: '🤫',
  },
  {
    id: '8',
    name: 'Mascot Plushie',
    description: 'A cute plushie of your favorite mascot.',
    pointsRequired: 3000,
    tierRequired: 3,
    rarity: 'epic',
    icon: '🧸',
  },
];

export const perks = REWARDS; // Alias for backward compatibility if needed
