import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/session";

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

  // Simpan session di server (signed, httpOnly)
  const session = await getSession();
  session.userId = user.id;
  session.name = user.name;
  session.username = user.username!;
  session.role = user.role;
  await session.save();

  return NextResponse.json({
    name: user.name,
    username: user.username,
    role: user.role,
  });
}