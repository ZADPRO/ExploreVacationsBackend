// import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";
import fs from "fs";
import { generateTokenWithExpire } from "../../../helper/token";
import { encrypt } from "../../../helper/encrypt";

export class homePageRepository {
    public async uploadHomeImagesV1(userData: any, tokendata: any): Promise<any> {
      const token = { id: tokendata.id };
      const tokens = generateTokenWithExpire(token, true);
    
      try {
      
        return encrypt(
          {
            success: true,
            message: "Home page Images added successfully",
            token: tokens
          },
          false
        );
      } catch (error: unknown) {
        return encrypt(
          {
            success: false,
            message: "An error occurred during Home page Images addition",
            token: tokens,
            error: String(error)
          },
          false
        );
      }
    }
    
}
