export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN: "/admin",
} as const;

export const ROUTE_LABELS: Record<string, string> = {
  "": "Inicio",
  login: "Iniciar Sesión",
} as const;

export const API_ROUTES = {
  SESSIONS: "/api/sessions",
  INQUIRIES: "/api/inquiries",
  ADMIN: {
    INQUIRIES: "/api/admin/inquiries",
    INQUIRY: (id: string) => `/api/admin/inquiries/${id}`,
    PRODUCTS: "/api/admin/products",
    FINANCING_PLANS: "/api/admin/financing-plans",
    FINANCING_PLAN: (id: string) => `/api/admin/financing-plans/${id}`,
  },
} as const;
