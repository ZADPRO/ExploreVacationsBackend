import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token"
import { adminResolver } from "./resolver";

export class adminController {
  public resolver: any;

  constructor() {
    this.resolver = new adminResolver();
  }
  public adminLogin = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----adminLogin");

    try {
      let entity;
      entity = await this.resolver.adminLoginV1(request.payload);
      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in admin Login", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public listTourBookings = async (
     request: any,
     response: Hapi.ResponseToolkit
   ): Promise<any> => {
     logger.info("Router-----list Bookings'");
     try {
       const decodedToken ={
         id:request.plugins.token.id
       }
       let entity;
       entity = await this.resolver.listTourBookingsV1(request.payload, decodedToken);
 
       if (entity.success) {
         return response.response(entity).code(201); // Created
       }
       return response.response(entity).code(200); // Bad Request if failed
 
     } catch (error) {
       logger.error("Error in list Bookings", error);
       return response
         .response({
           success: false,
           message:
             error instanceof Error
               ? error.message
               : "An unknown error occurred",
         })
         .code(500);
     }
  };
  public listCarBookings = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list Bookings'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.listCarBookingsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list Bookings", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public listCustomizeTourBookings = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list Customize Tour Bookings");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.listCustomizeTourBookingsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list Bookings", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  
}
