import { randomUUID } from "node:crypto";
import { productRepository } from "@/server/repository/product.repository";
import { r2StorageService } from "@/server/services/r2-storage.service";
import type { ProductForm } from "@/interfaces/product.interface";
import { IMAGE_UPLOAD_CONFIG, IMAGE_UPLOAD_MESSAGES } from "@/constants/image-upload.constant";
import { ApiError } from "@/utils/handlers/apiError.handler";
import httpStatus from "http-status";

function withPublicUrls<T extends { images: Array<{ objectKey: string }> }>(product: T) { return { ...product, images: product.images.map((image) => ({ ...image, url: r2StorageService.publicUrl(image.objectKey) })) }; }
export const productService = {
  async findAll() { const products = await productRepository.findAll(); return products.map(withPublicUrls); },
  async findById(id: string) { const product = await productRepository.findById(id); return product ? withPublicUrls(product) : null; },
  async create(data: ProductForm, files: File[]) {
    if (files.length > IMAGE_UPLOAD_CONFIG.MAX_IMAGES_PER_PRODUCT) throw new ApiError({ status: httpStatus.BAD_REQUEST, message: IMAGE_UPLOAD_MESSAGES.TOO_MANY_IMAGES });
    const product = await productRepository.create(data);
    const uploadedKeys: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        const key = `${IMAGE_UPLOAD_CONFIG.KEY_PREFIX}/${product.id}/${randomUUID()}.${IMAGE_UPLOAD_CONFIG.OUTPUT_FORMAT}`;
        const uploaded = await r2StorageService.uploadImage(Buffer.from(await file.arrayBuffer()), key);
        uploadedKeys.push(uploaded.key);
        await productRepository.addImage({ productId: product.id, objectKey: uploaded.key, width: uploaded.width, height: uploaded.height, bytes: uploaded.bytes, alt: data.name, displayOrder: index });
      }
      return productService.findById(product.id);
    } catch (error) {
      await Promise.all(uploadedKeys.map((key) => r2StorageService.deleteImage(key).catch(() => undefined)));
      await productRepository.delete(product.id).catch(() => undefined);
      throw error;
    }
  },
  async findPublished() { const products = await productRepository.findPublished(); return products.map(withPublicUrls); },
  async findBySlug(slug: string) { const product = await productRepository.findBySlug(slug); return product ? withPublicUrls(product) : null; },
};
