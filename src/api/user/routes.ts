import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { userController } from "./controller";
import validate from "./validate";

export class userRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new userController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/userRoutes/tourBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.tourBooking,
            validate: validate.tourBooking,
            description: "tour Booking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/customizeBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.customizeBooking,
            // validate: validate.customizeBooking,
            description: "customize Booking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/uploadCertificate",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadCertificate,
            // validate: validate.uploadCertificate,
            description: "Upload certificate",
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
          path: "/api/v1/userRoutes/uploadPassport",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadPassport,
            // validate: validate.uploadCertificate,
            description: "Upload passport",
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
          path: "/api/v1/userRoutes/userCarBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userCarBooking,
            // validate: validate.userCarBooking,
            description: "car Booking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        // {
        //   method: "POST",
        //   path: "/api/v1/userRoutes/listTour",
        //   config: {
        //     pre: [{ method: validateToken, assign: "token" }],
        //     handler: controller.listTour,
        //     description: "listTour",
        //     tags: ["api", "Users"],
        //     auth: false,
        //   },
        // },
        {
          method: "POST",
          path: "/api/v1/userRoutes/listTour",
          config: {
            handler: controller.listTour,
            validate: validate.listTour,
            description: "listTour",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/getAllTour",
          config: {
            handler: controller.getAllTour,
            description: "get AllTour",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/getAllCar",
          config: {
            handler: controller.getAllCar,
            description: "get All Car",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/getCarById",
          config: {
            handler: controller.getCarById,
            validate: validate.getCarById,
            description: "get CarById",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/listCarParking",
          config: {
            handler: controller.listCarParking,
            validate: validate.listCarParking,
            description: "list CarParking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/getCarParking",
          config: {
            handler: controller.getCarParking,
            description: "get CarParking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        // {
        //   method: "POST",
        //   path: "/api/v1/userRoutes/addTravalData",
        //   config: {
        //     pre: [{ method: validateToken, assign: "token" }],
        //     handler: controller.addTravalData,
        //     description: "add TravalData",
        //     tags: ["api", "Users"],
        //     auth: false,
        //   },
        // },
        // {
        //   method: "POST",
        //   path: "/api/v1/userRoutes/updateTravalData",
        //   config: {
        //     pre: [{ method: validateToken, assign: "token" }],
        //     handler: controller.updateTravalData,
        //     description: "update TravalData",
        //     tags: ["api", "Users"],
        //     auth: false,
        //   },
        // },
        {
          method: "POST",
          path: "/api/v1/userRoutes/uploadMap",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadMap,
            description: "Upload map",
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
          path: "/api/v1/userRoutes/deleteMap",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteMap,
            description: "delete map",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/listDestination",
          config: {
            handler: controller.listDestination,
            description: "list Destination",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/userSignUp",
          config: {
            handler: controller.userSignUp,
            description: "user SignUp",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/forgotPassword",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.forgotPassword,
            description: "forgot Password",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/tourBrochure",
          config: {
            handler: controller.tourBrochure,
            description: "tour Brochure",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/profileData",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.profileData,
            description: "profile Data",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/UpdateprofileData",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.UpdateprofileData,
            validate: validate.UpdateprofileData,
            description: "Update profile Data",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/tourBookingHistory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.tourBookingHistory,
            description: "tour Booking History",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/carBookingHistory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.carBookingHistory,
            description: "carBooking History",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/carParkingHistory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.carParkingHistory,
            description: "carParking History",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/listAssociateAirport",
          config: {
            handler: controller.listAssociateAirport,
            description: "list Associate Airport",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/listParkingType",
          config: {
            handler: controller.listParkingType,
            description: "list ParkingType",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        // {
        //   method: "GET",
        //   path: "/api/v1/userRoutes/carParkingHistory",
        //   config: {
        //     pre: [{ method: validateToken, assign: "token" }],
        //     handler: controller.carParkingHistory,
        //     description: "carParking History",
        //     tags: ["api", "Users"],
        //     auth: false,
        //   },
        // },
        {
          method: "POST",
          path: "/api/v1/userRoutes/addUserAddress",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addUserAddress,
            validate: validate.addUserAddress,
            description: "add User Address",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/carParkingBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.carParkingBooking,
            // validate: validate.carParkingBooking,
            description: "carParking Booking",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
