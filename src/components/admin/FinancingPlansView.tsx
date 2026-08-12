"use client";
import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GenericModal, ConfirmModal } from "@/components/common";
import { financingPlanClientService } from "@/services/financingPlan.service";
import { clientErrorHandler } from "@/utils/handlers/clientHandler";

import type { FinancingPlanForm, FinancingPlanResponse } from "@/interfaces/financingPlan.interface";
const emptyForm: FinancingPlanForm = {
  name: "",
  description: "",
  active: true,
  displayOrder: 0,
};

export function FinancingPlansView() {
  const [plans, setPlans] = useState<FinancingPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FinancingPlanForm>(emptyForm);
  const [editing, setEditing] = useState<FinancingPlanResponse | null>(null);
  const [deleting, setDeleting] = useState<FinancingPlanResponse | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  async function load() {
    const response = await financingPlanClientService.list();
    setPlans(response.data);
  }
  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);
  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm });
    setError("");
    setFormOpen(true);
  }
  function openEdit(plan: FinancingPlanResponse) {
    setEditing(plan);
    setForm({
      name: plan.name,
      description: plan.description,
      active: plan.active,
      displayOrder: plan.displayOrder,
    });
    setError("");
    setFormOpen(true);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) await financingPlanClientService.update(editing.id, form);
      else await financingPlanClientService.create(form);
    } catch (requestError) {
      clientErrorHandler(requestError, () => setError("No se pudo guardar el plan."));
      setSaving(false);
      return;
    }
    setSaving(false);
    await load();
    setEditing(null); setForm({ ...emptyForm }); setFormOpen(false);
  }
  async function remove() {
    if (!deleting) return;
    setSaving(true);
    try {
      await financingPlanClientService.remove(deleting.id);
      setPlans((current) => current.filter((plan) => plan.id !== deleting.id));
      setDeleting(null);
    } catch (requestError) { clientErrorHandler(requestError); } finally { setSaving(false); }
  }
  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-[#0B274E] p-7 text-white sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[.25em] text-[#EBC05A]">
            Catálogo financiero
          </p>
          <h2 className="mt-2 font-serif text-4xl">Planes de financiación</h2>
          <p className="mt-2 text-sm text-white/60">
            Creá alternativas claras para asociarlas a tus productos.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="rounded-full bg-[#EBC05A] text-[#0B274E] hover:bg-[#FFDB5A]"
        >
          Nuevo plan +
        </Button>
      </div>
      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-sm text-[#0B274E]/50">
          Cargando planes…
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center">
          <p className="font-serif text-3xl">Todavía no hay planes.</p>
          <p className="mt-2 text-sm text-[#0B274E]/50">
            El primer plan que crees aparecerá aquí.
          </p>
          <Button
            onClick={openCreate}
            className="mt-6 rounded-full bg-[#0B274E] text-white"
          >
            Crear primer plan
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${plan.active ? "bg-[#EBC05A]/25 text-[#80651F]" : "bg-[#0B274E]/10 text-[#0B274E]/50"}`}
                  >
                    {plan.active ? "Activo" : "Inactivo"}
                  </span>
                  <h3 className="mt-4 font-serif text-3xl">{plan.name}</h3>
                </div>
                <span className="font-serif text-3xl text-[#D8CC88]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 min-h-12 text-sm leading-6 text-[#0B274E]/60">
                {plan.description}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-[#0B274E]/10 pt-4 text-xs text-[#0B274E]/50">
                <span>{plan._count?.products ?? 0} productos asociados</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => openEdit(plan)}
                    className="font-semibold text-[#8B702F] hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleting(plan)}
                    className="font-semibold text-red-700 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
      <GenericModal
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
            setForm({ ...emptyForm });
            setFormOpen(false);
          }
        }}
        title={editing ? "Editar plan" : "Nuevo plan"}
        description="Esta información se guardará en PostgreSQL."
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(null);
                setForm({ ...emptyForm });
                setFormOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                document
                  .getElementById("financing-plan-form")
                  ?.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true }),
                  )
              }
              disabled={saving}
            >
              {saving ? "Guardando…" : "Guardar plan"}
            </Button>
          </>
        }
      >
        <form id="financing-plan-form" onSubmit={submit} className="grid gap-5">
          <label className="grid gap-2 text-sm text-white">
            Nombre
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-[#EBC05A]"
            />
          </label>
          <label className="grid gap-2 text-sm text-white">
            Descripción
            <textarea
              required
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              rows={4}
              className="resize-none rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-[#EBC05A]"
            />
          </label>
          <div className="flex items-center gap-3 text-sm text-white">
            <input
              id="plan-active"
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm({ ...form, active: event.target.checked })
              }
            />
            <label htmlFor="plan-active">Plan activo</label>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>
      </GenericModal>
      <ConfirmModal
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Eliminar plan"
        description={`¿Querés eliminar “${deleting?.name ?? ""}”? Esta acción no se puede deshacer.`}
        onConfirm={remove}
        loading={saving}
        variant="destructive"
      />
    </div>
  );
}
