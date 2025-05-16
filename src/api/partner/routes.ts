import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { partnerController } from "./controller";

export class partnerRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new partnerController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/partnerRoutes/addPartners",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addPartners,
            validate: validate.addPartners,
            description: "addPartners",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/partnerRoutes/updatePartner",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updatePartner,
            validate: validate.updatePartner,
            description: "updatePartner",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/partnerRoutes/getPartners",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getPartners,
            validate: validate.getPartners,
            description: "getPartners",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/partnerRoutes/deletePartners",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deletePartners,
            validate: validate.deletePartners,
            description: "deletePartners",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/partnerRoutes/listPartners",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listPartners,
            description: "listPartners",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        // -------------------------------------------------------------------
        {
          method: "POST",
          path: "/api/v1/partnerRoutes/addOffers",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addOffers,
            validate: validate.addOffers,
            description: "addOffers",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/partnerRoutes/updateOffers",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateOffers,
            validate: validate.updateOffers,
            description: "updateOffers",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/partnerRoutes/deleteOffers",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteOffers,
            validate: validate.deleteOffers,
            description: "deleteOffers",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/partnerRoutes/listOffers",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listOffers,
            description: "listOffers",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/partnerRoutes/applyCoupon",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.applyCoupon,
            validate: validate.applyCoupon,
            description: "applyCoupon",
            tags: ["api", "Users"],
            auth: false,
          },
        },
         {
          method: "POST",
          path: "/api/v1/partnerRoutes/getOffers",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getOffers,
            validate: validate.getOffers,
            description: "getOffers",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
