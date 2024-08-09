import { NextResponse } from "next/server";
import { apiFetch } from "../../../../../lib/utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("GET Route Request ID: ", params.id);

    const customer = await apiFetch(`/products/${params.id}`);
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the ID from the request parameters
    const { id } = params;

    console.log("PUT Route Request ID: ", id);

    const resBody = await request.json();

    const updatedCustomer = await apiFetch(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(resBody),
      cache: "no-store",
    });

    // Extract the response data
    return new NextResponse(updatedCustomer, { status: 204 });
  } catch (error) {
    console.log("DELETE RouteError: ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
