// /app/api/bonus-report/route.ts (Next.js 13+)
import { NextResponse } from "next/server";
import { fetchBonusReport } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");

  try {
    const reports = await fetchBonusReport({
      user_id: user_id ? Number(user_id) : undefined,
      start_date: start_date ?? undefined,
      end_date: end_date ?? undefined,
    });
    return NextResponse.json(reports);
  } catch (err: any) {
    console.error("API /bonus-report error:", err); // 👈 log
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

