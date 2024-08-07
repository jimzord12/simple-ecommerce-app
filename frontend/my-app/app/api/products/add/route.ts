import { NextResponse } from "next/server";
import { apiFetch } from "../../../../lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Route Request Body: ", JSON.stringify(body));
    const product = await apiFetch("/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Extract the response data
    return NextResponse.json(product);
  } catch (error) {
    console.log("RouteError: ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic'
