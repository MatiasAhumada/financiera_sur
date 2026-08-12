"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/utils/toast.util";

export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/sessions", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), password }) });
      if (!response.ok) { const message = "El email o la contraseña no son correctos."; setError(message); toastError(message); return; }
      toastSuccess("Sesión iniciada", { description: "Redirigiendo al panel administrativo." });
      window.location.assign("/admin");
    } catch { const message = "No pudimos conectar con el servidor."; setError(message); toastError(message); } finally { setLoading(false); }
  }
  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B274E] px-5 py-10 text-[#0B274E]"><div className="pointer-events-none absolute -left-40 -top-40 size-[32rem] rounded-full bg-[#EBC05A]/10 blur-3xl" /><div className="pointer-events-none absolute -bottom-40 -right-40 size-[32rem] rounded-full bg-[#EBC05A]/10 blur-3xl" /><motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="relative w-full max-w-md rounded-[2rem] bg-[#F8F5EE] px-7 py-8 shadow-[0_30px_90px_rgba(0,0,0,.28)] sm:px-10 sm:py-10"><div className="flex justify-center"><div className="rounded-2xl bg-[#0B274E] px-5 py-2 shadow-lg"><Image src="/brand/logo-del-sur.png" alt="Del Sur Financiera" width={280} height={150} className="h-auto w-64 object-contain" priority /></div></div><div className="mt-8 text-center"><p className="text-[11px] font-bold uppercase tracking-[.3em] text-[#8B702F]">Panel administrativo</p><h1 className="mt-4 font-serif text-5xl leading-none tracking-[-.04em]">Iniciar sesión</h1><p className="mt-4 text-sm text-[#0B274E]/55">Ingresá para continuar con la gestión de Del Sur.</p></div><form onSubmit={submit} className="mt-9 grid gap-5 text-left"><label className="grid gap-2 text-sm font-semibold">Email<input required value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="admin@del-sur.local" className="rounded-xl border border-[#0B274E]/15 bg-white/60 px-4 py-3 outline-none transition focus:border-[#8B702F] focus:ring-2 focus:ring-[#EBC05A]/30" /></label><label className="grid gap-2 text-sm font-semibold">Contraseña<input required value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" placeholder="••••••••••••" className="rounded-xl border border-[#0B274E]/15 bg-white/60 px-4 py-3 outline-none transition focus:border-[#8B702F] focus:ring-2 focus:ring-[#EBC05A]/30" /></label>{error && <p role="alert" className="rounded-xl bg-red-950/10 px-4 py-3 text-sm text-red-800">{error}</p>}<motion.div whileHover={{ y: -2 }} whileTap={{ scale: .98 }}><Button disabled={loading} size="lg" className="w-full rounded-xl bg-[#0B274E] text-white shadow-lg hover:bg-[#143964]">{loading ? "Ingresando…" : "Ingresar al panel"} ↗</Button></motion.div></form><a href="/" className="mt-7 block text-center text-sm text-[#0B274E]/55 transition hover:text-[#8B702F]">← Volver al sitio</a></motion.section></main>;
}
