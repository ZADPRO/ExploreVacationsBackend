import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token"
import { settingsResolver } from "./resolver";

export class settingsController {
  public resolver: any;

  constructor() {
    this.resolver = new settingsResolver();
  }

  public addDestination = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add Destination'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.addDestinationV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add Destination", error);
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
  public UpdateDestination = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----update Destination'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.UpdateDestinationV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update Destination", error);
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
    logger.info("Router-----update Destination'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.listDestinationV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update Destination", error);
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
  public DeleteDestination = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----delete Destination'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.DeleteDestinationV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in delete Destination", error);
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

  public addLocation = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add Loaction");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.addLocationV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add location", error);
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
  public updateLocation = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----update Loaction");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.updateLocationV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update location", error);
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
  public listLocation = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add Loaction");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.listLocationV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add location", error);
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
  public deleteLocation = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----delete Loaction");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.deleteLocationV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in delete location", error);
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

  public addCategories = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----addCategories");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.addCategoriesV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add category", error);
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
  public updateCategories = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----update Categories");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.updateCategoriesV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update category", error);
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
  public listCategories = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list Categories");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.listCategoriesV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list category", error);
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
  public deleteCategories = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----delete Categories");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.deleteCategoriesV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in delete category", error);
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

  public addActivities = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add Activities");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.addActivitiesV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add Activities", error);
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
  public updateActivities = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----update activities");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.updateActivitiesV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update activities", error);
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
  public listActivities = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----list Activities");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.listActivitiesV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in list activities", error);
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
  public deleteActivities = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----delete Activities");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.deleteActivitiesV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in delete activities", error);
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
