import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { notificationController } from "./controller";

export class notificationRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new notificationController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/notificationRoutes/addNotifications",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addNotifications,
            validate: validate.addNotifications,
            description: "add Notifications",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/notificationRoutes/updateNotifications",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateNotifications,
            validate: validate.updateNotifications,
            description: "update Notifications",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/notificationRoutes/listNotifications",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listNotifications,
            description: "list Notifications",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/notificationRoutes/getNotifications",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getNotifications,
            validate: validate.getNotifications,
            description: "get Notifications",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
