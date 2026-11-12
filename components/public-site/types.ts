
export type AppLocale = "en" | "fa" | "ps";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  image?: string;
  featured?: boolean;
};

export type HomeContent = {
  nav: {
    home: string;
    about: string;
    products: string;
    commitment: string;
    contact: string;
    contactButton: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    primary: string;
    secondary: string;
    imageLabel: string;
    imageNote: string;
    vertical: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    link: string;
    imageLabel: string;
    imageNote: string;
  };
  products: {
    eyebrow: string;
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    imageLabel: string;
    imageNote: string;
    viewProduct: string;
  };
  commitment: {
    eyebrow: string;
    title: string;
    description: string;
    imageLabel: string;
    imageNote: string;
    points: {
      title: string;
      description: string;
    }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    detailsMessage: string;
  };
  footer: {
    statement: string;
    explore: string;
    copyright: string;
    backToTop: string;
  };
  languageNames: {
    en: string;
    fa: string;
    ps: string;
  };
};
