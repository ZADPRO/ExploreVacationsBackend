import * as Hapi from "@hapi/hapi";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { GoogleApiController } from "./controller";

export class googleAPIRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new GoogleApiController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/validateAddress",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.validateAddress,
            description: "Validate Zurich Address",
            tags: ["api", "Address"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/calculateDistance",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.calculateDistance,
            description: "Validate Zurich Address",
            tags: ["api", "Address"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
