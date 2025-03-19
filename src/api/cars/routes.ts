import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { carsController } from "./controller";


export class carsRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new carsController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/carsRoutes/addVehicle",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addVehicle,
            description: "add Package",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/updateVehicle",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateVehicle,
            description: "update Package",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/carsRoutes/listVehicle",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listVehicle,
            description: "list Vehicle",
            tags: ["api", "Users"],
            auth: false,
          },
        },

        {
          method: "POST",
          path: "/api/v1/carsRoutes/addBenifits",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addBenifits,
            description: "add Benifits",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/updateBenifits",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateBenifits,
            description: "update Benifits",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/carsRoutes/listBenifits",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listBenifits,
            description: "list Benifits",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/addInclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addInclude,
            description: "add include",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/updateInclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateInclude,
            description: "update include",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/carsRoutes/listInclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listInclude,
            description: "list include",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/addExclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addExclude,
            description: "add Exclude",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/UpdateExclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.UpdateExclude,
            description: "update Exclude",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/carsRoutes/listExclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listExclude,
            description: "list Exclude",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/addDriverDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addDriverDetails,
            description: "add Driver Details",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/updateDriverDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateDriverDetails,
            description: "update Driver Details",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/carsRoutes/listDriverDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listDriverDetails,
            description: "list Driver Details",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/addTermsAndConditions",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addTermsAndConditions,
            description: "add Terms And Conditions",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/addFormDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addFormDetails,
            description: "add Form Details",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/updateFormDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateFormDetails,
            description: "update Form Details",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/carsRoutes/listFormDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listFormDetails,
            description: "list Form Details",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/addCars",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addCars,
            description: "add addCars",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/updateCars",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateCars,
            description: "update addCars",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/carsRoutes/listCars",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listCars,
            description: "list Cars",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/getCars",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getCars,
            description: "get Cars",
            tags: ["api", "Users"],
            auth: false,
          },
        },

      ]);
      resolve(true);
    });
  }
}