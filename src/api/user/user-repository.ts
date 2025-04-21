import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import { generatePassword, processImages } from "../../helper/common";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";
import nodemailer from "nodemailer";
import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { CurrentTime } from "../../helper/common";
import {
  addCarBookingQuery,
  addcustomizeBookingQuery,
  addTourBookingQuery,
  checkQuery,
  deleteImageRecordQuery,
  drivarDetailsQuery,
  getcarNameQuery,
  getCarsByIdQuery,
  getImageRecordQuery,
  getLastCustomerIdQuery,
  getOtherCarsQuery,
  getPackageNameQuery,
  getUsersQuery,
  insertUserAddressQuery,
  insertUserDomainQuery,
  insertUserQuery,
  listallTourQuery,
  listAssociateAirportQuery,
  listCarParkingByIdQuery,
  listCarParkingQuery,
  listCarsQuery,
  listDestinationQuery,
  listOtherTourQuery,
  listParkingTypeQuery,
  listTourBrochureQuery,
  listTourQuery,
  profileDataQuery,
  updateAddressDataQuery,
  updatedomainDataQuery,
  updateHistoryQuery,
  updateProfileDataQuery,
  updateUserPasswordQuery,
  userCarBookingHistoryQuery,
  userCarParkingBookingHistoryQuery,
  userTourBookingHistoryQuery,
} from "./query";
import fs from "fs";
import {
  generateCarBookingEmailContent,
  generateCustomizeTourBookingEmailContent,
  generateforgotPasswordEmailContent,
  generateTourBookingEmailContent,
  userCarEmailContent,
  userTourBookingMail,
} from "../../helper/mailcontent";
import { sendEmail } from "../../helper/mail";

export class userRepository {
  // public async tourBookingV1(userData: any, tokendata: any): Promise<any> {
  //   const client: PoolClient = await getClient();

  //   try {
  //     await client.query("BEGIN"); // Start transaction
  //     const {
  //       refPackageId,
  //       refUserName,
  //       refUserMail,
  //       refUserMobile,
  //       refPickupDate,
  //       refAdultCount,
  //       refChildrenCount,
  //       refInfants,
  //       refOtherRequirements,
  //     } = userData;

  //     // Insert package details and get refPackageId

  //     const Result = await client.query(addTourBookingQuery, [
  //       refPackageId,
  //       refUserName,
  //       refUserMail,
  //       refUserMobile,
  //       refPickupDate,
  //       refAdultCount,
  //       refChildrenCount,
  //       refInfants,
  //       refOtherRequirements,
  //       CurrentTime(),
  //       "Admin",
  //     ]);

  //     const main = async () => {
  //       const mailOptions = {
  //         to: "indumathi123indumathi@gmail.com",
  //         subject: "New Tour Booking Received", // Subject of the email
  //         html: generateTourBookingEmailContent(Result),
  //       };

  //       // Call the sendEmail function
  //       try {
  //         await sendEmail(mailOptions);
  //       } catch (error) {
  //         console.error("Failed to send email:", error);
  //       }
  //     };

  //     main().catch(console.error);

  //     if (refPickupDate === new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]) {
  //       const reminderHtml = generateReminderEmailContent({
  //         refUserName,
  //         refPackageId,
  //         refPickupDate,
  //         refUserMail,
  //       });

  //       await sendEmail({
  //         to: refUserMail,
  //         subject: "⏰ Your tour is tomorrow!",
  //         html: reminderHtml,
  //       });
  //     }

  //     await client.query("COMMIT"); // Commit transaction

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "tour booking successfully",
  //         Data: Result.rows[0],
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     await client.query("ROLLBACK"); // Rollback transaction in case of failure
  //     console.error("Error tour booking:", error);

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred while tour booking",
  //         error: String(error),
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }
  public async tourBookingV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    console.log("tokendata.id", tokendata.id);
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN");
      const {
        refPackageId,
        refUserName,
        refUserMail,
        refUserMobile,
        refPickupDate,
        refAdultCount,
        refChildrenCount,
        refInfants,
        refOtherRequirements,
      } = userData;


      console.log(' line --------- 178', )

      const Result = await client.query(addTourBookingQuery, [
        refPackageId,
        refUserName,
        refUserMail,
        refUserMobile,
        refPickupDate,
        refAdultCount,
        refChildrenCount,
        refInfants,
        refOtherRequirements,
        CurrentTime(),
        tokendata.id,
        tokendata.id,
      ]);
      console.log('Result line ----- 191', Result)
      const getPackageName: any = await executeQuery(getPackageNameQuery, [
        refPackageId,
      ]);

      console.log("getPackageName line ---- 195", getPackageName);

      // if (!getPackageName.rows.length) {
      //   throw new Error(`Package not found for refPackageId: ${refPackageId}`);
      // }
      const { refPackageName, refTourCustID } = getPackageName[0];

      const main = async () => {
        const adminMail = {
          to: "indumathi123indumathi@gmail.com",
          subject: "New Tour Booking Received",
          html: generateTourBookingEmailContent(Result),
        };

        try {
          await sendEmail(adminMail);
        } catch (error) {
          console.log("Error in sending the Mail for Admin", error);
        }
      };
      main().catch(console.error);

      // 2. User confirmation email with countdown
      // const daysLeft = Math.ceil(
      //   (new Date(refPickupDate).getTime() - new Date().getTime()) /
      //     (1000 * 60 * 60 * 24)
      // );

      const daysLeft = Math.ceil(
        (new Date(refPickupDate).getTime() -
          new Date(CurrentTime()).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const userMailData = {
        daysLeft: daysLeft,
        refPickupDate: refPickupDate,
        refUserName: refUserName,
        refPackageName: refPackageName,
        refTourCustID: refTourCustID,
      };

      console.log("userMailData", userMailData);
      const main1 = async () => {
        const adminMail = {
          to: refUserMail,
          subject: "✅ Your Tour Has Been Booked!",
          html: userTourBookingMail(userMailData),
        };

        try {
          await sendEmail(adminMail);
        } catch (error) {
          console.log("Error in sending the Mail for User", error);
        }
      };
      main1().catch(console.error);

      // const userMail = {
      //   to: refUserMail,
      //   subject: "✅ Your Tour Has Been Booked!",
      //   html: `
      //     <h2>Hi ${refUserName},</h2>
      //     <p>🎉 Your tour has been successfully booked!</p>
      //     <p>Your tour starts on <strong>${refPickupDate}</strong>.</p>
      //     <p>🧳 Only <strong>${daysLeft}</strong> day(s) to go!</p>
      //     <p>We’ll send you daily reminders so you don’t miss a thing!</p>
      //     <br/>
      //     <p>Thank you,<br>Team Explore Vacations</p>
      //   `,
      // };
      // await sendEmail(userMail);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "tour booking successfully",
          tokens: tokens,
          Data: Result.rows[0],
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error tour booking:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while tour booking",
          tokens: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // public async customizeBookingV1(userData: any, tokendata: any): Promise<any> {
  //   const client: PoolClient = await getClient();

  //   try {
  //     await client.query("BEGIN"); // Start transaction

  //     const {
  //       refPackageId,
  //       refUserName,
  //       refUserMail,
  //       refUserMobile,
  //       refArrivalDate,
  //       refSingleRoom,
  //       refTwinRoom,
  //       refTripleRoom,
  //       refAdultCount,
  //       refChildrenCount,
  //       refVaccinationType,
  //       refOtherRequirements,
  //       refVaccinationCertificate,
  //     } = userData;

  //     // Insert booking details with PDF path
  //     const Result = await client.query(addcustomizeBookingQuery, [
  //       refUserName,
  //       refUserMail,
  //       refUserMobile,
  //       refPackageId,
  //       refArrivalDate,
  //       refSingleRoom,
  //       refTwinRoom,
  //       refTripleRoom,
  //       refAdultCount,
  //       refChildrenCount,
  //       refVaccinationType,
  //       refVaccinationCertificate, // Store the file path
  //       refOtherRequirements,
  //       CurrentTime(),
  //       "Admin",
  //     ]);

  //     console.log('Result', Result.rows)
  //     const main = async () => {
  //       const mailOptions = {
  //         to: "indumathi123indumathi@gmail.com",
  //         subject: "New customize Tour Booking Received", // Subject of the email
  //         html: generateCustomizeTourBookingEmailContent(Result.rows[0]),
  //       };

  //       // Call the sendEmail function
  //       try {
  //         await sendEmail(mailOptions);
  //       } catch (error) {
  //         console.error("Failed to send email:", error);
  //       }
  //     };

  //     main().catch(console.error);

  //     // const history = [
  //     //   28,
  //     //   tokendata.id,
  //     //   "add customize tour booking",
  //     //   CurrentTime(),
  //     //   "user",
  //     // ];

  //     // await client.query(updateHistoryQuery, history);

  //     await client.query("COMMIT"); // Commit transaction

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Customize tour booking added successfully",
  //         Data: Result.rows[0],
  //         pdfPath: refVaccinationCertificate, // Returning stored PDF path for confirmation
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     await client.query("ROLLBACK"); // Rollback transaction in case of failure
  //     console.error("Error adding customize tour booking:", error);

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred while adding the customize tour booking",
  //         error: String(error),
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }

  public async customizeBookingV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN");

      const {
        refPackageId,
        refUserName,
        refUserMail,
        refUserMobile,
        refArrivalDate,
        refSingleRoom,
        refTwinRoom,
        refTripleRoom,
        refAdultCount,
        refChildrenCount,
        refVaccinationType,
        refOtherRequirements,
        refVaccinationCertificate,
        refPassPort,
      } = userData;

      const Result = await client.query(addcustomizeBookingQuery, [
        refUserName,
        refUserMail,
        refUserMobile,
        refPackageId,
        refArrivalDate,
        refSingleRoom,
        refTwinRoom,
        refTripleRoom,
        refAdultCount,
        refChildrenCount,
        refVaccinationType,
        refVaccinationCertificate,
        refOtherRequirements,
        refPassPort,
        CurrentTime(),
        tokendata.id,
        tokendata.id,
      ]);

      const getPackageName: any = await executeQuery(getPackageNameQuery, [
        refPackageId,
      ]);

      console.log("getPackageName", getPackageName);

      // if (!getPackageName.rows.length) {
      //   throw new Error(`Package not found for refPackageId: ${refPackageId}`);
      // }
      const { refPackageName, refTourCustID } = getPackageName[0];

      const bookingData = Result.rows[0];

      //way 1

      // const sendAdminMail = async () => {
      //   const mailOptions = {
      //     to: "indumathi123indumathi@gmail.com",
      //     subject: "New Customize Tour Booking Received",
      //     html: generateCustomizeTourBookingEmailContent(bookingData),
      //   };

      //   try {
      //     await sendEmail(mailOptions);
      //   } catch (error) {
      //     console.error("Failed to send admin email:", error);
      //   }
      // };

      // const sendUserConfirmationMail = async () => {
      //   const daysLeft = Math.ceil(
      //     (new Date(refArrivalDate).getTime() - new Date().getTime()) /
      //       (1000 * 60 * 60 * 24)
      //   );

      //   // way 1
      //   const mailOptions = {
      //     to: refUserMail,
      //     subject: "🌍 Customize Tour Booking Confirmed",
      //     html: `
      //    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      //   <div style="background-color: #007BFF; padding: 20px; color: white; text-align: center;">
      //     <h1 style="margin: 0;">Explore Vacations</h1>
      //     <p style="margin: 0;">Your journey starts here ✈️</p>
      //   </div>
      //   <div style="padding: 30px; background-color: #f9f9f9;">
      //     <h2 style="color: #007BFF;">Hello ${refUserName} 👋</h2>
      //     <p style="font-size: 16px; color: #333;">Your customized tour request has been <strong>successfully received</strong>.</p>

      //     <table style="width: 100%; margin-top: 20px; font-size: 15px; color: #444;">
      //       <tr>
      //         <td style="padding: 8px 0;"><strong>📦 Package:</strong></td>
      //         <td style="padding: 8px 0;">${refPackageName}</td>
      //       </tr>
      //       <tr>
      //         <td style="padding: 8px 0;"><strong>🆔 Tour ID:</strong></td>
      //         <td style="padding: 8px 0;">${refTourCustID}</td>
      //       </tr>
      //       <tr>
      //         <td style="padding: 8px 0;"><strong>📅 Arrival Date:</strong></td>
      //         <td style="padding: 8px 0;">${refArrivalDate}</td>
      //       </tr>
      //       <tr>
      //         <td style="padding: 8px 0;"><strong>⏳ Days Left:</strong></td>
      //         <td style="padding: 8px 0;">${daysLeft} day(s)</td>
      //       </tr>
      //     </table>

      //     <p style="margin-top: 25px; font-size: 16px; color: #333;">
      //       Our team will contact you shortly to finalize the details. Please keep an eye on your inbox!
      //     </p>

      //     <p style="margin-top: 30px; font-size: 16px; color: #007BFF;"><strong>Thank you for choosing Explore Vacations! 😊</strong></p>
      //   </div>
      //   <div style="background-color: #007BFF; color: white; padding: 15px; text-align: center; font-size: 14px;">
      //     &copy; ${new Date().getFullYear()} Explore Vacations. All rights reserved.
      //   </div>
      // </div>
      //     `,
      //   };

      //   try {
      //     await sendEmail(mailOptions);
      //   } catch (error) {
      //     console.error("Failed to send confirmation email to user:", error);
      //   }
      // };

      // await Promise.all([sendAdminMail(), sendUserConfirmationMail()]);

      // way 2

      const daysLeft = Math.ceil(
        (new Date(refArrivalDate).getTime() -
          new Date(CurrentTime()).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const main = async () => {
        const adminMail = {
          to: "indumathi123indumathi@gmail.com",
          subject: "New Customize Tour Booking Received",
          html: generateCustomizeTourBookingEmailContent(Result),
        };

        try {
          await sendEmail(adminMail);
        } catch (error) {
          console.log("Error in sending the Mail for Admin", error);
        }
      };
      main().catch(console.error);

      const main1 = async () => {
        const adminMail = {
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
        };
        try {
          await sendEmail(adminMail);
        } catch (error) {
          console.log("Error in sending the Mail for User", error);
        }
      };
      main1().catch(console.error);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Customize tour booking added successfully",
          tokens: tokens,
          Data: bookingData,
          pdfPath: refVaccinationCertificate,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error adding customize tour booking:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while adding the customize tour booking",
          tokens: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async uploadCertificateV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the PDF file from userData
      const pdfFile = userData["PdfFile "] || userData.PdfFile;
      console.log("userData", userData);
      console.log("pdfFile-------------------------------------", pdfFile);

      // Ensure that a PDF file is provided
      if (!pdfFile) {
        throw new Error("Please provide a PDF file.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the PDF file
      console.log("Storing PDF...");
      filePath = await storeFile(pdfFile, 3); // Assuming storeFile handles PDF storage

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
          tokens: tokens,
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
          tokens: tokens,
        },
        true
      );
    }
  }
  public async uploadPassportV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the PDF file from userData
      const pdfFile = userData["PdfFile "] || userData.PdfFile;
      console.log("userData", userData);
      console.log("pdfFile-------------------------------------", pdfFile);

      // Ensure that a PDF file is provided
      if (!pdfFile) {
        throw new Error("Please provide a PDF file.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the PDF file
      console.log("Storing PDF...");
      filePath = await storeFile(pdfFile, 8); // Assuming storeFile handles PDF storage

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
          tokens: tokens,
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
          tokens: tokens,
        },
        true
      );
    }
  }

  // public async userCarBookingV1(userData: any, tokendata: any): Promise<any> {
  //   const client: PoolClient = await getClient();

  //   try {
  //     await client.query("BEGIN"); // Start transaction

  //     const {
  //       refCarsId,
  //       refUserName,
  //       refUserMail,
  //       refUserMobile,
  //       refPickupAddress,
  //       refSubmissionAddress,
  //       refPickupDate,
  //       refAdultCount,
  //       refChildrenCount,
  //       refInfants,
  //       refOtherRequirements,
  //     } = userData;

  //     const refFormDetails = `{${userData.refFormDetails.join(",")}}`;

  //     // Insert package details and get refPackageId
  //     const Result = await client.query(addCarBookingQuery, [
  //       refCarsId,
  //       refUserName,
  //       refUserMail,
  //       refUserMobile,
  //       refPickupAddress,
  //       refSubmissionAddress,
  //       refPickupDate,
  //       refAdultCount,
  //       refChildrenCount,
  //       refInfants,
  //       refFormDetails,
  //       refOtherRequirements,
  //       CurrentTime(),
  //       "Admin",
  //     ]);

  //     const main = async () => {
  //       const mailOptions = {
  //         to: "indumathi123indumathi@gmail.com",
  //         subject: "New car Booking Received", // Subject of the email
  //         html: generateCarBookingEmailContent(Result.rows[0]),
  //       };

  //       // Call the sendEmail function
  //       try {
  //         await sendEmail(mailOptions);
  //       } catch (error) {
  //         console.error("Failed to send email:", error);
  //       }
  //     };

  //     main().catch(console.error);

  //     // const history = [29, tokendata.id, "car booking", CurrentTime(), "user"];

  //     // const updateHistory = await client.query(updateHistoryQuery, history);

  //     await client.query("COMMIT"); // Commit transaction

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "user car booking  added successfully",
  //         Data: Result.rows[0],
  //       },
  //       false
  //     );
  //   } catch (error: unknown) {
  //     await client.query("ROLLBACK"); // Rollback transaction in case of failure
  //     console.error("Error adding user car booking:", error);

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred while adding the user car booking",
  //         error: String(error),
  //       },
  //       false
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }

  public async userCarBookingV1(userData: any, tokendata: any): Promise<any> {
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
      } = userData;

      // const refFormDetails = `{${userData.refFormDetails.join(",")}}`;

      // Insert booking data
      const Result: any = await client.query(addCarBookingQuery, [
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
        // refFormDetails,
        refOtherRequirements,
        CurrentTime(),
        tokendata.id,
        tokendata.id,
      ]);

      console.log("Result", Result.rows);
      //way 1

      const daysLeft = Math.ceil(
        (new Date(refPickupDate).getTime() -
          new Date(CurrentTime()).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const getCarName: any = await executeQuery(getcarNameQuery, [refCarsId]);

      console.log("getCarName", getCarName);

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

      const adminMail = {
        to: "indumathi123indumathi@gmail.com",
        subject: "New car Booking Received",
        html: generateCarBookingEmailContent(Result),
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
        to: "indumathi123indumathi@gmail.com",
        subject: "New car Booking Received",
        html: generateCarBookingEmailContent(Result.rows),
      };

      await transporter.sendMail(mailoption);

      // 2. User confirmation email with countdown

      const adminmailoption = {
        from: process.env.EMAILID,
        to: refUserMail,
        subject: "🚗 Car Booking Confirmed",
        html: `
               <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background-color:rgba(0, 123, 255, 0.66); padding: 20px; color: white; text-align: center;">
      <h1 style="margin: 0;">Explore Vacations</h1>
      <p style="margin: 0;">Ride into comfort 🚗</p>
    </div>
    <div style="padding: 30px; background-color: #f9f9f9;">
      <h2 style="color: #007BFF;">Hello ${userMailData.refUserName} 👋</h2>
      <p style="font-size: 16px; color: #333;">Your car booking has been <strong>successfully received</strong>.</p>

      <table style="width: 100%; margin-top: 20px; font-size: 15px; color: #444;">
        <tr>
          <td style="padding: 8px 0;"><strong>🆔 Booking ID:</strong></td>
          <td style="padding: 8px 0;">${userMailData.refCarCustId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>🚘 Vehicle Type:</strong></td>
          <td style="padding: 8px 0;">${userMailData.refVehicleTypeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>🏷️ Car Category:</strong></td>
          <td style="padding: 8px 0;">${userMailData.refCarTypeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>📅 Pickup Date:</strong></td>
          <td style="padding: 8px 0;">${userMailData.refPickupDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>⏳ Days Left:</strong></td>
          <td style="padding: 8px 0;">${userMailData.daysLeft} day(s)</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>💰 Price:</strong></td>
          <td style="padding: 8px 0;">₹${userMailData.refCarPrice}</td>
        </tr>
      </table>

      <p style="margin-top: 25px; font-size: 16px; color: #333;">
        Our team will contact you soon to finalize your ride details.
      </p>
      
      <p style="margin-top: 30px; font-size: 16px; color: #007BFF;"><strong>Thank you for choosing Explore Vacations! 😊</strong></p>
    </div>
    <div style="background-color: #007BFF; color: white; padding: 15px; text-align: center; font-size: 14px;">
      &copy; ${CurrentTime()} Explore Vacations. All rights reserved.
    </div>
  </div>
             `,
      };

      await transporter.sendMail(adminmailoption);

      // //way 2

      // const getCarName: any = await executeQuery(getcarNameQuery, [refCarsId]);

      // console.log("getCarName", getCarName);

      // const { refCarTypeName, refVehicleTypeName, refCarCustId, refCarPrice } =
      //   getCarName[0];

      // const main = async () => {
      //   const adminMail = {
      //     to: "indumathi123indumathi@gmail.com",
      //     // to: "keerthana2005keethukeethu@gmail.com",
      //     subject: "New car Booking Received",
      //     html: generateCarBookingEmailContent(Result),
      //   };
      //   try {
      //     await sendEmail(adminMail);
      //   } catch (error) {
      //     console.log("Error in sending the Mail for Admin", error);
      //   }
      // };
      // main().catch(console.error);

      // // 2. User confirmation email with countdown

      // // const daysLeft = Math.ceil(
      // //   (new Date(refPickupDate).getTime() - new Date().getTime()) /
      // //     (1000 * 60 * 60 * 24)
      // // );

      // const daysLeft = Math.ceil(
      //   (new Date(refPickupDate).getTime() - new Date(CurrentTime()).getTime()) /
      //     (1000 * 60 * 60 * 24)
      // );

      // const userMailData = {
      //   daysLeft: daysLeft,
      //   refPickupDate: refPickupDate,
      //   refUserName: refUserName,
      //   refCarTypeName: refCarTypeName,
      //   refVehicleTypeName: refVehicleTypeName,
      //   refCarCustId: refCarCustId,
      //   refCarPrice: refCarPrice,
      // };

      // console.log("userMailData", userMailData);
      // const main1 = async () => {
      //   const adminMail = {
      //     to: refUserMail,
      //     subject: "✅ Your car Has Been Booked!",
      //     // html: userCarEmailContent(userMailData),
      //     html:` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      // <div style="background-color: #007BFF; padding: 20px; color: white; text-align: center;">
      //   <h1 style="margin: 0;">Explore Vacations</h1>
      //   <p style="margin: 0;">Ride into comfort 🚗</p>
      // </div>
      // <div style="padding: 30px; background-color: #f9f9f9;">
      //   <h2 style="color: #007BFF;">Hello ${userMailData.refUserName} 👋</h2>
      //   <p style="font-size: 16px; color: #333;">Your car booking has been <strong>successfully received</strong>.</p>

      //   <table style="width: 100%; margin-top: 20px; font-size: 15px; color: #444;">
      //     <tr>
      //   <td style="padding: 8px 0;"><strong>🆔 Booking ID:</strong></td>
      //   <td style="padding: 8px 0;">${userMailData.refCarCustId}</td>
      // </tr>
      // <tr>
      //   <td style="padding: 8px 0;"><strong>🚘 Vehicle Type:</strong></td>
      //   <td style="padding: 8px 0;">${userMailData.refVehicleTypeName}</td>
      // </tr>
      // <tr>
      //   <td style="padding: 8px 0;"><strong>🏷️ Car Category:</strong></td>
      //   <td style="padding: 8px 0;">${userMailData.refCarTypeName}</td>
      // </tr>
      // <tr>
      //   <td style="padding: 8px 0;"><strong>📅 Pickup Date:</strong></td>
      //   <td style="padding: 8px 0;">${userMailData.refPickupDate}</td>
      // </tr>
      // <tr>
      //   <td style="padding: 8px 0;"><strong>⏳ Days Left:</strong></td>
      //   <td style="padding: 8px 0;">${userMailData.daysLeft} day(s)</td>
      // </tr>
      // <tr>
      //   <td style="padding: 8px 0;"><strong>💰 Price:</strong></td>
      //   <td style="padding: 8px 0;">₹${userMailData.refCarPrice}</td>
      //       </tr>
      //     </table>

      //     <p style="margin-top: 25px; font-size: 16px; color: #333;">
      //       Our team will contact you soon to finalize your ride details.
      //     </p>

      //     <p style="margin-top: 30px; font-size: 16px; color: #007BFF;"><strong>Thank you for choosing Explore Vacations! 😊</strong></p>
      //   </div>
      //   <div style="background-color: #007BFF; color: white; padding: 15px; text-align: center; font-size: 14px;">
      //     &copy; ${CurrentTime()} Explore Vacations. All rights reserved.
      //   </div>
      // </div>`
      //     };

      //   try {
      //     await sendEmail(adminMail);
      //   } catch (error) {
      //     console.log("Error in sending the Mail for User", error);
      //   }
      // };
      // main1().catch(console.error);

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
          message: "User car booking added successfully",
          tokens: tokens,
          Data: Result.rows[0],
          drivarDetails: drivarDetails,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback transaction
      console.error("Error adding user car booking:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while adding the user car booking",
          tokens: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async listTourV1(userData: any, tokendata: any): Promise<any> {
    try {
      const { refPackageId } = userData;

      // Step 1: Execute Queries
      const result1 = await executeQuery(listTourQuery, [refPackageId]);

      const result2 = await executeQuery(listOtherTourQuery, [refPackageId]);

      // for (const image of result1) {
      //   const galleryValue = image["refGallery"];
      //   if (galleryValue) {
      //     try {
      //       // If it's a string in the format: {"path1","path2",...}
      //       const galleryPaths =
      //         typeof galleryValue === "string"
      //           ? galleryValue
      //               .replace(/^{|}$/g, "") // Remove starting and ending curly braces
      //               .split(/","?/) // Split paths by "," or just "
      //               .map((p) => p.replace(/^"|"$/g, "").trim()) // Remove surrounding quotes
      //           : galleryValue;

      //       image["refGallery"] = await Promise.all(
      //         galleryPaths.map(async (imgPath: string) => {
      //           try {
      //             const fileBuffer = await viewFile(imgPath);
      //             return {
      //               filename: path.basename(imgPath),
      //               content: fileBuffer.toString("base64"),
      //               contentType: "image/jpeg",
      //             };
      //           } catch (err) {
      //             console.error(
      //               `Error reading gallery image from ${imgPath}:`,
      //               err
      //             );
      //             return null;
      //           }
      //         })
      //       ).then((results) => results.filter(Boolean)); // Filter out failed
      //     } catch (error) {
      //       console.error("Error processing refGallery:", error);
      //       image["refGallery"] = [];
      //     }
      //   }

      //   // Handle single image fields
      //   for (const key of ["refItinaryMapPath", "refCoverImage"]) {
      //     const value = image[key];

      //     if (value) {
      //       try {
      //         const fileBuffer = await viewFile(value);
      //         image[key] = {
      //           filename: path.basename(value),
      //           content: fileBuffer.toString("base64"),
      //           contentType: "image/jpeg",
      //         };
      //       } catch (error) {
      //         console.error(`Error processing ${key}:`, error);
      //         image[key] = null;
      //       }
      //     }
      //   }
      // }

      for (const image of result1) {
        // Handle gallery images
        const galleryValue = image["refGallery"];
        if (galleryValue) {
          try {
            const galleryPaths =
              typeof galleryValue === "string"
                ? galleryValue
                    .replace(/^{|}$/g, "") // Remove {}
                    .split(/","?/) // Split by "," or "
                    .map((p) => p.replace(/^"|"$/g, "").trim()) // Remove quotes
                : galleryValue;

            image["refGallery"] = galleryPaths.map((imgPath: string) =>
              path.basename(imgPath)
            );
          } catch (error) {
            console.error("Error processing refGallery:", error);
            image["refGallery"] = [];
          }
        }

        // Handle single image fields
        for (const key of ["refItinaryMapPath", "refCoverImage"]) {
          const value = image[key];
          if (value) {
            try {
              image[key] = path.basename(value);
            } catch (error) {
              console.error(`Error processing ${key}:`, error);
              image[key] = null;
            }
          }
        }
      }

      // Step 3: Return success response
      return encrypt(
        {
          success: true,
          message: "Listed Tour successfully",
          tourDetails: result1,
          // othertourDetails: result2,
        },
        true
      );
    } catch (error: unknown) {
      // Log the error for debugging
      console.error("Error in listing tour:", error);

      // Step 4: Return error response with a more descriptive error message
      return encrypt(
        {
          success: false,
          message: "An error occurred while listing the tour details.",
          error: String(error), // Return detailed error for debugging
        },
        true
      );
    }
  }
  // public async getAllTourV1(userData: any, tokendata: any): Promise<any> {

  //   try {
  //     const result1 = await executeQuery(listallTourQuery);

  //     //  //way 1
  //     //     for (const image of result1) {
  //     //       for (const key of [
  //     //         "refGallery",
  //     //         "refItinaryMapPath",
  //     //         "refCoverImage",
  //     //       ]) {
  //     //         console.log("********************", key + "(()()()()(", image[key]);
  //     //         if (image[key]) {
  //     //           try {
  //     //             console.log("key line 219", key);
  //     //             const fileBuffer = await viewFile(image[key]);
  //     //             image[key] = {
  //     //               filename: path.basename(image[key]),
  //     //               content: fileBuffer.toString("base64"),
  //     //               contentType: "image/jpeg", // Adjust if needed based on the image type
  //     //             };
  //     //           } catch (error) {
  //     //             console.error(`Error reading ${key} file:`, error);
  //     //             image[key] = null; // Handle missing/unreadable files
  //     //           }
  //     //         }
  //     //       }

  //     //way 2

  //     for (const image of result1) {
  //       for (const key of [
  //         "refGallery",
  //         "refItinaryMapPath",
  //         "refCoverImage",
  //       ]) {
  //         const value = image[key];

  //         if (value) {
  //           try {
  //             if (key === "refGallery") {
  //               // Handle multiple image paths (as comma-separated string or array)
  //               const paths = Array.isArray(value)
  //                 ? value
  //                 : value.split(",").map((p: string) => p.trim());

  //               image[key] = await Promise.all(
  //                 paths.map(async (imgPath: string) => {
  //                   try {
  //                     const fileBuffer = await viewFile(imgPath);
  //                     return {
  //                       filename: path.basename(imgPath),
  //                       content: fileBuffer.toString("base64"),
  //                       contentType: "image/jpeg", // Update as needed
  //                     };
  //                   } catch (err) {
  //                     console.error(
  //                       `Error reading image from ${imgPath}:`,
  //                       err
  //                     );
  //                     return null;
  //                   }
  //                 })
  //               );
  //             } else {
  //               // Handle single image path
  //               const fileBuffer = await viewFile(value);
  //               image[key] = {
  //                 filename: path.basename(value),
  //                 content: fileBuffer.toString("base64"),
  //                 contentType: "image/jpeg", // Update as needed
  //               };
  //             }
  //           } catch (error) {
  //             console.error(`Error processing ${key}:`, error);
  //             image[key] = null;
  //           }
  //         }
  //       }
  //     }

  //     // way 3

  //     // for (const image of result1) {
  //     //   //  Handle refGallery (Multiple Images)
  //     //   if (image.refGallery) {
  //     //     try {
  //     //       const paths = Array.isArray(image.refGallery)
  //     //         ? image.refGallery
  //     //         : image.refGallery.split(",").map((p: string) => p.trim());

  //     //       image.refGallery = await Promise.all(
  //     //         paths.map(async (imgPath: string) => {
  //     //           try {
  //     //             const fileBuffer = await viewFile(imgPath);
  //     //             return {
  //     //               filename: path.basename(imgPath),
  //     //               content: fileBuffer.toString("base64"),
  //     //               contentType: "image/jpeg", // Adjust based on file type
  //     //             };
  //     //           } catch (err) {
  //     //             console.error(`Error reading image from ${imgPath}:`, err);
  //     //             return null;
  //     //           }
  //     //         })
  //     //       ).then((imgs) => imgs.filter(Boolean)); // Remove nulls if any
  //     //     } catch (error) {
  //     //       console.error("Error processing refGallery:", error);
  //     //       image.refGallery = [];
  //     //     }
  //     //   }

  //     // ✅ Handle Single Image Fields
  //     //   for (const key of ["refItinaryMapPath", "refCoverImage"]) {
  //     //     const value = image[key];
  //     //     if (value) {
  //     //       try {
  //     //         const fileBuffer = await viewFile(value);
  //     //         image[key] = {
  //     //           filename: path.basename(value),
  //     //           content: fileBuffer.toString("base64"),
  //     //           contentType: "image/jpeg", // Adjust as needed
  //     //         };
  //     //       } catch (error) {
  //     //         console.error(`Error reading ${key} file:`, error);
  //     //         image[key] = null;
  //     //       }
  //     //     }
  //     //   }
  //     // }

  //     console.log(result1);

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "listed Tour successfully",
  //         tourDetails: result1,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An unknown error occurred during listed  Tour ",
  //         error: String(error),
  //       },
  //       true
  //     );
  //   }
  // }
  public async getAllTourV1(userData: any, tokendata: any): Promise<any> {
    try {
      const result1 = await executeQuery(listallTourQuery);
      // for (const image of result1) {
      //   const galleryValue = image["refGallery"];
      //   if (galleryValue) {
      //     try {
      //       // If it's a string in the format: {"path1","path2",...}
      //       const galleryPaths =
      //         typeof galleryValue === "string"
      //           ? galleryValue
      //               .replace(/^{|}$/g, "") // Remove starting and ending curly braces
      //               .split(/","?/) // Split paths by "," or just "
      //               .map((p) => p.replace(/^"|"$/g, "").trim()) // Remove surrounding quotes
      //           : galleryValue;

      //       image["refGallery"] = await Promise.all(
      //         galleryPaths.map(async (imgPath: string) => {
      //           try {
      //             const fileBuffer = await viewFile(imgPath);
      //             return {
      //               filename: path.basename(imgPath),
      //               content: fileBuffer.toString("base64"),
      //               contentType: "image/jpeg",
      //             };
      //           } catch (err) {
      //             console.error(
      //               `Error reading gallery image from ${imgPath}:`,
      //               err
      //             );
      //             return null;
      //           }
      //         })
      //       ).then((results) => results.filter(Boolean)); // Filter out failed
      //     } catch (error) {
      //       console.error("Error processing refGallery:", error);
      //       image["refGallery"] = [];
      //     }
      //   }

      //   // Handle single image fields
      //   for (const key of ["refItinaryMapPath", "refCoverImage"]) {
      //     const value = image[key];

      //     if (value) {
      //       try {
      //         const fileBuffer = await viewFile(value);
      //         image[key] = {
      //           filename: path.basename(value),
      //           content: fileBuffer.toString("base64"),
      //           contentType: "image/jpeg",
      //         };
      //       } catch (error) {
      //         console.error(`Error processing ${key}:`, error);
      //         image[key] = null;
      //       }
      //     }
      //   }
      // }

      for (const image of result1) {
        // Handle gallery images
        const galleryValue = image["refGallery"];
        if (galleryValue) {
          try {
            const galleryPaths =
              typeof galleryValue === "string"
                ? galleryValue
                    .replace(/^{|}$/g, "") // Remove {}
                    .split(/","?/) // Split by "," or "
                    .map((p) => p.replace(/^"|"$/g, "").trim()) // Remove quotes
                : galleryValue;

            image["refGallery"] = galleryPaths.map((imgPath: string) =>
              path.basename(imgPath)
            );
          } catch (error) {
            console.error("Error processing refGallery:", error);
            image["refGallery"] = [];
          }
        }

        // Handle single image fields
        for (const key of ["refItinaryMapPath", "refCoverImage"]) {
          const value = image[key];
          if (value) {
            try {
              image[key] = path.basename(value);
            } catch (error) {
              console.error(`Error processing ${key}:`, error);
              image[key] = null;
            }
          }
        }
      }

      console.log(result1);

      return encrypt(
        {
          success: true,
          message: "listed Tour successfully",
          tourDetails: result1,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed  Tour ",
          error: String(error),
        },
        true
      );
    }
  }

  public async listCarParkingV1(userData: any, tokendata: any): Promise<any> {
    try {
      const {
        travelStartDate,
        travelEndDate,
        refCarParkingId,
        refAssociatedAirport,
        refCarParkingTypeId
      } = userData;

      if (!travelStartDate || !travelEndDate) {
        throw new Error("travelStartDate and travelEndDate are required.");
      }
      // Convert to proper Date objects
      const startDate = new Date(travelStartDate);
      const endDate = new Date(travelEndDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error(
          "Invalid date format for travelStartDate or travelEndDate."
        );
      }

      // Calculate duration in days
      const bookingDuration = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (bookingDuration <= 0) {
        throw new Error("travelEndDate must be after travelStartDate.");
      }
      const result1 = await executeQuery(listCarParkingQuery, [
        bookingDuration,
        refCarParkingId,
        refAssociatedAirport,
        refCarParkingTypeId
      ]);

      for (const image of result1) {
        if (image.parkingSlotImage) {
          try {
            image.parkingSlotImage = path.basename(image.parkingSlotImage);
          } catch (error) {
            console.error(
              "Error extracting filename for parkingSlotImage:",
              error
            );
            image.parkingSlotImage = null;
          }
        }
      }

      // Step 3: Return success response
      return encrypt(
        {
          success: true,
          message: "Listed car parikng successfully",
          tourDetails: result1,
        },
        false
      );
    } catch (error: unknown) {
      // Log the error for debugging
      console.error("Error in listing car parikng:", error);

      // Step 4: Return error response with a more descriptive error message
      return encrypt(
        {
          success: false,
          message: "An error occurred while listing the car parikng details.",
          error: String(error), // Return detailed error for debugging
        },
        false
      );
    }
  }

  public async getCarParkingV1(userData: any, tokendata: any): Promise<any> {
    try {
      const { refCarParkingId } = userData;
      // Step 1: Execute Queries
      const result1 = await executeQuery(listCarParkingByIdQuery, [
        refCarParkingId,
      ]);

      // Step 2: Process images results if needed

      for (const image of result1) {
        if (image.parkingSlotImage) {
          try {
            const fileBuffer = await viewFile(image.parkingSlotImage);
            image.parkingSlotImage = {
              filename: path.basename(image.parkingSlotImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg",
            };
          } catch (error) {
            console.error("Error reading image file for product ,err");
            image.parkingSlotImage = null;
          }
        }
      }

      // Step 3: Return success response
      return encrypt(
        {
          success: true,
          message: "get car parikng successfully",
          tourDetails: result1,
        },
        true
      );
    } catch (error: unknown) {
      // Log the error for debugging
      console.error("Error in getting car parikng:", error);

      // Step 4: Return error response with a more descriptive error message
      return encrypt(
        {
          success: false,
          message: "An error occurred while geting the car parikng details.",
          error: String(error), // Return detailed error for debugging
        },
        true
      );
    }
  }
  public async uploadMapV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the image from userData
      const image = userData.Image;

      // Ensure that only one image is provided
      if (!image) {
        throw new Error("Please provide an image.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the image
      console.log("Storing image...");
      filePath = await storeFile(image, 4);

      // Read the file buffer and convert it to Base64
      const imageBuffer = await viewFile(filePath);
      const imageBase64 = imageBuffer.toString("base64");

      storedFiles.push({
        filename: path.basename(filePath),
        content: imageBase64,
        contentType: "image/jpeg", // Assuming the image is in JPEG format
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
  public async deleteMapV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // let filePath: string | any;

      if (userData.refTravalDataId) {
        console.log("userData.refTravalDataId", userData.refTravalDataId);

        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getImageRecordQuery, [
          userData.refTravalDataId,
        ]);
        console.log("imageRecord", imageRecord);
        if (imageRecord.length === 0) {
          return encrypt(
            {
              success: false,
              message: "Image record not found",
              tokens: tokens,
            },
            true
          );
        }
      }
      // filePath = imageRecord[0].refImagePath;

      // Delete the image record from the database
      const DeleteImage = await executeQuery(deleteImageRecordQuery, [
        userData.refTravalDataId,
      ]);

      // } else {
      //   // filePath = userData.filePath;
      // }

      // if (filePath) {
      //   // Delete the file from local storage
      //   await deleteFile(filePath);
      // }

      return encrypt(
        {
          success: true,
          message: " Image Deleted Successfully",
          tokens: tokens,
        },
        true
      );
    } catch (error) {
      console.error("Error in deleting file:", (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Deleting Image: ${(error as Error).message}`,
          tokens: tokens,
        },
        true
      );
    }
  }
  public async getAllCarV1(userData: any, tokendata: any): Promise<any> {
    try {
      const { refCarTypeId } = userData;
      const result = await executeQuery(listCarsQuery, [refCarTypeId]);

      // for (const image of result) {
      //   if (image.refCarPath) {
      //     try {
      //       const fileBuffer = await viewFile(image.refCarPath);
      //       image.refCarPath = {
      //         filename: path.basename(image.refCarPath),
      //         content: fileBuffer.toString("base64"),
      //         contentType: "image/jpeg", // Adjust if needed
      //       };

      //     } catch (error) {
      //       console.error("Error reading image file:", error);
      //       image.refCarPath = null; // Handle missing/unreadable files
      //     }
      //   }
      // }

      for (const image of result) {
        if (image.refCarPath) {
          try {
            image.refCarPath = path.basename(image.refCarPath);
          } catch (error) {
            console.error("Error extracting filename from refCarPath:", error);
            image.refCarPath = null;
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "listed car successfully",
          Details: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed  car ",
          error: String(error),
        },
        true
      );
    }
  }
  public async getCarByIdV1(userData: any, tokendata: any): Promise<any> {
    try {
      const { refCarsId } = userData;

      const result1 = await executeQuery(getCarsByIdQuery, [refCarsId]);
      console.log("result1", result1);

      // const result2 = await executeQuery(getOtherCarsQuery, [refCarsId]);
      // console.log("result2", result2);

      // for (const image of result1) {
      //   if (image.refCarPath) {
      //     try {
      //       const fileBuffer = await viewFile(image.refCarPath);
      //       image.refCarPath = {
      //         filename: path.basename(image.refCarPath),
      //         content: fileBuffer.toString("base64"),
      //         contentType: "image/jpeg", // Adjust if needed
      //       };
      //     } catch (error) {
      //       console.error("Error reading image file:", error);
      //       image.refCarPath = null; // Handle missing/unreadable files
      //     }
      //   }
      // }

      for (const image of result1) {
        if (image.refCarPath) {
          try {
            image.refCarPath = path.basename(image.refCarPath);
          } catch (error) {
            console.error("Error extracting filename from refCarPath:", error);
            image.refCarPath = null;
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "listed car successfully",
          tourDetails: result1,
          // othertourDetails: result2,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed  car ",
          error: String(error),
        },
        true
      );
    }
  }
  public async listDestinationV1(userData: any, tokendata: any): Promise<any> {
    try {
      const result = await executeQuery(listDestinationQuery);

      return encrypt(
        {
          success: true,
          message: "listed destination successfully",
          Details: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed destination ",
          error: String(error),
        },
        true
      );
    }
  }
  public async userSignUpV1(userData: any, token_data?: any): Promise<any> {
    const client: PoolClient = await getClient();
    try {
      await client.query("BEGIN");
      const {
        temp_password,
        refFName,
        refLName,
        refDOB,
        refUserEmail,
        refMoblile,
      } = userData;
      console.log('userData', userData)

      const hashedPassword = await bcrypt.hash(temp_password, 10);

      const check = 
      [refMoblile,
        refUserEmail
      ];
      console.log(check);

      const userCheck = await client.query(checkQuery, check);
      console.log('userCheck', userCheck)

      const userFind = userCheck.rows[0];

      if (userFind) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            message: "Already exists",
            success: true,
          },
          true
        );
      }
      const customerPrefix = "EV-CUS-";
      const baseNumber = 0;

      const lastCustomerResult = await client.query(getLastCustomerIdQuery);
      let newCustomerId: string;

      if (lastCustomerResult.rows.length > 0) {
        const lastNumber = parseInt(lastCustomerResult.rows[0].count, 10);
        newCustomerId = `${customerPrefix}${(baseNumber + lastNumber + 1)
          .toString()
          .padStart(4, "0")}`;
      } else {
        newCustomerId = `${customerPrefix}${(baseNumber + 1)
          .toString()
          .padStart(4, "0")}`;
      }

      // Insert into users table
      const params = [
        newCustomerId,
        refFName,
        refLName,
        refDOB,
        refMoblile,
        // userData.refUserTypeId,
        CurrentTime(),
        3,
      ];
      const userResult = await client.query(insertUserQuery, params);
      console.log('userResult', userResult)
      const newUser = userResult.rows[0];

      // Insert into userDomain table
      const domainParams = [
        newUser.refuserId,
        refUserEmail,
        temp_password,
        hashedPassword,
        refMoblile,
        CurrentTime(),
        3,
      ];

      const domainResult = await client.query(
        insertUserDomainQuery,
        domainParams
      );
      console.log('domainResult', domainResult)
      // if ((userResult.rowCount ?? 0) > 0 && (domainResult.rowCount ?? 0) > 0) {
      //   const history = [
      //     52,
      //     3,
      //     `${userData.refFName} user signedUp succcesfully`,
      //     CurrentTime(),
      //     3,
      //   ];
      //   const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "User signed up added successful",
          user: newUser,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during User signed up:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during User signed up ",
          error: error instanceof Error ? error.message : String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  
  public async forgotPasswordV1(userData: any, token_data?: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: token_data.id }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { emailId } = userData;

      // Validate input
      if (!emailId) {
        return encrypt(
          {
            success: false,
            message: "Email ID is missing",
          },
          true
        );
      }

      // Begin database transaction
      await client.query("BEGIN");

      // Fetch all mobile numbers associated with the user
      const Result = await executeQuery(getUsersQuery, [emailId]);

      // Check if any mobile numbers were found
      if (!Result.length) {
        return encrypt(
          {
            success: false,
            message: "No found for the user",
            tokens: tokens,
          },
          true
        );
      }
      const genPassword = generatePassword();
      console.log("genPassword", genPassword);
      const genHashedPassword = await bcrypt.hash(genPassword, 10);
      console.log("genHashedPassword", genHashedPassword);

      const updatePassword = await client.query(updateUserPasswordQuery, [
        emailId,
        token_data.id,
        genPassword,
        genHashedPassword,
        CurrentTime(),
        token_data.id,
      ]);

      console.log("token_data.id", token_data.id);
      console.log("updatePassword", updatePassword);
      const tokenData = {
        id: token_data.id,
        email: emailId,
      };
      await client.query("COMMIT");

      // way 1
      const main = async () => {
        const mailOptions = {
          to: emailId,
          subject: "You Accont has be Created Successfully In our Platform", // Subject of the email
          html: generateforgotPasswordEmailContent(emailId, genPassword),
        };

        // Call the sendEmail function
        try {
          await sendEmail(mailOptions);
        } catch (error) {
          console.error("Failed to send email:", error);
        }
      };
      main().catch(console.error);

      // // way 2
      // const mailToUser = {
      //   to: emailId,
      //   subject: "You Accont has be Created Successfully In our Platform", // Subject of the email
      //   html: generateforgotPasswordEmailContent(emailId, genPassword),
      // };

      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: process.env.EMAILID,
      //     pass: process.env.PASSWORD,
      //   },
      // });

      // await transporter.sendMail(mailToUser);

      // Return the mobile numbers and email ID in the response
      return encrypt(
        {
          success: true,
          message: "mail send successfully",
          emailId,
          tokens: tokens,
        },
        true
      );
    } catch (error) {
      console.error("Error retrieving user contact info:", error);

      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "Internal server error",
          tokens: tokens,
        },
        true
      );
    } finally {
      client.release(); // Release the client back to the pool
    }
  }
  public async tourBrochureV1(userData: any, tokendata: any): Promise<any> {
    try {
      const { refPackageId } = userData;

      const result = await executeQuery(listTourBrochureQuery, [refPackageId]);

      if (result && result.length) {
        await processImages(result);
      }

      return encrypt(
        {
          success: true,
          message: "listed destination successfully",
          Details: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed destination ",
          error: String(error),
        },
        true
      );
    }
  }
  public async profileDataV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    try {
      const profileData = await executeQuery(profileDataQuery, [tokendata.id]);

      return encrypt(
        {
          success: true,
          message: "listed profileData successfully",
          token: tokens,
          profileData:profileData
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed profileData",
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async UpdateprofileDataV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    console.log("tokendata.id", tokendata.id);
    const tokens = generateTokenWithExpire(token, true);
    try {
      const {
        refFName,
        refLName,
        refDOB,
        refMoblile,
        refUserEmail,
        refUserPassword,
        refUserAddress,
        refUserCity,
        refUserState,
        refUserCountry,
        refUserZipCode,
      } = userData;
      console.log("userData", userData);

      const genHashedPassword = await bcrypt.hash(refUserPassword, 10);

      const profileData = await executeQuery(updateProfileDataQuery, [
        refFName,
        refLName,
        refDOB,
        refMoblile,
        CurrentTime(),
        tokendata.id,
        tokendata.id,
      ]);
      console.log("profileData", profileData);

      const domainData = await executeQuery(updatedomainDataQuery, [
        refUserEmail,
        refUserPassword,
        genHashedPassword,
        CurrentTime(),
        tokendata.id,
        tokendata.id,
      ]);
      console.log("domainData", domainData);

      const addressData = await executeQuery(updateAddressDataQuery, [
        refUserAddress,
        refUserCity,
        refUserState,
        refUserCountry,
        refUserZipCode,
        CurrentTime(),
        tokendata.id,
        tokendata.id,
      ]);
      console.log("addressData", addressData);

      return encrypt(
        {
          success: true,
          message: "profile update successfully",
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during profile update ",
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }

  public async tourBookingHistoryV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    try {
      const tourBookingresult = await executeQuery(
        userTourBookingHistoryQuery,
        [tokendata.id]
      );
      return encrypt(
        {
          success: true,
          message: "listed user tour Booking List",
          token: tokens,
          tourBookingresult: tourBookingresult,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message:
            "An unknown error occurred during listed user tour Booking List ",
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async carBookingHistoryV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    try {
      const CarBookingresult = await executeQuery(userCarBookingHistoryQuery, [
        tokendata.id
      ]);

      // const CarParkingBookingresult = await executeQuery(
      //   userCarParkingBookingHistoryQuery,
      //   [tokendata.id]
      // );

      return encrypt(
        {
          success: true,
          message: "listed user car Booking List",
          token: tokens,
          CarBookingresult: CarBookingresult,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message:
            "An unknown error occurred during listed user car Booking List ",
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async carParkingHistoryV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    try {
      const CarParkingBookingresult = await executeQuery(
        userCarParkingBookingHistoryQuery,
        [tokendata.id]
      );

      return encrypt(
        {
          success: true,
          message: "listed user car parking Booking List",
          token: tokens,
          CarParkingBookingresult: CarParkingBookingresult,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message:
            "An unknown error occurred during listed user car parking Booking List ",
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async listAssociateAirportV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    try {
      const result = await executeQuery(listAssociateAirportQuery);
      return encrypt(
        {
          success: true,
          message: "listed Associate Airport successfully",
          Details: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed Associate Airport ",
          error: String(error),
        },
        true
      );
    }
  }
  public async listParkingTypeV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    try {
      const result = await executeQuery(listParkingTypeQuery);
      return encrypt(
        {
          success: true,
          message: "listed Parking Type successfully",
          Details: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed Parking Type ",
          error: String(error),
        },
        true
      );
    }
  }
  public async addUserAddressV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();
    try {
      await client.query("BEGIN");
      const {
        refUserAddress,
        refUserCity,
        refUserState,
        refUserCountry,
        refUserZipCode,
      } = userData;

      // Insert into users table
      const params = [
        tokendata.id,
        refUserAddress,
        refUserCity,
        refUserState,
        refUserCountry,
        refUserZipCode,
        CurrentTime(),
        tokendata.id,
      ];
      const addressResult = await client.query(insertUserAddressQuery, params);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "User Address added successful",
          address: addressResult,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during User Address addition:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during User Address addition ",
          error: error instanceof Error ? error.message : String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

}

