import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import fs from "fs";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import dayjs from 'dayjs';

export class patmentRepository {
    public async paymentV1(userData: any, tokendata: any): Promise<any> {
      const token = { id: tokendata.id };
      const tokens = generateTokenWithExpire(token, true);
    
      try {
        const { travelStartDate, 
            travelEndDate, pricePerDayorHour, price } = userData;
    
        if (!travelStartDate || !travelEndDate || !pricePerDayorHour || !price) {
          throw new Error("Missing required fields");
        }
    
        const start = dayjs(travelStartDate);
        const end = dayjs(travelEndDate);
    
        if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
          throw new Error("Invalid travel dates");
        }
    
        let totalAmount = 0;
    
        if (pricePerDayorHour === 'day') {
          const days = end.diff(start, 'day') + 1; // include the end day
          totalAmount = days * price;
        } else if (pricePerDayorHour === 'hour') {
          const hours = end.diff(start, 'hour');
          totalAmount = hours * price;
        } else {
          throw new Error("Invalid pricePerDayorHour value. Must be 'day' or 'hour'");
        }
    
        return encrypt(
          {
            success: true,
            message: "payment calculated successfully",
            totalAmount,
            travelStartDate,
            travelEndDate,
            pricePerDayorHour,
            price,
            token: tokens
          },
          false
        );
      } catch (error: unknown) {
        return encrypt(
          {
            success: false,
            message: "An error occurred during payment calculation",
            token: tokens,
            error: String(error)
          },
          false
        );
      }
    }
    
}
