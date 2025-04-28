import * as Hapi from "@hapi/hapi";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { paymentController } from "./controller";

export class paymentRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new paymentController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/paymentRoutes/calculation",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.calculation,
            description: "calculation",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/paymentRoutes/payment",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.payment,
            description: "payment",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}