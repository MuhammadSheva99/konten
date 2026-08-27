"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      const role = data.role;
      if (role === "ADMIN") {
        Cookies.set("admin_session", JSON.stringify(data), { expires: 1 });
        router.push("/master-data");
      } else if (role === "PIC") {
        Cookies.set("pic_session", JSON.stringify(data), { expires: 1 });
        router.push("/portal");
      } else {
        setError("Akun ini tidak memiliki akses ke portal ini");
      }
    } catch {
      setError("Gagal koneksi ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b12] px-4">
      <div className="w-full max-w-md bg-panel border border-white/10 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-white">Konten Manager</h1>
          <p className="text-sm text-muted mt-1">Masuk untuk mengakses dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="stat-label block mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-transparent border border-white/20 text-white placeholder:text-muted focus:border-accent"
            />
          </div>
          <div>
            <label className="stat-label block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-transparent border border-white/20 text-white placeholder:text-muted focus:border-accent"
            />
          </div>
          {error && <p className="text-xs text-bad font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60 bg-accent hover:opacity-90"
          >
            {loading ? "Memuat..." : "Masuk Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
