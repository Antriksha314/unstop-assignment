/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";

// Seat interface to define the structure of a seat object.
interface Seat {
  _id: string;
  seatNumber: string;
  status: string;
  id: number;
}

const SeatBooking: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]); // Stores seat data
  const [seatCount, setSeatCount] = useState<number>(1); // Stores selected number of seats
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Controls modal visibility
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]); // Stores booked seat indices
  const [isClient, setIsClient] = useState<boolean>(false); // Tracks if the component is mounted on the client

  // Fetch seat data from API on component mount.
  useEffect(() => {
    setIsClient(true);
    fetchSeats();
  }, []);

  // Fetch seat data from API and store it in state.
  const fetchSeats = async () => {
    try {
      const res = await axios.get('/api/seats');
      setSeats(res.data);
    } catch (error) {
      console.error("Error fetching seats:", error);
      alert("Error fetching seats.");
    }
  };

  // Handle booking seats based on the selected count.
  const handleBookSeats = () => {
    let booked: number[] = [];
    const status = seats.map(seat => seat.status);

    // Attempt to book seats in a row first
    for (let i = 0; i <= seats.length - seatCount; i++) {
      const seatsPerRow = i < 77 ? 7 : 3; // 7 seats per row until the 77th seat, then 3 seats per row

      // Check if the selected seats fit in the row and are available
      if ((i % seatsPerRow) + seatCount <= seatsPerRow && status.slice(i, i + seatCount).every(status => status === "available")) {
        booked = Array.from({ length: seatCount }, (_, j) => i + j); // Booking consecutive seats
        break;
      }
    }

    // If no consecutive seats found in rows, book nearby seats
    if (!booked.length) {
      const availableSeats: number[] = [];
      for (let i = 0; i < seats.length; i++) {
        if (status[i] === "available" && availableSeats.length < seatCount) {
          availableSeats.push(i);
        }
      }
      if (availableSeats.length === seatCount) {
        booked = availableSeats;
      }
    }

    if (booked.length) {
      // Update seat status and make API call to book the seats.
      updateSeatStatus(booked);
    } else {
      alert('No available seats found.');
    }
  };

  // Update seat status on the server after booking.
  const updateSeatStatus = async (bookedSeats: number[]) => {
    try {
      await axios.post('/api/book', { bookseat: bookedSeats });
      setSelectedSeats(bookedSeats);
      fetchSeats(); // Refresh seat data after booking.
      alert('Seats booked successfully!');
    } catch (error) {
      console.error("Error updating seat status:", error);
      alert('Error booking seats.');
    }
  };

  // Handle canceling the booking.
  const handleCancelBooking = async () => {
    const seatId = localStorage.getItem("seatid");
    if (seatId) {
      try {
        await axios.put('/api/cancel', { seatid: seatId });
        setIsModalOpen(false);
        localStorage.removeItem("seatid");
        fetchSeats(); // Refresh seat data after cancelation.
        alert('Booking canceled successfully.');
      } catch (error) {
        console.error("Error canceling booking:", error);
        alert('Error canceling booking.');
      }
    }
  };

  // Reset all bookings.
  const handleReset = async () => {
    try {
      await axios.get('/api/reset');
      fetchSeats(); // Refresh seat data after reset.
      alert('All bookings reset.');
    } catch (error) {
      console.error("Error resetting bookings:", error);
      alert('Error resetting bookings.');
    }
  };

  // Modal to confirm booking cancellation.
  const renderCancelModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-xs w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Cancel Booking</h2>
        <div className="flex justify-between space-x-4">
          <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            No
          </button>
          <button onClick={handleCancelBooking} className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-300">
            Yes
          </button>
        </div>
      </div>
    </div>
  );

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="text-center px-4 md:px-8 lg:px-16 py-8 bg-gray-50">
      <h2 className="font-bold text-3xl mb-6 text-gray-800">Seat Booking</h2>

      {/* Seat Selection */}
      <div className="mb-8">
        <label htmlFor="seatCount" className="block text-lg font-medium text-gray-700">Select Seats</label>
        <div className="flex justify-center items-center space-x-4 mb-4">
          <input
            id="seatCount"
            type="range"
            min="1"
            max="7"
            value={seatCount}
            onChange={(e) => setSeatCount(parseInt(e.target.value))}
            className="w-64 md:w-80 border-2 border-gray-800 rounded-lg"
          />
          <p className="seatstext text-xl font-semibold">No of seats selected: {seatCount}</p>
        </div>
        <button
          onClick={handleBookSeats}
          className="mt-5 mb-5 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Book Tickets
        </button>
      </div>

      {/* Seat Grid */}
      <div id="coach" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-6 mx-auto">
        {seats.map((seat, index) => (
          <div
            key={index}
            className={`seat ${seat.status === "available" ? "bg-green-300" : seat.status === "booked" ? "bg-red-500" : "bg-gray-400"} p-3 border-2 border-gray-300 cursor-pointer rounded-md transition-all hover:scale-105`}
            onClick={() => {
              if (seat.status === "booked") {
                localStorage.setItem("seatid", seat._id);
                localStorage.setItem("index", seat.id.toString());
                setIsModalOpen(true);
              }
            }}
          >
            <p className="name text-lg font-semibold text-center text-white">{seat.seatNumber}</p>
          </div>
        ))}
      </div>

      {/* Reset Booking Button */}
      <button
        onClick={handleReset}
        className="mt-5 mb-5 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
      >
        Reset Booking
      </button>

      {/* Modal for Cancel Booking */}
      {isModalOpen && renderCancelModal()}
    </div>
  );
};

export default SeatBooking;
