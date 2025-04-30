import * as Hapi from "@hapi/hapi";
import IRoute from "../../helper/routes";
import { validateToken } from "../../helper/token";
import { bookingController } from "./controller";

export class bookingRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new bookingController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/approveTourBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.approveTourBooking,
            description: "approve Tour Booking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/approveCarBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.approveCarBooking,
            description: "approve Car Booking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/approveCustomizeTourBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.approveCustomizeTourBooking,
            description: "approveCustomizeTourBooking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/approveParkingBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.approveParkingBooking,
            description: "approveParkingBooking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/uploadTourAgreement",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadTourAgreement,
            // validate: validate.uploadEmployeeImage,
            description: "Upload employee Image",
            tags: ["api", "Users"],
            auth: false,
            payload: {
              maxBytes: 10485760,
              output: "stream",
              parse: true,
              multipart: true,
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
