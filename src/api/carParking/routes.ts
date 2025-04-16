import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { carParkingController } from "./controller";

export class carParkingRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new carParkingController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/carParkingRoutes/addCarParking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addCarParking,
            validate: validate.addCarParking,
            description: "add CarParking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carParkingRoutes/uploadParkingImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadParkingImage,
            description: "uploadParkingImage",
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
          path: "/api/v1/carParkingRoutes/deleteParkingImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteParkingImage,
            description: "delete ParkingImage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carParkingRoutes/updateCarParking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateCarParking,
            validate: validate.updateCarParking,
            description: "update CarParking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/carParkingRoutes/listCarParking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listCarParking,
            description: "list CarParking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carParkingRoutes/getCarParking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getCarParking,
            validate: validate.getCarParking,
            description: "get CarParking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carParkingRoutes/deleteCarParking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCarParking,
            validate: validate.deleteCarParking,
            description: "delete CarParking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carParkingRoutes/addServiceFeatures",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addServiceFeatures,
            // validate: validate.addServiceFeatures,
            description: "add ServiceFeatures",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carParkingRoutes/updateServiceFeatures",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateServiceFeatures,
            // validate: validate.addCarParking,
            description: "update ServiceFeatures",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/carParkingRoutes/listServiceFeatures",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listServiceFeatures,
            description: "list ServiceFeatures",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carParkingRoutes/deleteServiceFeatures",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteServiceFeatures,
            // validate: validate.addCarParking,
            description: "delete ServiceFeatures",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
