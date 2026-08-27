"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import Cookies from "js-cookie";

const NAV = [
  {
    group: "Overview",
    items: [{ href: "/", label: "Dashboard" }],
  },
  {
    group: "Data & Perencanaan",
    items: [
      { href: "/master-data", label: "Master Data" },
      { href: "/planner", label: "Request Konten" },
      { href: "/posting-tracker", label: "Posting Tracker" },
      { href: "/approval", label: "Approval Konten" },
      { href: "/draft-stock", label: "Monitoring Draft Konten" },
    ],
  },
  {
    group: "Analitik",
    items: [
      { href: "/performance", label: "Performance Tracker" },
      { href: "/kpi", label: "KPI Otomatis" },
      { href: "/funnel", label: "Funnel Analysis" },
      { href: "/monitoring", label: "Monitoring Akun" },
      { href: "/leaderboard", label: "Leaderboard" },
    ],
  },
  {
    group: "Sistem",
    items: [
      { href: "/reminder", label: "Reminder" },
      { href: "/laporan", label: "Laporan" },
      { href: "/hak-akses", label: "Hak Akses" },
      { href: "/activity-log", label: "Activity Log" },
    ],
  },
];

export default function Sidebar({ userName, role }: { userName: string; role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // lanjut aja meski request gagal, tetap bersihkan cookie di client
    }
    Cookies.remove("admin_session");
    Cookies.remove("pic_session");
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-surface flex flex-col">
      <div className="px-5 py-5 border-b border-border">
        <div className="font-display font-bold text-white text-lg tracking-tight">
          Konten Manager
        </div>
        <div className="text-xs text-muted mt-0.5">Content Ops Platform</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map((group) => (
          <div key={group.group}>
            <div className="px-2 mb-1.5 text-[10px] uppercase tracking-wider text-muted font-semibold">
              {group.group}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "block px-3 py-2 rounded-lg text-sm transition",
                      active
                        ? "bg-accent/15 text-accent font-medium"
                        : "text-gray-300 hover:bg-panel hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="text-sm text-white font-medium truncate">{userName}</div>
        <div className="text-xs text-muted mb-2">{role === "ADMIN" ? "Admin" : "PIC"}</div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-xs text-muted hover:text-bad transition disabled:opacity-50"
        >
          {loggingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </aside>
  );
}
