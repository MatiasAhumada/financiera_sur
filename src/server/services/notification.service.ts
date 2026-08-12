import { inquiryRepository } from "@/server/repository/inquiry.repository";
import axios from "axios";
import { EXTERNAL_API_ROUTES } from "@/constants/external-api.constant";

export async function notifyInquiry(inquiry: { id: string; name: string; email: string; phone: string; message: string | null; product?: { name: string } | null }) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.INQUIRY_RECIPIENT;
  if (!apiKey || !recipient) return;
  try {
    await axios.post(EXTERNAL_API_ROUTES.RESEND_EMAILS, { from: process.env.EMAIL_FROM ?? "Financiera del Sur <onboarding@resend.dev>", to: [recipient], subject: `Nueva consulta de ${inquiry.name}`, html: `<h2>Nueva consulta</h2><p><b>Nombre:</b> ${inquiry.name}</p><p><b>Email:</b> ${inquiry.email}</p><p><b>Teléfono:</b> ${inquiry.phone}</p><p><b>Producto:</b> ${inquiry.product?.name ?? "General"}</p><p>${inquiry.message ?? "Sin mensaje"}</p>` }, { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } });
    await inquiryRepository.updateNotification(inquiry.id, { status: "SENT" });
  } catch (error) {
    await inquiryRepository.updateNotification(inquiry.id, { status: "FAILED", error: error instanceof Error ? error.message : "Error desconocido" });
  }
}
