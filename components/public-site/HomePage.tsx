import type { AppLocale, HomeContent, Product } from "./types";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import ProductsSection from "./sections/ProductsSection";
import CommitmentSection from "./sections/CommitmentSection";
import ContactSection from "./sections/ContactSection";

type HomePageProps = {
  locale: AppLocale;
  content: HomeContent;
  products: Product[];
};

export default function HomePage({ locale, content, products }: HomePageProps) {
  return (
    <main lang={locale} className="overflow-hidden">
      <HeroSection content={content.hero} locale={locale} />
      <AboutSection content={content.about} locale={locale} />
      <ProductsSection content={content.products} products={products} />
      <CommitmentSection content={content.commitment} locale={locale} />
      <ContactSection content={content.contact} locale={locale} />
    </main>
  );
}
