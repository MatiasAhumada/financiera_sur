import { prisma } from "@/lib/prisma";

export type FinancingPlanData = { name: string; description: string; active?: boolean; displayOrder?: number };
export const financingPlanRepository = {
  findAll() { return prisma.financingPlan.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], include: { _count: { select: { products: true } } } }); },
  findById(id: string) { return prisma.financingPlan.findUnique({ where: { id } }); },
  create(data: FinancingPlanData) { return prisma.financingPlan.create({ data }); },
  update(id: string, data: Partial<FinancingPlanData>) { return prisma.financingPlan.update({ where: { id }, data }); },
  delete(id: string) { return prisma.financingPlan.delete({ where: { id } }); },
};
