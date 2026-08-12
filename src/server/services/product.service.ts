import { productRepository } from "@/server/repository/product.repository";
export const productService = { findAll: () => productRepository.findAll(), findPublished: () => productRepository.findPublished(), findBySlug: (slug: string) => productRepository.findBySlug(slug) };
