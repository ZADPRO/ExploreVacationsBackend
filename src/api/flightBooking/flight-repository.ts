import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import fs from "fs";
import nodemailer from "nodemailer";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { CurrentTime } from "../../helper/common";
import {
  addFlightBookingQuery,
  deleteflightBookingQuery,
  listFlightBookingQuery,
  listuserflightBookingHistoryQuery,
} from "./query";
import { generateflightBookingEmailContent } from "../../helper/mailcontent";

export class flightRepository {
  public async flightBookingV1(userData?: any, tokendata?: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction
      const {
        refUserName,
        refMoblile,
        refEmail,
        refPickup,
        refDestination,
        flightORtour,
        refAdultCount,
        refKidsCount,
        refInfantsCount,
        refRequirements,
      } = userData;

      // Insert booking data
      const Result: any = await client.query(addFlightBookingQuery, [
        refUserName,
        refMoblile,
        refEmail,
        refPickup,
        refDestination,
        flightORtour,
        refAdultCount,
        refKidsCount,
        refInfantsCount,
        refRequirements,
        CurrentTime(),
        tokendata.id,
      ]);

      console.log("Result", Result);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAILID,
          pass: process.env.PASSWORD,
        },
      });

      const mailoption = {
        from: process.env.EMAILID,
        to: "indumathi123indumathi@gmail.com",
        subject: "New flight Booking Enquery Received",
        html: generateflightBookingEmailContent(Result.rows[0]),
      };

      transporter.sendMail(mailoption);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "User car booking added successfully",
          token: tokens,
          Data: Result.rows[0],
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback transaction
      console.error("Error adding user flight Booking Enquery:", error);

      return encrypt(
        {
          success: false,
          message:
            "An error occurred while adding the user flight Booking Enquery",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async userflightBookingHistoryV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listuserflightBookingHistoryQuery, [
        tokendata.id,
      ]);

      return encrypt(
        {
          success: true,
          message: "list user flight Booking History successfully",
          result: result,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list user flight Booking History:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list user flightBooking History",
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async listFlightBookingV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listFlightBookingQuery);

      return encrypt(
        {
          success: true,
          message: "list user flight Booking  successfully",
          result: result,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list user flight Booking :", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list user flightBooking History",
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async deleteFlightBookingV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(deleteflightBookingQuery, [
        userData.flightBookingId,
        CurrentTime,
        tokendata.id,
      ]);

      return encrypt(
        {
          success: true,
          message: "list user flight Booking History successfully",
          result: result,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list user flight Booking History:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list user flightBooking History",
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }
}
