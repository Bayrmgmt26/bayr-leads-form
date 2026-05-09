import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json({
    success: true,
    message: "API route works",
    received: body
  });
}