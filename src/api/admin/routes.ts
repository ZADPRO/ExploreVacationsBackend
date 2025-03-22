import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { adminController } from "./controller";


export class adminRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new adminController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/adminRoutes/adminLogin",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.adminLogin,
            description: "admin Login",
            // tags: ["api", "Users"],
            auth: false,
          },
        },
       
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listTourBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listTourBookings,
            description: "list Tour Bookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listCarBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listCarBookings,
            description: "list Car Bookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listCustomizeTourBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listCustomizeTourBookings,
            description: "list Customize Tour Bookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listAuditPage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listAuditPage,
            description: "listAuditPage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        
      ]);
      resolve(true);
    });
  }
}