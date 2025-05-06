import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { bannerController } from "./controller";

export class bannerRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new bannerController();
      server.route([
         {
                  method: "POST",
                  path: "/api/v1/bannerRoutes/homeImageContent",
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
                  path: "/api/v1/bannerRoutes/updateContent",
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
                  path: "/api/v1/bannerRoutes/deletehomeImageContent",
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
                  path: "/api/v1/bannerRoutes/uploadImages",
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
                  path: "/api/v1/bannerRoutes/deletehomeImage",
                  config: {
                    pre: [{ method: validateToken, assign: "token" }],
                    handler: controller.deletehomeImage,
                    description: "deletehomeImage",
                    tags: ["api", "Users"],
                    auth: false,
                  },
                },
    
    
      ]);
      resolve(true);
    });
  }
}
