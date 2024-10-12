import {
    fetchUser,
    loginStudent,
    loginTutor,
    refreshToken,
    verifyOTP,
    } from "../controllers/auth/auth.js";
    import { verifyToken } from "../middleware/auth.js";

    
    export const authRoutes = async (fastify, options) => {
    fastify.post("/student/login", loginStudent);
    fastify.post("/student/verify-otp", verifyOTP);
    fastify.post("/delivery/login", loginTutor);
    fastify.post("/refresh-token", refreshToken);
    fastify.get("/user", { preHandler: [verifyToken] }, fetchUser);
    };
    


