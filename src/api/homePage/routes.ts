import * as Hapi from "@hapi/hapi";
import IRoute from "../../helper/routes";
import { validateToken } from "../../helper/token";
import { homePageController } from "./controller";

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
            description: "update Package",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/homePageRoutes/homeImageContent",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.homeImageContent,
            // validate: validate.homeImageContent,
            description: "update Package",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
