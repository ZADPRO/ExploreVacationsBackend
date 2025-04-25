import * as Hapi from "@hapi/hapi";
import { settingRoutes } from "./api/settings/routes";
import { packageRoutes } from "./api/package/routes";
import { adminRoutes } from "./api/admin/routes";
import { carsRoutes } from "./api/cars/routes";
import { userRoutes } from "./api/user/routes";
import { carParkingRoutes } from "./api/carParking/routes";
import { batchRoutes } from "./api/batch/routes";
import { paymentRoutes } from "./api/payment/routes";
import { homePageRoutes } from "./api/homePage/routes";
import { notificationRoutes } from "./api/notification/routes";



export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new packageRoutes().register(server);
    await new settingRoutes().register(server);
    await new adminRoutes().register(server);
    await new carsRoutes().register(server);
    await new userRoutes().register(server);
    await new carParkingRoutes().register(server);
    await new batchRoutes().register(server);
    await new paymentRoutes().register(server);
    await new homePageRoutes().register(server);
    await new notificationRoutes().register(server);

  }
}