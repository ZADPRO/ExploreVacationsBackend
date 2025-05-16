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
    // logger.info("Router-----tour Booking");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      // const decodedToken ={
      //   id:52
      // }
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.tourBookingV1(request.payload
        , decodedToken
      );

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
    // logger.info("Router-----customize Booking");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.customizeBookingV1(request.payload
        , decodedToken
      );

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
    // logger.info("Router-----upload Certificate");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.uploadCertificateV1(request.payload
        , decodedToken
      );

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
  public uploadPassport = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----upload passport");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.uploadPassportV1(request.payload
        , decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in upload passport", error);
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
    // logger.info("Router-----car Booking");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.userCarBookingV1(request.payload
        , decodedToken
      );

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
    // logger.info("Router-----list Tour");
    logger.info(`GET URL REQ => ${request.url.href}`);

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
    // logger.info("Router-----list all Tour");
    logger.info(`GET URL REQ => ${request.url.href}`);

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
    // logger.info("Router-----upload Map");
    logger.info(`GET URL REQ => ${request.url.href}`);

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
    // logger.info("Router-----deleteMap");
    logger.info(`GET URL REQ => ${request.url.href}`);

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
    // logger.info("Router-----list all car");
    logger.info(`GET URL REQ => ${request.url.href}`);

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
    // logger.info("Router-----list car by id");
    logger.info(`GET URL REQ => ${request.url.href}`);

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
  public listCarParking = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----listCarParking");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      
      let entity;

      entity = await this.resolver.listCarParkingV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in listCarParking", error);
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
  public getCarParking = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----getCarParking");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      let entity;

      entity = await this.resolver.getCarParkingV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in getCarParking", error);
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
    // logger.info("Router-----list Destination");
    logger.info(`GET URL REQ => ${request.url.href}`);

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
    // logger.info("Router-----user SignUp");
    logger.info(`GET URL REQ => ${request.url.href}`);

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
    // logger.info("Router-----forgotPassword");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      // const decodedToken ={
      //   id:request.plugins.token.id
      // }
      let entity;

      entity = await this.resolver.forgotPasswordV1(request.payload
        // ,decodedToken
      );

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
    // logger.info("Router-----tour Brochure");
    logger.info(`GET URL REQ => ${request.url.href}`);

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
  public profileData = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----profileData");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      console.log('decodedToken', decodedToken)
      let entity;

      entity = await this.resolver.profileDataV1(request.payload, decodedToken );

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in profileData", error);
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
  public UpdateprofileData = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----UpdateprofileData");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.UpdateprofileDataV1(request.payload,decodedToken );

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in UpdateprofileData", error);
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


  public tourBookingHistory = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----tourBookingHistory");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.tourBookingHistoryV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in tourBookingHistory", error);
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
  public carBookingHistory = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----carBookingHistory");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.carBookingHistoryV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in carBookingHistory", error);
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
  public carParkingHistory = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----carParkingHistory");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.carParkingHistoryV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in carParkingHistory", error);
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
  public listAssociateAirport = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
  
    // logger.info("Router-----list Associate Airport");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      
      let entity;
      entity = await this.resolver.listAssociateAirportV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list Associate Airport", error);
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
  public listParkingType = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----listParkingType");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      
      let entity;
      entity = await this.resolver.listParkingTypeV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in listParkingType", error);
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
  public addUserAddress = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----addUserAddress");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.addUserAddressV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in addUserAddress", error);
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
  public carParkingBooking = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----car Parking Booking");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.carParkingBookingV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in car Parking Booking", error);
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
  public checkoffer = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    // logger.info("Router-----car Parking Booking");
    logger.info(`GET URL REQ => ${request.url.href}`);

    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;

      entity = await this.resolver.checkofferV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in check offer", error);
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
