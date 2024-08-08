import { NextResponse } from "next/server";
import { apiFetch } from "../../../../lib/utils";
import { error } from "console";

// REGISTER API ROUTE
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Route Request Body: ", JSON.stringify(body));
    const success = await apiFetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Extract the response data
    return NextResponse.json(success);
  } catch (error) {
    console.log("RouteError: ", error);

    if (
      (error.message as string).includes(
        "duplicate key value violates unique constraint"
      )
    ) {
      return NextResponse.json(
        { error: { message: "User already exists" } },
        { status: 409 }
      );
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
