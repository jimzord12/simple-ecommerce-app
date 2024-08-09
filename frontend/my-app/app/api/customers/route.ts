// app/api/products/route.ts
import { NextResponse } from "next/server";
import { apiFetch } from "../../../lib/utils";

export async function GET() {
  try {
    const products = await apiFetch("/products");
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export const fetchCache = "force-no-store";
