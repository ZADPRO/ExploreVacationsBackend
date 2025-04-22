import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { adminController } from "./controller";
import validate from "./validate";

export class adminRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new adminController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/adminRoutes/adminLogin",
          config: {
            handler: controller.adminLogin,
            validate: validate.userLogin,
            description: "admin Login",
            // tags: ["api", "Users"],
            auth: false,
          },
        },

        {
          method: "GET",
          path: "/api/v1/adminRoutes/listTourBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listTourBookings,
            description: "list Tour Bookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listCarBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listCarBookings,
            description: "list Car Bookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listCustomizeTourBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listCustomizeTourBookings,
            description: "list Customize Tour Bookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listParkingBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listParkingBookings,
            description: "listParkingBookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/listAuditPage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listAuditPage,
            description: "listAuditPage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/addEmployee",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addEmployee,
            // validate: validate.addEmployee,
            description: "add Employee",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/uploadEmployeeImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadEmployeeImage,
            validate: validate.uploadEmployeeImage,
            description: "Upload employee Image",
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
          path: "/api/v1/carsRoutes/deleteEmployeeImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteEmployeeImage,
            description: "delete Employee Image",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/updateEmployee",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateEmployee,
            // validate: validate.updateEmployee,
            description: "update employee",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listEmployees",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listEmployees,
            description: "listEmployees",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/getEmployee",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getEmployee,
            validate: validate.getEmployee,
            description: "get Employee",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/deleteEmployee",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteEmployee,
            validate: validate.deleteEmployee,
            description: "delete Employee",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listTransactionType",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listTransactionType,
            description: "delete Employee",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listUserType",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listUserType,
            description: "listUserType",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/dashBoard",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.dashBoard,
            description: "dashBoard",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/deleteCarBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCarBookings,
            validate: validate.deleteCarBookings,
            description: "deleteCarBookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/deleteTourBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteTourBookings,
            validate: validate.deleteTourBookings,
            description: "deleteTourBookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/deleteCustomizeTourBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCustomizeTourBookings,
            validate: validate.deleteCustomizeTourBookings,
            description: "deleteCustomizeTourBookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/deleteCarParkingBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCarParkingBookings,
            validate: validate.deleteCarParkingBookings,
            description: "deleteCarParkingBookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },

      ]);
      resolve(true);
    });
  }
}
