export type MascotRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type Mascot = {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  rarity: MascotRarity;
  baseXp: number;
  image: any;
};

export const mascots: Mascot[] = [
  {
    id: 'loudini',
    brandId: 'angel-wings',
    name: 'Loudini',
    slug: 'Angel Wings',
    rarity: 'common',
    baseXp: 10,
    image: require('../assets/mascots/LOUDINI ANGEL WINGS MASCOT.png'),
  },
  {
    id: 'beanzo',
    brandId: 'espresso-co',
    name: 'Beanzo',
    slug: 'Espresso Co.',
    rarity: 'rare',
    baseXp: 12,
    image: require('../assets/mascots/BEANZO ESPRESSO MASCOT.png'),
  },
  {
    id: 'eggavier',
    brandId: 'tha-morning-after',
    name: 'Eggavier',
    slug: 'Tha Morning After',
    rarity: 'common',
    baseXp: 10,
    image: require('../assets/mascots/EGGAVIER MORINING AFTER MASCOT.png'),
  },
  {
    id: 'scrambalina',
    brandId: 'tha-morning-after',
    name: 'Scrambalina',
    slug: 'Tha Morning After',
    rarity: 'rare',
    baseXp: 12,
    image: require('../assets/mascots/SCRAMBALINA MORNING AFTER MASCOT.png'),
  },
  {
    id: 'yaki',
    brandId: 'taco-yaki',
    name: 'Yaki',
    slug: 'Taco Yaki',
    rarity: 'epic',
    baseXp: 16,
    image: require('../assets/mascots/YAKI TACO YAKI MASCOT.png'),
  },
  {
    id: 'paddy-daddy',
    brandId: 'patty-daddy',
    name: 'Paddy Daddy',
    slug: 'Patty Daddy',
    rarity: 'legendary',
    baseXp: 22,
    image: require('../assets/mascots/PADDY DADDY PATTY DADDY MASCOT.png'),
  },
  {
    id: 'sweetness',
    brandId: 'sweet-tooth',
    name: 'Sweetness',
    slug: 'Sweet Tooth',
    rarity: 'rare',
    baseXp: 12,
    image: require('../assets/mascots/SWEETNESS SWEET TOOTH MASCOT.png'),
  },
  {
    id: 'mojothemango',
    brandId: 'mojo-juice',
    name: 'Mojo the Mango',
    slug: 'MoJO',
    rarity: 'common',
    baseXp: 10,
    image: require('../assets/mascots/MOJOtheMango MOJO JUICE MASCOT.png'),
  },
  {
    id: 'miss-pearl',
    brandId: 'mr-oyster',
    name: 'Miss Pearl',
    slug: 'Mr. Oyster',
    rarity: 'epic',
    baseXp: 16,
    image: require('../assets/mascots/Miss Pearl MR OYSTER MASCOT.png'),
  },
  {
    id: 'mac-daddy',
    brandId: 'pasta-bish',
    name: 'Mac Daddy',
    slug: 'Pasta Bish',
    rarity: 'rare',
    baseXp: 12,
    image: require('../assets/mascots/MAC DADDY PASTA BISH MASCOT.png'),
  },
  {
    id: 'lil-linguine',
    brandId: 'pasta-bish',
    name: 'Lil Linguine',
    slug: 'Pasta Bish',
    rarity: 'common',
    baseXp: 10,
    image: require('../assets/mascots/LIL LINGUINE PASTA BISH MASCOT.png'),
  },
  {
    id: 'king-kale',
    brandId: 'tossd',
    name: 'King Kale',
    slug: 'Toss’d',
    rarity: 'common',
    baseXp: 10,
    image: require('../assets/mascots/KING KALE TOSSD MASCOT.png'),
  }
];
