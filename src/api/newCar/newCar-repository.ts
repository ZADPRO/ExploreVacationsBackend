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
import nodemailer from "nodemailer";
import { sendEmail } from "../../helper/mail";

import { cli } from "winston/lib/winston/config";
import {
  addCarGroupQuery,
  addOfflineCarBookingQuery,
  checkCarGroupIdQuery,
  checkCarGroupQuery,
  deleteCarGroupQuery,
  deleteOfflineCarBookingQuery,
  drivarDetailsQuery,
  getCarGroupQuery,
  listCarGroupQuery,
  listOfflineCarBookingQuery,
  updateCarGroupQuery,
  updateHistoryQuery,
} from "./query";
import { getcarNameQuery } from "../user/query";
import { generateCarBookingEmailContent } from "../../helper/mailcontent";

export class newCarsRepository {
  public async addCarGroupV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refCarGroupName } = userData;

      const check: any = await executeQuery(checkCarGroupQuery, [
        refCarGroupName,
      ]);

      const count = Number(check[0]?.count || 0); // safely convert to number

      if (count > 0) {
        throw new Error(
          `Duplicate car group Name found: "${refCarGroupName}" already exists.`
        );
      }

      const carGroupResult = await client.query(addCarGroupQuery, [
        refCarGroupName,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        62,
        tokendata.id,
        `${refCarGroupName} car group added successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");
      return encrypt(
        {
          success: true,
          message: "car group added successfully",
          data: carGroupResult,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during car group addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateCarGroupV1(userData: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refCarGroupId, refCarGroupName } = userData;

      const checkResult = await executeQuery(checkCarGroupIdQuery, [
        refCarGroupId,
      ]);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "carGroup ID not found",
            token: tokens,
          },
          true
        );
      }
      const check: any = await executeQuery(checkCarGroupQuery, [
        refCarGroupName,
      ]);

      const count = Number(check[0]?.count || 0); // safely convert to number

      if (count > 0) {
        throw new Error(
          `Duplicate carGroupType Name found: "${refCarGroupName}" already exists.`
        );
      }

      const params = [
        refCarGroupId,
        refCarGroupName,
        CurrentTime(),
        tokenData.id,
      ];

      const updatecarGroup = await client.query(updateCarGroupQuery, params);

      const history = [
        63,
        tokenData.id,
        `${refCarGroupName} car Group updated successfully`,
        CurrentTime(),
        tokenData.id,
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "car Group updated successfully",
          updatecarGroup: updatecarGroup,
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.log("error", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "carGroup update failed",
          token: tokens,
          error: errorMessage,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteCarGroupV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refCarGroupId } = userData;
      const result = await client.query(deleteCarGroupQuery, [
        refCarGroupId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Car Group not found or already deleted",
            token: tokens,
          },
          true
        );
      }
      const getresult: any = await executeQuery(getCarGroupQuery, [
        refCarGroupId,
      ]);

      const { refCarGroupName } = getresult[0];

      // Insert delete action into history
      const history = [
        64, // Unique ID for delete action
        tokendata.id,
        `${refCarGroupName} Car Group deleted successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Car Group deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Car Group:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Car Group",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listCarGroupV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listCarGroupQuery);

      return encrypt(
        {
          success: true,
          message: "list CarGroup successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list  CarGroup",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async userOfflineCarBookingV1(
    userData?: any,
    tokendata?: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction
      const {
        refCarsId,
        refUserName,
        refUserMail,
        refUserMobile,
        refPickupAddress,
        refSubmissionAddress,
        refPickupDate,
        refAdultCount,
        refChildrenCount,
        refInfants,
        refOtherRequirements,
        refDriverName,
        refDriverAge,
        refDriverMail,
        refDriverMobile,

        isExtraKMneeded,
        refExtraKm,
      } = userData;

      const refFormDetails = `{${userData.refFormDetails.join(",")}}`;

      const isExtraKMneed = isExtraKMneeded === true;
      const ExtraKm = isExtraKMneed ? refExtraKm : null;

      // Insert booking data
      const Result: any = await client.query(addOfflineCarBookingQuery, [
        refCarsId,
        refUserName,
        refUserMail,
        refUserMobile,
        refPickupAddress,
        refSubmissionAddress,
        refPickupDate,
        refAdultCount,
        refChildrenCount,
        refInfants,
        refFormDetails,
        refOtherRequirements,
        "offline", //refBookingType
        isExtraKMneed,
        ExtraKm,
        CurrentTime(),
        tokendata.id,
        tokendata.id,
      ]);

      //way 1

      const daysLeft = Math.ceil(
        (new Date(refPickupDate).getTime() -
          new Date(CurrentTime()).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const getCarName: any = await executeQuery(getcarNameQuery, [refCarsId]);

      const { refCarTypeName, refVehicleTypeName, refCarCustId, refCarPrice } =
        getCarName[0];

      const userMailData = {
        daysLeft: daysLeft,
        refPickupDate: refPickupDate,
        refUserName: refUserName,
        refCarTypeName: refCarTypeName,
        refVehicleTypeName: refVehicleTypeName,
        refCarCustId: refCarCustId,
        refCarPrice: refCarPrice,
      };

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAILID,
          pass: process.env.PASSWORD,
        },
      });

      const mailoption = {
        from: process.env.EMAILID,
        to: "rac_booking@explorevacations.ch",
        subject: "New offline car Booking Received",
        html: generateCarBookingEmailContent(Result.rows),
      };

      transporter.sendMail(mailoption);

      const drivarDetails = await client.query(drivarDetailsQuery, [
        refDriverName,
        refDriverAge,
        refDriverMail,
        refDriverMobile,
        CurrentTime(),
        tokendata.id,
      ]);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "User offline car booking added successfully",
          token: tokens,
          Data: Result.rows[0],
          drivarDetails: drivarDetails,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback transaction
      console.error("Error adding user offline car booking:", error);

      return encrypt(
        {
          success: false,
          message:
            "An error occurred while adding the user offline car booking",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listOfflineCarBookingV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listOfflineCarBookingQuery);

      return encrypt(
        {
          success: true,
          message: "list offline car bookings successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list offline car bookings",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteOfflineCarBookingV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { offlineCarBookingId } = userData;
      const result = await client.query(deleteOfflineCarBookingQuery, [
        offlineCarBookingId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Offline Car Booking not found or already deleted",
            token: tokens,
          },
          true
        );
      }
      // const getresult: any = await executeQuery(getCarGroupQuery, [
      //   offlineCarBookingId,
      // ]);

      // const { refCarGroupName } = getresult[0];

      // // Insert delete action into history
      // const history = [
      //   64, // Unique ID for delete action
      //   tokendata.id,
      //   `${refCarGroupName} Car Group deleted successfully`,
      //   CurrentTime(),
      //   tokendata.id,
      // ];

      // await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Car Group deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Car Group:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Car Group",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
}
