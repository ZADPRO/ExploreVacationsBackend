import * as Hapi from "@hapi/hapi";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { batchController } from "./controller";

export class batchRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new batchController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/batchRoutes/sendTourRem",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.sendTourRem,
            description: "send Tour Remainder",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/batchRoutes/sendCarRem",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.sendCarRem,
            description: "send Car Remainder",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/batchRoutes/sendCustomizeTourRem",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.sendCustomizeTourRem,
            description: "send Customize Tour Remainder",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/batchRoutes/sendParkingRem",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.sendParkingRem,
            description: "sendParkingRem",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      
      ]);
      resolve(true);
    });
  }
}
