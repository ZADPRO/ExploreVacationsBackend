import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { newCarsController } from "./controller";


export class newCarsRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new newCarsController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/newCarsRoutes/addCarGroup",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addCarGroup,
            validate: validate.addCarGroup,
            description: "addCarGroup",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      
      ]);
      resolve(true);
    });
  }
}