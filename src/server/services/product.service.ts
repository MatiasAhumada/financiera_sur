import { productRepository } from "@/server/repository/product.repository";
export const productService = { findPublished: () => productRepository.findPublished(), findBySlug: (slug: string) => productRepository.findBySlug(slug) };
