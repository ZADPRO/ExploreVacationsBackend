import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import { formatDate } from "../../helper/common";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";
import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { CurrentTime } from "../../helper/common";
import {
  addActivitiesQuery,
  addCategoryQuery,
  addDestinationQuery,
  addLocationQuery,
  checkActivitiesQuery,
  checkCategoryQuery,
  checkLocationQuery,
  checkQuery,
  listActivitiesQuery,
  listCategoryQuery,
  listDestinationQuery,
  listLoacationQuery,
  updateActivityQuery,
  updateCategoryQuery,
  updateDestinationQuery,
  updateLocationQuery,
} from "./query";
import { any } from "@hapi/joi";

export class settingsRepository {
  public async addDestinationV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refDestination } = userData;

      const userResult = await executeQuery(addDestinationQuery, [
        refDestination,
        CurrentTime(),
        "Admin",
      ]);

      // const history = [
      //   17,
      //   token.id,
      //   "Rearrange products",
      //   CurrentTime(),
      //   'vendor',
      // ];

      // const updateHistory = await client.query(updateHistoryQuery, history);

      return encrypt(
        {
          success: true,
          message: "destination added successfully",
          data: userResult,
          token:tokens
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during destination addition",
          token:tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async UpdateDestinationV1(
    userData: any,
    tokenData: any
  ): Promise<any> {
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refDestinationId, refDestinationName } = userData;

      const checkResult = await executeQuery(checkQuery, [refDestinationId]);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "Destination ID not found",
            token:tokens
          },
          true
        );
      }

      const params = [
        refDestinationId,
        refDestinationName,
        CurrentTime(),
        "Admin",
      ];

      const updateDestination = await executeQuery(
        updateDestinationQuery,
        params
      );

      return encrypt(
        {
          success: true,
          message: "Destination updated successfully",
          token:tokens
        },
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error during destination update:", error);

      return encrypt(
        {
          success: false,
          message: "Destination update failed",
          error: errorMessage,
          token:tokens
        },
        true
      );
    }
  }
  public async listDestinationV1(userData: any, tokenData: any): Promise<any> {
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const destinationList = await executeQuery(listDestinationQuery);

      return encrypt(
        {
          success: true,
          message: "vendor updated successfully",
          token:tokens,
          destinationList: destinationList,
        },
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error during vendor update:", error);

      return encrypt(
        {
          success: false,
          message: "vendor update failed",
          token:tokens,
          error: errorMessage,
        },
        true
      );
    }
  }

  public async addLocationV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { locations, refDestinationId } = userData; // Assuming the payload will have an array of locations
      console.log(
        "userData--------------------------------------------------",
        userData
      );

      if (!Array.isArray(locations) || locations.length === 0) {
        return encrypt(
          {
            success: false,
            message: "No locations provided",
            token:tokens,
          },
          true
        );
      }
      let resultArray = [];
      for (const location of locations) {
        const { refLocation } = location;

        if (!refLocation) {
          continue;
        }

        const result = await executeQuery(addLocationQuery, [
          refLocation,
          refDestinationId,
          CurrentTime(),
          "Admin",
        ]);
        console.log("result", result);

        resultArray.push(result);
        console.log(
          "resultArray-------------------------------------",
          resultArray
        );
      }
      return encrypt(
        {
          success: true,
          message: "Locations added successfully",
          token:tokens,
          result: resultArray,

        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during location addition",
          error: String(error),
          token:tokens,

        },
        true
      );
    }
  }
  public async updateLocationV1(userData: any, tokenData: any): Promise<any> {
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refLocationId, refLocationName, refDestinationId } = userData;

      const checkResult = await executeQuery(checkLocationQuery, [
        refLocationId,
      ]);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "location ID not found",
            token:tokens
          },
          true
        );
      }

      const params = [
        refLocationId,
        refLocationName,
        refDestinationId,
        CurrentTime(),
        "Admin",
      ];

      const updateDestination = await executeQuery(updateLocationQuery, params);

      return encrypt(
        {
          success: true,
          message: "location updated successfully",
          token:tokens
        },
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error during location update:", error);

      return encrypt(
        {
          success: false,
          message: "Destination update failed",
          error: errorMessage,
          token:tokens

        },
        true
      );
    }
  }
  public async listLocationV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listLoacationQuery);
      return encrypt(
        {
          success: true,
          message: "Locations added successfully",
          token:tokens,
          result: result,
          
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during location addition",
          token:tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async addCategoriesV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refCategory } = userData;

      const userResult = await executeQuery(addCategoryQuery, [
        refCategory,
        CurrentTime(),
        "Admin",
      ]);

      // const history = [
      //   17,
      //   token.id,
      //   "Rearrange products",
      //   CurrentTime(),
      //   'vendor',
      // ];

      // const updateHistory = await client.query(updateHistoryQuery, history);

      return encrypt(
        {
          success: true,
          message: "destination added successfully",
          token:tokens,
          data: userResult,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during destination addition",
          token:tokens,
          error: String(error),

        },
        true
      );
    }
  }
  public async updateCategoriesV1(userData: any, tokenData: any): Promise<any> {
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refCategoryId, refCategoryName } = userData;

      const checkResult = await executeQuery(checkCategoryQuery, [
        refCategoryId,
      ]);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "category ID not found",
            token:tokens,
          },
          true
        );
      }

      const params = [refCategoryId, refCategoryName, CurrentTime(), "Admin"];

      const updateDestination = await executeQuery(updateCategoryQuery, params);

      return encrypt(
        {
          success: true,
          message: "category updated successfully",
          token:tokens,
        },
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error during location update:", error);

      return encrypt(
        {
          success: false,
          message: "category update failed",
          token:tokens,
          error: errorMessage,
        },
        true
      );
    }
  }
  public async listCategoriesV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listCategoryQuery);

      return encrypt(
        {
          success: true,
          message: "categories added successfully",
          token:tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during location addition",
          error: String(error),
        },
        true
      );
    }
  }

  public async addActivitiesV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refActivity } = userData;

      const userResult = await executeQuery(addActivitiesQuery, [
        refActivity,
        CurrentTime(),
        "Admin",
      ]);

      return encrypt(
        {
          success: true,
          message: "Activities added successfully",
          token:tokens,
          data: userResult,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during activity addition",
          token:tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateActivitiesV1(userData: any, tokenData: any): Promise<any> {
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refActivitiesId, refActivitiesName } = userData;

      const checkResult = await executeQuery(checkActivitiesQuery, [
        refActivitiesId,
      ]);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "activity ID not found",
            token:tokens,
          },
          true
        );
      }

      const params = [
        refActivitiesId,
        refActivitiesName,
        CurrentTime(),
        "Admin",
      ];

      const updateDestination = await executeQuery(updateActivityQuery, params);

      return encrypt(
        {
          success: true,
          message: "activities updated successfully",
          token:tokens
        },
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      return encrypt(
        {
          success: false,
          message: "cativity update failed",
          token:tokens,
          error: errorMessage,
        },
        true
      );
    }
  }
  public async listActivitiesV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listActivitiesQuery);

      return encrypt(
        {
          success: true,
          message: "activities added successfully",
          token:tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during location addition",
          token:tokens,
          error: String(error),
        },
        true
      );
    }
  }
}
