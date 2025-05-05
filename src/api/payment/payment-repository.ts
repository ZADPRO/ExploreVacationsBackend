import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import fs from "fs";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import dayjs from "dayjs";
import axios from "axios";
import Payrexx from "../../helper/Payrexx";
import { getPriceQuery } from "./query";
export class patmentRepository {
  // public async calculationV1(userData: any, tokendata: any): Promise<any> {
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);

  //   try {
  //     const {
  //       travelStartDate,
  //       travelEndDate,
  //       pricePerDayorHour,
  //       refCarParkingId
  //     } = userData;

  //     const getPrice = await executeQuery(getPriceQuery, [refCarParkingId]);
  //     console.log("getPrice", getPrice);
  //     const refPrice = getPrice[0];
  //     console.log("price", refPrice);
  //     const start = dayjs(travelStartDate);
  //     const end = dayjs(travelEndDate);

  //     if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
  //       throw new Error("Invalid travel dates");
  //     }

  //     let totalAmount = 0;

  //     if (pricePerDayorHour === "day" ) {
  //       const days = end.diff(start, "day") + 1; // include the end day
  //       totalAmount = days * refPrice;
  //     } else if (pricePerDayorHour === "hour") {
  //       const hours = end.diff(start, "hour");
  //       totalAmount = hours * refPrice;
  //     } else {
  //       throw new Error(
  //         "Invalid pricePerDayorHour value. Must be 'day' or 'hour'"
  //       );
  //     }

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "payment calculated successfully",
  //         totalAmount:totalAmount,
  //         // travelStartDate,
  //         // travelEndDate,
  //         // pricePerDayorHour,
  //         // refPrice,
  //         token: tokens,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred during payment calculation",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   }
  // }
  public async calculationV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
  
    try {
      const {
        travelStartDate,
        travelEndDate,
        pricePerDayorHour,
        refCarParkingId
      } = userData;
      console.log('userData', userData)
  
      const getPrice = await executeQuery(getPriceQuery, [refCarParkingId]);
      console.log("getPrice", getPrice);
  
      if (!getPrice.length) {
        throw new Error("No pricing found for the given car parking ID");
      }
  
      // const refPrice = getPrice[0];
      const refPrice = Number(getPrice[0].refPrice);
      if (isNaN(refPrice)) {
        throw new Error("Invalid price data from database");
      }
      const start = dayjs(travelStartDate);
      const end = dayjs(travelEndDate);
  
      if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
        throw new Error("Invalid travel dates");
      }
  
      let totalAmount = 0;
      const billingUnit = pricePerDayorHour.toLowerCase(); // normalize casing
  
      if (billingUnit === "day") {
        const days = end.diff(start, "day") + 1; // include the end day
        totalAmount = days * refPrice;
      } else if (billingUnit === "hour") {
        const hours = end.diff(start, "hour");
        totalAmount = hours * refPrice;
      } else {
        throw new Error(
          "Invalid pricePerDayorHour value. Must be 'day' or 'hour'"
        );
      }
      console.log('totalAmount', totalAmount)
  
      return encrypt(
        {
          success: true,
          message: "Payment calculated successfully",
          totalAmount: totalAmount,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An error occurred during payment calculation",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  
  public async paymentV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const payment = new Payrexx(
      "explorevacationsag",
      "vqdTdCezHYCNEzgFcRsPz4PwvYvZPV"
    );
    try {
      const { totalAmount, userEmail, firstname, purpose } = userData;
      console.log("userData", userData);
      // Send payment request to Payrexx
      const result = await payment.post("Gateway", {
        amount: totalAmount * 100,
        currency: "CHF",
        vatRate: 7.7, //means charging 7.7% tax on top of the payment
        purpose: purpose, //  purpose
        psp: [44, 36],
        pm: ["visa", "mastercard", "twint", "amex"],
        fields: {
          email: { value: userEmail },
          forename: { value: firstname }
          // surname: { value: lastname },
        },
      });

      console.log(
        "result-------------------------------------------------------------------98",
        result
      );
      console.log("Payrexx API Response:", result);

      // Ensure the response has the necessary fields
      if (result && result.status && result.data) {
        return encrypt(
          {
            success: true,
            message: "Payed List passed successfully",
            token: tokens,
            data: result.data, // Assuming result.data contains the payment link and other details
          },
          true
        );
      } else {
        throw new Error("Payrexx response does not contain expected data");
      }
    } catch (error) {
      console.error("Error in Payrexx API call:", error);

      return encrypt(
        {
          success: false,
          message: "Failed to create payment link",
          error: error || "Unknown error",
          token: tokens,
        },
        true
      );
    }
  }
}
