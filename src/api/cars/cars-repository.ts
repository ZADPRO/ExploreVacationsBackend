import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import {
  storeFile,
  viewFile,
  convertToBase64,
  storetheFile,
  deleteFile,
} from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import fs from "fs";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { CurrentTime } from "../../helper/common";
import {
  addVehicleQuery,
  addBenifitsQuery,
  addIncludeQuery,
  addExcludeQuery,
  addDriverDetailsQuery,
  updateHistoryQuery,
  checkVehiclesQuery,
  updateVehicleQuery,
  listVehicleQuery,
  checkBenifitsQuery,
  updateBenifitsQuery,
  listBenifitsQuery,
  checkIncludeQuery,
  updateIncludeQuery,
  listIncludeQuery,
  checkExcludeQuery,
  updateExcludeQuery,
  listExcludeQuery,
  checkDriverDetailsQuery,
  updateDriverDetailsQuery,
  addCarsQuery,
  addCondation,
  addFormDetailsQuery,
  checkFormDetailsQuery,
  updateFormDetailsQuery,
  listFormDetailsQuery,
  updateCarsQuery,
  listCarsQuery,
  getCarsByIdQuery,
  listDriverDetailsQuery,
  deleteVehicleQuery,
  deletebenifitsQuery,
  deleteIncludeQuery,
  deleteExcludeQuery,
  deleteDriverDetailsQuery,
  deleteFormDetailsQuery,
  updateCondation,
  deleteCarsQuery,
  deleteImageRecordQuery,
  getImageRecordQuery,
  getVehicleNameQuery,
  getDeletedCarQuery,
  getCarIdIdQuery,
  getCarTypeQuery,
  checkVehicleTypeNameQuery,
  checkduplicateQuery,
  checkduplicateIncludeNameQuery,
  checkduplicateExcludeQuery,
  checkduplicateFormDetailsQuery,
  getVehicleQuery,
} from "./query";
import { cli } from "winston/lib/winston/config";

export class carsRepository {
  public async addVehicleV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refVehicleTypeName } = userData;
      console.log("userData", userData);

      const check: any = await executeQuery(checkVehicleTypeNameQuery, [
        refVehicleTypeName,
      ]);

      const count = Number(check[0]?.count || 0); // safely convert to number

      if (count > 0) {
        throw new Error(
          `Duplicate VehicleType Name found: "${refVehicleTypeName}" already exists.`
        );
      }

      const vehicleResult = await client.query(addVehicleQuery, [
        refVehicleTypeName,
        CurrentTime(),
        tokendata.id,
      ]);

      console.log("vehicleResult", vehicleResult.rows);
      const history = [
        12,
        tokendata.id,
        `${refVehicleTypeName} vehicle added successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");
      return encrypt(
        {
          success: true,
          message: "vehicle added successfully",
          data: vehicleResult,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during vehicle addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateVehicleV1(userData: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refVehicleTypeId, refVehicleTypeName } = userData;

      const checkResult = await executeQuery(checkVehiclesQuery, [
        refVehicleTypeId,
      ]);
      console.log("checkResult", checkResult);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "vehicle ID not found",
            token: tokens,
          },
          true
        );
      }
      const check: any = await executeQuery(checkVehicleTypeNameQuery, [
        refVehicleTypeName,
      ]);

      const count = Number(check[0]?.count || 0); // safely convert to number

      if (count > 0) {
        throw new Error(
          `Duplicate VehicleType Name found: "${refVehicleTypeName}" already exists.`
        );
      }

      const params = [
        refVehicleTypeId,
        refVehicleTypeName,
        CurrentTime(),
        tokenData.id,
      ];

      const updatevehicle = await client.query(updateVehicleQuery, params);

      const history = [
        13,
        tokenData.id,
        `${refVehicleTypeName} vehicle updated successfully`,
        CurrentTime(),
        tokenData.id,
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "vehicle updated successfully",
          updatevehicle: updatevehicle,
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
          message: "vehicle update failed",
          token: tokens,
          error: errorMessage,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listVehicleV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listVehicleQuery);

      return encrypt(
        {
          success: true,
          message: "list Vehicle successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list Vehicle",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteVehicleV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refVehicleTypeId } = userData;
      const result = await client.query(deleteVehicleQuery, [
        refVehicleTypeId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Vehicle not found or already deleted",
            token: tokens,
          },
          true
        );
      }
      const getresult: any = await client.query(getVehicleQuery, [
        refVehicleTypeId,
      ]);

      console.log("getresult", getresult);

      const { refVehicleTypeName } = getresult[0];

      console.log("refVehicleTypeName", refVehicleTypeName);
      // Insert delete action into history
      const history = [
        34, // Unique ID for delete action
        tokendata.id,
        `${refVehicleTypeName} Vehicle deleted successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Vehicle deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Vehicle:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Vehicle",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async addBenifitsV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      // Begin transaction
      await client.query("BEGIN");

      // Destructure refBenifitsName from the user data
      const { refBenifitsName } = userData;

      console.log("Received userData:", userData);

      // Check if refBenifitsName is an array and has items
      if (!Array.isArray(refBenifitsName) || refBenifitsName.length === 0) {
        return encrypt(
          {
            success: false,
            message: "No benefits provided",
            token: tokens,
          },
          true
        );
      }

      const duplicateCheck: any = await client.query(checkduplicateQuery, [
        refBenifitsName,
      ]);

      const count = Number(duplicateCheck[0]?.count || 0); // safely convert to number
      if (count > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: `Benifits Name "${refBenifitsName}" already exists for the selected destination.`,
            token: tokens,
          },
          true
        );
      }

      let resultArray: any[] = [];

      // Loop through each benefit and add it to the database
      for (const benefit of refBenifitsName) {
        const { refBenifitsName: benefitName } = benefit;

        // Skip empty benefit names
        if (!benefitName) {
          continue;
        }

        const result = await client.query(addBenifitsQuery, [
          benefitName,
          CurrentTime(),
          tokendata.id,
        ]);

        console.log("Benefit added result:", result);

        resultArray.push(result);
      }

      // Log history of the action
      const history = [
        14, // History type ID for "add benefits"
        tokendata.id, // User ID
        `Added Benefits: ${refBenifitsName
          .map((item: any) => item.benefitName)
          .join(", ")}`,
        CurrentTime(), // Timestamp of the action
        tokendata.id, // Performed by
      ];

      console.log(
        '`Added Benefits: ${refBenifitsName.map((item: any) => item.benefitName).join(", ")}`,',
        `Added Benefits: ${refBenifitsName
          .map((item: any) => item.benefitName)
          .join(", ")}`
      );

      // Commit transaction
      await client.query("COMMIT");

      // Update the history table with the action performed
      await client.query(updateHistoryQuery, history);

      // Return success response
      return encrypt(
        {
          success: true,
          message: "Benefits added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error) {
      // Rollback transaction in case of error
      await client.query("ROLLBACK");

      // Handle the error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during benefits addition";

      return encrypt(
        {
          success: false,
          message: errorMessage,
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateBenifitsV1(userData: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refBenifitsId, refBenifitsName } = userData;

      const checkResult = await executeQuery(checkBenifitsQuery, [
        refBenifitsId,
      ]);
      console.log("checkResult", checkResult);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "Benifits ID not found",
            token: tokens,
          },
          true
        );
      }

      const duplicateCheck: any = await client.query(checkduplicateQuery, [
        refBenifitsName,
      ]);

      const count = Number(duplicateCheck[0]?.count || 0); // safely convert to number
      if (count > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: `Benifits Name "${refBenifitsName}" already exists for the selected destination.`,
            token: tokens,
          },
          true
        );
      }
      const params = [refBenifitsId, refBenifitsName, CurrentTime(), "Admin"];

      const updateBenifits = await client.query(updateBenifitsQuery, params);

      const history = [
        15,
        tokenData.id,
        `${refBenifitsName} benifits updated successfully`,
        CurrentTime(),
        tokenData.id,
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "benifits updated successfully",
          token: tokens,
          updateBenifits: updateBenifits,
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
          message: "benifit update failed",
          token: tokens,
          error: errorMessage,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listBenifitsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listBenifitsQuery);

      return encrypt(
        {
          success: true,
          message: "list benifits successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list benifits",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteBenifitsV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refBenifitsId } = userData;
      const result = await client.query(deletebenifitsQuery, [
        refBenifitsId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "benifits not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      const history = [
        35, // Unique ID for delete action
        tokendata.id,
        "delete benifits",
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "benifits deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting benifits:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the benifits",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async addIncludeV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { refIncludeName } = userData;

      console.log("line ------ 523");

      console.log("Received userData:", userData);

      if (!Array.isArray(refIncludeName) || refIncludeName.length === 0) {
        console.log("line ------ 528");

        return encrypt(
          {
            success: false,
            message: "No include provided",
            token: tokens,
          },
          true
        );
      }
      console.log("line ------ 537");
      const duplicateCheck: any = await client.query(
        checkduplicateIncludeNameQuery,
        [refIncludeName]
      );
      const count = Number(duplicateCheck[0]?.count || 0); // safely convert to number
      if (count > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: `Include Name "${refIncludeName}" already exists`,
            token: tokens,
          },
          true
        );
      }

      let resultArray: any[] = [];

      for (const include of refIncludeName) {
        const { refIncludeName: refIncludeName } = include;

        console.log("include", include);
        if (!refIncludeName) {
          continue;
        }

        const result = await client.query(addIncludeQuery, [
          refIncludeName,
          CurrentTime(),
          tokendata.id,
        ]);

        console.log("result", result);

        resultArray.push(result);
      }

      // Log history of the action
      const history = [
        16,
        tokendata.id,
        `${refIncludeName} Include added successFully`,
        CurrentTime(),
        tokendata.id,
      ];
      console.log("line ------ 570");

      // Commit transaction
      await client.query("COMMIT");

      await client.query(updateHistoryQuery, history);

      // Return success response
      return encrypt(
        {
          success: true,
          message: "include added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error) {
      console.log(
        "error-------------------------------------------------------------------------581",
        error
      );
      // Rollback transaction in case of error
      await client.query("ROLLBACK");

      // Handle the error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during include addition";

      return encrypt(
        {
          success: false,
          message: errorMessage,
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateIncludeV1(userData: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refIncludeId, refIncludeName } = userData;

      const checkResult = await executeQuery(checkIncludeQuery, [refIncludeId]);
      console.log("checkResult", checkResult);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "include ID not found",
            token: tokens,
          },
          true
        );
      }
      const duplicateCheck: any = await client.query(
        checkduplicateIncludeNameQuery,
        [refIncludeName]
      );
      const count = Number(duplicateCheck[0]?.count || 0); // safely convert to number
      if (count > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: `Include Name "${refIncludeName}" already exists`,
            token: tokens,
          },
          true
        );
      }
      const params = [refIncludeId, refIncludeName, CurrentTime(), "Admin"];

      const updateInclude = await client.query(updateIncludeQuery, params);

      const history = [
        17,
        tokenData.id,
        "Update include",
        CurrentTime(),
        tokenData.id,
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "include updated successfully",
          token: tokens,
          updateInclude: updateInclude,
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
          message: "include update failed",
          token: tokens,
          error: errorMessage,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listIncludeV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listIncludeQuery);

      return encrypt(
        {
          success: true,
          message: "list Include successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list Includes",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteIncludeV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refIncludeId } = userData;
      const result = await client.query(deleteIncludeQuery, [
        refIncludeId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Include not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      const history = [
        36, // Unique ID for delete action
        tokendata.id,
        "delete Include",
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Include deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Include:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Include",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async addExcludeV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { refExcludeName } = userData;

      console.log("Received userData:", userData);

      if (!Array.isArray(refExcludeName) || refExcludeName.length === 0) {
        return encrypt(
          {
            success: false,
            message: "No exclude provided",
            token: tokens,
          },
          true
        );
      }

      const duplicateCheck: any = await client.query(
        checkduplicateExcludeQuery,
        [refExcludeName]
      );
      const count = Number(duplicateCheck[0]?.count || 0); // safely convert to number
      if (count > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: ` Exclude Name "${refExcludeName}" already exists for the selected destination.`,
            token: tokens,
          },
          true
        );
      }
      let resultArray: any[] = [];

      for (const exclude of refExcludeName) {
        const { refExcludeName: refExcludeName } = exclude;

        if (!refExcludeName) {
          continue;
        }

        const result = await client.query(addExcludeQuery, [
          refExcludeName,
          CurrentTime(),
          tokendata.id,
        ]);

        console.log("excludes added result:", result);

        resultArray.push(result);
      }

      // Log history of the action
      const history = [
        18,
        tokendata.id,
        `${refExcludeName} exclude added SuccessFully`,
        CurrentTime(),
        tokendata.id,
      ];

      // Commit transaction
      await client.query("COMMIT");

      await client.query(updateHistoryQuery, history);

      // Return success response
      return encrypt(
        {
          success: true,
          message: "exclude added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error) {
      // Rollback transaction in case of error
      await client.query("ROLLBACK");

      // Handle the error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during exclude addition";

      return encrypt(
        {
          success: false,
          message: errorMessage,
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async UpdateExcludeV1(userData: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      console.log("userData", userData);
      const { refExcludeId, refExcludeName } = userData;
      console.log("refExcludeId", refExcludeId);

      const checkResult = await executeQuery(checkExcludeQuery, [refExcludeId]);
      console.log("checkResult", checkResult);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "include ID not found",
            token: tokens,
          },
          true
        );
      }
      const duplicateCheck: any = await client.query(
        checkduplicateExcludeQuery,
        [refExcludeName]
      );
      const count = Number(duplicateCheck[0]?.count || 0); // safely convert to number
      if (count > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: ` Exclude Name "${refExcludeName}" already exists for the selected destination.`,
            token: tokens,
          },
          true
        );
      }
      const params = [refExcludeId, refExcludeName, CurrentTime(), "Admin"];

      const update = await client.query(updateExcludeQuery, params);

      const history = [
        19,
        tokenData.id,
        `${refExcludeName} Update Exclude successfully`,
        CurrentTime(),
        tokenData.id,
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "exclude updated successfully",
          token: tokens,
          update: update,
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
          message: "exclude update failed",
          token: tokens,
          error: errorMessage,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listExcludeV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listExcludeQuery);

      return encrypt(
        {
          success: true,
          message: "list exclude successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list exclude",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteExcludeV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refExcludeId } = userData;
      const result = await client.query(deleteExcludeQuery, [
        refExcludeId,
        CurrentTime(),
        tokendata.id,
      ]);

      console.log("result", result);
      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Exclude not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      const history = [
        37, // Unique ID for delete action
        tokendata.id,
        "delete Exclude",
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Exclude deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Exclude:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Exclude",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async addDriverDetailsV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();

    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const {
        refDriverName,
        refDriverAge,
        refDriverMail,
        refDriverMobile,
        refDriverLocation,
        isVerified,
      } = userData;

      const driverResult = await client.query(addDriverDetailsQuery, [
        refDriverName,
        refDriverAge,
        refDriverMail,
        refDriverMobile,
        refDriverLocation,
        isVerified,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [20, token.id, "Add driver", CurrentTime(), tokendata.id];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "driver added successfully",
          // data: driverResult,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during driver addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateDriverDetailsV1(
    userData: any,
    tokenData: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const {
        refDriverDetailsId,
        refDriverName,
        refDriverAge,
        refDriverMail,
        refDriverMobile,
        refDriverLocation,
        isVerified,
      } = userData;

      const checkResult = await executeQuery(checkDriverDetailsQuery, [
        refDriverDetailsId,
      ]);
      console.log("checkResult", checkResult);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "DriverDetails Id not found",
            token: tokens,
          },
          true
        );
      }

      const params = [
        refDriverDetailsId,
        refDriverName,
        refDriverAge,
        refDriverMail,
        refDriverMobile,
        refDriverLocation,
        isVerified,
        CurrentTime(),
        tokenData.id,
      ];

      const update = await client.query(updateDriverDetailsQuery, params);

      const history = [
        21,
        tokenData.id,
        "Update driver details",
        CurrentTime(),
        tokenData.id,
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "driver details updated successfully",
          token: tokens,
          update: update,
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
          message: "driver details update failed",
          token: tokens,
          error: errorMessage,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listDriverDetailsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listDriverDetailsQuery);

      return encrypt(
        {
          success: true,
          message: "list DriverDetails successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list DriverDetails",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteDriverDetailsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refDriverDetailsId } = userData;
      const result = await client.query(deleteDriverDetailsQuery, [
        refDriverDetailsId,
        CurrentTime(),
        "Admin",
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "DriverDetails not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      const history = [
        38, // Unique ID for delete action
        tokendata.id,
        "delete Driver Details",
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "DriverDetails deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting DriverDetails:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the DriverDetails",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  // public async addTermsAndConditionsV1(
  //   userData: any,
  //   tokendata: any
  // ): Promise<any> {
  //   const client: PoolClient = await getClient();

  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);
  //   try {
  //     const { refCarsId, refAnswer } = userData;

  //     const userResult = await executeQuery(addTermsAndConditionsQuery, [
  //       refCarsId,
  //       refAnswer,
  //       CurrentTime(),
  //       "Admin",
  //     ]);

  //     const history = [
  //       22,
  //       tokendata.id,
  //       "addTermsAndConditions",
  //       CurrentTime(),
  //       "Admin",
  //     ];

  //     const updateHistory = await client.query(updateHistoryQuery, history);

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Terms And Conditions added successfully",
  //         data: userResult,
  //         token: tokens,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An unknown error occurred during add Terms And Conditions",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   }
  // }
  public async addFormDetailsV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      // Begin transaction
      await client.query("BEGIN");

      // Destructure refBenifitsName from the user data
      const { refFormDetails } = userData;

      console.log("Received userData:", userData);

      // Check if refBenifitsName is an array and has items
      if (!Array.isArray(refFormDetails) || refFormDetails.length === 0) {
        return encrypt(
          {
            success: false,
            message: "No Form Details provided",
            token: tokens,
          },
          true
        );
      }

      const duplicateCheck: any = await client.query(
        checkduplicateFormDetailsQuery,
        [refFormDetails]
      );
      console.log("duplicateCheck", duplicateCheck);

      if (duplicateCheck[0]?.count == 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: `ref Form Details "${refFormDetails}" already exists `,
            token: tokens,
          },
          true
        );
      }

      let resultArray: any[] = [];

      for (const form of refFormDetails) {
        const { refFormDetails: refFormDetails } = form;

        if (!refFormDetails) {
          continue;
        }

        const result = await client.query(addFormDetailsQuery, [
          refFormDetails,
          CurrentTime(),
          tokendata.id,
        ]);

        console.log("Form Details added result:", result);

        resultArray.push(result);
      }

      // Log history of the action
      const history = [
        23,
        tokendata.id,
        `Added Form Details: ${refFormDetails
          .map((item: any) => item.refFormDetails)
          .join(", ")}`,
        CurrentTime(), // Timestamp of the action
        tokendata.id, // Performed by
      ];

      // Commit transaction
      await client.query("COMMIT");

      // Update the history table with the action performed
      await client.query(updateHistoryQuery, history);

      // Return success response
      return encrypt(
        {
          success: true,
          message: "Form Details added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error) {
      // Rollback transaction in case of error
      await client.query("ROLLBACK");

      // Handle the error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during Form Details addition";

      return encrypt(
        {
          success: false,
          message: errorMessage,
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateFormDetailsV1(
    userData: any,
    tokenData: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refFormDetailsId, refFormDetails } = userData;

      const checkResult = await executeQuery(checkFormDetailsQuery, [
        refFormDetailsId,
      ]);
      console.log("checkResult", checkResult);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "form data ID not found",
            token: tokens,
          },
          true
        );
      }

      const params = [
        refFormDetailsId,
        refFormDetails,
        CurrentTime(),
        tokenData.id,
      ];

      const update = await client.query(updateFormDetailsQuery, params);

      const history = [
        24,
        tokenData.id,
        `${refFormDetails}FormDetails is added successfully`,
        CurrentTime(),
        tokenData.id,
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "form details updated successfully",
          token: tokens,
          update: update,
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
          message: "form details update failed",
          token: tokens,
          error: errorMessage,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listFormDetailsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listFormDetailsQuery);

      return encrypt(
        {
          success: true,
          message: "list form data successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list form data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteFormDetailsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refFormDetailsId } = userData;
      const result = await client.query(deleteFormDetailsQuery, [
        refFormDetailsId,
        CurrentTime(),
        "Admin",
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "form Details not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      const history = [
        39, // Unique ID for delete action
        tokendata.id,
        "delete form Details",
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "form Details deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting form Details:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the form Details",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async addCarsV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN"); // Start transaction

      const {
        refVehicleTypeId,
        refPersonCount,
        refBag,
        refFuelType,
        refcarManufactureYear,
        refMileage,
        refTrasmissionType,
        refFuleLimit,
        refOtherRequirements,
        refrefRentalAgreement,
        refFuelPolicy,
        // refDriverRequirements,
        refPaymentTerms,
        carImagePath,
        refCarPrice,
        refCarTypeId,
      } = userData;

      const refBenifits = Array.isArray(userData.refBenifits)
        ? `{${userData.refBenifits.join(",")}}`
        : "{}";

      const refInclude = Array.isArray(userData.refInclude)
        ? `{${userData.refInclude.join(",")}}`
        : "{}";

      const refExclude = Array.isArray(userData.refExclude)
        ? `{${userData.refExclude.join(",")}}`
        : "{}";

      const refFormDetails = Array.isArray(userData.refFormDetails)
        ? `{${userData.refFormDetails.join(",")}}`
        : "{}";

      const customerPrefix = "EV-CAR-";
      const baseNumber = 0;

      const lastCustomerResult = await client.query(getCarIdIdQuery);
      let newCustomerId: string;

      if (lastCustomerResult.rows.length > 0) {
        const lastNumber = parseInt(lastCustomerResult.rows[0].count, 10);
        newCustomerId = `${customerPrefix}${(baseNumber + lastNumber + 1)
          .toString()
          .padStart(4, "0")}`;
      } else {
        newCustomerId = `${customerPrefix}${(baseNumber + 1)
          .toString()
          .padStart(4, "0")}`;
      }

      const params = [
        refVehicleTypeId,
        refPersonCount,
        refBag,
        refFuelType,
        refcarManufactureYear,
        refMileage,
        refTrasmissionType,
        refFuleLimit,
        refBenifits,
        refInclude,
        refExclude,
        refFormDetails,
        refOtherRequirements,
        carImagePath,
        refCarPrice,
        newCustomerId,
        refCarTypeId,
        CurrentTime(),
        tokendata.id,
      ];

      const carsResult = await client.query(addCarsQuery, params);
      const termsPrams = [
        carsResult.rows[0].refCarsId,
        refrefRentalAgreement,
        refFuelPolicy,
        // refDriverRequirements,
        refPaymentTerms,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(addCondation, termsPrams);

      const refCarsId = carsResult.rows[0].refCarsId;
      console.log("Inserted cars ID:", refCarsId);

      const getVehicleName: any = await executeQuery(getVehicleNameQuery, [
        refVehicleTypeId,
      ]);

      console.log("getVehicleName", getVehicleName);

      const vehicleName = getVehicleName[0]?.refVehicleTypeName || "Vehicle";

      // Log history of the action
      const history = [
        24,
        tokendata.id,
        `${vehicleName} added successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Car added successfully with image",
          token: tokens,
          carsResult: carsResult.rows,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback transaction in case of failure

      console.error("Error adding car:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while adding the car",
          error: String(error),
          token: tokens,
        },

        true
      );
    } finally {
      client.release();
    }
  }

  public async uploadCarsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the image from userData
      const image = userData.Image;
      console.log("image", image);

      // Ensure that only one image is provided
      if (!image) {
        throw new Error("Please provide an image.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the image
      console.log("Storing image...");
      filePath = await storeFile(image, 2);

      // Read the file buffer and convert it to Base64
      const imageBuffer = await viewFile(filePath);
      const imageBase64 = imageBuffer.toString("base64");

      storedFiles.push({
        filename: path.basename(filePath),
        content: imageBase64,
        contentType: "image/jpeg", // Assuming the image is in JPEG format
      });

      // Return success response
      return encrypt(
        {
          success: true,
          message: "Image Stored Successfully",
          token: tokens,
          filePath: filePath,
          files: storedFiles,
        },
        true
      );
    } catch (error) {
      console.error("Error occurred:", error);
      return encrypt(
        {
          success: false,
          message: "Error in Storing the Image",
          token: tokens,
        },
        true
      );
    }
  }
  public async deleteCarImageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      let filePath: string | any;

      if (userData.refCarsId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getImageRecordQuery, [
          userData.refCarsId,
        ]);
        if (imageRecord.length === 0) {
          return encrypt(
            {
              success: false,
              message: "Image record not found",
              token: tokens,
            },
            true
          );
        }

        filePath = imageRecord[0].refGallery;
        console.log("filePath", filePath);

        // Delete the image record from the database
        await executeQuery(deleteImageRecordQuery, [userData.refCarsId]);
      } else if (userData.filePath) {
        // Fallback path deletion
        filePath = userData.filePath;
      } else {
        return encrypt(
          {
            success: false,
            message: "No user ID or file path provided for deletion",
            token: tokens,
          },
          true
        );
      }
      if (filePath) {
        await deleteFile(filePath); // Delete file from local storage
      }

      return encrypt(
        {
          success: true,
          message: "gallery image deleted successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.error("Error in deleting file:", (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Deleting Image: ${(error as Error).message}`,
          token: tokens,
        },
        true
      );
    }
  }
  public async updateCarsV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const {
        refCarsId, // to identify the car you want to update
        refVehicleTypeId,
        refPersonCount,
        refBag,
        refFuelType,
        refcarManufactureYear,
        refMileage,
        refTrasmissionType,
        refFuleLimit,
        refOtherRequirements,
        refrefRentalAgreement,
        refFuelPolicy,
        // refDriverRequirements,
        refPaymentTerms,
        refCarPrice,
        carImagePath,
        refCarTypeId,
      } = userData;

      // const refBenifits = `{${userData.refBenifits.join(",")}}`;
      // const refInclude = `{${userData.refInclude.join(",")}}`;
      // const refExclude = `{${userData.refExclude.join(",")}}`;
      // const refFormDetails = `{${userData.refFormDetails.join(",")}}`;

      const refBenifits = Array.isArray(userData.refBenifits)
        ? `{${userData.refBenifits.join(",")}}`
        : "{}";

      const refInclude = Array.isArray(userData.refInclude)
        ? `{${userData.refInclude.join(",")}}`
        : "{}";

      const refExclude = Array.isArray(userData.refExclude)
        ? `{${userData.refExclude.join(",")}}`
        : "{}";

      const refFormDetails = Array.isArray(userData.refFormDetails)
        ? `{${userData.refFormDetails.join(",")}}`
        : "{}";

      const params = [
        refVehicleTypeId,
        refPersonCount,
        refBag,
        refFuelType,
        refcarManufactureYear,
        refMileage,
        refTrasmissionType,
        refFuleLimit,
        refBenifits,
        refInclude,
        refExclude,
        refFormDetails,
        refOtherRequirements,
        carImagePath, // Updated image path (if provided)
        refCarPrice,
        refCarTypeId,
        CurrentTime(),
        tokendata.id,
        refCarsId, // Specify the car to be updated by `refCarsId`
      ];

      const updateResult = await client.query(updateCarsQuery, params);
      console.log("updateResult", updateResult);

      const termsPrams = [
        refCarsId,
        refrefRentalAgreement,
        refFuelPolicy,
        refPaymentTerms,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateCondation, termsPrams);

      const updatedCar = updateResult.rows[0];
      console.log("Updated car ID:", updatedCar.refCarsId);

      const getVehicleName: any = await executeQuery(getVehicleNameQuery, [
        refVehicleTypeId,
      ]);

      console.log("getVehicleName", getVehicleName);

      const vehicleName = getVehicleName[0]?.refVehicleTypeName || "Vehicle";
      // Log history of the action
      const history = [
        26,
        tokendata.id,
        `${vehicleName} car data updated Succesfully`,
        CurrentTime(),
        tokendata.id,
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Car updated successfully",
          token: tokens,
          carsResult: updatedCar,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback transaction in case of failure
      console.error("Error updating car:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while updating the car",
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async listCarsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // const {refCarTypeId} = userData
      const result = await executeQuery(listCarsQuery);

      for (const image of result) {
        if (image.refCarPath) {
          try {
            const fileBuffer = await viewFile(image.refCarPath);
            image.refCarPath = {
              filename: path.basename(image.refCarPath),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Change based on actuwal file type if necessary
            };
          } catch (error) {
            console.error("Error reading image file for product ,err");
            image.refCarPath = null; // Handle missing or unreadable files gracefully
          }
        }
      }

      // let profileFile = null;
      // if (Data.refProfilePath) {
      //   const profileFilePath = Data.refProfilePath;
      //   try {
      //     const fileBuffer = await viewFile(profileFilePath);
      //     const fileBase64 = fileBuffer.toString("base64"); // Convert file to base64 to pass in response
      //     profileFile = {
      //       filename: path.basename(profileFilePath),
      //       content: fileBase64,
      //       contentType: "image/jpeg", // Assume JPEG, adjust if necessary
      //     };
      //   } catch (err) {
      //     console.error("Error retrieving profile file:", err);
      //   }
      // }
      return encrypt(
        {
          success: true,
          message: "listed car successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed packege",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getCarsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refCarsId } = userData;
      console.log("refCarsId liune ------ 1950", refCarsId);

      const result = await executeQuery(getCarsByIdQuery, [refCarsId]);

      for (const image of result) {
        if (image.refCarPath) {
          try {
            const fileBuffer = await viewFile(image.refCarPath);
            image.refCarPath = {
              filename: path.basename(image.refCarPath),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg",
            };
          } catch (error) {
            console.error("Error reading image file for product ,err");
            image.refCarPath = null;
          }
        }
      }

      // for (const image of result) {
      //   if (image.refCarPath) {
      //     try {
      //       image.refCarPath = path.basename(image.refCarPath);
      //     } catch (error) {
      //       console.error("Error extracting filename from refCarPath:", error);
      //       image.refCarPath = null;
      //     }
      //   }
      // }

      return encrypt(
        {
          success: true,
          message: "listed car by id successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed car",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteCarsV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction
      const { refCarsId } = userData;
      const result = await client.query(deleteCarsQuery, [
        refCarsId,
        CurrentTime(),
        tokendata.id,
      ]);

      // const getDeletedCar = await executeQuery(getDeletedCarQuery,[refCarsId])

      // if (result.rowCount === 0) {
      //   await client.query("ROLLBACK");
      //   return encrypt(
      //     {
      //       success: false,
      //       message: "car not found or already deleted",
      //       token: tokens,
      //     },
      //     true
      //   );
      // }

      // Insert delete action into history

      const history = [
        48, // Unique ID for delete action
        tokendata.id,
        `car with ${refCarsId} Id deleted Successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "car deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting car:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Vehicle",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async getCarTypeV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(getCarTypeQuery);
      return encrypt(
        {
          success: true,
          message: "CarType listed successfully",
          token: tokens,
          Data: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in listed carType:", error);
      return encrypt(
        {
          success: false,
          message: "An error occurred while listed carType",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
}
