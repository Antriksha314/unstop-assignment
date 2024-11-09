import { NextResponse } from "next/server";
import axios from "axios";

const SEAT_API_URL = process.env.SERVER_API_URL + '/seat/cancel';

// To handle a PUT request to /api/seat/cancel
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.put(SEAT_API_URL, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to cancel seat booking' }, { status: 500 });
  }
}