import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import { packageController } from "./controller";
import IRoute from "../../helper/routes";
import validate from "./validate";

export class packageRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new packageController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/packageRoutes/addPackage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addPackage,
            // validate: validate.addPackage,
            description: "add Package",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/UpdatePackage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.UpdatePackage,
            validate: validate.UpdatePackage,
            description: "update Package",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/deletePackage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deletePackage,
            validate: validate.deletePackage,
            description: "delete Package",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/galleryUpload",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.galleryUpload,
            description: "Upload gallery",
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
          method: "GET",
          path: "/api/v1/packageRoutes/listPackage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listPackage,
            description: "update Package",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/deleteImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteImage,
            description: "delete image in gallery",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/addTravalInclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addTravalInclude,
            validate: validate.addTravalInclude,
            description: "add TravalInclude",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/updateTravalInclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateTravalInclude,
            validate: validate.updateTravalInclude,
            description: "update TravalInclude",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/deleteTravalInclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteTravalInclude,
            validate: validate.deleteTravalInclude,
            description: "delete TravalInclude",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/packageRoutes/listTravalInclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listTravalInclude,
            description: "get TravalInclude",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/addTravalExclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addTravalExclude,
            validate: validate.addTravalExclude,
            description: "add TravalExclude",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/updateTravalExclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateTravalExclude,
            validate: validate.updateTravalExclude,
            description: "update TravalExclude",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/deleteTravalExclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteTravalExclude,
            validate: validate.deleteTravalExclude,
            description: "delete Traval Exclude",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/packageRoutes/listTravalExclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listTravalExclude,
            description: "get Traval Exclude",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/uploadCoverImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadCoverImage,
            validate: validate.uploadCoverImage,
            description: "Upload cover Image",
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
          path: "/api/v1/packageRoutes/deleteCoverImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCoverImage,
            description: "deleteCoverImage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/getTour",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getTour,
            validate: validate.getTour,
            description: "getTour",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
