const BRAND_GRAPHICS_BASE = 'https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics';

export const publicBrandAsset = (path: string) => `${BRAND_GRAPHICS_BASE}/${path}`;

export const CASPER_MEDIA_VERSION = '2026-08-06T23:49:50.035984Z';

export const CASPER_HERO_POSTER = publicBrandAsset('websites/graphics/CASPER_GROUP_GRAPHICS/CASPER_GRAPHICS/ChatGPT_Image_Aug_4_2026_03_13_37_AM_3_.png');
export const CASPER_HERO_MOTION = publicBrandAsset('kollective/animations/GIF/CASPER.gif');

export const CASPER_GALLERY = [
  'websites/graphics/CASPER_GROUP_GRAPHICS/CASPER_GRAPHICS/ChatGPT_Image_Aug_4_2026_03_13_37_AM_3_.png',
  'websites/graphics/CASPER_GROUP_GRAPHICS/CASPER_GRAPHICS/ChatGPT_Image_Aug_4_2026_03_24_27_AM_1_.png',
  'websites/graphics/CASPER_GROUP_GRAPHICS/CASPER_GRAPHICS/ChatGPT_Image_Aug_4_2026_03_08_51_AM_2_.png',
  'websites/graphics/CASPER_GROUP_GRAPHICS/CASPER_GRAPHICS/ChatGPT_Image_Aug_4_2026_03_57_21_AM_2_.png',
  'websites/graphics/CASPER_GROUP_GRAPHICS/CASPER_GRAPHICS/ChatGPT_Image_Aug_4_2026_03_20_10_AM_1_.png',
  'websites/graphics/CASPER_GROUP_GRAPHICS/CASPER_GRAPHICS/ChatGPT_Image_Aug_4_2026_03_12_53_AM_2_.png',
].map(publicBrandAsset);

export type RealmMedia = {
  motion: string;
  nativeFallback: string;
  kind: 'gif' | 'video';
};

const gif = (path: string): RealmMedia => ({
  motion: publicBrandAsset(path),
  nativeFallback: publicBrandAsset(path),
  kind: 'gif',
});

const video = (path: string, fallbackGif = 'kollective/animations/GIF/CASPER.gif'): RealmMedia => ({
  motion: publicBrandAsset(path),
  nativeFallback: publicBrandAsset(fallbackGif),
  kind: 'video',
});

// Pinned to the newest compatible media objects found in the approved public brand-graphics bucket.
export const REALM_MEDIA: Record<string, RealmMedia> = {
  'angel-wings': video('kollective/animations/CASPER_GROUP/ANGEL_MASCOT_ANI.mp4', 'kollective/animations/GIF/ANGEL_WINGS.gif'),
  'tha-morning-after': gif('kollective/animations/GIF/MORNING_AFTER.gif'),
  'patty-daddy': video('kollective/animations/PATTY_DADDY2.mp4', 'kollective/animations/GIF/PATTY_DADDY.gif'),
  'espresso-co': gif('kollective/animations/GIF/ESPRESSO_CO.gif'),
  'mojo-juice': video('kollective/animations/MOJO_JUICE.mp4', 'kollective/animations/GIF/MOJO_JUICE.gif'),
  'mr-oyster': gif('kollective/animations/GIF/MR_OYSTER.gif'),
  'sweet-tooth': video('kollective/animations/SWEET_TOOTH.mp4', 'kollective/animations/GIF/SWEET_TOOTH.gif'),
  'taco-yaki': video('kollective/animations/CASPER_GROUP/TACO_YAKI_ANI.mp4', 'kollective/animations/GIF/TACO_YAKI.gif'),
  'tossd': video('kollective/animations/CASPER_GROUP/TOSSD_ANI.mp4'),
  'pasta-bish': gif('kollective/animations/GIF/PASTA_BISH.gif'),
  'peace-pizza': video('kollective/animations/CASPER_GROUP/PEACE_PIZZA_ANI.mp4'),
  'american-dragon': video('kollective/animations/CASPER_GROUP/AMERICAN_DRAGON.mp4'),
};

export function realmMedia(id: string): RealmMedia {
  return REALM_MEDIA[id] ?? gif('kollective/animations/GIF/CASPER.gif');
}
