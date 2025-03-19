import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile, convertToBase64, storetheFile } from "../../helper/storage";
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
  addVehicleQuery,
  addBenifitsQuery,
  addIncludeQuery,
  addExcludeQuery,
  addDriverDetailsQuery,
  addTermsAndConditionsQuery,
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
  addFormDetailsQuery,
  checkFormDetailsQuery,
  updateFormDetailsQuery,
  listFormDetailsQuery,
  updateCarsQuery,
  listCarsQuery,
  getCarsByIdQuery,
  listDriverDetailsQuery,
} from "./query";
import { any } from "@hapi/joi";
import { HeapInfo } from "v8";

export class carsRepository {
  public async addVehicleV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refVehicleTypeName } = userData;
      console.log("userData", userData);

      const userResult = await client.query(addVehicleQuery, [
        refVehicleTypeName,
        CurrentTime(),
        "Admin",
      ]);

      console.log("userResult", userResult.rows);
      const history = [12, tokendata.id, "add Vehicle", CurrentTime(), "Admin"];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");
      return encrypt(
        {
          success: true,
          message: "vehicle added successfully",
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
          message: "An unknown error occurred during vehicle addition",
          token: tokens,
          error: String(error),
        },
        true
      );
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

      const params = [
        refVehicleTypeId,
        refVehicleTypeName,
        CurrentTime(),
        "Admin",
      ];

      const updateDestination = await client.query(updateVehicleQuery, params);

      const history = [
        13,
        tokenData.id,
        "Update vehicle",
        CurrentTime(),
        "Admin",
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "vehicle updated successfully",
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
          "Admin",
        ]);

        console.log("Benefit added result:", result);

        resultArray.push(result);
      }

      // Log history of the action
      const history = [
        14, // History type ID for "add benefits"
        tokendata.id, // User ID
        "add benefits", // Action name
        CurrentTime(), // Timestamp of the action
        "Admin", // Performed by
      ];

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
          : "An unknown error occurred during location addition";

      return encrypt(
        {
          success: false,
          message: errorMessage,
          error: String(error),
          token: tokens,
        },
        true
      );
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

      const params = [refBenifitsId, refBenifitsName, CurrentTime(), "Admin"];

      const updateBenifits = await client.query(updateBenifitsQuery, params);

      const history = [
        15,
        tokenData.id,
        "Update benifits",
        CurrentTime(),
        "Admin",
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "vehicle updated successfully",
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
          message: "vehicle update failed",
          token: tokens,
          error: errorMessage,
        },
        true
      );
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

  public async addIncludeV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { refIncludeName } = userData;

      console.log("Received userData:", userData);

      if (!Array.isArray(refIncludeName) || refIncludeName.length === 0) {
        return encrypt(
          {
            success: false,
            message: "No benefits provided",
            token: tokens,
          },
          true
        );
      }

      let resultArray: any[] = [];

      for (const include of refIncludeName) {
        const { refIncludeName: refIncludeName } = include;

        if (!refIncludeName) {
          continue;
        }

        const result = await client.query(addIncludeQuery, [
          refIncludeName,
          CurrentTime(),
          "Admin",
        ]);

        console.log("Benefit added result:", result);

        resultArray.push(result);
      }

      // Log history of the action
      const history = [
        16,
        tokendata.id,
        "add uncludes",
        CurrentTime(),
        "Admin",
      ];

      // Commit transaction
      await client.query("COMMIT");

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
          : "An unknown error occurred during location addition";

      return encrypt(
        {
          success: false,
          message: errorMessage,
          error: String(error),
          token: tokens,
        },
        true
      );
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

      const params = [refIncludeId, refIncludeName, CurrentTime(), "Admin"];

      const updateBenifits = await client.query(updateIncludeQuery, params);

      const history = [
        17,
        tokenData.id,
        "Update include",
        CurrentTime(),
        "Admin",
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "vehicle updated successfully",
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
          message: "vehicle update failed",
          token: tokens,
          error: errorMessage,
        },
        true
      );
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
            message: "No benefits provided",
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
          "Admin",
        ]);

        console.log("excludes added result:", result);

        resultArray.push(result);
      }

      // Log history of the action
      const history = [
        18,
        tokendata.id,
        "add excludes",
        CurrentTime(),
        "Admin",
      ];

      // Commit transaction
      await client.query("COMMIT");

      await client.query(updateHistoryQuery, history);

      // Return success response
      return encrypt(
        {
          success: true,
          message: "excludes added successfully",
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
          false
        );
      }

      const params = [refExcludeId, refExcludeName, CurrentTime(), "Admin"];

      const update = await client.query(updateExcludeQuery, params);

      const history = [
        19,
        tokenData.id,
        "Update Exclude",
        CurrentTime(),
        "Admin",
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
        false
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
        false
      );
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

  public async addDriverDetailsV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();

    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
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
        "Admin",
      ]);

      const history = [20, token.id, "Add driver", CurrentTime(), "vendor"];

      const updateHistory = await client.query(updateHistoryQuery, history);

      return encrypt(
        {
          success: true,
          message: "driver added successfully",
          data: driverResult,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during driver addition",
          token: tokens,
          error: String(error),
        },
        true
      );
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
            message: "include ID not found",
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
        "Admin",
      ];

      const update = await client.query(updateDriverDetailsQuery, params);

      const history = [
        21,
        tokenData.id,
        "Update driver details",
        CurrentTime(),
        "Admin",
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
    }
  }
  public async listDriverDetailsV1(userData: any, tokendata: any): Promise<any> {
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

  public async addTermsAndConditionsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();

    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refAnswer, refTermsAndConditionsId } = userData;

      const userResult = await executeQuery(addTermsAndConditionsQuery, [
        refAnswer,
        refTermsAndConditionsId,
        CurrentTime(),
        "Admin",
      ]);

      const history = [
        22,
        tokendata.id,
        "addTermsAndConditions",
        CurrentTime(),
        "Admin",
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);

      return encrypt(
        {
          success: true,
          message: "TermsAndConditions added successfully",
          data: userResult,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during add Terms And Conditions",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
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
            message: "No FormDetails provided",
            token: tokens,
          },
          false
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
          "Admin",
        ]);

        console.log("Benefit added result:", result);

        resultArray.push(result);
      }

      // Log history of the action
      const history = [
        23,
        tokendata.id,
        "addFormDetails", // Action name
        CurrentTime(), // Timestamp of the action
        "Admin", // Performed by
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
        false
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
        false
      );
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

      const params = [refFormDetailsId, refFormDetails, CurrentTime(), "Admin"];

      const update = await client.query(updateFormDetailsQuery, params);

      const history = [
        24,
        tokenData.id,
        "Update form details",
        CurrentTime(),
        "Admin",
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

  // public async addCarsV1(userData: any, tokendata: any): Promise<any> {
  //     const client: PoolClient = await getClient();
  //     const token = { id: tokendata.id };
  //     const tokens = generateTokenWithExpire(token, true);
  //     try {
  //       await client.query("BEGIN"); // Start transaction
  //       const {
  //         refVehicleTypeId,
  //         refPersonCount,
  //         refBag,
  //         refFuelType,
  //         refcarManufactureYear,
  //         refMileage,
  //         refTrasmissionType,
  //         refFuleLimit,
  //         refBenifits,
  //         refInclude,
  //         refExclude,
  //         refDriverDetailsId,
  //         refTermsAndConditionsId,
  //         refFormDetailsId,
  //         refOtherRequirements

  //       } = userData;

  //       // Insert package details and get refPackageId
  //       const carsResult = await client.query(addCarsQuery, [
  //         refVehicleTypeId,
  //         refPersonCount,
  //         refBag,
  //         refFuelType,
  //         refcarManufactureYear,
  //         refMileage,
  //         refTrasmissionType,
  //         refFuleLimit,
  //         refBenifits,
  //         refInclude,
  //         refExclude,
  //         refDriverDetailsId,
  //         refTermsAndConditionsId,
  //         refFormDetailsId,
  //         refOtherRequirements,
  //         CurrentTime(),
  //         "Admin"
  //       ]);

  //       const refCarsId = carsResult.rows[0].refCarsId;
  //       console.log("Inserted cars ID:", refCarsId);

  //       const history = [
  //         24,
  //         tokendata.id,
  //         "add cars",
  //         CurrentTime(),
  //         "Admin",
  //       ];

  //       const updateHistory = await client.query(updateHistoryQuery, history);
  //       await client.query("COMMIT"); // Commit transaction

  //       return encrypt(
  //         {
  //           success: true,
  //           message: "Package and gallery images added successfully",
  //           token: token,
  //           carsResult: carsResult.rows[0],
  //         },
  //         true
  //       );
  //     } catch (error: unknown) {
  //       await client.query("ROLLBACK"); // Rollback transaction in case of failure
  //       console.error("Error adding package:", error);

  //       return encrypt(
  //         {
  //           success: false,
  //           message: "An error occurred while adding the package",
  //           error: String(error),
  //         },
  //         true
  //       );
  //     } finally {
  //       client.release();
  //     }
  // }

  public async addCarsV1(
    userData: any,
    tokendata: any,
    carImage: any
  ): Promise<any> {
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
        refDriverDetailsId,
        refTermsAndConditionsId,
        refOtherRequirements,
      } = userData;
      console.log('userData', userData)

      const refBenifits = Array.isArray(userData.refBenifits) ? `{${userData.refBenifits.join(",")}}` : "{}";
      const refInclude = Array.isArray(userData.refInclude) ? `{${userData.refInclude.join(",")}}` : "{}";
      const refExclude = Array.isArray(userData.refExclude) ? `{${userData.refExclude.join(",")}}` : "{}";
      const refFormDetails = Array.isArray(userData.refFormDetails) ? `{${userData.refFormDetails.join(",")}}` : "{}";

      const carImagePath = await storetheFile(carImage, 2); // 2 for car images
      console.log('carImagePath', carImagePath)

      const carImageBase64 = await convertToBase64(carImagePath);
      console.log('carImageBase64', carImageBase64)

      const carsResult = await client.query(addCarsQuery, [
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
        refDriverDetailsId,
        refTermsAndConditionsId,
        refFormDetails,
        refOtherRequirements,
        carImagePath, // Store the image path
        CurrentTime(),
        "Admin",
      ]);
      console.log('carsResult', carsResult)

      const refCarsId = carsResult.rows[0].refCarsId;
      console.log("Inserted cars ID:", refCarsId);

      // Log history of the action
      const history = [
        24, 
        tokendata.id,
        "add cars", 
        CurrentTime(), 
        "Admin"
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Car added successfully with image",
          token: tokens,
          carsResult: carsResult.rows[0],
          imageBase64: carImageBase64, 
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
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateCarsV1(
    userData: any,
    tokendata: any,
    carImage: any
  ): Promise<any> {
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
        refDriverDetailsId,
        refTermsAndConditionsId,
        refOtherRequirements,
      } = userData;
      console.log('userData', userData)
  
      const refBenifits = `{${userData.refBenifits.join(",")}}`;
      const refInclude = `{${userData.refInclude.join(",")}}`;
      const refExclude = `{${userData.refExclude.join(",")}}`;
      const refFormDetails = `{${userData.refFormDetails.join(",")}}`;
  
      let carImagePath = null;
      let carImageBase64 = null;
  
      if (carImage) {
        // If there's an image to upload, store it and convert it to base64
        carImagePath = await storetheFile(carImage, 2); // 2 for car images
        carImageBase64 = await convertToBase64(carImagePath);
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
        refDriverDetailsId,
        refTermsAndConditionsId,
        refFormDetails,
        refOtherRequirements,
        carImagePath, // Updated image path (if provided)
        CurrentTime(),
        "Admin",
        refCarsId, // Specify the car to be updated by `refCarsId`
      ];
  
      const updateResult = await client.query(updateCarsQuery, params);
      console.log('updateResult', updateResult)
  
      const updatedCar = updateResult.rows[0];
      console.log("Updated car ID:", updatedCar.refCarsId);
  
      // Log history of the action
      const history = [
        26,
        tokendata.id,
        "update cars",
        CurrentTime(),
        "Admin",
      ];
  
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction
  
      return encrypt(
        {
          success: true,
          message: "Car updated successfully",
          token: tokens,
          carsResult: updatedCar,
          imageBase64: carImageBase64, // Return image in base64 format (if updated)
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
        const result = await executeQuery(listCarsQuery);
  
        return encrypt(
          {
            success: true,
            message: "listed packege successfully",
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

      const {refCarsId} = userData;

      const result = await executeQuery(getCarsByIdQuery, [refCarsId]);

      return encrypt(
        {
          success: true,
          message: "listed packege successfully",
          token: tokens,
          result: result,
        },
        false
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed packege",
          token: tokens,
          error: String(error),
        },
        false
      );
    }
  }
  

}
