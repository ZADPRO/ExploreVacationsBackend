import * as Hapi from "@hapi/hapi";

import { vendorRoutes } from "./api/vendor/routes";



export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new vendorRoutes().register(server);

  }
}