import { Request, Response } from 'express';
import { SeatModel } from '../model/seat.model';

// Get all seats
export const getAllSeats = async (req: Request, res: Response): Promise<void> => {
    try {
        const seats = await SeatModel.find();
        res.status(200).json({ success: true, message: 'Seats retrieved successfully', data: seats.reverse() });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve seats', error: (err as Error).message });
    }
};

// Book seats
export const bookSeats = async (req: Request, res: Response): Promise<void> => {
    const { bookseat } = req.body;
    let response = "";

    try {
        if (bookseat.length !== 0) {
            for (let i = 0; i < bookseat.length; i++) {
                const seats = await SeatModel.find({ id: bookseat[i] });
                for (let j = 0; j < seats.length; j++) {
                    response += seats[j].seatNumber + " ";
                }
            }
        }

        const update = { $set: { status: "booked" } };

        if (bookseat.length !== 0) {
            for (let i = 0; i < bookseat.length; i++) {
                await SeatModel.updateMany({ id: bookseat[i] }, update);
            }
        }

        res.status(200).json({ success: true, message: `You have booked seats: ${response}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Seat booking failed', error: (error as Error).message });
    }
};

// Add a new seat
export const addSeat = async (req: Request, res: Response): Promise<void> => {
    const newSeat = new SeatModel(req.body);
    try {
        const savedPost = await newSeat.save();
        res.status(200).json({ success: true, message: 'Seat added successfully', data: savedPost });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to add seat', error: (err as Error).message });
    }
};

// Delete a seat
export const deleteSeat = async (req: Request, res: Response): Promise<void> => {
    try {
        await SeatModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Seat has been deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete seat', error: (err as Error).message });
    }
};

// Cancel a booking
export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
    const { seatid } = req.body;
    const update = { $set: { status: "available" } };

    try {
        await SeatModel.findByIdAndUpdate(seatid, update);
        res.status(200).json({ success: true, message: 'Booking successfully canceled' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to cancel booking', error: (err as Error).message });
    }
};

// Reset all bookings
export const resetBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        await SeatModel.updateMany({}, { $set: { status: "available" } });
        res.status(200).json({ success: true, message: 'All bookings reset successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to reset bookings', error: (err as Error).message });
    }
};

// Update seat by ID
export const updateSeatById = async (req: Request, res: Response): Promise<void> => {
    const { seatid, seatNumber } = req.body;
    const id = req.params.id;
    const update = { $set: { id: seatid, seatNumber: seatNumber } };

    try {
        const user = await SeatModel.findByIdAndUpdate(id, update);
        res.status(200).json({ success: true, message: 'Seat updated successfully', data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update seat', error: (err as Error).message });
    }
};
