import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

// import { decodeToken } from "../../helper/token"
import { homePageResolver } from "./resolver";
import logger from "../../../helper/logger";

export class homePageController {
  public resolver: any;

  constructor() {
    this.resolver = new homePageResolver();
  }
  public uploadHomeImages = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----upload Home Images");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
    
      let entity;

      entity = await this.resolver.uploadHomeImagesV1(request.payload
        , decodedToken
    );

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in upload Home Images", error);
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
