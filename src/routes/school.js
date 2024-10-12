import { getAllSchools } from "../controllers/school/school.js";


export const schoolRoutes = async (fastify, options) => {
    fastify.get("/schools", getAllSchools);
    };