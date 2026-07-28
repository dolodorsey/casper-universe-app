export type Brand = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  vibe: string;
  primary: string;
};

export const brands: Brand[] = [
  { id: "1", slug: "angel-wings", name: "Angel Wings", tagline: "Heaven-sent heat", vibe: "Crispy + Divine", primary: "#F97316" },
  { id: "2", slug: "tha-morning-after", name: "Tha Morning After", tagline: "Wake up legendary", vibe: "Brunch + Recovery", primary: "#D89A2B" },
  { id: "3", slug: "patty-daddy", name: "Patty Daddy", tagline: "Bigger. Bolder. Daddy.", vibe: "Power + Flavor", primary: "#D7B46A" },
  { id: "4", slug: "espresso-co", name: "Espresso Co.", tagline: "Science of the perfect cup", vibe: "Speed + Focus", primary: "#8A6A3A" },
  { id: "5", slug: "mojo-juice", name: "Mojo Juice", tagline: "Fuel the ritual", vibe: "Fresh + Functional", primary: "#63A647" },
  { id: "6", slug: "mr-oyster", name: "Mr. Oyster", tagline: "The deep end of flavor", vibe: "Ocean + Occasion", primary: "#4C86A8" },
  { id: "7", slug: "sweet-tooth", name: "Sweet Tooth", tagline: "Indulgence engineered", vibe: "Dessert + Celebration", primary: "#D74B9B" },
  { id: "8", slug: "taco-yaki", name: "Taco Yaki", tagline: "Fire meets flavor", vibe: "Fusion + Crunch", primary: "#EF4444" },
  { id: "9", slug: "tossd", name: "Toss'd", tagline: "Fresh. Fast. No excuses.", vibe: "Wellness + Speed", primary: "#61A146" },
  { id: "10", slug: "pasta-bish", name: "Pasta Bish", tagline: "Comfort with attitude", vibe: "Sauce + Personality", primary: "#C9473E" },
  { id: "11", slug: "peace-pizza", name: "Peace Pizza", tagline: "Good slices. Good energy.", vibe: "Community + Sharing", primary: "#F28C28" },
  { id: "12", slug: "american-dragon", name: "American Dragon", tagline: "Luxury takeout. American fire.", vibe: "Gold + Night Market", primary: "#D9A52E" },
];
