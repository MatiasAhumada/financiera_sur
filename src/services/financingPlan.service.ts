import clientAxios from "@/utils/clientAxios.util";
import { API_ROUTES } from "@/constants/routes";
import type { FinancingPlanForm, FinancingPlanResponse } from "@/interfaces/financingPlan.interface";

export const financingPlanClientService = {
  list() { return clientAxios.get<FinancingPlanResponse[]>(API_ROUTES.ADMIN.FINANCING_PLANS); },
  create(data: FinancingPlanForm) { return clientAxios.post<FinancingPlanResponse>(API_ROUTES.ADMIN.FINANCING_PLANS, data); },
  update(id: string, data: FinancingPlanForm) { return clientAxios.patch<FinancingPlanResponse>(API_ROUTES.ADMIN.FINANCING_PLAN(id), data); },
  remove(id: string) { return clientAxios.delete(API_ROUTES.ADMIN.FINANCING_PLAN(id)); },
};
