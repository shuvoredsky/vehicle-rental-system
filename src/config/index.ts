import dotenv from "dotenv"
import path from "path"


dotenv.config({path: path.join(process.cwd(), ".env")})

const config = {
    port: process.env.PORT || 5000,
    jwt_secret: process.env.JWT_SECRET || "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
    connection_str : process.env.CONNECTION_STR,
    jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
    bcrypt_salt_rounds: 10,
}

export default config;