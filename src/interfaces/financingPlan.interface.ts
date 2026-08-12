export interface FinancingPlan {
  id: string;
  name: string;
  description: string;
  active: boolean;
  displayOrder: number;
  productCount?: number;
}

export interface FinancingPlanResponse extends FinancingPlan {
  _count?: { products: number };
}

export interface FinancingPlanForm {
  name: string;
  description: string;
  active: boolean;
  displayOrder: number;
}
