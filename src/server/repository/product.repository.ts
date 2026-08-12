import { prisma } from "@/lib/prisma";

const productInclude = { images: { orderBy: { displayOrder: "asc" as const } }, financings: { include: { financingPlan: true }, orderBy: { displayOrder: "asc" as const } } } as const;
export interface ProductRepositoryData { name: string; slug: string; description: string; published: boolean; featured: boolean; displayOrder: number; financingPlanIds: string[]; }
export const productRepository = {
  findAll() { return prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: productInclude }); },
  findById(id: string) { return prisma.product.findUnique({ where: { id }, include: productInclude }); },
  findPublished() { return prisma.product.findMany({ where: { published: true }, include: productInclude, orderBy: [{ featured: "desc" }, { displayOrder: "asc" }] }); },
  findBySlug(slug: string) { return prisma.product.findFirst({ where: { slug, published: true }, include: productInclude }); },
  async create(data: ProductRepositoryData) {
    return prisma.$transaction(async (transaction) => {
      const product = await transaction.product.create({ data: { name: data.name, slug: data.slug, description: data.description, published: data.published, featured: data.featured, displayOrder: data.displayOrder } });
      if (data.financingPlanIds.length) await transaction.productFinancing.createMany({ data: data.financingPlanIds.map((financingPlanId, index) => ({ productId: product.id, financingPlanId, displayOrder: index })) });
      return product;
    });
  },
  addImage(data: { productId: string; objectKey: string; width: number; height: number; bytes: number; alt: string; displayOrder: number }) { return prisma.productImage.create({ data }); },
  delete(id: string) { return prisma.product.delete({ where: { id } }); },
};
