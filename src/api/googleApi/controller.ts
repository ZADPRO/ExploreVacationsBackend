import * as Hapi from "@hapi/hapi";

import logger from "../../helper/logger";
import { GoogleAPIRepo } from "./repository";

export class GoogleApiController {
  public repository: any;

  constructor() {
    this.repository = new GoogleAPIRepo();
  }

  public validateAddress = async (request: any, h: Hapi.ResponseToolkit) => {
    logger.info(`VALIDATE ADDRESS => ${request.url.href}`);

    try {
      const { address } = request.payload;
      console.log("address", address);

      const result = await this.repository.getSuggestionsService(address);
      console.log("result", result);

      return h.response(result).code(200);
    } catch (error) {
      logger.error("Error in validateAddress", error);

      return h
        .response({
          success: false,
          message: "Failed to validate address",
          error: error instanceof Error ? error.message : error,
        })
        .code(500);
    }
  };

  public calculateDistance = async (request: any, h: Hapi.ResponseToolkit) => {
    try {
      const { from, to } = request.payload;
      console.log("to", to);
      console.log("from", from);

      if (!from || !to) {
        return h
          .response({
            success: false,
            message: "From and To locations are required",
          })
          .code(400);
      }

      const result = await this.repository.calculateDistanceService(from, to);

      return h.response(result).code(200);
    } catch (err: any) {
      return h
        .response({
          success: false,
          message: err.message,
        })
        .code(500);
    }
  };
}
