import { prisma } from "@/lib/prisma";

export const productRepository = {
  findAll() { return prisma.product.findMany({ orderBy: { createdAt: "desc" } }); },
  findPublished() {
    return prisma.product.findMany({ where: { published: true }, include: { images: { orderBy: { displayOrder: "asc" }, take: 1 }, financings: { include: { financingPlan: true }, orderBy: { displayOrder: "asc" } } }, orderBy: [{ featured: "desc" }, { displayOrder: "asc" }] });
  },
  findBySlug(slug: string) {
    return prisma.product.findFirst({ where: { slug, published: true }, include: { images: { orderBy: { displayOrder: "asc" } }, financings: { include: { financingPlan: true }, orderBy: { displayOrder: "asc" } } } });
  },
};
