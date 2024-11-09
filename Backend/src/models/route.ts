import express, { Request, Response } from 'express';
import { 
    getAllSeats, 
    bookSeats, 
    addSeat, 
    deleteSeat, 
    cancelBooking, 
    resetBookings, 
    updateSeatById 
} from './controller/seat.controller';

// Create a new router for seat-related routes
const seatRouter = express.Router();

// Route to get all seats
seatRouter.get('/',getAllSeats);

// Route to book seats
seatRouter.post('/book',bookSeats);

// Route to add a new seat
seatRouter.post('/add',addSeat);

// Route to delete a seat by ID
seatRouter.delete('/:id',deleteSeat);

// Route to cancel a booking
seatRouter.put('/cancel',cancelBooking);

// Route to reset all bookings
seatRouter.get('/reset',resetBookings);

// Route to update a seat by ID
seatRouter.put('/id/:id',updateSeatById);

// Export the router
export { seatRouter };