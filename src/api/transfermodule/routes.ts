import * as Hapi from "@hapi/hapi";
import { validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { TransferController } from "./controller";

export class transferRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new TransferController();

      server.route([
        // CAR SERVICE COMPLETED
        {
          method: "POST",
          path: "/api/v1/transferRoutes/addServices",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addTransferServiceController,
            description: "Add transfer car service",
            tags: ["api", "Transfer"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/transferRoutes/services",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getTransferServicesController,
            description: "Get transfer car services",
            tags: ["api", "Transfer"],
            auth: false,
          },
        },
        {
          method: "PUT",
          path: "/api/v1/transferRoutes/services/{id}",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateTransferServiceController,
            description: "Update transfer car service",
            tags: ["api", "Transfer"],
            auth: false,
          },
        },
        {
          method: "DELETE",
          path: "/api/v1/transferRoutes/services/{id}",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteTransferServiceController,
            description: "Soft delete transfer car service",
            tags: ["api", "Transfer"],
            auth: false,
          },
        },

        // CARS TRANSFER - CAR ADD
        {
          method: "POST",
          path: "/api/v1/carRoutes/uploadImages",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadImages,
            description: "uploadImages",
            tags: ["api", "HomePage"],
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
          path: "/api/v1/transferRoutes/addCar",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addCarController,
            description: "Add transfer car",
            tags: ["api", "TransferCars"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/transferRoutes/cars",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getCarsController,
            description: "Get transfer cars",
            tags: ["api", "TransferCars"],
            auth: false,
          },
        },
        {
          method: "PUT",
          path: "/api/v1/transferRoutes/cars/{id}",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateCarController,
            description: "Update transfer car",
            tags: ["api", "TransferCars"],
            auth: false,
          },
        },
        {
          method: "DELETE",
          path: "/api/v1/transferRoutes/cars/{id}",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCarController,
            description: "Soft delete transfer car",
            tags: ["api", "TransferCars"],
            auth: false,
          },
        },

        // CAR BADGES
        {
          method: "POST",
          path: "/api/v1/carBadges",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addBadge,
            description: "Add Car Badge",
            tags: ["api", "CarBadges"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/carBadges",
          config: {
            handler: controller.getBadges,
            description: "Get Car Badges",
            tags: ["api", "CarBadges"],
            auth: false,
          },
        },
        {
          method: "PUT",
          path: "/api/v1/carBadges/{id}",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateBadge,
            description: "Update Car Badge",
            tags: ["api", "CarBadges"],
            auth: false,
          },
        },
        {
          method: "DELETE",
          path: "/api/v1/carBadges/{id}",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteBadge,
            description: "Delete Car Badge",
            tags: ["api", "CarBadges"],
            auth: false,
          },
        },
      ]);

      resolve(true);
    });
  }
}
