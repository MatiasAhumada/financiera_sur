"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  AdminSidebar,
  type SidebarItem,
} from "@/components/common/AdminSidebar";
import { FinancingPlansView } from "@/components/admin/FinancingPlansView";
import type { Inquiry } from "@/interfaces/inquiry.interface";
import type { AdminProduct } from "@/interfaces/product.interface";
import type { FinancingPlan } from "@/interfaces/financingPlan.interface";
async function logout() {
  await fetch("/api/sessions", { method: "DELETE" });
  window.location.href = "/login";
}
const tabs: SidebarItem[] = [
  { key: "overview", label: "Resumen" },
  { key: "inquiries", label: "Consultas" },
  { key: "products", label: "Productos" },
  { key: "plans", label: "Financiación" },
];
export function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [plans, setPlans] = useState<FinancingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      fetch("/api/admin/inquiries"),
      fetch("/api/admin/products"),
      fetch("/api/admin/financing-plans"),
    ])
      .then(async ([inquiriesResponse, productsResponse, plansResponse]) => {
        if (inquiriesResponse.ok) setInquiries(await inquiriesResponse.json());
        if (productsResponse.ok) setProducts(await productsResponse.json());
        if (plansResponse.ok) setPlans(await plansResponse.json());
      })
      .finally(() => setLoading(false));
  }, []);
  const newInquiries = inquiries.filter((item) => item.status === "NEW").length;
  return (
    <main className="min-h-screen bg-[#F8F5EE] text-[#0B274E]">
      <AdminSidebar items={tabs} activeKey={active} onSelect={setActive} />
      <aside className="hidden">
        <a href="/">
          <Image
            src="/brand/logo-del-sur.png"
            alt="Del Sur Financiera"
            width={190}
            height={102}
            className="h-20 w-auto object-contain"
          />
        </a>
        <nav className="grid gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`rounded-xl px-4 py-3 text-left text-sm transition ${active === tab.key ? "bg-[#EBC05A] font-bold text-[#0B274E]" : "text-white/65 hover:bg-white/10 hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="grid gap-3 text-xs text-white/45">
          <span>Panel administrativo</span>
          <a href="/" className="transition hover:text-[#FFDB5A]">
            ← Volver al sitio
          </a>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="flex items-center justify-between border-b border-[#0B274E]/10 bg-[#F8F5EE]/85 px-6 py-5 backdrop-blur lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.28em] text-[#8B702F]">
              Del Sur · Admin
            </p>
            <h1 className="mt-2 font-serif text-4xl">
              {tabs.find((tab) => tab.key === active)?.label}
            </h1>
          </div>
          <Button
            variant="outline"
            className="rounded-full border-[#0B274E]/20"
            onClick={logout}
          >
            Cerrar sesión
          </Button>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-[#0B274E]/10 px-6 py-3 lg:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs ${active === tab.key ? "bg-[#0B274E] text-white" : "bg-[#0B274E]/5"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <motion.section
          key={active}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-12"
        >
          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-sm text-[#0B274E]/50">
              Cargando datos reales…
            </div>
          ) : active === "overview" ? (
            <div className="grid gap-6 md:grid-cols-3">
              <Metric label="Consultas totales" value={inquiries.length} />
              <Metric label="Nuevas" value={newInquiries} accent />
              <Metric
                label="Productos publicados"
                value={products.filter((item) => item.published).length}
              />
              <div className="md:col-span-3 rounded-3xl bg-[#0B274E] p-8 text-white">
                <p className="text-xs uppercase tracking-[.25em] text-[#EBC05A]">
                  Actividad reciente
                </p>
                <h2 className="mt-3 font-serif text-3xl">
                  {inquiries.length
                    ? `Hay ${inquiries.length} consultas registradas.`
                    : "Todavía no hay consultas registradas."}
                </h2>
                <button
                  onClick={() => setActive("inquiries")}
                  className="mt-6 text-sm text-[#FFDB5A] underline-offset-4 hover:underline"
                >
                  Ver historial →
                </button>
              </div>
            </div>
          ) : active === "inquiries" ? (
            <InquiryTable items={inquiries} />
          ) : active === "products" ? (
            <EntityList
              title="Productos"
              empty="Todavía no hay productos creados."
              items={products.map(
                (item) =>
                  `${item.name} · ${item.published ? "Publicado" : "Borrador"}`,
              )}
            />
          ) : active === "plans" ? (
            <FinancingPlansView />
          ) : (
            <EntityList
              title="Planes de financiación"
              empty="Todavía no hay planes creados."
              items={plans.map(
                (item) =>
                  `${item.name} · ${item.active ? "Activo" : "Inactivo"}`,
              )}
            />
          )}
        </motion.section>
      </div>
    </main>
  );
}
function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-3xl p-7 ${accent ? "bg-[#EBC05A]" : "bg-white"}`}>
      <p className="text-xs uppercase tracking-[.2em] opacity-55">{label}</p>
      <p className="mt-4 font-serif text-5xl">{value}</p>
    </div>
  );
}
function InquiryTable({ items }: { items: Inquiry[] }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white">
      <div className="border-b border-[#0B274E]/10 p-6">
        <h2 className="font-serif text-3xl">Historial de consultas</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#0B274E]/10 text-xs uppercase tracking-wider text-[#0B274E]/45">
              <th className="p-5">Fecha</th>
              <th className="p-5">Nombre</th>
              <th className="p-5">Contacto</th>
              <th className="p-5">Producto</th>
              <th className="p-5">Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#0B274E]/10 last:border-0"
              >
                <td className="p-5">
                  {new Date(item.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="p-5 font-semibold">{item.name}</td>
                <td className="p-5">
                  {item.email}
                  <br />
                  {item.phone}
                </td>
                <td className="p-5">{item.product?.name ?? "General"}</td>
                <td className="p-5">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && (
        <p className="p-12 text-center text-[#0B274E]/50">
          No hay consultas para mostrar.
        </p>
      )}
    </div>
  );
}
function EntityList({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl">{title}</h2>
        <Button disabled className="rounded-full bg-[#0B274E] text-white">
          Nuevo
        </Button>
      </div>
      {items.length ? (
        <div className="mt-6 grid gap-3">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[#0B274E]/10 p-4 text-sm"
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl bg-[#F8F5EE] p-8 text-center text-sm text-[#0B274E]/50">
          {empty}
        </p>
      )}
    </div>
  );
}
