import Link from "next/link";

const TABS = [
  { href: "/master-data/brand", label: "Brand" },
  { href: "/master-data/platform", label: "Platform" },
  { href: "/master-data/akun", label: "Akun" },
  { href: "/master-data/pic", label: "PIC" },
  { href: "/master-data/target-kpi", label: "Target KPI" },
];

export default function MasterDataLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Master Data</h1>
        <p className="text-muted text-sm mt-1">Kelola data induk: brand, platform, akun, PIC, dan target KPI</p>
      </div>
      <div className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="px-4 py-2.5 text-sm text-gray-300 hover:text-white border-b-2 border-transparent hover:border-accent transition"
          >
            {t.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
