import { getCities } from "../controllers/city/city.js";



export const cityRoutes = async (fastify, options) => {

  fastify.get("/cities", getCities);
}