import * as Hapi from "@hapi/hapi";
import { settingRoutes } from "./api/settings/routes";
import { packageRoutes } from "./api/package/routes";
import { adminRoutes } from "./api/admin/routes";
import { carsRoutes } from "./api/cars/routes";
import { userRoutes } from "./api/user/routes";
import { carParkingRoutes } from "./api/carParking/routes";



export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new packageRoutes().register(server);
    await new settingRoutes().register(server);
    await new adminRoutes().register(server);
    await new carsRoutes().register(server);
    await new userRoutes().register(server);
    await new carParkingRoutes().register(server);


  }
}