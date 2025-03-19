import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token"
import { PackageResolver } from "./resolver";

export class packageController {
  public resolver: any;

  constructor() {
    this.resolver = new PackageResolver();
  }
  public addPackage = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----add packages'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
     
      let entity;

      entity = await this.resolver.addPackageV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in add package", error);
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
  public UpdatePackage = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----update packages'");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      console.log('decodedToken', decodedToken)
     
      let entity;

      entity = await this.resolver.UpdatePackageV1(request.payload, decodedToken);
      console.log('entity', entity)

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in update package controller", error);
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
  public galleryUpload = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----gallery Upload");
  
    try {
      // const decodedToken ={
      //   id:request.plugins.token.id
      // }
      const decodedToken ={
        id:1
      }
      let entity;
      entity = await this.resolver.galleryUploadV1(
        request.payload, decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in upload gallery  ", error);
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
  public listPackage = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----gallery Upload");
  
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.listPackageV1(
        request.payload, decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in upload gallery  ", error);
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
  public deleteImage = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router----- delete gallery image");
  
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      let entity;
      entity = await this.resolver.deleteImageV1(
        request.payload, decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in delete gallery image ", error);
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
