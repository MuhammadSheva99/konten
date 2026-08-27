import Sidebar from "@/components/Sidebar";
import { mockUser } from "@/lib/mockData";

// CATATAN: sementara pakai mockUser supaya frontend bisa dijalankan tanpa
// database/login. Nanti kalau siap sambung ke backend, ganti balik ke
// getServerSession(authOptions) + redirect("/login") seperti sebelumnya.

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const role = mockUser.role;

  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar userName={mockUser.name} role={role} />
      <main className="flex-1 min-w-0 px-8 py-7">{children}</main>
    </div>
  );
}
