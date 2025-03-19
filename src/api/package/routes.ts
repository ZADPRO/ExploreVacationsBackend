import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import { packageController } from "./controller";
import IRoute from "../../helper/routes";


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
            description: "update Package",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/packageRoutes/galleryUpload",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
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
          method: "DELETE",
          path: "/api/v1/packageRoutes/deleteImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteImage,
            description: "delete image in gallery",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}