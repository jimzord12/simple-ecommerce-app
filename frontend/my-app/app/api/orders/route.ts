// CUSTOMERS
import { NextResponse } from "next/server";
import { apiFetch } from "../../../lib/utils";

export async function GET() {
  try {
    const orders = await apiFetch("/orders");
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export const fetchCache = "force-no-store";
