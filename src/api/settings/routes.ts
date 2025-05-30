import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { settingsController } from "./controller";
import validate from "./validate";

export class settingRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new settingsController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/settingRoutes/addDestination",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addDestination,
            // validate: validate.addDestination,
            description: "add Destination",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/UpdateDestination",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.UpdateDestination,
            validate: validate.UpdateDestination,
            description: "update Destination",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingRoutes/listDestination",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listDestination,
            description: "list Destination",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/DeleteDestination",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.DeleteDestination,
            // validate: validate.DeleteDestination,
            description: "Delete Destination",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/addLocation",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addLocation,
            validate: validate.addLocation,
            description: "add Location",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/updateLocation",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateLocation,
            validate: validate.updateLocation,
            description: "update Location",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingRoutes/listLocation",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listLocation,
            description: "list Location",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/deleteLocation",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteLocation,
            // validate: validate.deleteLocation,
            description: "delete Location",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/addCategories",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addCategories,
            validate: validate.addCategories,
            description: "add Categories",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/updateCategories",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateCategories,
            validate: validate.updateCategories,
            description: "update Categories",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingRoutes/listCategories",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listCategories,
            description: "list Categories",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/deleteCategories",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCategories,
            validate: validate.deleteCategories,
            description: "delete Categories",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/addActivities",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addActivities,
            validate: validate.addActivities,
            description: "add Activities",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/updateActivities",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateActivities,
            validate: validate.updateActivities,
            description: "update Activities",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingRoutes/listActivities",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listActivities,
            description: "list Activities",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/deleteActivities",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteActivities,
            validate: validate.deleteActivities,
            description: "delete Activities",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
