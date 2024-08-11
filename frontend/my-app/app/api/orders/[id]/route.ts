// app/api/products/route.ts
import { NextResponse } from "next/server";
import { apiFetch } from "../../../../lib/utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  // Extract the ID from the request parameters
  const { id } = params;
  console.log("Order ID: ", id);

  try {
    const order = await apiFetch("/orders/" + id, {
      cache: "no-store",
    });
    return NextResponse.json(order);
  } catch (error) {
    console.log("Error fetching order:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Extract the ID from the request parameters
    const { id } = params;

    console.log("Delete Route Request ID: ", id);

    await apiFetch(`/orders/${id}`, {
      method: "DELETE",
    });

    // Extract the response data
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const myError = error as Error;
    console.log("DELETE RouteError: ", error);
    return NextResponse.json({ error: myError.message }, { status: 500 });
  }
}

export const fetchCache = "force-no-store";
