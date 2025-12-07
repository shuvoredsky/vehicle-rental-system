import { Request, Response } from "express";
import { vehicleService } from "./vehicles.service";


const createVehicle = async (req: Request, res: Response)=>{
    try{
        const {vehicles_name, type, registration_number, daily_rent_price, availability_status} = req.body;
        
        if(!vehicles_name || !type || !registration_number || !daily_rent_price){
            return res.status(400).json({
                success: false,
                message: "ALl fields are require: vehicles_name, type, registration_number, daily_rent_price"
            })
        }

        const validType = ["car", "bike", "van", "SUV"];
        if(!validType.includes(type)){
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle type. Must be one of: car, bike, van, SUV",
            })
        }

        if(daily_rent_price <= 0){
            return res.status(201).json({
                success: false,
                message: "Daily rent price must be greater than 0"
            })
        }

        const result = await vehicleService.createVehicle(req.body)

        return res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0],
        })

    }catch(error: any){
        if(error.message.includes("already exists")){
            return res.status(409).json({
                success: false,
                message: error.message,
            })
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create vehicle",
            error: error.message,
        })
    }
}


const getAllVehicles = async (req: Request, res: Response)=>{

    try{
        const result = await vehicleService.getVehicles();

        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows,
        })
    }catch(error: any){
        res.status(500).json({
            success: false,
            message: "Failed to retrive vehicle",
            error: error.message,
        })
    }

}

const getVehicleById = async (req: Request, res: Response)=>{
    try{
        const vehicleId = req.params.vehicleId as string;
        const result = await vehicleService.getVehiclesById(vehicleId);

        if(result.rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0],
        })
    }catch(error: any){
        res.status(500).json({
            success: false,
            message: "Failed to retrieve vehicle",
            error: error.message,
        })
    }
}

const updateVehicle = async (req: Request, res:Response)=>{
    try{

        const vehicleId = req.params.vehicleId as string;
        const updateData = req.body;

        if(updateData.type){
            const validType = ["car", "bike", "van", "SUV"];
            if(!validType.includes(updateData.type)){
                return res.status(400).json({
                    success: false,
                    message: "Invalid vehicle type. Must be one of: car, bike, van, SUV"
                })
            }
        }
        if(updateData.daily_rent_price !== undefined && updateData.daily_rent_price <= 0){
            return res.status(400).json({
                success: false,
                message: "Daily rent price must be greater than 0"
            })
        }

        if(updateData.availability_status !== undefined){
            const validStatuses = ["available", "booked"];
            if(!validStatuses.includes(updateData.availability_status)){
                return res.status(400).json({
                success: false,
                message: "Invalid available status"
            })
            }
        }

        const result = await vehicleService.updateVehicle(vehicleId, updateData);

        if(result.rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        }

        return res.status(200).json({
                success: true,
                message: "vechicle updated successfully"
            })

    }catch(error: any){
        return res.status(500).json({
                success: false,
                error: error.message
            })
    }
}

const deleteVehicle =  async (req: Request, res: Response)=>{
    try{
        const vehicleId = req.params.vehicleId as string;

        const hasActiveBookings = await vehicleService.checkActiveBookings(vehicleId)

        if(hasActiveBookings){
            return res.status(400).json({
                success: false,
                message: "Cannot delete vehicle , vehicle has active bookings"
            })
        }

        const result = await vehicleService.deleteVehicle(vehicleId)

        if(result.rowCount === 0){
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        }

        return res.status(200).json({
                success: true,
                message: "Vehicle deleted success"
            })


    }catch(error: any){
        res.status(500).json({
                success: false,
                message: "failed to delete vehecle",
                error: error.message,
            })
    }
}

export const vehicleController ={
createVehicle,
getAllVehicles,
getVehicleById,
updateVehicle,
deleteVehicle,
}