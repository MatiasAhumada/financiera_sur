import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getSessionFromToken } from "@/server/services/auth.service";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ds_session")?.value;
  if (!token || !(await getSessionFromToken(token))) redirect("/login");
  return <AdminDashboard />;
}
