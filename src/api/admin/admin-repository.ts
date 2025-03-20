import {  executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";
import { encrypt } from "../../helper/encrypt";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { listCarBookingsQuery, listCustomizeTourBookingsQuery, listTourBookingsQuery, 
  selectUserByLogin, 
  updateHistoryQuery
 } from "./query";
import { CurrentTime } from "../../helper/common";

export class adminRepository {
  public async adminLoginV1(user_data: any, domain_code?: any): Promise<any> {
    const client: PoolClient = await getClient();

    try {
      const params = [user_data.login];
      console.log("params line ------ 25", params);
      const users = await client.query(selectUserByLogin, params);
      console.log("users", users);

      if (users.rows.length > 0) {
        const user = users.rows[0];

        console.log("User data:", user);
        console.log("User hashed password:", user.refUserHashedPassword); // Correct field name
        console.log("Entered password:", user_data.password);

        if (!user.refUserHashedPassword) {
          console.error("Error: User has no hashed password stored.");
          return encrypt(
            {
              success: false,
              message: "Invalid login credentials",
            },
            true
          );
        }

        const validPassword = await bcrypt.compare(
          user_data.password,
          user.refUserHashedPassword
        );
        console.log("validPassword", validPassword);
        if (validPassword) {
          const tokenData = { id: user.refUserId };
          console.log('tokenData', tokenData)

           const history = [
            1,
            user.refUserId,
            "logIn",
            CurrentTime(),
            "Admin",
          ];
    
          const updateHistory = await client.query(updateHistoryQuery, history);

          return encrypt(
            {
              success: true,
              message: "Login successful",
              token: generateTokenWithoutExpire(tokenData, true),
            },
            true
          );
        }
      }

      return encrypt(
        {
          success: false,
          message: "Invalid login credentials",
        },
        true
      );
    } catch (error) {
      console.error("Error during login:", error);
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listTourBookingsV1(userData: any, tokendata: any): Promise<any> {
        const token = { id: tokendata.id };
        const tokens = generateTokenWithExpire(token, true);
        try {
          const result = await executeQuery (listTourBookingsQuery);
    
          return encrypt(
            {
              success: true,
              message: "listed tour bookings successfully",
              token: tokens,
              result: result,
            },
            true
  
          );
        } catch (error: unknown) {
          return encrypt(
            {
              success: false,
              message: "An unknown error occurred during listed tour bookings",
              token: tokens,
              error: String(error),
            },
            true
          );
        }
  }
  public async listCarBookingsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery (listCarBookingsQuery);

      return encrypt(
        {
          success: true,
          message: "listed car bookings successfully",
          token: tokens,
          result: result,
        },
        true

      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed car bookings",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listCustomizeTourBookingsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery (listCustomizeTourBookingsQuery);

       // Convert images to Base64 format
       for (const product of result) {
        if (product.refVaccinationCertificate) {
          try {
            const fileBuffer = await fs.promises.readFile(product.refVaccinationCertificate);
            product.refVaccinationCertificate = {
              filename: path.basename(product.refVaccinationCertificate),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", 
            };
          } catch (err) {
            console.error("Error reading image file for product ${product.productId}:,err ");
            product.foodPic = null; 
          }
        }
      }


      return encrypt(
        {
          success: true,
          message: "listed Customize Tour Bookings successfully",
          token: tokens,
          result: result,
        },
        true

      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed Customize Tour Bookings",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
}
