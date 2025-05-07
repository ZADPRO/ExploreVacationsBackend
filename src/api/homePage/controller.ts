// import * as Hapi from "@hapi/hapi";

// // import { decodeToken } from "../../helper/token"
// import { homePageResolver } from "./resolver";
// import logger from "../../helper/logger";

// export class homePageController {
//   public resolver: any;

//   constructor() {
//     this.resolver = new homePageResolver();
//   }
//   public uploadHomeImages = async (
//     request: any,
//     response: Hapi.ResponseToolkit
//   ): Promise<any> => {
  //     logger.info(`GET URL REQ => ${request.url.href}`);
//     try {
//       const decodedToken = {
  //         id: request.plugins.token.id,
//       };

//       let entity;

//       entity = await this.resolver.uploadHomeImagesV1(
  //         request.payload,
  //         decodedToken
  //       );

//       if (entity.success) {
//         return response.response(entity).code(201); // Created
//       }
//       return response.response(entity).code(200); // Bad Request if failed
//     } catch (error) {
  //       logger.error("Error in upload Home Images", error);
  //       return response
  //         .response({
    //           success: false,
    //           message:
    //             error instanceof Error
    //               ? error.message
//               : "An unknown error occurred",
//         })
//         .code(500);
//     }
//   };
// }

import * as Hapi from "@hapi/hapi";
import { homePageResolver } from "./resolver";
import * as Boom from "@hapi/boom";
import logger from "../../helper/logger";

export class homePageController {
  public resolver: any;

  constructor() {
    this.resolver = new homePageResolver();
  }

  public uploadHomeImages = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
      };

      const entity = await this.resolver.uploadHomeImagesV1(
        request.payload,
        decodedToken
        // null // or pass a real domain_code if required
      );

      if (entity.success) {
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in uploadHomeImages", error);
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
  public deleteHomeImage = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
      };

      const entity = await this.resolver.deleteHomeImageV1(
        request.payload,
        decodedToken
        // null // or pass a real domain_code if required
      );

      if (entity.success) {
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in uploadHomeImages", error);
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
 
  public homeImageContent = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
      };

      const entity = await this.resolver.homeImageContentV1(
        request.payload,
        decodedToken
        // null // or pass a real domain_code if required
      );

      if (entity.success) {
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in homeImageContent", error);
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
  public updateContent = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
      };

      const entity = await this.resolver.updateContentV1(
        request.payload,
        decodedToken
        // null // or pass a real domain_code if required
      );

      if (entity.success) {
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in updateContent", error);
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
  public deletehomeImageContent = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
      };

      const entity = await this.resolver.deletehomeImageContentV1(
        request.payload,
        decodedToken
        // null // or pass a real domain_code if required
      );

      if (entity.success) {
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in deletehomeImageContent", error);
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
  public uploadImages = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      console.log("request line ----- 21", request);
      const decodedToken = {
        id: request.plugins.token.id,
      };
      console.log("decodedToken line ------ 24", decodedToken);

      let entity;

      entity = await this.resolver.uploadImagesV1(request.payload, decodedToken);

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
  public deletehomeImage = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
      };
      console.log("decodedToken line ------ 24", decodedToken);

      let entity;

      entity = await this.resolver.deletehomeImageV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in delete Images", error);
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
  public listhomeImage = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
      };
      console.log("decodedToken line ------ 24", decodedToken);

      let entity;

      entity = await this.resolver.listhomeImageV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in list home Image", error);
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
  public getHomeImage = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      const decodedToken = {
        id: request.plugins.token.id,
      };
      console.log("decodedToken line ------ 24", decodedToken);

      let entity;

      entity = await this.resolver.getHomeImageV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in get home Image", error);
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
  public listhomeImageUserSide = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
   
      let entity;

      entity = await this.resolver.listhomeImageUserSideV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in get home Image user side", error);
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
