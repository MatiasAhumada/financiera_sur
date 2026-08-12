"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/common/AdminSidebar";
import type { SidebarItem } from "@/interfaces/sidebar.interface";
import { FinancingPlansView } from "@/components/admin/FinancingPlansView";
import type { Inquiry } from "@/interfaces/inquiry.interface";
import type { AdminProduct } from "@/interfaces/product.interface";
import { inquiryClientService } from "@/services/inquiry.service";
import { clientErrorHandler } from "@/utils/handlers/clientHandler";
import { toastNotification } from "@/utils/toast.util";
import { ADMIN_NOTIFICATION_POLL_INTERVAL_MS } from "@/constants/admin.constant";
import { productClientService } from "@/services/product.service";
import { sessionClientService } from "@/services/session.service";
import { ROUTES } from "@/constants/routes";

const tabs: SidebarItem[] = [{ key: "overview", label: "Resumen" }, { key: "inquiries", label: "Consultas" }, { key: "products", label: "Productos" }, { key: "plans", label: "Financiación" }];

export function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const previousUnreadCount = useRef(0);
  const navigation = tabs.map((item) => item.key === "inquiries" ? { ...item, badge: unreadCount } : item);

  useEffect(() => {
    const load = async () => {
      try {
        const [inquiryResponse, productsResponse] = await Promise.all([inquiryClientService.list(), productClientService.list()]);
        setInquiries(inquiryResponse.data.items); setUnreadCount(inquiryResponse.data.unreadCount);
        if (inquiryResponse.data.unreadCount > previousUnreadCount.current) toastNotification("Nuevas consultas", { description: `Hay ${inquiryResponse.data.unreadCount} consultas sin revisar.` });
        previousUnreadCount.current = inquiryResponse.data.unreadCount;
        setProducts(productsResponse.data);
      } catch (error) { clientErrorHandler(error); } finally { setLoading(false); }
    };
    void load(); const timer = window.setInterval(() => { void load(); }, ADMIN_NOTIFICATION_POLL_INTERVAL_MS); return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (active !== "inquiries" || unreadCount < 1) return;
    void inquiryClientService.markAllAsRead().then(() => { setUnreadCount(0); previousUnreadCount.current = 0; setInquiries((items) => items.map((item) => ({ ...item, isRead: true }))); }).catch(clientErrorHandler);
  }, [active, unreadCount]);

  async function logout() { await sessionClientService.remove(); window.location.assign(ROUTES.LOGIN); }
  const newInquiries = inquiries.filter((item) => item.status === "NEW").length;
  return <main className="min-h-screen bg-[#F8F5EE] text-[#0B274E]"><AdminSidebar items={navigation} activeKey={active} onSelect={setActive} /><div className="lg:pl-72"><header className="flex items-center justify-between border-b border-[#0B274E]/10 bg-[#F8F5EE]/85 px-6 py-5 backdrop-blur lg:px-12"><div><p className="text-xs font-bold uppercase tracking-[.28em] text-[#8B702F]">Del Sur · Admin</p><h1 className="mt-2 font-serif text-4xl">{tabs.find((tab) => tab.key === active)?.label}</h1></div><Button variant="outline" className="rounded-full border-[#0B274E]/20" onClick={logout}>Cerrar sesión</Button></header><div className="flex gap-2 overflow-x-auto border-b border-[#0B274E]/10 px-6 py-3 lg:hidden">{navigation.map((tab) => <button key={tab.key} onClick={() => setActive(tab.key)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs ${active === tab.key ? "bg-[#0B274E] text-white" : "bg-[#0B274E]/5"}`}>{tab.label}{tab.badge ? ` (${tab.badge})` : ""}</button>)}</div><motion.section key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-12">{loading ? <div className="rounded-2xl bg-white p-10 text-sm text-[#0B274E]/50">Cargando datos reales…</div> : active === "overview" ? <div className="grid gap-6 md:grid-cols-3"><Metric label="Consultas totales" value={inquiries.length} /><Metric label="Nuevas" value={newInquiries} accent /><Metric label="Productos publicados" value={products.filter((item) => item.published).length} /><div className="md:col-span-3 rounded-3xl bg-[#0B274E] p-8 text-white"><p className="text-xs uppercase tracking-[.25em] text-[#EBC05A]">Actividad reciente</p><h2 className="mt-3 font-serif text-3xl">{inquiries.length ? `Hay ${inquiries.length} consultas registradas.` : "Todavía no hay consultas registradas."}</h2><button onClick={() => setActive("inquiries")} className="mt-6 text-sm text-[#FFDB5A] underline-offset-4 hover:underline">Ver historial →</button></div></div> : active === "inquiries" ? <InquiryTable items={inquiries} /> : active === "products" ? <EntityList title="Productos" empty="Todavía no hay productos creados." items={products.map((item) => `${item.name} · ${item.published ? "Publicado" : "Borrador"}`)} /> : <FinancingPlansView />}</motion.section></div></main>;
}
function Metric({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) { return <div className={`rounded-3xl p-7 ${accent ? "bg-[#EBC05A]" : "bg-white"}`}><p className="text-xs uppercase tracking-[.2em] opacity-55">{label}</p><p className="mt-4 font-serif text-5xl">{value}</p></div>; }
function InquiryTable({ items }: { items: Inquiry[] }) { return <div className="overflow-hidden rounded-3xl bg-white"><div className="border-b border-[#0B274E]/10 p-6"><h2 className="font-serif text-3xl">Historial de consultas</h2><p className="mt-2 text-sm text-[#0B274E]/55">Las filas doradas todavía no fueron revisadas.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-[#0B274E]/10 text-xs uppercase tracking-wider text-[#0B274E]/45"><th className="p-5">Fecha</th><th className="p-5">Nombre</th><th className="p-5">Contacto</th><th className="p-5">Producto</th><th className="p-5">Estado</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className={`border-b border-[#0B274E]/10 last:border-0 ${item.isRead ? "" : "bg-[#EBC05A]/20"}`}><td className="p-5">{new Date(item.createdAt).toLocaleDateString("es-AR")}</td><td className="p-5 font-semibold">{item.name}</td><td className="p-5">{item.email}<br />{item.phone}</td><td className="p-5">{item.product?.name ?? "General"}</td><td className="p-5">{item.status}</td></tr>)}</tbody></table></div>{items.length < 1 ? <p className="p-12 text-center text-[#0B274E]/50">No hay consultas para mostrar.</p> : null}</div>; }
function EntityList({ title, empty, items }: { title: string; empty: string; items: string[] }) { return <div className="rounded-3xl bg-white p-6"><h2 className="font-serif text-3xl">{title}</h2>{items.length ? <div className="mt-6 grid gap-3">{items.map((item) => <div key={item} className="rounded-2xl border border-[#0B274E]/10 p-4 text-sm">{item}</div>)}</div> : <p className="mt-10 rounded-2xl bg-[#F8F5EE] p-8 text-center text-sm text-[#0B274E]/50">{empty}</p>}</div>; }
