"use client";

import { useState } from "react";
import AkunRow from "./AkunRow";

type Option = { id: string; name: string };
type Akun = {
  id: string; username: string; status: "ACTIVE" | "INACTIVE"; category: "OFFICIAL" | "OUTLET"; apiConnected: boolean;
  brandId: string; platformId: string; picId: string | null;
  brand: { name: string }; platform: { name: string }; pic: { name: string } | null;
};

export default function AkunTableWithFilter({
  akunList,
  brands,
  platforms,
  pics,
}: {
  akunList: Akun[];
  brands: Option[];
  platforms: Option[];
  pics: Option[];
}) {
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "OFFICIAL" | "OUTLET">("ALL");

  const filtered = akunList.filter((a) =>
    categoryFilter === "ALL" ? true : a.category === categoryFilter
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-white/60">
          Menampilkan {filtered.length} dari {akunList.length} akun
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as "ALL" | "OFFICIAL" | "OUTLET")}
          className="bg-transparent border border-white/20 rounded px-3 py-1.5 text-white text-sm"
        >
          <option value="ALL" className="bg-black">Semua Kategori</option>
          <option value="OFFICIAL" className="bg-black">Official</option>
          <option value="OUTLET" className="bg-black">Outlet</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Brand</th>
            <th>Platform</th>
            <th>PIC</th>
            <th>Kategori</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => (
            <AkunRow key={a.id} akun={a} brands={brands} platforms={platforms} pics={pics} />
          ))}
        </tbody>
      </table>
    </div>
  );
}