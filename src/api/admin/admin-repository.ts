import {  getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";
import { encrypt } from "../../helper/encrypt";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { selectUserByLogin } from "./query";

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
        false
      );
    } finally {
      client.release();
    }
  }
}
