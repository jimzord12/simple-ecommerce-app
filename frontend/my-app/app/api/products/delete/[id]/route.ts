import { NextResponse } from "next/server";
import { apiFetch } from "../../../../../lib/utils";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the ID from the request parameters
    const { id } = params;

    console.log("Delete Route Request ID: ", id);

    await apiFetch(`/products/${id}`, {
      method: "DELETE",
    });

    // Extract the response data
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("DELETE RouteError: ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
