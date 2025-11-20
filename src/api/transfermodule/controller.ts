import * as Hapi from "@hapi/hapi";
import logger from "../../helper/logger";
import { transferRepository } from "./repository";

export class TransferController {
  public repository: transferRepository;

  constructor() {
    this.repository = new transferRepository();
  }

  // CREATE
  public addTransferServiceController = async (
    request: any,
    h: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`\n\n[Transfer] add service URL => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const entity = await this.repository.addCarServices(
        request.payload,
        decodedToken
      );

      return h.response(entity).code(entity.success ? 201 : 200);
    } catch (error) {
      logger.error("Error in add services", error);
      return h
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

  // READ ALL
  public getTransferServicesController = async (
    request: any,
    h: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`\n\n[Transfer] get services URL => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const entity = await this.repository.getCarServices(decodedToken);
      return h.response(entity).code(200);
    } catch (error) {
      logger.error("Error in get services", error);
      return h
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

  // UPDATE
  public updateTransferServiceController = async (
    request: any,
    h: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`\n\n[Transfer] update service URL => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const serviceId = Number(request.params.id);

      const entity = await this.repository.updateCarService(
        serviceId,
        request.payload,
        decodedToken
      );

      return h.response(entity).code(200);
    } catch (error) {
      logger.error("Error in update services", error);
      return h
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

  // DELETE (soft)
  public deleteTransferServiceController = async (
    request: any,
    h: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`\n\n[Transfer] delete service URL => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const serviceId = Number(request.params.id);

      const entity = await this.repository.deleteCarService(
        serviceId,
        decodedToken
      );

      return h.response(entity).code(200);
    } catch (error) {
      logger.error("Error in delete services", error);
      return h
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

  // UPLOAD IMAGES
  public uploadImages = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
      };

      let entity;

      entity = await this.repository.uploadImagesV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in upload Images", error);
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
  // CREATE
  public addCarController = async (request: any, h: Hapi.ResponseToolkit) => {
    logger.info(`Add Car => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const entity = await this.repository.addCar(
        request.payload,
        decodedToken
      );
      return h.response(entity).code(entity.success ? 201 : 200);
    } catch (error: any) {
      logger.error("Error adding car", error);
      return h.response({ success: false, message: error.message }).code(500);
    }
  };

  // READ
  public getCarsController = async (request: any, h: Hapi.ResponseToolkit) => {
    logger.info(`Get Cars => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const entity = await this.repository.getCars(decodedToken);
      return h.response(entity).code(200);
    } catch (error: any) {
      logger.error("Error getting cars", error);
      return h.response({ success: false, message: error.message }).code(500);
    }
  };

  // UPDATE
  public updateCarController = async (
    request: any,
    h: Hapi.ResponseToolkit
  ) => {
    logger.info(`Update Car => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const carId = Number(request.params.id);
      const entity = await this.repository.updateCar(
        carId,
        request.payload,
        decodedToken
      );

      return h.response(entity).code(200);
    } catch (error: any) {
      logger.error("Error updating car", error);
      return h.response({ success: false, message: error.message }).code(500);
    }
  };

  // DELETE
  public deleteCarController = async (
    request: any,
    h: Hapi.ResponseToolkit
  ) => {
    logger.info(`Delete Car => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const carId = Number(request.params.id);
      const entity = await this.repository.deleteCar(carId, decodedToken);

      return h.response(entity).code(200);
    } catch (error: any) {
      logger.error("Error deleting car", error);
      return h.response({ success: false, message: error.message }).code(500);
    }
  };

  // CAR BADGES CONTROLLER
  public addBadge = async (request: any, h: Hapi.ResponseToolkit) => {
    logger.info(`[CarBadge] Add Badge => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const result = await this.repository.addBadge(
        request.payload,
        decodedToken
      );

      return h.response(result).code(result.success ? 201 : 200);
    } catch (err: any) {
      logger.error("[CarBadge] Add Badge Error =>", err);
      return h.response({ success: false, message: err.message }).code(500);
    }
  };

  public getBadges = async (request: any, h: Hapi.ResponseToolkit) => {
    logger.info(`[CarBadge] Get Badges => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const result = await this.repository.getBadges(decodedToken);
      return h.response(result).code(200);
    } catch (err: any) {
      logger.error("[CarBadge] Get Badges Error =>", err);
      return h.response({ success: false, message: err.message }).code(500);
    }
  };

  public updateBadge = async (request: any, h: Hapi.ResponseToolkit) => {
    logger.info(`[CarBadge] Update Badge => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const id = Number(request.params.id);

      const result = await this.repository.updateBadge(
        id,
        request.payload,
        decodedToken
      );

      return h.response(result).code(200);
    } catch (err: any) {
      logger.error("[CarBadge] Update Badge Error =>", err);
      return h.response({ success: false, message: err.message }).code(500);
    }
  };

  public deleteBadge = async (request: any, h: Hapi.ResponseToolkit) => {
    logger.info(`[CarBadge] Delete Badge => ${request.url.href}`);

    try {
      const decodedToken = {
        id: request.plugins.token.id,
        roleId: request.plugins.token.roleId,
      };

      const id = Number(request.params.id);

      const result = await this.repository.deleteBadge(id, decodedToken);

      return h.response(result).code(200);
    } catch (err: any) {
      logger.error("[CarBadge] Delete Badge Error =>", err);
      return h.response({ success: false, message: err.message }).code(500);
    }
  };
}
