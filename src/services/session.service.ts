import clientAxios from "@/utils/clientAxios.util";
import { API_ROUTES } from "@/constants/routes";

export interface LoginInput { email: string; password: string; }
export const sessionClientService = {
  create(data: LoginInput) { return clientAxios.post(API_ROUTES.SESSIONS, data, { withCredentials: true }); },
  remove() { return clientAxios.delete(API_ROUTES.SESSIONS, { withCredentials: true }); },
};
