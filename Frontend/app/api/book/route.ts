import { NextResponse } from "next/server";
import axios from "axios";

const SEAT_API_URL = process.env.NEXT_PUBLIC_API_URL + '/seat/book';
// To handle a POST request to /api/seat/book
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post(SEAT_API_URL, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to book seat' }, { status: 500 });
  }
}