import type { Locale } from "@/lib/types";

const en = {
  nav: {
    home: "Home", about: "About Us", destinations: "Destinations", experiences: "Experiences",
    dayTours: "Day Tours", packages: "Packages", tailorMake: "Tailor-Make", reviews: "Reviews",
    gallery: "Gallery", blog: "Blog", contact: "Contact", account: "My Trips",
  },
  cta: { tailorMake: "Start Tailor-Make", packages: "Browse Packages", bookNow: "Book now", bookAsIs: "Book as-is", customize: "Customize" },
  heroKicker: "Sri Lanka · Tailor-made by local experts",
  sloganSub: "Real humans plan it. You just live it.",
} as const;

type Dict = {
  [K in keyof typeof en]: (typeof en)[K] extends Record<string, string>
    ? { [P in keyof (typeof en)[K]]: string }
    : string;
};

const de: Dict = {
  nav: {
    home: "Start", about: "Über uns", destinations: "Reiseziele", experiences: "Erlebnisse",
    dayTours: "Tagestouren", packages: "Pakete", tailorMake: "Maßreise", reviews: "Bewertungen",
    gallery: "Galerie", blog: "Blog", contact: "Kontakt", account: "Meine Reisen",
  },
  cta: { tailorMake: "Maßreise starten", packages: "Pakete ansehen", bookNow: "Jetzt buchen", bookAsIs: "Direkt buchen", customize: "Anpassen" },
  heroKicker: "Sri Lanka · Maßgeschneidert von lokalen Experten",
  sloganSub: "Echte Menschen planen. Du erlebst es einfach.",
};

const fr: Dict = {
  nav: {
    home: "Accueil", about: "À propos", destinations: "Destinations", experiences: "Expériences",
    dayTours: "Excursions", packages: "Forfaits", tailorMake: "Sur mesure", reviews: "Avis",
    gallery: "Galerie", blog: "Blog", contact: "Contact", account: "Mes voyages",
  },
  cta: { tailorMake: "Créer mon voyage", packages: "Voir les forfaits", bookNow: "Réserver", bookAsIs: "Réserver tel quel", customize: "Personnaliser" },
  heroKicker: "Sri Lanka · Sur mesure par des experts locaux",
  sloganSub: "De vraies personnes le planifient. Vous le vivez.",
};

const dicts = { en, de, fr };
export const LOCALES: Locale[] = ["en", "de", "fr"];
export function getDict(locale: string): typeof en {
  return (dicts as Record<string, typeof en>)[locale] ?? en;
}
