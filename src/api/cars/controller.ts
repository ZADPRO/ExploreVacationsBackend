import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token"
import { carsResolver } from "./resolver";

export class carsController {
  public resolver: any;

  constructor() {
    this.resolver = new carsResolver();
  }
  public addVehicle = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add Vehicle'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.addVehicleV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add Vehicle", error);
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
  public updateVehicle = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----update Vehicle");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.updateVehicleV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update Vehicle", error);
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
  public listVehicle = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list Vehicle");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.listVehicleV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list Vehicle", error);
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
  public deleteVehicle = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----delete Vehicle");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.deleteVehicleV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in delete Vehicle", error);
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

  public addBenifits = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add benifits'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.addBenifitsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add benifits", error);
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
  public updateBenifits = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----update Benifits");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;
      entity = await this.resolver.updateBenifitsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update benifits", error);
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
  public listBenifits = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list benifits");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.listBenifitsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list benifits", error);
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
  public deleteBenifits = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----delete benifits");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.deleteBenifitsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in delete benifits", error);
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

  public addInclude = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add include'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.addIncludeV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add include", error);
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
  public updateInclude = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----update include'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.updateIncludeV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update include", error);
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
  public listInclude = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list Include");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.listIncludeV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list include", error);
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
  public deleteInclude = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----delete Include");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.deleteIncludeV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in delete include", error);
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

  public addExclude = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add exclude'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.addExcludeV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add exclude", error);
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
  public UpdateExclude = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----update exclude'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      // const decodedToken ={
      //   id:1
      // }
      let entity;
      entity = await this.resolver.UpdateExcludeV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update exclude", error);
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
  public listExclude = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list Exclude");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.listExcludeV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list Exclude", error);
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
  public deleteExclude = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----delete Exclude");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.deleteExcludeV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in delete Exclude", error);
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

  public addDriverDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add exclude'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.addDriverDetailsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add exclude", error);
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
  public updateDriverDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router----update Driver Details");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.updateDriverDetailsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update Driver Details", error);
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
  public listDriverDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router----list Driver Details");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.listDriverDetailsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list Driver Details", error);
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
  public deleteDriverDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router----delete Driver Details");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.deleteDriverDetailsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in delete Driver Details", error);
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

  // public addTermsAndConditions = async (
  //   request: any,
  //   response: Hapi.ResponseToolkit
  // ): Promise<any> => {
  //   logger.info("Router-----add TermsAndConditions");
  //   try {
  //     const decodedToken ={
  //       id:request.plugins.token.id
  //     }
  //     let entity;
  //     entity = await this.resolver.addTermsAndConditionsV1(request.payload, decodedToken);

  //     if (entity.success) {
  //       return response.response(entity).code(201); // Created
  //     }
  //     return response.response(entity).code(200); // Bad Request if failed

  //   } catch (error) {
  //     logger.error("Error in addTermsAndConditions", error);
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
  public addFormDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add Form Details'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.addFormDetailsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add Form Details", error);
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
  public updateFormDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----update form data'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      // const decodedToken ={
      //   id:1
      // }
      let entity;
      entity = await this.resolver.updateFormDetailsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update form data", error);
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
  public listFormDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list form data");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.listFormDetailsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list form data", error);
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
  public deleteFormDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----delete form data");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.deleteFormDetailsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in delete form data", error);
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

  public addCars = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add cars'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.addCarsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add cars", error);
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
  public uploadCars = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----upload cars'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.uploadCarsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in upload cars", error);
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
  public deleteCarImage = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----deleteCarImage");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.deleteCarImageV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in deleteCarImage", error);
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
  public updateCars = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----update cars'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.updateCarsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update cars", error);
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
  public listCars = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list cars'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.listCarsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list cars", error);
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
  public getCars = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----get cars'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.getCarsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in get cars", error);
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
  public deleteCars = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----deleteCars");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.deleteCarsV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in delete cars", error);
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
