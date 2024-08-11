import { NextResponse } from "next/server";
import { apiFetch } from "../../../../lib/utils";

// CUSTOMERS
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Route Request Body: ", JSON.stringify(body));
    const customer = await apiFetch("/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Extract the response data
    return NextResponse.json(customer);
  } catch (error) {
    const myError = error as Error;
    console.log("RouteError: ", myError);
    return NextResponse.json({ error: myError.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
