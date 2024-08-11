import { NextResponse } from "next/server";
import { apiFetch } from "../../../../../lib/utils";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Extract the ID from the request parameters
    const { id } = params;

    console.log("Delete Route Request ID: ", id);

    await apiFetch(`/customers/${id}`, {
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

export const dynamic = "force-dynamic";
