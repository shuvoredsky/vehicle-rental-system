import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

// Create booking
const createBooking = async (req: Request, res: Response) => {
    try {
        const { vehicle_id, rent_start_date, rent_end_date } = req.body;
        const currentUser = req.user!;

        // Validation
        if (!vehicle_id || !rent_start_date || !rent_end_date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: vehicle_id, rent_start_date, rent_end_date",
            });
        }

        const booking = await bookingService.createBooking(currentUser.userId, req.body);

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    } catch (error: any) {
        if (error.message.includes("not found") || error.message.includes("not available")) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: error.message,
        });
    }
};

// Get all bookings (Admin: all, Customer: own)
const getBookings = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user!;

        const bookings = await bookingService.getBookings(
            currentUser.userId,
            currentUser.role
        );

        return res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: bookings,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve bookings",
            error: error.message,
        });
    }
};

// Update booking (Cancel or Return)
const updateBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.bookingId as string;
        const { action } = req.body; // "cancel" or "return"
        const currentUser = req.user!;

        if (!action || (action !== "cancel" && action !== "return")) {
            return res.status(400).json({
                success: false,
                message: "Invalid action. Use 'cancel' or 'return'",
            });
        }

        // Only admin can return
        if (action === "return" && currentUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden - Only admin can mark bookings as returned",
            });
        }

        const booking = await bookingService.updateBooking(
            bookingId,
            currentUser.userId,
            currentUser.role,
            action
        );

        return res.status(200).json({
            success: true,
            message: `Booking ${action === "cancel" ? "cancelled" : "returned"} successfully`,
            data: booking,
        });
    } catch (error: any) {
        if (error.message.includes("not found")) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message.includes("Forbidden") || error.message.includes("Cannot cancel")) {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update booking",
            error: error.message,
        });
    }
};

export const bookingController = {
    createBooking,
    getBookings,
    updateBooking,
};