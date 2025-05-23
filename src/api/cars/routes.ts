import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { carsController } from "./controller";
import validate from "./validate";


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
            validate: validate.addVehicle,
            description: "add Vehicle",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/updateVehicle",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            validate: validate.updateVehicle,
            handler: controller.updateVehicle,
            description: "update Vehicle",
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
          path: "/api/v1/carsRoutes/deleteVehicle",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteVehicle,
            validate: validate.deleteVehicle,
            description: "delete Vehicle",
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
            validate: validate.addBenifits,
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
            // validate: validate.updateBenifits,
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
          path: "/api/v1/carsRoutes/deleteBenifits",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteBenifits,
            validate: validate.deleteBenifits,
            description: "delete Benifits",
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
            validate: validate.addInclude,
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
            // validate: validate.updateInclude,
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
          path: "/api/v1/carsRoutes/deleteInclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteInclude,
            validate: validate.deleteInclude,
            description: "delete Include",
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
            validate: validate.addExclude,
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
            // validate: validate.UpdateExclude,
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
          path: "/api/v1/carsRoutes/deleteExclude",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteExclude,
            validate: validate.deleteExclude,
            description: "delete Exclude",
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
            validate: validate.addDriverDetails,
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
            // validate: validate.updateDriverDetails,
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
          path: "/api/v1/carsRoutes/deleteDriverDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteDriverDetails,
            validate: validate.deleteDriverDetails,
            description: "delete Driver Details",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        // {
        //   method: "POST",
        //   path: "/api/v1/carsRoutes/addTermsAndConditions",
        //   config: {
        //     pre: [{ method: validateToken, assign: "token" }],
        //     handler: controller.addTermsAndConditions,
        //     description: "add Terms And Conditions",
        //     tags: ["api", "Users"],
        //     auth: false,
        //   },
        // },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/addFormDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addFormDetails,
            validate: validate.addFormDetails,
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
            validate: validate.updateFormDetails,
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
          path: "/api/v1/carsRoutes/deleteFormDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteFormDetails,
            validate: validate.deleteFormDetails,
            description: "delete Form Details",
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
            // validate: validate.addCars,
            description: "add Cars ",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/uploadCars",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadCars,
            // validate: validate.uploadCars,
            description: "upload Cars",
            tags: ["api", "Users"],
            auth: false,
            payload: {
              maxBytes: 10485760,
              output: "stream",
              parse: true,
              multipart: true,
            },
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/updateCars",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateCars,
            // validate: validate.updateCars,
            description: "update addCars",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/deleteCarImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCarImage,
            description: "delete Car Image",
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
            validate: validate.getCars,
            handler: controller.getCars,
            description: "get Cars",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/carsRoutes/deleteCars",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCars,
            validate: validate.deleteCars,
            description: "delete Cars",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/carsRoutes/getCarType",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getCarType,
            description: "getCarType",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}