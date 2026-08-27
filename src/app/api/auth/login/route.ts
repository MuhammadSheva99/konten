import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !user.password) {
    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  }

  if (!user.isActive) {
    return NextResponse.json({ error: "Akun ini dinonaktifkan. Hubungi admin." }, { status: 403 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role, // "ADMIN" | "PIC"
  });
}
