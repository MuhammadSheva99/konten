"use client";

import { useState, useTransition } from "react";
import { updateUserRole, toggleUserActive } from "./actions";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PIC";
  isActive: boolean;
};

export default function HakAksesClient({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isPending, startTransition] = useTransition();

  function handleRoleChange(id: string, role: "ADMIN" | "PIC") {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    startTransition(() => updateUserRole(id, role));
  }

  function handleToggleActive(id: string, currentActive: boolean) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: !currentActive } : u)));
    startTransition(() => toggleUserActive(id, !currentActive));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Hak Akses</h1>
        <p className="text-muted text-sm mt-1">
          <span className="text-accent">Admin</span> — akses penuh.{" "}
          <span className="text-accent2">PIC</span> — hanya akses modul miliknya sendiri.
        </p>
      </div>
      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="text-white">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    className="input py-1 text-xs w-auto"
                    value={u.role}
                    disabled={isPending}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as "ADMIN" | "PIC")}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="PIC">PIC</option>
                  </select>
                </td>
                <td>
                  <span className={`badge ${u.isActive ? "bg-good/15 text-good" : "bg-bad/15 text-bad"}`}>
                    {u.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td>
                  <button
                    className="text-xs text-muted hover:text-accent"
                    disabled={isPending}
                    onClick={() => handleToggleActive(u.id, u.isActive)}
                  >
                    {u.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
