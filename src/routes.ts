import * as Hapi from "@hapi/hapi";
import { settingRoutes } from "./api/settings/routes";
import { packageRoutes } from "./api/package/routes";
import { adminRoutes } from "./api/admin/routes";



export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new packageRoutes().register(server);
    await new settingRoutes().register(server);
    await new adminRoutes().register(server);

  }
}