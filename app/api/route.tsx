import { getData } from "@/lib/database";
import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(request: Request) {
  // Do whatever you want
  const data = await getData();
  return NextResponse.json(data, { status: 200 });
}
