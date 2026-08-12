export interface AdminProduct {
  id: string;
  name: string;
  published: boolean;
  slug: string;
  description?: string;
  featured?: boolean;
  displayOrder?: number;
  images?: ProductImageReference[];
  financings?: ProductFinancingReference[];
}

export interface ProductImageReference { id: string; objectKey: string; url: string; width: number; height: number; bytes: number; alt: string; displayOrder: number; }
export interface ProductFinancingReference { financingPlanId: string; financingPlan: { id: string; name: string; }; displayOrder: number; }
export interface ProductForm { name: string; slug: string; description: string; published: boolean; featured: boolean; displayOrder: number; financingPlanIds: string[]; }
