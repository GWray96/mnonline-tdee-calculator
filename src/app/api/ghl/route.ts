import { NextRequest, NextResponse } from "next/server";

const GHL_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/cKCRO6TbecmrUL2ZT57Y/webhook-trigger/97b0a2f5-2c47-42f2-a762-8294cdce1e87";

export type GHLPayload = {
  firstName: string;
  email: string;
  goal: string;
  goalCals: number;
  cutCals: number;
  bulkCals: number;
  tdee: number;
  bmr: number;
  bmi: string;
  proteinG: number;
  carbsG: number;
  fatG: number;
  gender: string;
  unit: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GHLPayload;
    const payload = {
      firstName: body.firstName,
      email: body.email,
      source: "TDEE Calculator",
      tags: ["tdee-calculator", "lead-magnet", `goal-${body.goal}`],
      tdee_goal_calories: body.goalCals,
      tdee_cut_calories: body.cutCals,
      tdee_bulk_calories: body.bulkCals,
      tdee_maintenance: body.tdee,
      tdee_bmr: body.bmr,
      tdee_bmi: body.bmi,
      tdee_protein_g: body.proteinG,
      tdee_carbs_g: body.carbsG,
      tdee_fat_g: body.fatG,
      tdee_goal: body.goal,
      tdee_gender: body.gender,
    };

    const res = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("GHL webhook error:", res.status, text);
      return NextResponse.json(
        { error: "Webhook failed", details: text },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("GHL API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
