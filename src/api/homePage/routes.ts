import * as Hapi from "@hapi/hapi";
import IRoute from "../../helper/routes";
import { validateToken } from "../../helper/token";
import { homePageController } from "./controller";
import validate from "./validate";

export class homePageRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new homePageController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/homePageRoutes/uploadHomeImages",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadHomeImages,
            description: "uploadHomeImages",
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
          path: "/api/v1/homePageRoutes/deleteHomeImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteHomeImage,
            // validate: validate.deleteHomeImage,
            description: "deleteHomeImage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/homePageRoutes/homeImageContent",
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
          path: "/api/v1/homePageRoutes/updateContent",
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
          path: "/api/v1/homePageRoutes/deletehomeImageContent",
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
          path: "/api/v1/homePageRoutes/uploadImages",
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
          path: "/api/v1/homePageRoutes/deletehomeImage",
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
          path: "/api/v1/homePageRoutes/listhomeImage",
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
          path: "/api/v1/homePageRoutes/getHomeImage",
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
          path: "/api/v1/homePageRoutes/listhomeImageUserSide",
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
