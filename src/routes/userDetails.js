import { getCities } from "../controllers/city/city.js";
import {
  getClasses,
  getBoards,
  getPincodes,
  getSubjects,
} from "../controllers/userDetails/userDetails.js";


export const userDetailRoutes = async (fastify, options) => {
  fastify.get("/classes", getClasses);
  fastify.get("/boards", getBoards);
  fastify.get("/pincodes", getPincodes);
  fastify.get("/subjects", getSubjects);
};
