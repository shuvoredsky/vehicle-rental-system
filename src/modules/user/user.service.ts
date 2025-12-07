import { Pool } from "pg";
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

// const createUser = async (payload: Record<string, unknown>)=>{
//     const {name,email, password, phone, role } = payload;
//     const hashedPass = await bcrypt.hash(password as string, 10)
//      const result = await pool.query(
//             `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
//             [name,email, hashedPass, phone, role]
//         );
//         return result;
// }

const getUser = async()=>{
    const result = await pool.query(`SELECT id, name, email, phone, role, created_at, updated_at FROM users`);

    return result;
}

const getSingleUser = async(id: string)=>{
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])
    return result;
}

const updateUser = async (userId: string, data: any)=>{
    const {name, email, phone, role} = data;

    const result = await pool.query(`
        UPDATE users 
        SET
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone),
            role = COALESCE($4, role),
            updated_at = NOW() WHERE id = $5
            RETURNING id, name, email, phone, role, created_at, updated_at
        `, [name, email ? email.toLowerCase(): null, phone, role, userId])
        return result;
}

const deleteUser = async (userId: string)=>{
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [userId])
    return result;
    
}

const checkActiveBookings = async (userId: string): Promise<boolean>=>{
    const result = await pool.query(`
        SELECT COUNT(*) as count FROM bookings WHERE customer_id = $1 AND status = 'active'
        `, [userId]);
        return parseInt(result.rows[0].count) > 0;
}

export const userService= {
    // createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser,
    checkActiveBookings
}