import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

import { prisma } from "./prisma";
import { Role } from "@prisma/client";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("Missing JWT_SECRET");

const secret = new TextEncoder().encode(jwtSecret);

interface Payload extends Record<string, unknown> {
  user: {
    id: string;
    role: Role;
    validUntil?: Date | null;
  };
  expires: Date;
}

export async function encrypt(payload: Payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function decrypt(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });
  return payload as Payload;
}

async function verifyUser(formData: FormData) {
  console.log(formData)
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email e senha são obrigatórios.");
  }

  try {
    const user = await prisma.user.findUnique({
      where: {email},
    });

    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error verifying user:", error);
    return null;
  }
}

export async function login(formData: FormData) {
  const user = await verifyUser(formData);

  if (!user) {
    return { error: "Invalid credentials" }
  }

  if (!user.isActive) {
    return { error: "Account is deactivated. Contact administrator." };
  }

  if (user.validUntil && user.validUntil < new Date()) {
    return { error: "Account is expired. Contact administrator." };
  }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt({ user, expires });

  const cookieStore = await cookies();
  cookieStore.set("session", session, { expires, httpOnly: true });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}

export async function getSession(): Promise<Payload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session) as Payload;
}

export async function updateSession(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie) return;

  const parsedSession = await decrypt(sessionCookie);
  parsedSession.expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Extend expiration by 24 hours

  const newSession = await encrypt(parsedSession);

  const cookieStore = await cookies();
  cookieStore.set("session", newSession, { expires: parsedSession.expires, httpOnly: true });

  return NextResponse.next();
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return !!session && session.user.role === Role.ADMIN;
}

export async function isViewer(): Promise<boolean> {
  const session = await getSession();
  return !!session && session.user.role === Role.VIEWER;
}