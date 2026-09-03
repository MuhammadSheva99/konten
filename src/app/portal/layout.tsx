import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session.userId || session.role !== "PIC") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0b0b12] flex">
      <aside className="w-60 shrink-0 h-screen sticky top-0 border-r border-white/10 bg-panel flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="font-display font-bold text-white text-lg">Portal PIC</div>
          <div className="text-xs text-muted mt-0.5">Konten Manager</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link href="/portal" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white">
            Dashboard
          </Link>
          <Link href="/portal/posting" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white">
            Catat Posting
          </Link>
          <Link href="/portal/performance" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white">
            Performance
          </Link>
          <Link href="/portal/kpi" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white">
            KPI Saya
          </Link>
          <Link href="/portal/leaderboard" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white">
            Leaderboard
          </Link>
          <Link href="/portal/laporan-mingguan" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white">
            Laporan Mingguan
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="text-sm text-white font-medium truncate">{session.name}</div>
          <div className="text-xs text-muted mb-2">PIC</div>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
