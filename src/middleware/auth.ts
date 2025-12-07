import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
                role: string;
            }
        }
    }
}

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Token missing"
                });
            }

            if (!config.jwt_secret) {
                throw new Error("JWT secret is not defined");
            }

            const decode = jwt.verify(token, config.jwt_secret) as JwtPayload;

            req.user = {
                userId: decode.userId,
                email: decode.email,
                role: decode.role,
            };

            if (roles.length > 0 && !roles.includes(decode.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                });
            }

            next();
        } catch (err: any) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                err: err.message,
            });
        }
    };
};

export default auth;
