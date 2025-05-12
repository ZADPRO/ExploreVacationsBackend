import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import {
  storeFile,
  viewFile,
  convertToBase64,
  storetheFile
} from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import fs from "fs";
import { decodeToken } from "../../helper/token"

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { CurrentTime } from "../../helper/common";
import { getCarData,
   getCarParkingRemData, 
   getCustomizeTourRemData, 
   getTourData 
  } from "./query";
import { sendEmail } from "../../helper/mail";
import { sendCarRemainder, 
  sendCustomizeTourRemainder, 
  sendParkingRemainder, 
  sendTourRemainder 
} from "../../helper/mailcontent";

export class BatchRepository {
  public async sendTourRemV1(tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const getData = await executeQuery(getTourData, []);
      if (getData.length > 0) {
        for (let i = 0; i < getData.length; i++) {
          const main = async () => {
            const mailOptions = {
              to: getData[i].refCtEmail,
              subject: "📅 Tour Reminder – Explore Vacations",
              html: sendTourRemainder(
                getData[i].refUserName,
                getData[i].refUserMail,
                getData[i].refPickUpdate
              ),
            };

            // Call the sendEmail function
            try {
              await sendEmail(mailOptions);
            } catch (error) {
              console.error("Failed to send email:", error);
            }
          };

          main().catch(console.error);
        }
      }

      const results = {
        success: true,
        message: "Mail Is Send Successfully",
        token: tokens
      };
      return encrypt(results, true);
    } catch (error) {
      console.log(error);
      const results = {
        success: false,
        message: "error In sending Mail",
        token: tokens
      };
      return encrypt(results, true);
    }
  }
  public async sendCarRemV1(tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const getData = await executeQuery(getCarData, []);
      if (getData.length > 0) {
        for (let i = 0; i < getData.length; i++) {
          const main = async () => {
            const mailOptions = {
              to: getData[i].refCtEmail,
              subject: "🚗 Car Reminder – Explore Vacations",
              html: sendCarRemainder(
                getData[i].refUserName,
                getData[i].refUserMail,
                getData[i].refPickUpdate
              ),
            };
            console.log('sendCarRemainder', sendCarRemainder)
            // Call the sendEmail function
            try {
              await sendEmail(mailOptions);
            } catch (error) {
              console.error("Failed to send email:", error);
            }
          };
          main().catch(console.error);
        }
      }

      const results = {
        success: true,
        message: "Mail Is Send Successfully",
        token: tokens
      };
      return encrypt(results, true);
    } catch (error) {
      console.log(error);
      const results = {
        success: false,
        message: "error In sending Mail",
        token: tokens,
      };
      return encrypt(results, true);
    }
  }
  public async sendCustomizeTourRemV1(tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const getData = await executeQuery(getCustomizeTourRemData, []);
      if (getData.length > 0) {
        for (let i = 0; i < getData.length; i++) {
          const main = async () => {
            const mailOptions = {
              to: getData[i].refCtEmail,
              subject: "🌍 Customize Tour Reminder – Explore Vacations",
              html: sendCustomizeTourRemainder(
                getData[i].refUserName,
                getData[i].refUserMail,
                getData[i].refArrivalDate
              ),
            };
            // Call the sendEmail function
            try {
              await sendEmail(mailOptions);
            } catch (error) {
              console.error("Failed to send email:", error);
            }
          };
          main().catch(console.error);
        }
      }

      const results = {
        success: true,
        message: "Mail Is Send Successfully",
        token: tokens,
      };
      return encrypt(results, true);
    } catch (error) {
      console.log(error);
      const results = {
        success: false,
        message: "error In sending Mail",
        token: tokens,
      };
      return encrypt(results, true);
    }
  }
  public async sendParkingRemV1(tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const getData = await executeQuery(getCarParkingRemData, []);
      if (getData.length > 0) {
        for (let i = 0; i < getData.length; i++) {
          const main = async () => {
            const mailOptions = {
              to: getData[i].refCtEmail,
              subject: "🌍 Customize Tour Reminder – Explore Vacations",
              html: sendParkingRemainder(
                getData[i].refFName,
                getData[i].refUserEmail,
                getData[i].refUserName,
                getData[i].travelStartDate,
                getData[i].travelEndDate
              ),
            };
            // Call the sendEmail function
            try {
              await sendEmail(mailOptions);
            } catch (error) {
              console.error("Failed to send email:", error);
            }
          };

          main().catch(console.error);
        }
      }

      const results = {
        success: true,
        message: "Mail Is Send Successfully",
        token: tokens,
      };
      return encrypt(results, true);
    } catch (error) {
      console.log(error);
      const results = {
        success: false,
        message: "error In sending Mail",
        token: tokens,
      };
      return encrypt(results, true);
    }
  }

}


