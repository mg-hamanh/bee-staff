// /app/api/bonus-report/route.ts (Next.js 13+)
import { NextRequest, NextResponse } from "next/server";
import { fetchBonusReport } from "@/app/api/bonus-report/controller";
import { getCompareRange } from "@/utils/formatters";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const userId = body.userId;
  const period = body.period;
  const data = getCompareRange(period);

  try {
    const reports =
    await fetchBonusReport({
      userId: userId,
      date: data,
    });
    return NextResponse.json(reports);
  } catch (err: any) {
    console.error("API /bonus-report error:", err); // 👈 log
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

