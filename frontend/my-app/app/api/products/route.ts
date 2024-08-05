// app/api/products/route.ts
import { NextResponse } from "next/server";
import { apiFetch } from "../../../lib/utils";

export async function GET() {
  try {
    const products = await apiFetch("/products");
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
    console.log("RouteError: ", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
