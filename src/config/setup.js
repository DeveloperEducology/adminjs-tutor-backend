import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSFastify from "@adminjs/fastify";

import * as Models from "../models/index.js";
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Models.Student,
      options: {
        listProperties: ["phoneNumber", "role", "isActivated"],
        filterProperties: ["phoneNumber", "role"],
      },
    },
    {
      resource: Models.Tutor,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },

    {
      resource: Models.Category,
      options: {
        listProperties: ["name", "_id", "status"],
        filterProperties: ["name", "status"],
      },
    },

    {
      resource: Models.School,
    },
    { resource: Models.Class },
    { resource: Models.Subject },
    { resource: Models.Pincode },
    { resource: Models.City },
  ],
  branding: {
    companyName: "Blinkit",
    withMadeWithLove: false,
  },
  rootPath: "/admin",
});

export const buildAdminRouter = async (app) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    { authenticate, cookiePassword: COOKIE_PASSWORD, cookieName: "adminjs" },
    app,
    {
      store: sessionStore,
      saveUnintialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
};
