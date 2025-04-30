// import { getCardWordData } from "@/lib/old";
import { NextResponse } from 'next/server';

// // To handle a GET request to /api
// export async function GET(request: Request) {
//   // Do whatever you want
//   const data = await getCardWordData();
//   return NextResponse.json(data, { status: 200 });
// }

// To handle a GET request to /api
export async function GET(request: Request) {
  // Return a simple response for now
  return NextResponse.json({ message: 'Hello from the API!' }, { status: 200 });
}
