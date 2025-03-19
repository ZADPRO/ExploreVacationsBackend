import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token"
import { userResolver } from "./resolver";

export class userController {
  public resolver: any;

  constructor() {
    this.resolver = new userResolver();
  }
  public tourBooking = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----tour Booking");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.tourBookingV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in tour Booking", error);
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
  public customizeBooking = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----customize Booking");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.customizeBookingV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in customize Booking", error);
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
