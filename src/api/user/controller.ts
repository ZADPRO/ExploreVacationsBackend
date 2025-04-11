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
     
     
      let entity;

      entity = await this.resolver.tourBookingV1(request.payload);

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
      
     
      let entity;

      entity = await this.resolver.customizeBookingV1(request.payload);

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
  public uploadCertificate = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----upload Certificate");
    try {
      
      let entity;
      entity = await this.resolver.uploadCertificateV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in upload Certificate", error);
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
  public userCarBooking = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----car Booking");
    try {
    
     
      let entity;

      entity = await this.resolver.userCarBookingV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in car Booking", error);
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
  // public listTour = async (
  //   request: any,
  //   response: Hapi.ResponseToolkit
  // ): Promise<any> => {
  //   logger.info("Router-----list Tour");
  //   try {
  //     const decodedToken ={
  //       id:request.plugins.token.id
  //     }
     
  //     let entity;

  //     entity = await this.resolver.listTourV1(request.payload, decodedToken);

  //     if (entity.success) {
  //       return response.response(entity).code(201); // Created
  //     }
  //     return response.response(entity).code(200); // Bad Request if failed

  //   } catch (error) {
  //     logger.error("Error in list Tour", error);
  //     return response
  //       .response({
  //         success: false,
  //         message:
  //           error instanceof Error
  //             ? error.message
  //             : "An unknown error occurred",
  //       })
  //       .code(500);
  //   }
  // };
  public listTour = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list Tour");
    try {
      
      let entity;

      entity = await this.resolver.listTourV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list Tour", error);
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
  public getAllTour = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list all Tour");
    try {
      
      let entity;

      entity = await this.resolver.getAllTourV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list all Tour", error);
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
  // public addTravalData = async (
  //   request: any,
  //   response: Hapi.ResponseToolkit
  // ): Promise<any> => {
  //   logger.info("Router-----list Tour");
  //   try {
  //     const decodedToken ={
  //       id:request.plugins.token.id
  //     }
  //     let entity;

  //     entity = await this.resolver.addTravalDataV1(request.payload,decodedToken);

  //     if (entity.success) {
  //       return response.response(entity).code(201); // Created
  //     }
  //     return response.response(entity).code(200); // Bad Request if failed

  //   } catch (error) {
  //     logger.error("Error in list Tour", error);
  //     return response
  //       .response({
  //         success: false,
  //         message:
  //           error instanceof Error
  //             ? error.message
  //             : "An unknown error occurred",
  //       })
  //       .code(500);
  //   }
  // };
  // public updateTravalData = async (
  //   request: any,
  //   response: Hapi.ResponseToolkit
  // ): Promise<any> => {
  //   logger.info("Router-----list Tour");
  //   try {
  //     const decodedToken ={
  //       id:request.plugins.token.id
  //     }
  //     let entity;

  //     entity = await this.resolver.updateTravalDataV1(request.payload,decodedToken);

  //     if (entity.success) {
  //       return response.response(entity).code(201); // Created
  //     }
  //     return response.response(entity).code(200); // Bad Request if failed

  //   } catch (error) {
  //     logger.error("Error in list Tour", error);
  //     return response
  //       .response({
  //         success: false,
  //         message:
  //           error instanceof Error
  //             ? error.message
  //             : "An unknown error occurred",
  //       })
  //       .code(500);
  //   }
  // };
  public uploadMap = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----upload Map");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.uploadMapV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in upload Map", error);
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
  public deleteMap = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----deleteMap");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.deleteMapV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in deleteMap", error);
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

  public getAllCar = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list all car");
    try {
      
      let entity;

      entity = await this.resolver.getAllCarV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list all car", error);
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
  public getCarById = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list car by id");
    try {
      
      let entity;

      entity = await this.resolver.getCarByIdV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list car by id", error);
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
  public listDestination = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list Destination");
    try {
      
      let entity;

      entity = await this.resolver.listDestinationV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list Destination", error);
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
  public userSignUp = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----user SignUp");
    try { 
      let entity;
      entity = await this.resolver.userSignUpV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in user signup", error);
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
  public forgotPassword = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----forgotPassword");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.forgotPasswordV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in forgot Password", error);
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
  public tourBrochure = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----tour Brochure");
    try {
      
      let entity;

      entity = await this.resolver.tourBrochureV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in tour Brochure", error);
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
  public userBookingHistory = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----user Booking History");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.userBookingHistoryV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in user Booking History", error);
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
