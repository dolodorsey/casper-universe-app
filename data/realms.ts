export type Realm = {
    id: string;
    name: string;
    tagline: string;
    accent: string;
};

export const REALMS: Realm[] = [
    { id: 'angel-wings', name: 'Angel Wings', tagline: 'Crispy. Loud. Legendary.', accent: '#F5C542' },
    { id: 'patty-daddy', name: 'Patty Daddy', tagline: 'Thick. Juicy. Illegal.', accent: '#FF5A5F' },
    { id: 'taco-yaki', name: 'Taco Yaki', tagline: 'Fire meets flavor.', accent: '#6DFFB8' },
];
