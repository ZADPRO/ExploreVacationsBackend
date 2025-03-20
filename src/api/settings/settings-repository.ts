import { executeQuery, getClient } from "../../helper/db";
import { Client, PoolClient } from "pg";
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
  deleteActivityQuery,
  deletecategoryQuery,
  deleteDestinationQuery,
  deletelocationQuery,
  listActivitiesQuery,
  listCategoryQuery,
  listDestinationQuery,
  listLoacationQuery,
  updateActivityQuery,
  updateCategoryQuery,
  updateDestinationQuery,
  updateHistoryQuery,
  updateLocationQuery,
} from "./query";
import { any } from "@hapi/joi";

export class settingsRepository {
  public async addDestinationV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const { refDestination } = userData;

      const userResult = await executeQuery(addDestinationQuery, [
        refDestination,
        CurrentTime(),
        "Admin"
      ]);

      const history = [
        2,
        tokendata.id,
        "add Destination",
        CurrentTime(),
        "vendor",
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "destination added successfully",
          data: userResult,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during destination addition",
          token: tokens,
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
    const client: PoolClient = await getClient();
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
            token: tokens,
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

      const history = [
        3,
        tokenData.id,
        "update Destination",
        CurrentTime(),
        "Admin",
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);

      return encrypt(
        {
          success: true,
          message: "Destination updated successfully",
          token: tokens,
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
          token: tokens,
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
          token: tokens,
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
          token: tokens,
          error: errorMessage,
        },
        true
      );
    }
  }
  public async DeleteDestinationV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
        await client.query("BEGIN"); // Start transaction

        const { refDestinationId } = userData
        const result = await client.query(deleteDestinationQuery, [
          refDestinationId,
          CurrentTime(),
          "Admin"
        ]);

        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return encrypt(
                {
                    success: false,
                    message: "Destination not found or already deleted",
                    tokens:tokens
                },
                true
            );
        }

        // Insert delete action into history
        const history = [
            30, // Unique ID for delete action
            tokendata.id,
            "delete destination",
            CurrentTime(),
            "admin",
        ];

        await client.query(updateHistoryQuery, history);
        await client.query("COMMIT"); // Commit transaction

        return encrypt(
            {
                success: true,
                message: "Destination deleted successfully",
                tokens:tokens,
                deletedData: result.rows[0], // Return deleted record for reference
            },
            true
        );
    } catch (error: unknown) {
        await client.query("ROLLBACK"); // Rollback on error
        console.error("Error deleting destination:", error);

        return encrypt(
            {
                success: false,
                message: "An error occurred while deleting the destination",
                tokens:tokens,
                error: String(error),
            },
            true
        );
    } finally {
        client.release();
    }
  }


  public async addLocationV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const client: PoolClient = await getClient();

    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

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
            token: tokens,
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

        const result = await client.query(addLocationQuery, [
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

      const history = [4, tokendata.id, "add Location", CurrentTime(), "Admin"];

      await client.query("COMMIT");

      const updateHistory = await client.query(updateHistoryQuery, history);

      return encrypt(
        {
          success: true,
          message: "Locations added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during location addition",
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async updateLocationV1(userData: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const { refLocationId, refLocationName, refDestinationId } = userData;

      const checkResult = await executeQuery(checkLocationQuery, [
        refLocationId,
      ]);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "location ID not found",
            token: tokens,
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

      const updateDestination = await client.query(updateLocationQuery, params);

      const history = [
        5,
        tokenData.id,
        "update Destination",
        CurrentTime(),
        "Admin",
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "location updated successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error during location update:", error);

      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "Destination update failed",
          error: errorMessage,
          token: tokens,
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
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during location addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteLocationV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
        await client.query("BEGIN"); // Start transaction

        const { refLocationId } = userData
        const result = await client.query(deletelocationQuery, [
          refLocationId,
          CurrentTime(),
          "Admin"
          
        ]);

        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return encrypt(
                {
                    success: false,
                    message: "location not found or already deleted",
                    token:tokens
                },
                true
            );
        }

        // Insert delete action into history
        const history = [
            31, 
            tokendata.id,
            "delete location",
            CurrentTime(),
            "admin",
        ];

        await client.query(updateHistoryQuery, history);
        await client.query("COMMIT"); // Commit transaction

        return encrypt(
            {
                success: true,
                message: "location deleted successfully",
                token:tokens,
                deletedData: result.rows[0], // Return deleted record for reference
            },
            true
        );
    } catch (error: unknown) {
        await client.query("ROLLBACK"); // Rollback on error
        console.error("Error deleting location:", error);

        return encrypt(
            {
                success: false,
                message: "An error occurred while deleting the location",
                token:tokens,
                error: String(error),
            },
            true
        );
    } finally {
        client.release();
    }
  }


  public async addCategoriesV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refCategory } = userData;

      const userResult = await client.query(addCategoryQuery, [
        refCategory,
        CurrentTime(),
        "Admin",
      ]);

      const history = [
        6,
        tokendata.id,
        "add Categories",
        CurrentTime(),
        "Admin",
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);

      return encrypt(
        {
          success: true,
          message: "destination added successfully",
          token: tokens,
          data: userResult,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during destination addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateCategoriesV1(userData: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();

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
            token: tokens,
          },
          true
        );
      }

      const params = [refCategoryId, refCategoryName, CurrentTime(), "Admin"];

      const updateDestination = await client.query(updateCategoryQuery, params);
      const history = [
        7,
        tokenData.id,
        "update category",
        CurrentTime(),
        "Admin",
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "category updated successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error during location update:", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "category update failed",
          token: tokens,
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
          token: tokens,
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
  public async deleteCategoriesV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
        await client.query("BEGIN"); // Start transaction

        const { refCategoryId } = userData
        const result = await client.query(deletecategoryQuery, [
          refCategoryId,
          CurrentTime(),
          "Admin"
        ]);

        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return encrypt(
                {
                    success: false,
                    message: "category not found or already deleted",
                    token:tokens
                },
                true
            );
        }

        // Insert delete action into history
        const history = [
            32, 
            tokendata.id,
            "delete category",
            CurrentTime(),
            "admin",
        ];

        await client.query(updateHistoryQuery, history);
        await client.query("COMMIT"); // Commit transaction

        return encrypt(
            {
                success: true,
                message: "category deleted successfully",
                token:tokens,
                deletedData: result.rows[0], // Return deleted record for reference
            },
            true
        );
    } catch (error: unknown) {
        await client.query("ROLLBACK"); // Rollback on error
        console.error("Error deleting category:", error);

        return encrypt(
            {
                success: false,
                message: "An error occurred while deleting the category",
                token:tokens,
                error: String(error),
            },
            true
        );
    } finally {
        client.release();
    }
  }

  public async addActivitiesV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refActivity } = userData;
      const userResult = await client.query(addActivitiesQuery, [
        refActivity,
        CurrentTime(),
        "Admin",
      ]);
      
      console.log('userResult-------------------------------------------------------------------507', userResult)
      const history = [
        8, 
        tokendata.id, 
        "add activity", 
        CurrentTime(), 
        "Admin"
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      console.log('updateHistory--------------------------------------------------------517', updateHistory)
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Activities added successfully",
          token: tokens,
          data: userResult,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during activity addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateActivitiesV1(userData: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refActivitiesId, refActivitiesName } = userData;

      const checkResult = await executeQuery(checkActivitiesQuery, [
        refActivitiesId,
      ]);
      console.log('checkResult', checkResult)

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "activity ID not found",
            token: tokens,
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

      const updateDestination = await client.query(updateActivityQuery, params);

      const history = [
        9,
        tokenData.id,
        "Update Activities",
        CurrentTime(),
        "Admin",
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "activities updated successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
        await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "cativity update failed",
          token: tokens,
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
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during location addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteActivitiesV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
        await client.query("BEGIN"); // Start transaction

        const { refActivitiesId } = userData
        const result = await client.query(deleteActivityQuery, [
          refActivitiesId,
          CurrentTime(),
          "Admin"
        ]);

        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return encrypt(
                {
                    success: false,
                    message: "activity not found or already deleted",
                    token:tokens
                },
                true
            );
        }

        // Insert delete action into history
        const history = [
            33, 
            tokendata.id,
            "delete activity",
            CurrentTime(),
            "admin",
        ];

        await client.query(updateHistoryQuery, history);
        await client.query("COMMIT"); // Commit transaction

        return encrypt(
            {
                success: true,
                message: "activity deleted successfully",
                token:tokens,
                deletedData: result.rows[0], // Return deleted record for reference
            },
            true
        );
    } catch (error: unknown) {
        await client.query("ROLLBACK"); // Rollback on error
        console.error("Error deleting activity:", error);

        return encrypt(
            {
                success: false,
                message: "An error occurred while deleting the activity",
                token:tokens,
                error: String(error),
            },
            true
        );
    } finally {
        client.release();
    }
  }
}
