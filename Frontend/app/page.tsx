"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import SeatBooking from '../components/SeatBooking';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Seat Booking App</title>
        <meta name="description" content="Seat Booking App using Next.js, TypeScript, and Tailwind CSS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center min-h-screen">
        <SeatBooking />
      </main>
    </div>
  );
};

export default Home;