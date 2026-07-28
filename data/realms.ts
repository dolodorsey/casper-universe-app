import { brands } from "./brands";

export type Realm = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
};

export const REALMS: Realm[] = brands.map((brand) => ({
  id: brand.slug,
  name: brand.name,
  tagline: brand.tagline,
  description: brand.vibe,
  accent: brand.primary,
}));
