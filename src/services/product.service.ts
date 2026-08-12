import clientAxios from "@/utils/clientAxios.util";
import { API_ROUTES } from "@/constants/routes";
import type { AdminProduct } from "@/interfaces/product.interface";

export const productClientService = {
  list() { return clientAxios.get<AdminProduct[]>(API_ROUTES.ADMIN.PRODUCTS); },
};
