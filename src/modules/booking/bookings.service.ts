import { pool } from "../../config/db";

const createBooking = async (customerId: number, data: any) => {
    const { vehicle_id, rent_start_date, rent_end_date } = data;

    
    const vehicleResult = await pool.query(
        "SELECT * FROM vehicles WHERE id = $1",
        [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== "available") {
        throw new Error("Vehicle is not available");
    }

    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
        throw new Error("End date must be after start date");
    }

    const totalPrice = days * parseFloat(vehicle.daily_rent_price);


    const bookingResult = await pool.query(
        `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
         VALUES($1, $2, $3, $4, $5, 'active')
         RETURNING *`,
        [customerId, vehicle_id, rent_start_date, rent_end_date, totalPrice]
    );


    await pool.query(
        "UPDATE vehicles SET availability_status = 'booked', updated_at = NOW() WHERE id = $1",
        [vehicle_id]
    );

    return bookingResult.rows[0];
};

const getBookings = async (userId: number, userRole: string) => {
    let query = "SELECT * FROM bookings ORDER BY created_at DESC";
    let params: any[] = [];


    if (userRole === "customer") {
        query = "SELECT * FROM bookings WHERE customer_id = $1 ORDER BY created_at DESC";
        params = [userId];
    }

    const result = await pool.query(query, params);
    return result.rows;
};

const getBookingById = async (bookingId: string, userId: number, userRole: string) => {
    const result = await pool.query(
        "SELECT * FROM bookings WHERE id = $1",
        [bookingId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const booking = result.rows[0];

    
    if (userRole === "customer" && booking.customer_id !== userId) {
        throw new Error("Forbidden - You can only view your own bookings");
    }

    return booking;
};


const updateBooking = async (bookingId: string, userId: number, userRole: string, action: string) => {
    
    const bookingResult = await pool.query(
        "SELECT * FROM bookings WHERE id = $1",
        [bookingId]
    );

    if (bookingResult.rows.length === 0) {
        throw new Error("Booking not found");
    }

    const booking = bookingResult.rows[0];


    if (userRole === "customer" && booking.customer_id !== userId) {
        throw new Error("Forbidden - You can only cancel your own bookings");
    }


    if (action === "cancel") {

        const today = new Date();
        const startDate = new Date(booking.rent_start_date);

        if (today >= startDate) {
            throw new Error("Cannot cancel booking - Start date has passed");
        }

        
        const result = await pool.query(
            `UPDATE bookings 
             SET status = 'cancelled', updated_at = NOW() 
             WHERE id = $1 
             RETURNING *`,
            [bookingId]
        );


        await pool.query(
            "UPDATE vehicles SET availability_status = 'available', updated_at = NOW() WHERE id = $1",
            [booking.vehicle_id]
        );

        return result.rows[0];
    } else if (action === "return" && userRole === "admin") {
        
        const result = await pool.query(
            `UPDATE bookings 
             SET status = 'returned', updated_at = NOW() 
             WHERE id = $1 
             RETURNING *`,
            [bookingId]
        );

        
        await pool.query(
            "UPDATE vehicles SET availability_status = 'available', updated_at = NOW() WHERE id = $1",
            [booking.vehicle_id]
        );

        return result.rows[0];
    } else {
        throw new Error("Invalid action");
    }
};

export const bookingService = {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
};