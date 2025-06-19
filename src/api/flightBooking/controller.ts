import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token";
import { flightResolver } from "./resolver";

export class flightController {
  public resolver: any;

  constructor() {
    this.resolver = new flightResolver();
  }
  public flightBooking = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
                        roleId: request.plugins.token.roleId, // Add this

      };

      const entity = await this.resolver.flightBookingV1(
        request.payload,
        decodedToken
        // null // or pass a real domain_code if required
      );

      if (entity.success) {
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in flight Booking", error);
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
  public userflightBookingHistory = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
                        roleId: request.plugins.token.roleId, // Add this

      };

      const entity = await this.resolver.userflightBookingHistoryV1(
        request.payload,
        decodedToken
        // null // or pass a real domain_code if required
      );

      if (entity.success) {
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in user flight Booking history", error);
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
  public listFlightBooking = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
                        roleId: request.plugins.token.roleId, // Add this

      };


      const entity = await this.resolver.listFlightBookingV1(
        request.payload,
        decodedToken
        // null // or pass a real domain_code if required
      );

      if (entity.success) {
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in list flight Booking ", error);
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
  public deleteFlightBooking = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
                        roleId: request.plugins.token.roleId, // Add this

      };

      const entity = await this.resolver.deleteFlightBookingV1(
        request.payload,
        decodedToken
        // null // or pass a real domain_code if required
      );

      if (entity.success) {
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in delete flight Booking ", error);
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
