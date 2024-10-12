import fastify from "fastify";
import { authRoutes } from "./auth.js";
import { categoryRoutes, productRoutes } from "./product.js";
import { orderRoutes } from "./order.js";
import { schoolRoutes } from "./school.js";
import { userDetailRoutes } from "./userDetails.js";
import { cityRoutes } from "./city.js";

const prefix = "/api";

export const registerRoutes = async (fastify) => {
  fastify.register(authRoutes, { prefix: prefix });
  fastify.register(productRoutes, { prefix: prefix });
  fastify.register(categoryRoutes, { prefix: prefix });
  fastify.register(orderRoutes, { prefix: prefix });
  fastify.register(schoolRoutes, { prefix: prefix });
  fastify.register(userDetailRoutes, { prefix: prefix });
  fastify.register(cityRoutes, { prefix: prefix });
};
