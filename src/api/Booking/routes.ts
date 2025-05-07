import * as Hapi from "@hapi/hapi";
import IRoute from "../../helper/routes";
import { validateToken } from "../../helper/token";
import { bookingController } from "./controller";
import validate from "./validate";

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
            description: "Upload tour agreement",
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
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/uploadCarAgreement",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadCarAgreement,
            // validate: validate.uploadEmployeeImage,
            description: "upload Car Agreement",
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
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/uploadParkingAgreement",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadParkingAgreement,
            // validate: validate.uploadEmployeeImage,
            description: "upload parking Agreement",
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
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/deleteTourAgreement",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteTourAgreement,
            description: "deleteTourAgreement",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/deleteCarAgreement",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCarAgreement,
            description: "deleteCarAgreement",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/deleteParkingAgreement",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteParkingAgreement,
            description: "deleteParkingAgreement",
            tags: ["api", "Users"],
            auth: false,
          },
        },

        //---------------------------------------------------------------------------------------------------------

        {
          method: "POST",
          path: "/api/v1/bookingRoutes/homeImageContent",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            validate: validate.homeImageContent,
            handler: controller.homeImageContent,
            description: "homeImageContent",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/updateContent",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateContent,
            validate: validate.updateContent,
            description: "updateContent",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/deletehomeImageContent",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deletehomeImageContent,
            validate: validate.deletehomeImageContent,
            description: "deletehomeImageContent",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/uploadImages",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadImages,
            description: "uploadImages",
            tags: ["api", "HomePage"],
            auth: false,
            payload: {
              maxBytes: 10485760,
              output: "stream",
              parse: true,
              multipart: true,
            },
          },
        },
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/deletehomeImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deletehomeImage,
            description: "deletehomeImage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/bookingRoutes/listhomeImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listhomeImage,
            description: "listhomeImage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/bookingRoutes/getHomeImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getHomeImage,
            description: "getHomeImage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/bookingRoutes/listhomeImageUserSide",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listhomeImageUserSide,
            description: "listhomeImageUserSide",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
