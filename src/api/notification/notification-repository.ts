import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";
import { encrypt } from "../../helper/encrypt";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import { generateTokenWithExpire } from "../../helper/token";

import { CurrentTime } from "../../helper/common";

import {
  addNotificationQuery,
  deleteNotificationQuery,
  getNotificationQuery,
  listNotificationQuery,
  readNotificationQuery,
  staffNotificationCountQuery,
  unreadNotificationQuery,
  updateNotificationQuery,
  updateReadStatusQuery,
} from "./query";

export class notificationRepository {
  public async addNotificationsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refSubject, refDescription, refNotes } = userData;

      const refUserTypeId = Array.isArray(userData.refUserTypeId)
        ? `{${userData.refUserTypeId.join(",")}}`
        : `{${userData.refUserTypeId.split(",").join(",")}}`;

      const Result = await executeQuery(addNotificationQuery, [
        refUserTypeId,
        refSubject,
        refDescription,
        refNotes,
        CurrentTime(),
        tokendata.id
      ]);

      //   const history = [
      //     53,
      //     tokendata.id,
      //     `${refParkingName} car parking Added`,
      //     CurrentTime(),
      //     tokendata.id,
      //   ];

      //   const updateHistory = await client.query(updateHistoryQuery, history);

      return encrypt(
        {
          success: true,
          message: "Notifications added successfully",
          token: tokens,
          Result: Result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error adding Notifications:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while adding the Notifications",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateNotificationsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refNotificationsId, refSubject, refDescription, refNotes } =
        userData;

      const refUserTypeId = Array.isArray(userData.refUserTypeId)
        ? `{${userData.refUserTypeId.join(",")}}`
        : `{${userData.refUserTypeId.split(",").join(",")}}`;

      const Result = await executeQuery(updateNotificationQuery, [
        refNotificationsId,
        refUserTypeId,
        refSubject,
        refDescription,
        refNotes,
        CurrentTime(),
        tokendata.id
      ]);
      return encrypt(
        {
          success: true,
          message: "Notifications updated successfully",
          token: tokens,
          Result: Result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error update Notifications:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while updating the Notifications",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listNotificationsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const Result = await executeQuery(listNotificationQuery);

      return encrypt(
        {
          success: true,
          message: "Notifications listed successfully",
          token: tokens,
          Result: Result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list Notifications:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while listed the Notifications",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getNotificationsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const Result = await executeQuery(getNotificationQuery, [
        userData.refNotificationsId
      ]);

      return encrypt(
        {
          success: true,
          message: "get Notifications by id successfully",
          token: tokens,
          Result: Result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error get Notifications:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while getting the Notifications",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteNotificationsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const Result = await executeQuery(deleteNotificationQuery, [
        userData.refNotificationsId,
        CurrentTime(),
        tokendata.id
      ]);

      return encrypt(
        {
          success: true,
          message: "get Notifications by id successfully",
          token: tokens,
          Result: Result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error get Notifications:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while getting the Notifications",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  //--------------------------------------------------------------------------------------------------------

  public async staffNotificationCountV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {

      const Result = await executeQuery(staffNotificationCountQuery, [tokendata.id]);
   
      return encrypt(
        {
          success: true,
          message: "get staff Notification Count successfully",
          token: tokens,
          Result: Result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error get staff Notification Count:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while getting the staff Notification Count",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async staffNotificationsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const Result1 = await executeQuery(readNotificationQuery,[tokendata.id]);
      const Result2 = await executeQuery(unreadNotificationQuery,[tokendata.id])
      return encrypt(
        {
          success: true,
          message: "get staff Notifications successfully",
          token: tokens,
          readNotification: Result1,
          unReadNotification: Result2
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error get staff Notifications:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while getting the staff Notifications",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateReadStatusV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const readResult = await executeQuery(updateReadStatusQuery,[userData.refNotificationsId]);
      console.log('readResult', readResult)
      return encrypt(
        {
          success: true,
          message: "update Read Status successfully",
          token: tokens,
          readResult: readResult,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in update Read Status:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while update Read Status",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

}
