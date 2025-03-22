import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { userController } from "./controller";

export class userRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new userController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/userRoutes/tourBooking",
          config: {
            handler: controller.tourBooking,
            description: "tour Booking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/customizeBooking",
          config: {
            handler: controller.customizeBooking,
            description: "customize Booking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/uploadCertificate",
          config: {
            handler: controller.uploadCertificate,
            description: "Upload certificate",
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
          path: "/api/v1/userRoutes/userCarBooking",
          config: {
            handler: controller.userCarBooking,
            description: "car Booking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        // {
        //   method: "POST",
        //   path: "/api/v1/userRoutes/listTour",
        //   config: {
        //     pre: [{ method: validateToken, assign: "token" }],
        //     handler: controller.listTour,
        //     description: "listTour",
        //     tags: ["api", "Users"],
        //     auth: false,
        //   },
        // },
        {
          method: "POST",
          path: "/api/v1/userRoutes/listTour",
          config: {
            handler: controller.listTour,
            description: "listTour",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/getAllTour",
          config: {
            handler: controller.getAllTour,
            description: "getAllTour",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/getAllCar",
          config: {
            handler: controller.getAllCar,
            description: "getAllCar",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/getCarById",
          config: {
            handler: controller.getCarById,
            description: "getCarById",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        // {
        //   method: "POST",
        //   path: "/api/v1/userRoutes/addTravalData",
        //   config: {
        //     pre: [{ method: validateToken, assign: "token" }],
        //     handler: controller.addTravalData,
        //     description: "add TravalData",
        //     tags: ["api", "Users"],
        //     auth: false,
        //   },
        // },
        // {
        //   method: "POST",
        //   path: "/api/v1/userRoutes/updateTravalData",
        //   config: {
        //     pre: [{ method: validateToken, assign: "token" }],
        //     handler: controller.updateTravalData,
        //     description: "update TravalData",
        //     tags: ["api", "Users"],
        //     auth: false,
        //   },
        // },
        {
          method: "POST",
          path: "/api/v1/userRoutes/uploadMap",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadMap,
            description: "Upload map",
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
          path: "/api/v1/userRoutes/deleteMap",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteMap,
            description: "delete map",
            tags: ["api", "Users"],
            auth: false,
            
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/listDestination",
          config: {
            handler: controller.listDestination,
            description: "listDestination",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
