
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

import type { Product } from "../types";
import ImagePlaceholder from "../../shared/ImagePlaceholder";
import SectionReveal from "../../shared/SectionReveal";

type ProductsContent = {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  imageLabel: string;
  imageNote: string;
  viewProduct: string;
};

type ProductsSectionProps = {
  content: ProductsContent;
  products: Product[];
};

function ProductCard({
  product,
  content,
  index,
}: {
  product: Product;
  content: ProductsContent;
  index: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="group"
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-[#E9EEF3]">
          {product.image ? (
            <div className="aspect-[4/4.5] overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-contain p-8 transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
          ) : (
            <ImagePlaceholder
              label={`${product.name} — ${content.imageLabel}`}
              note={content.imageNote}
              number={String(index + 1).padStart(2, "0")}
              className="aspect-[4/4.5] border-0"
            />
          )}

          <span className="absolute start-4 top-4 bg-white px-3 py-2 text-[10px] font-bold tracking-wider text-[#66778A]">
            {product.category}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-[#DCE4EC] py-5">
          <div>
            <h3 className="text-lg font-bold tracking-[-0.03em] text-[#062F5E] transition-colors group-hover:text-[#02488F]">
              {product.name}
            </h3>
            <p className="mt-2 line-clamp-2 max-w-[260px] text-xs leading-6 text-[#66778A]">{product.shortDescription}</p>
            <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.12em] text-[#02488F]">{content.viewProduct}<ArrowUpRight size={12} /></span>
          </div>

          <span className="flex size-10 shrink-0 items-center justify-center border border-[#DCE4EC] text-[#02488F] transition-all group-hover:border-[#02488F] group-hover:bg-[#02488F] group-hover:text-white">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function ProductsSection({
  content,
  products,
}: ProductsSectionProps) {
  return (
    <section id="products" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <SectionReveal>
          <div className="grid gap-8 border-b border-[#E1E7EE] pb-12 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <div className="mb-7 flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-[#FF7A0A]">
                <span className="h-px w-9 bg-[#FF7A0A]" />
                {content.eyebrow}
              </div>

              <h2 className="max-w-[620px] text-4xl font-extrabold tracking-[-0.05em] text-[#062F5E] md:text-6xl">
                {content.title}
              </h2>
            </div>

            <p className="max-w-[480px] text-sm leading-8 text-[#66778A] md:text-base">
              {content.description}
            </p>
          </div>
        </SectionReveal>

        {products.length > 0 ? (
          <div className="grid gap-x-6 gap-y-12 pt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <SectionReveal key={product.id} delay={(index % 4) * 0.06}>
                <ProductCard
                  product={product}
                  content={content}
                  index={index}
                />
              </SectionReveal>
            ))}
          </div>
        ) : (
          <div className="my-12 grid min-h-[280px] place-items-center border border-dashed border-[#CCD7E2] bg-[#F8FAFC] px-6 py-14 text-center">
            <div className="max-w-md">
              <span className="mx-auto mb-5 flex size-12 items-center justify-center bg-[#E8EEF4] text-[#02488F]">
                <ArrowUpRight size={21} />
              </span>
              <h3 className="text-xl font-bold text-[#062F5E]">
                {content.emptyTitle}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#66778A]">
                {content.emptyDescription}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
