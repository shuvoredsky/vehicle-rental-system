
import express, { Request, Response } from "express"


import initDB, { pool } from "./config/db";

import { userRoute } from "./modules/user/user.route";
import logger from "./middleware/logger";
import { authRoute } from "./modules/auth/auth.route";
import { vehicleRoute } from "./modules/vehicles/vehicles.route";
import { bookingRoute } from "./modules/booking/bookings.route";

const app = express()

app.use(express.json())
app.use(logger)

initDB()
app.get('/', (req: Request ,res: Response)=>{
    res.send("Vehicle Rental System Home");
})

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/vehicles", vehicleRoute)
app.use("/api/v1/bookings", bookingRoute)

app.use((req:Request, res:Response)=>{
    res.status(404).json({
        success: false,
        message: "Route Not Found",
        path: req.path,
    })
})

export default app;