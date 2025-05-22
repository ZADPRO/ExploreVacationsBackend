import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { newCarsController } from "./controller";

export class newCarsRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new newCarsController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/newCarsRoutes/addCarGroup",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addCarGroup,
            validate: validate.addCarGroup,
            description: "addCarGroup",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/newCarsRoutes/updateCarGroup",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateCarGroup,
            validate: validate.updateCarGroup,
            description: "updateCarGroup",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/newCarsRoutes/deleteCarGroup",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCarGroup,
            validate: validate.deleteCarGroup,
            description: "deleteCarGroup",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/newCarsRoutes/listCarGroup",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listCarGroup,
            // validate: validate.listCarGroup,
            description: "listCarGroup",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/newCarsRoutes/userOfflineCarBooking",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userOfflineCarBooking,
            // validate: validate.userOfflineCarBooking,
            description: "userOfflineCarBooking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/newCarsRoutes/listOfflineCarBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listOfflineCarBooking,
            // validate: validate.listCarGroup,
            description: "listCarGroup",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/newCarsRoutes/deleteOfflineCarBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteOfflineCarBooking,
            // validate: validate.deleteOfflineCarBooking,
            description: "deleteOfflineCarBooking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
         {
          method: "POST",
          path: "/api/v1/newCarsRoutes/uploadPassport",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadPassport,
            description: "upload passport",
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
          path: "/api/v1/newCarsRoutes/uploadLicense",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadLicense,
            description: "uploadLicense",
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
          path: "/api/v1/newCarsRoutes/deletePassport",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deletePassport,
            // validate: validate.deleteOfflineCarBooking,
            description: "deletePassport",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/newCarsRoutes/deleteLicense",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteLicense,
            // validate: validate.deleteLicense,
            description: "deleteLicense",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/newCarsRoutes/viewCertificates",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.viewCertificates,
            // validate: validate.deleteLicense,
            description: "deleteLicense",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
