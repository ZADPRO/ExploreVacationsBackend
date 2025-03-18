import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { adminController } from "./controller";


export class adminRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new adminController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/adminRoutes/adminLogin",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.adminLogin,
            description: "admin Login",
            // tags: ["api", "Users"],
            auth: false,
          },
        },
       
        
      ]);
      resolve(true);
    });
  }
}