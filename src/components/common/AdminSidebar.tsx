"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export interface SidebarItem {
  key: string;
  label: string;
}
interface AdminSidebarProps {
  items: SidebarItem[];
  activeKey: string;
  onSelect: (key: string) => void;
}
export function AdminSidebar({
  items,
  activeKey,
  onSelect,
}: AdminSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col justify-between bg-[#0B274E] p-7 text-white lg:flex">
      <a href="/">
        <Image
          src="/brand/logo-del-sur.png"
          alt="Del Sur Financiera"
          width={190}
          height={102}
          className="h-20 w-auto object-contain"
        />
      </a>
      <nav className="grid gap-2" aria-label="Navegación administrativa">
        {items.map((item) => (
          <motion.button
            key={item.key}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(item.key)}
            className={`rounded-xl px-4 py-3 text-left text-sm transition ${activeKey === item.key ? "bg-[#EBC05A] font-bold text-[#0B274E]" : "text-white/65 hover:bg-white/10 hover:text-white"}`}
          >
            {item.label}
          </motion.button>
        ))}
      </nav>
      <div className="grid gap-3 text-xs text-white/45">
        <span>Panel administrativo</span>
        <a href="/" className="transition hover:text-[#FFDB5A]">
          ← Volver al sitio
        </a>
      </div>
    </aside>
  );
}
