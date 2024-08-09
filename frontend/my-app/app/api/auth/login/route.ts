import { NextResponse } from "next/server";
import { apiFetch } from "../../../../lib/utils";
import { error } from "console";

// LOGIN API ROUTE
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Route Request Body: ", JSON.stringify(body));
    const success = await apiFetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Extract the response data
    return NextResponse.json(success);
  } catch (error) {
    console.log("Type of Error: ", typeof error);
    console.log((error as { message: string }).message);
    console.log(
      "AAAA: ",
      (error as { message: string }).message.includes(
        "Invalid email or password"
      )
    );
    console.log("RouteError: ", error);
    if (
      (error as { message: string }).message.includes(
        "Invalid email or password"
      )
    ) {
      return NextResponse.json(
        { error: { message: "Invalid email or password" } },
        { status: 401 }
      );
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
