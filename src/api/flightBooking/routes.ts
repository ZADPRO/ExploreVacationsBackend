import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { flightController } from "./controller";

export class flightRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new flightController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/flightRoutes/flightBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.flightBooking,
            validate: validate.flightBooking,
            description: "flightBooking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/flightRoutes/userflightBookingHistory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            // validate: validate.userflightBookingHistory,
            handler: controller.userflightBookingHistory,
            description: "userflightBookingHistory",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/flightRoutes/listFlightBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            // validate: validate.userflightBookingHistory,
            handler: controller.listFlightBooking,
            description: "listFlightBooking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
         {
          method: "POST",
          path: "/api/v1/flightRoutes/deleteFlightBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            validate: validate.deleteFlightBooking,
            handler: controller.deleteFlightBooking,
            description: "deleteFlightBooking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
