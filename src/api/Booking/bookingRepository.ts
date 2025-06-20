// import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";
import fs from "fs";
import { generateTokenWithExpire } from "../../helper/token";
import { encrypt } from "../../helper/encrypt";
import { executeQuery, getClient } from "../../helper/db";
import {
  approveCarBookingQuery,
  approveCustomizeBookingQuery,
  approveParkingBookingQuery,
  approveTourBookingQuery,
  deleteAgreementQuery,
  deleteCarAgreementQuery,
  deleteParkingAgreementQuery,
  getCarAgreementQuery,
  getParkingAgreementQuery,
  getTourAgreementQuery,
  getUserdataCarQuery,
  getUserdataCustomizeTourQuery,
  getUserdataParkingQuery,
  getUserdataTourQuery,
  addHomePageQuery,
  deleteHomeImageContentQuery,
  getHomeImageQuery,
  getImageRecordQuery,
  getModuleQuery,
  listhomeImageQuery,
  updateHistoryQuery,
  updateHomePageQuery,
} from "./query";
import {
  userCarParkingBookingMail,
  userTourBookingMail,
} from "../../helper/mailcontent";
import { sendEmail } from "../../helper/mail";
import { CurrentTime } from "../../helper/common";
import { deleteFile, storeFile, viewFile } from "../../helper/storage";

export class bookingRepository {
  public async approveTourBookingV1(
    userData: any,
    tokendata: any,
    pdfBase64: string
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(approveTourBookingQuery, [
        userData.userTourBookingId,
      ]);

      const mailResult: any = await executeQuery(getUserdataTourQuery, [
        userData.userTourBookingId,
      ]);
      const {
        refPickupDate,
        refUserFname,
        refUserMail,
        refPackageName,
        refTourCustID,
      } = mailResult[0];

      // Convert Base64 to Buffer
      const pdfBuffer = Buffer.from(userData.pdfBase64, "base64");

      const main1 = async () => {
        const userMail = {
          to: refUserMail,
          subject: "✅ Your Tour Has Been Booked!",
          html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4faff; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 123, 255, 0.1); overflow: hidden;">
            <div style="background-color: #007bff; color: white; padding: 20px 30px;">
              <h2 style="margin: 0;">Explore Vacations</h2>
            </div>
            <div style="padding: 30px;">
              <h3 style="color: #007bff;">Hi ${refUserFname},</h3>
              <p>🎉 Great news! Your tour <strong>"${refPackageName}"</strong> has been successfully booked.</p>
              <p><strong>Tour Code:</strong> ${refTourCustID}</p>
              <p>Your adventure begins on <strong>${refPickupDate}</strong>.</p>
              
              <p>We'll send you daily reminders so you’re fully prepared for the journey ahead.</p>
    
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
    
              <p>Thank you for choosing <strong>Explore Vacations</strong>!</p>
              <p>We look forward to giving you an unforgettable experience.</p>
    
              <p style="margin-top: 30px;">Warm regards,<br/><strong>Team Explore Vacations</strong></p>
            </div>
          </div>
        </div>
      `,
          attachments: [
            {
              filename: "BookingConformation",
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        };
        try {
          sendEmail(userMail);
        } catch (error) {
          console.log("Error in sending the Mail for User", error);
        }
      };
      main1().catch(console.error);

      return encrypt(
        {
          success: true,
          message: "Tour Booking approved successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An error occurred during approve Tour Booking",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async approveCarBookingV1(
    userData: any,
    tokendata: any,
    pdfBase64: string
  ): Promise<any> {
    console.log('userData', userData)
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(approveCarBookingQuery, [
        userData.userCarBookingId
      ]);

      const mailResult = await executeQuery(getUserdataCarQuery, [
        userData.userCarBookingId
      ]);
      console.log('mailResult', mailResult)
      console.log("mailResult", mailResult[0]);

      const {
        refPickupDate,
        refDropDate,
        refUserFname,
        refUserLname,
        refUserMail,
        refUserMobile,
        refCarTypeName,
        refVehicleTypeName
      } = mailResult[0];
      
      console.log('refPickupDate', refPickupDate)
      const pdfBuffer = Buffer.from(userData.pdfBase64, "base64");

      const main1 = async () => {
        const userMail = {
          to: refUserMail,
          subject: "🚗 Car Booking Confirmed",
          html: `
               <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #4CAF50;">Thank You For Choosing Explore Vacations</h2>
      
      <h3 style="margin-top: 30px;">Reservation Details</h3>
      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <tbody>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Name:</td>
            <td style="padding: 8px;">${refUserFname}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Phone:</td>
            <td style="padding: 8px;">${refUserMobile}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Pickup Date:</td>
            <td style="padding: 8px;">${refPickupDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Drop Date:</td>
            <td style="padding: 8px;">${refDropDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Reservation Taken:</td>
            <td style="padding: 8px;">${CurrentTime()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Vehicle Type:</td>
            <td style="padding: 8px;">${refVehicleTypeName} (${refCarTypeName})</td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">Payment Status:</td>
            <td style="padding: 8px; color: green;"><strong>Paid</strong></td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 30px;">We look forward to serving you with a comfortable journey!</p>

      <p>Warm Regards,<br/>Explore Vacations Team</p>
    </div>
             `,
          attachments: [
            {
              filename: "BookingConformation",
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        };

        try {
         await sendEmail(userMail);
        } catch (error) {
          console.log("Error in sending the Mail for User", error);
        }
      };
      main1().catch(console.error);

      return encrypt(
        {
          success: true,
          message: "Car Booking approved successfully",
          token: tokens,
          result: result,
          mailResult: mailResult,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An error occurred during approve Car Booking",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async approveCustomizeTourBookingV1(
    userData: any,
    tokendata: any,
    pdfBase64: string
  ): Promise<any> {
    console.log("userData", userData);
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN"); // Start transaction

      const result = await client.query(approveCustomizeBookingQuery, [
        userData.userId,
      ]);
      console.log("result", result);
      const mailResult: any = await executeQuery(
        getUserdataCustomizeTourQuery,
        [userData.userId]
      );
      console.log("mailResult", mailResult);
      const {
        refUserName,
        refUserMail,
        refTourCustID,
        refArrivalDate,
        refPackageName,
      } = mailResult[0];

      const daysLeft = Math.ceil(
        (new Date(refArrivalDate).getTime() -
          new Date(CurrentTime()).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Convert Base64 to Buffer
      const pdfBuffer = Buffer.from(userData.pdfBase64, "base64");

      const main1 = async () => {
        const userMail = {
          to: refUserMail,
          subject: "✅ Your Tour Has Been Booked!",
          html: `
                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background-color: #007BFF; padding: 20px; color: white; text-align: center;">
              <h1 style="margin: 0;">Explore Vacations</h1>
              <p style="margin: 0;">Your journey starts here ✈️</p>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #007BFF;">Hello ${refUserName} 👋</h2>
              <p style="font-size: 16px; color: #333;">Your customized tour request has been <strong>successfully received</strong>.</p>
              
              <table style="width: 100%; margin-top: 20px; font-size: 15px; color: #444;">
                <tr>
                  <td style="padding: 8px 0;"><strong>📦 Package:</strong></td>
                  <td style="padding: 8px 0;">${refPackageName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>🆔 Tour ID:</strong></td>
                  <td style="padding: 8px 0;">${refTourCustID}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>📅 Arrival Date:</strong></td>
                  <td style="padding: 8px 0;">${refArrivalDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>⏳ Days Left:</strong></td>
                  <td style="padding: 8px 0;">${daysLeft} day(s)</td>
                </tr>
              </table>
        
              <p style="margin-top: 25px; font-size: 16px; color: #333;">
                Our team will contact you shortly to finalize the details. Please keep an eye on your inbox!
              </p>
              
              <p style="margin-top: 30px; font-size: 16px; color: #007BFF;"><strong>Thank you for choosing Explore Vacations! 😊</strong></p>
            </div>
            <div style="background-color: #007BFF; color: white; padding: 15px; text-align: center; font-size: 14px;">
              &copy; ${CurrentTime()} Explore Vacations. All rights reserved.
            </div>
          </div> `,
          attachments: [
            {
              filename: "BookingConformation",
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        };
        try {
          sendEmail(userMail);
        } catch (error) {
          console.log("Error in sending the Mail for User", error);
        }
      };
      main1().catch(console.error);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Customize Tour Booking approved successfully",
          token: tokens,
          result: result,
          mailResult: mailResult,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback transaction

      console.log("error", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred during approve Customize Tour Booking",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async approveParkingBookingV1(
    userData: any,
    tokendata: any,
    pdfBase64: string
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(approveParkingBookingQuery, [
        userData.carParkingBookingId,
      ]);

      const mailResult: any = await executeQuery(getUserdataParkingQuery, [
        userData.carParkingBookingId,
      ]);
      const {
        travelStartDate,
        refFName,
        refParkingName,
        refParkingCustId,
        refUserEmail,
      } = mailResult[0];

      const daysLeft = Math.ceil(
        (new Date(travelStartDate).getTime() -
          new Date(CurrentTime()).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const userMailData = {
        daysLeft: daysLeft,
        refPickupDate: travelStartDate,
        refUserName: refFName,
        refParkingName: refParkingName,
        refParkingCustId: refParkingCustId,
      };
      // Convert Base64 to Buffer

      const pdfBuffer = Buffer.from(userData.pdfBase64, "base64");

      // console.log("userMailData", userMailData);
      const main1 = async () => {
        const adminMail = {
          to: refUserEmail,
          subject: "✅ Your CarParking Has Been Booked!",
          html: ` <div style="font-family: Arial, sans-serif; background-color: #f4f8fb; padding: 20px; color: #333;">
       <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
        <h1>🚗 Booking Confirmed!</h1>
        <p>Thanks for choosing <strong>Explore Vacations</strong></p>
      </div>

      <div style="padding: 20px;">
        <p>Hi <strong>${refFName}</strong>,</p>
        <p>We’re excited to confirm your car parking booking at <strong>${refParkingName}</strong>.</p>

        <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Parking ID:</strong></td>
            <td style="padding: 8px 0;">${refParkingCustId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Travel Start Date:</strong></td>
            <td style="padding: 8px 0;">${travelStartDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Days Left:</strong></td>
            <td style="padding: 8px 0;">${daysLeft} day(s)</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">We’ll be ready and waiting. If you have any questions, feel free to contact us!</p>

        <p style="margin-top: 20px;">Safe travels! 🌍</p>
        <p style="color: #007bff; font-weight: bold;">— The Explore Vacations Team</p>
      </div>

      <div style="background-color: #e3f0ff; padding: 15px; text-align: center; font-size: 12px; color: #555;">
        © ${CurrentTime()} Explore Vacations. All rights reserved.
      </div>
    </div>
  </div>
  `,
          attachments: [
            {
              filename: "BookingConformation",
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        };
        try {
          sendEmail(adminMail);
        } catch (error) {
          console.log("Error in sending the Mail for User", error);
        }
      };
      main1().catch(console.error);

      return encrypt(
        {
          success: true,
          message: "Parking Booking approved successfully",
          token: tokens,
          result: result,
          mailResult: mailResult[0],
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An error occurred during approve Parking Booking",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async uploadTourAgreementV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the PDF file from userData
      const pdfFile = userData["PdfFile "] || userData.PdfFile;

      // Ensure that a PDF file is provided
      if (!pdfFile) {
        throw new Error("Please provide a PDF file.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the PDF file
      filePath = await storeFile(pdfFile, 9); // Assuming storeFile handles PDF storage

      // Read the file buffer and convert it to Base64
      const pdfBuffer = await viewFile(filePath);
      const pdfBase64 = pdfBuffer.toString("base64");

      storedFiles.push({
        filename: path.basename(filePath),
        content: pdfBase64,
        contentType: "application/pdf",
      });

      // Return success response
      return encrypt(
        {
          success: true,
          message: "PDF Stored Successfully",
          token: tokens,
          filePath: filePath,
          files: storedFiles,
        },
        true
      );
    } catch (error) {
      console.error("Error occurred:", error);
      return encrypt(
        {
          success: false,
          message: "Error in Storing the PDF",
          token: tokens,
        },
        true
      );
    }
  }
  public async uploadCarAgreementV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the PDF file from userData
      const pdfFile = userData["PdfFile "] || userData.PdfFile;

      // Ensure that a PDF file is provided
      if (!pdfFile) {
        throw new Error("Please provide a PDF file.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the PDF file
      filePath = await storeFile(pdfFile, 10); // Assuming storeFile handles PDF storage

      // Read the file buffer and convert it to Base64
      const pdfBuffer = await viewFile(filePath);
      const pdfBase64 = pdfBuffer.toString("base64");

      storedFiles.push({
        filename: path.basename(filePath),
        content: pdfBase64,
        contentType: "application/pdf",
      });

      // Return success response
      return encrypt(
        {
          success: true,
          message: "PDF Stored Successfully",
          token: tokens,
          filePath: filePath,
          files: storedFiles,
        },
        true
      );
    } catch (error) {
      console.error("Error occurred:", error);
      return encrypt(
        {
          success: false,
          message: "Error in Storing the PDF",
          token: tokens,
        },
        true
      );
    }
  }
  public async uploadParkingAgreementV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the PDF file from userData
      const pdfFile = userData["PdfFile "] || userData.PdfFile;

      // Ensure that a PDF file is provided
      if (!pdfFile) {
        throw new Error("Please provide a PDF file.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the PDF file
      filePath = await storeFile(pdfFile, 10); // Assuming storeFile handles PDF storage

      // Read the file buffer and convert it to Base64
      const pdfBuffer = await viewFile(filePath);
      const pdfBase64 = pdfBuffer.toString("base64");

      storedFiles.push({
        filename: path.basename(filePath),
        content: pdfBase64,
        contentType: "application/pdf",
      });

      // Return success response
      return encrypt(
        {
          success: true,
          message: "PDF Stored Successfully",
          token: tokens,
          filePath: filePath,
          files: storedFiles,
        },
        true
      );
    } catch (error) {
      console.error("Error occurred:", error);
      return encrypt(
        {
          success: false,
          message: "Error in Storing the PDF",
          token: tokens,
        },
        true
      );
    }
  }
  public async deleteTourAgreementV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { userTourBookingId } = userData;
      let filePath: string | null = null;

      if (userTourBookingId) {
        // Retrieve the image record from the database
        const imageRecord: any = await executeQuery(getTourAgreementQuery, [
          userTourBookingId,
        ]);

        if (!imageRecord || imageRecord.length === 0) {
          await client.query("ROLLBACK");
          return encrypt(
            {
              success: false,
              message: "Image record not found",
              token: tokens,
            },
            true
          );
        }

        filePath = imageRecord[0]?.refAgreementPath;

        // Delete from DB
        await client.query(deleteAgreementQuery, [userTourBookingId]);
      } else if (userData.filePath) {
        // Fallback path deletion
        filePath = userData.filePath;
      } else {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "No ID or file path provided for deletion",
            token: tokens,
          },
          true
        );
      }

      if (filePath) {
        await deleteFile(filePath); // Delete file from local storage
      }

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "agreement deleted successfully",
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      console.error("Error deleting agreement:", error);
      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the agreement",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteCarAgreementV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { userCarBookingId } = userData;
      let filePath: string | null = null;

      if (userCarBookingId) {
        // Retrieve the image record from the database
        const imageRecord: any = await executeQuery(getCarAgreementQuery, [
          userCarBookingId,
        ]);

        if (!imageRecord || imageRecord.length === 0) {
          await client.query("ROLLBACK");
          return encrypt(
            {
              success: false,
              message: "Image record not found",
              token: tokens,
            },
            true
          );
        }

        filePath = imageRecord[0]?.refAgreementPath;

        // Delete from DB
        await client.query(deleteCarAgreementQuery, [userCarBookingId]);
      } else if (userData.filePath) {
        // Fallback path deletion
        filePath = userData.filePath;
      } else {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "No ID or file path provided for deletion",
            token: tokens,
          },
          true
        );
      }

      if (filePath) {
        await deleteFile(filePath); // Delete file from local storage
      }

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "agreement deleted successfully",
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      console.error("Error deleting agreement:", error);
      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the agreement",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteParkingAgreementV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { carParkingBookingId } = userData;
      let filePath: string | null = null;

      if (carParkingBookingId) {
        // Retrieve the image record from the database
        const imageRecord: any = await executeQuery(getParkingAgreementQuery, [
          carParkingBookingId,
        ]);

        if (!imageRecord || imageRecord.length === 0) {
          await client.query("ROLLBACK");
          return encrypt(
            {
              success: false,
              message: "Image record not found",
              token: tokens,
            },
            true
          );
        }

        filePath = imageRecord[0]?.refAgreementPath;

        // Delete from DB
        await client.query(deleteParkingAgreementQuery, [carParkingBookingId]);
      } else if (userData.filePath) {
        // Fallback path deletion
        filePath = userData.filePath;
      } else {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "No ID or file path provided for deletion",
            token: tokens,
          },
          true
        );
      }

      if (filePath) {
        await deleteFile(filePath); // Delete file from local storage
      }

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "agreement deleted successfully",
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      console.error("Error deleting agreement:", error);
      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the agreement",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // -------------------------------------------------------------------------------------------------------------------------------------
  public async homeImageContentV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const {
        refHomePageName,
        homePageHeading,
        homePageContent,
        refOffer,
        refOfferName,
        homePageImage,
        refModuleId,
      } = userData;

      const getModule = await executeQuery(getModuleQuery);

      const Result = await client.query(addHomePageQuery, [
        refHomePageName,
        homePageHeading,
        homePageContent,
        refOffer,
        refOfferName,
        homePageImage,
        refModuleId,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        58,
        tokendata.id,
        `${homePageHeading} Home page added successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "home page content added successfully",
          data: Result,
          moduleResult: getModule,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message:
            "An unknown error occurred during home page content addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateContentV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();

    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const {
        refHomePageId,
        refHomePageName,
        homePageHeading,
        homePageContent,
        refOffer,
        refOfferName,
        homePageImage,
        refModuleId,
      } = userData;

      const Result = await client.query(updateHomePageQuery, [
        refHomePageId,
        refHomePageName,
        homePageHeading,
        homePageContent,
        refOffer,
        refOfferName,
        homePageImage,
        refModuleId,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        59,
        tokendata.id,
        `Home page With Name: ${refHomePageName} is updated Successfully successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "home page content updated successfully",
          data: Result,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during home page content update",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deletehomeImageContentV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refHomePageId } = userData;
      console.log('userData', userData)
      const result = await client.query(deleteHomeImageContentQuery, [
        refHomePageId,
        CurrentTime(),
        tokendata.id,
      ]);
      console.log('result', result)

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "refHomePageId not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      const history = [
        60, // Unique ID for delete action
        tokendata.id,
        "The homepage deleted successfully",
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "HomePage deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting HomePage:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the HomePage",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async uploadImagesV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the image from userData
      const image = userData.images;

      // Ensure that only one image is provided
      if (!image) {
        throw new Error("Please provide an image.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the image
      filePath = await storeFile(image, 12);

      // Read the file buffer and convert it to Base64

      const imageBuffer = await viewFile(filePath);
      const imageBase64 = imageBuffer.toString("base64");

      // const contentType = mime.lookup(filePath) || "application/octet-stream";
      // console.log('contentType', contentType)
      // const contentType = fileData.hapi.headers["content-type"];

      storedFiles.push({
        filename: path.basename(filePath),
        content: imageBase64,
        contentType: "image/jpg", // Assuming the image is in JPEG format

        // contentType:contentType
      });

      // Return success response
      return encrypt(
        {
          success: true,
          message: "Image Stored Successfully",
          token: tokens,
          filePath: filePath,
          files: storedFiles,
        },
        true
      );
    } catch (error) {
      console.error("Error occurred:", error);
      return encrypt(
        {
          success: false,
          message: "Error in Storing the Image",
          token: tokens,
        },
        true
      );
    }
  }
  public async deletehomeImageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      let filePath: string | any;

      if (userData.refHomePageId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getImageRecordQuery, [
          userData.refHomePageId,
        ]);
        if (imageRecord.length === 0) {
          return encrypt(
            {
              success: false,
              message: "Image record not found",
              token: tokens,
            },
            true
          );
        }

        filePath = imageRecord[0].homePageImage;

        // Delete the image record from the database
        // await executeQuery(deleteImageRecordQuery, [userData.refHomePageId]);
      } else if (userData.filePath) {
        // Fallback path deletion
        filePath = userData.filePath;
      } else {
        return encrypt(
          {
            success: false,
            message: "No user ID or file path provided for deletion",
            token: tokens,
          },
          true
        );
      }
      if (filePath) {
        await deleteFile(filePath); // Delete file from local storage
      }

      return encrypt(
        {
          success: true,
          message: "gallery image deleted successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.error("Error in deleting file:", (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Deleting Image: ${(error as Error).message}`,
          token: tokens,
        },
        true
      );
    }
  }
  public async listhomeImageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listhomeImageQuery);

      for (const profile of result) {
        if (profile.homePageImage) {
          try {
            const fileBuffer = await viewFile(profile.homePageImage);
            profile.homePageImage = {
              filename: path.basename(profile.homePageImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error("Error reading image file for product", err);
            profile.homePageImage = null; // Handle missing or unreadable files gracefully
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "list data successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list data:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getHomeImageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { refHomePageId } = userData;

      const result = await executeQuery(getHomeImageQuery, [refHomePageId]);

      for (const profile of result) {
        if (profile.homePageImage) {
          try {
            const fileBuffer = await viewFile(profile.homePageImage);
            profile.homePageImage = {
              filename: path.basename(profile.homePageImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error("Error reading image file for product", err);
            profile.homePageImage = null; // Handle missing or unreadable files gracefully
          }
        }
      }
      return encrypt(
        {
          success: true,
          message: "get data successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error get data:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while get data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listhomeImageUserSideV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    //     const token = { id: tokendata.id, roleId: tokendata.roleId };
    // const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listhomeImageQuery);
      for (const profile of result) {
        if (profile.homePageImage) {
          try {
            const fileBuffer = await viewFile(profile.homePageImage);
            profile.homePageImage = {
              filename: path.basename(profile.homePageImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error("Error reading image file for product", err);
            profile.homePageImage = null; // Handle missing or unreadable files gracefully
          }
        }
      }
      return encrypt(
        {
          success: true,
          message: "list data successfully",
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list data:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list data",
          error: String(error),
        },
        true
      );
    }
  }
}
