import { pool } from "../../config/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Pool } from "pg"
import config from "../../config"

const signup = async(payload: any)=>{
    const {name, email, password, phone, role="customer"} = payload;

    if(!name || !email || !password || !phone){
        throw new Error ("All fields are required")
    }

    if(password.length < 6){
        throw new Error ("Password must be at least 6 characters")
    }

    const emailLower = email.toLowerCase();

    const existingUser = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [emailLower])

        if(existingUser.rows.length > 0){
            throw new Error("user already exits")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(`
            INSERT INTO users(name, email, password, phone, role)
            VALUES($1, $2, $3, $4, $5)
            RETURNING id, name, email, phone, role, created_at
            `, [name, emailLower, hashedPassword, phone, role])
    
            return result.rows[0]
}

const signIn = async (email: string, password: string)=>{
    if(!email || !password){
        throw new Error("Email and password are required");
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLocaleLowerCase()])

    if(result.rows.length === 0){
        return null;
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return null;
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role
        },
        config.jwt_secret as string,
        {expiresIn: "30d"}
    )

    console.log({generatedToken: token})

        const {password: _, ...userWithoutPassword} = user;

        return{
            token,
            user: userWithoutPassword,
        }

};



export const authServices = {
    signup,
    signIn,
}