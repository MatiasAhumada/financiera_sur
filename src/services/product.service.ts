import clientAxios from "@/utils/clientAxios.util";
import { API_ROUTES } from "@/constants/routes";
import type { AdminProduct, ProductForm } from "@/interfaces/product.interface";

export const productClientService = {
  list() { return clientAxios.get<AdminProduct[]>(API_ROUTES.ADMIN.PRODUCTS); },
  create(data: ProductForm, images: File[]) {
    const formData = new FormData();
    formData.append("name", data.name); formData.append("slug", data.slug); formData.append("description", data.description); formData.append("published", String(data.published)); formData.append("featured", String(data.featured)); formData.append("displayOrder", String(data.displayOrder)); formData.append("financingPlanIds", JSON.stringify(data.financingPlanIds));
    images.forEach((image) => formData.append("images", image));
    return clientAxios.post<AdminProduct>(API_ROUTES.ADMIN.PRODUCTS, formData, { headers: { "Content-Type": "multipart/form-data" } });
  },
};
