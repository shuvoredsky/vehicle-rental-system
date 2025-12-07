import { Pool } from "pg";
import { pool } from "../../config/db";

const createVehicle = async (data: any)=>{
    const {vehicles_name, type, registration_number, daily_rent_price, availability_status = "available"} = data;

    const existingVehicle = await pool.query(
        "SELECT * FROM vehicles WHERE registration_number.toUpperCase() = $1", [registration_number]
    );

    if(existingVehicle.rows.length > 0){
        throw new Error("Vehicle with this registration number already exists");
    }

    const result = await pool.query(`
        INSERT INTO vehicles(vehicles_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *
        `, [vehicles_name, type, registration_number.toUpperCase(), daily_rent_price, availability_status])

        return result;
}

const getVehicles = async () =>{
    const result = await pool.query(`
        SELECT * FROM vehicles ORDER BY created_at DESC
        `);
        return result;
}


const getVehiclesById = async (vehicleId: string) =>{
    const result = await pool.query(`
        SELECT * FROM vehicles WHERE id = $1
        `, [vehicleId]);
        return result;
}


const updateVehicle = async (vehicleId: string, data: any) => {
    const { vehicles_name, type, registration_number, daily_rent_price, availability_status } = data;

    const result = await pool.query(`
        UPDATE vehicles SET
            vehicles_name = COALESCE($1, vehicles_name),
            type = COALESCE($2, type),
            registration_number = COALESCE($3, registration_number),
            daily_rent_price = COALESCE($4, daily_rent_price),
            availability_status = COALESCE($5, availability_status),
            updated_at = NOW()
        WHERE id = $6
        RETURNING *
    `, [
        vehicles_name,
        type,
        registration_number ? registration_number.toUpperCase() : null,
        daily_rent_price,
        availability_status,
        vehicleId
    ]);

    return result;
};



const deleteVehicle = async (vehicleId: string) =>{
    const result = await pool.query(`
        DELETE FROM vehicles WHERE id = $1
        `, [vehicleId]);
        return result;
}


const checkActiveBookings = async(vehicleId: string): Promise<boolean> =>{
    const result = await pool.query(`
        SELECT COUNT(*) as count FROM bookings WHERE vehicle_id = $1 AND status = 'active'
        `, [vehicleId])

        return parseInt(result.rows[0].count) > 0;
}


export const vehicleService = {
    createVehicle,
    getVehicles,
    getVehiclesById,
    updateVehicle,
    deleteVehicle,
    checkActiveBookings,
}