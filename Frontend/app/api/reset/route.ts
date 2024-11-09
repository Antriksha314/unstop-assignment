import { NextResponse } from "next/server";
import axios from "axios";

const SEAT_API_URL = process.env.NEXT_PUBLIC_API_URL + '/seat/reset';

// To handle a GET request to /api/seat/reset
export async function GET() {
  try {
    const response = await axios.get(SEAT_API_URL, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to reset seat data' }, { status: 500 });
  }
}