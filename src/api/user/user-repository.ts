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
  getCarPriceQuery,
  getCarsByIdQuery,
  getFormDataQuery,
  getImageRecordQuery,
  getLastCustomerIdQuery,
  getOtherCarsQuery,
  getPackageNameQuery,
  getPackagePriceQuery,
  getParkingResultQuery,
  getUserResultQuery,
  getUsersQuery,
  insertcarParkingBookingQuery,
  insertUserAddressQuery,
  insertUserDomainQuery,
  insertUserQuery,
  listallTourQuery,
  listAssociateAirportQuery,
  listCarGroupQuery,
  listCarParkingByIdQuery,
  listCarParkingQuery,
  listCarParkingTypeQuery,
  listCarsQuery,
  listCarTypeQuery,
  listDestinationQuery,
  listfilteredCarsQuery,
  listfilteredTourQuery,
  listOtherTourQuery,
  listParkingTypeQuery,
  listTourBrochureQuery,
  listTourQuery,
  listVehicleTypeQuery,
  offercheckQuery,
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
  generateCarParkingBookingEmailContent,
  generateCustomizeTourBookingEmailContent,
  generateforgotPasswordEmailContent,
  generateTourBookingEmailContent,
  // sendTourRemainder,
  userCarEmailContent,
  userCarParkingBookingMail,
  userTourBookingMail,
} from "../../helper/mailcontent";
import { sendEmail } from "../../helper/mail";
import { cli } from "winston/lib/winston/config";

export class userRepository {
  // public async tourBookingV1(userData?: any, tokendata?: any): Promise<any> {
  //   const token = { id: tokendata.id, roleId: tokendata.roleId };
  //   const tokens = generateTokenWithExpire(token, true);
  //   const client: PoolClient = await getClient();

  //   try {
  //     await client.query("BEGIN");
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
  //       refApplyOffers,
  //       refCouponCode,
  //       transactionId
  //     } = userData;
  //     // 💥 Validate coupon if offer applied
  //     if (refApplyOffers === true) {
  //       if (!refCouponCode) {
  //         throw new Error("Coupon code is required when offer is applied.");
  //       }
  //       console.log("tokendata.id", tokendata.id);

  //       // 🔍 Check if coupon code is valid
  //       const offerCheckRes: any = await client.query(offercheckQuery, [
  //         refCouponCode,
  //         tokendata.id,
  //       ]);

  //       console.log("offerCheckRes", offerCheckRes);

  //       if (offerCheckRes.rows.length === 0) {
  //         throw new Error("You are not supposed to use this coupon code.");
  //       }

  //       const applyOffers = refApplyOffers === true;
  //       const couponCode = applyOffers ? refCouponCode : null;

  //       const Result = await client.query(addTourBookingQuery, [
  //         refPackageId,
  //         refUserName,
  //         refUserMail,
  //         refUserMobile,
  //         refPickupDate,
  //         refAdultCount,
  //         refChildrenCount,
  //         refInfants,
  //         refOtherRequirements,
  //         // refAgreementPath,
  //         applyOffers,
  //         couponCode,
  //         transactionId,
  //         CurrentTime(),
  //         tokendata.id,
  //         tokendata.id,
  //       ]);
  //       const main = async () => {
  //         const adminMail = {
  //           to: "indumathi123indumathi@gmail.com",
  //           subject: "New Tour Booking Received",
  //           html: generateTourBookingEmailContent(Result),
  //         };

  //         try {
  //           sendEmail(adminMail);
  //         } catch (error) {
  //           console.log("Error in sending the Mail for Admin", error);
  //         }
  //       };
  //       main().catch(console.error);

  //       await client.query("COMMIT");

  //       return encrypt(
  //         {
  //           success: true,
  //           message: "tour booking successfully",
  //           token: tokens,
  //           Data: Result.rows[0],
  //         },
  //         true
  //       );
  //     }
  //   } catch (error: unknown) {
  //     await client.query("ROLLBACK");
  //     console.error("Error tour booking:", error);

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred while tour booking",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }

  public async tourBookingV1(userData?: any, tokendata?: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN");
      const {
        refPackageId,
        refUserFname,
        refUserLname,
        refUserMail,
        refUserMobile,
        refPickupDate,
        refAdultCount,
        refChildrenCount,
        refInfants,
        refSingleRoom,
        refTwinRoom,
        refTripleRoom,
        refVaccinationCertificate,
        refOtherRequirements,
        refPassPort,
        refAgreementPath,
        refApplyOffers,
        refCouponCode,
        transactionId,
      } = userData;

      // If offers applied, validate coupon
      if (refApplyOffers === true) {
        if (!refCouponCode) {
          throw new Error("Coupon code is required when offer is applied.");
        }

        const offerCheckRes: any = await client.query(offercheckQuery, [
          refCouponCode,
          tokendata.id,
        ]);

        if (offerCheckRes.rows.length === 0) {
          throw new Error("You are not supposed to use this coupon code.");
        }
      }

      const applyOffers = refApplyOffers === true;
      const couponCode = applyOffers ? refCouponCode : null;

      // Get package price regardless of offer
      const getPackagePrice = await executeQuery(getPackagePriceQuery, [
        refPackageId,
      ]);
      const { refTourPrice } = getPackagePrice[0];

      const totalAmount =
        Number(refTourPrice) *
        (Number(refAdultCount) + Number(refChildrenCount));

      const Result = await client.query(addTourBookingQuery, [
        refPackageId,
        refUserFname,
        refUserLname,
        refUserMail,
        refUserMobile,
        refPickupDate,
        refAdultCount,
        refChildrenCount,
        refInfants,
        refSingleRoom,
        refTwinRoom,
        refTripleRoom,
        refVaccinationCertificate,
        refOtherRequirements,
        refPassPort,
        tokendata.id,
        refAgreementPath,
        applyOffers,
        couponCode,
        transactionId,
        totalAmount,
        CurrentTime(),
        tokendata.id,
      ]);

      // Send admin mail async (non-blocking)
      const main = async () => {
        const adminMail = {
          to: "indumathi123indumathi@gmail.com",
          subject: "New Tour Booking Received",
          html: generateTourBookingEmailContent(Result),
        };

        try {
          sendEmail(adminMail);
        } catch (error) {
          console.log("Error in sending the Mail for Admin", error);
        }
      };
      main().catch(console.error);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "tour booking successfully",
          token: tokens,
          Data: Result.rows[0],
          totalAmount: totalAmount,
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
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // public async tourBookingV1(userData?: any, tokendata?: any): Promise<any> {
  //   const token = { id: tokendata.id, roleId: tokendata.roleId };
  //   const tokens = generateTokenWithExpire(token, true);
  //   const client: PoolClient = await getClient();

  //   try {
  //     await client.query("BEGIN");
  //     const {
  //       refPackageId,
  //       refUserFname,
  //       refUserLname,
  //       refUserMail,
  //       refUserMobile,
  //       refPickupDate,
  //       refAdultCount,
  //       refChildrenCount,
  //       refInfants,
  //       refSingleRoom,
  //       refTwinRoom,
  //       refTripleRoom,
  //       refVaccinationCertificate,
  //       refOtherRequirements,
  //       refPassPort,
  //       refAgreementPath,
  //       refApplyOffers,
  //       refCouponCode,
  //       transactionId,
  //     } = userData;
  //     // 💥 Validate coupon if offer applied
  //     if (refApplyOffers === true) {
  //       if (!refCouponCode) {
  //         throw new Error("Coupon code is required when offer is applied.");
  //       }
  //       console.log("tokendata.id", tokendata.id);

  //       // 🔍 Check if coupon code is valid
  //       const offerCheckRes: any = await client.query(offercheckQuery, [
  //         refCouponCode,
  //         tokendata.id,
  //       ]);

  //       console.log("offerCheckRes", offerCheckRes);

  //       if (offerCheckRes.rows.length === 0) {
  //         throw new Error("You are not supposed to use this coupon code.");
  //       }

  //       const applyOffers = refApplyOffers === true;
  //       const couponCode = applyOffers ? refCouponCode : null;

  //       const getPackagePrice = await executeQuery(getPackagePriceQuery, [
  //         refPackageId,
  //       ]);
  //       const { refTourPrice } = getPackagePrice[0];

  //       const totalAmount =
  //         Number(refTourPrice) *
  //         (Number(refAdultCount) + Number(refChildrenCount));

  //       const Result = await client.query(addTourBookingQuery, [
  //         refPackageId,
  //         refUserFname,
  //         refUserLname,
  //         refUserMail,
  //         refUserMobile,
  //         refPickupDate,
  //         refAdultCount,
  //         refChildrenCount,
  //         refInfants,
  //         refSingleRoom,
  //         refTwinRoom,
  //         refTripleRoom,
  //         refVaccinationCertificate,
  //         refOtherRequirements,
  //         refPassPort,
  //         tokendata.id,
  //         refAgreementPath,
  //         applyOffers,
  //         couponCode,
  //         transactionId,
  //         totalAmount,
  //         CurrentTime(),
  //         tokendata.id,
  //       ]);
  //       const main = async () => {
  //         const adminMail = {
  //           to: "indumathi123indumathi@gmail.com",
  //           subject: "New Tour Booking Received",
  //           html: generateTourBookingEmailContent(Result),
  //         };

  //         try {
  //           sendEmail(adminMail);
  //         } catch (error) {
  //           console.log("Error in sending the Mail for Admin", error);
  //         }
  //       };
  //       main().catch(console.error);

  //       await client.query("COMMIT");

  //       return encrypt(
  //         {
  //           success: true,
  //           message: "tour booking successfully",
  //           token: tokens,
  //           Data: Result.rows[0],
  //           totalAmount:totalAmount
  //         },
  //         true
  //       );
  //     }
  //   } catch (error: unknown) {
  //     await client.query("ROLLBACK");
  //     console.error("Error tour booking:", error);

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred while tour booking",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }

  public async customizeBookingV1(
    userData?: any,
    tokendata?: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
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
        // refAgreementPath,
        refApplyOffers,
        refCouponCode,
        transactionId,
      } = userData;

      // 💥 Validate coupon if offer applied
      if (refApplyOffers === true) {
        if (!refCouponCode) {
          throw new Error("Coupon code is required when offer is applied.");
        }
        console.log("tokendata.id", tokendata.id);

        // 🔍 Check if coupon code is valid
        const offerCheckRes = await client.query(offercheckQuery, [
          refCouponCode,
          tokendata.id,
        ]);

        console.log("offerCheckRes", offerCheckRes);
        if (offerCheckRes.rows.length === 0) {
          throw new Error("You are not supposed to use this coupon code.");
        }
      }

      const applyOffers = refApplyOffers === true;
      const couponCode = applyOffers ? refCouponCode : null;

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
        // refAgreementPath,
        applyOffers,
        couponCode,
        transactionId,
        CurrentTime(),
        tokendata.id,
        tokendata.id,
      ]);

      const getPackageName: any = await executeQuery(getPackageNameQuery, [
        refPackageId,
      ]);

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
          to: "tours_booking@explorevacations.ch",
          subject: "New Customize Tour Booking Received",
          html: generateCustomizeTourBookingEmailContent(Result),
        };

        try {
          sendEmail(adminMail);
        } catch (error) {
          console.log("Error in sending the Mail for Admin", error);
        }
      };
      main().catch(console.error);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Customize tour booking added successfully",
          token: tokens,
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
          token: tokens,
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
  public async uploadPassportV1(userData: any, tokendata: any): Promise<any> {
    console.log("userData", userData);
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

  public async userCarBookingV1(userData?: any, tokendata?: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction
      const {
        refCarsId,
        refUserFname,
        refUserLname,
        refUserMail,
        refUserMobile,
        refUserAddress,
        refPickupDate,
        refDropDate,
        refOtherRequirements,
        refDriverName,
        refDriverAge,
        refDriverMail,
        refDriverMobile,
        refAgreementPath,
        transactionId,
        isExtraKMneeded,
        refExtraKm,
      } = userData;

      const refFormDetails = `{${userData.refFormDetails.join(",")}}`;

      const isExtraKMneed = isExtraKMneeded === true;
      const ExtraKm = isExtraKMneed ? refExtraKm : null;

      // Insert booking data
      const Result: any = await client.query(addCarBookingQuery, [
        refCarsId,
        refUserFname,
        refUserLname,
        refUserMail,
        refUserMobile,
        refUserAddress,
        refPickupDate,
        refDropDate,
        refFormDetails,
        refOtherRequirements,
        refAgreementPath,
        transactionId,
        isExtraKMneed,
        ExtraKm,
        CurrentTime(),
        tokendata.id,
        tokendata.id,
      ]);

      //way 1

      // const daysLeft = Math.ceil(
      //   (new Date(refPickupDate).getTime() -
      //     new Date(CurrentTime()).getTime()) /
      //     (1000 * 60 * 60 * 24)
      // );

      const getCarName = await executeQuery(getcarNameQuery, [refCarsId]);

      // const { refCarTypeName, refVehicleTypeName, refCarCustId, refCarPrice } =
      //   getCarName[0];
      // console.log("getCarName[0]", getCarName[0]);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAILID,
          pass: process.env.PASSWORD,
        },
      });

      const mailoption = {
        from: process.env.EMAILID,
        // to: "indumathi123indumathi@gmail.com",
        to: "rac_booking@explorevacations.ch",
        subject: "New car Booking Received",
        html: generateCarBookingEmailContent(Result.rows),
      };

      transporter.sendMail(mailoption);

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
          token: tokens,
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
          token: tokens,
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
  public async getAllTourV1(userData: any, tokendata: any): Promise<any> {
    try {
      let result1;
      const getDurationInDays = (fromDate: string, toDate: string): number => {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        const diff = Math.ceil(
          (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diff;
      };

      const hasFilter =
        userData &&
        userData.fromdate &&
        userData.todate &&
        userData.refPersonCount &&
        userData.refDesignationId;

      if (!hasFilter) {
        // No filters provided, list all tours
        result1 = await executeQuery(listallTourQuery);
      } else {
        // Filters provided, run filtered query
        const durationDays = getDurationInDays(
          userData.fromdate,
          userData.todate
        );
        console.log("durationDays", durationDays);

        result1 = await executeQuery(listfilteredTourQuery, [
          userData.refDesignationId,
          userData.refPersonCount,
          durationDays,
        ]);
      }
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
        refAssociatedAirport,
        refCarParkingTypeId,
        refParkingTypeId,
      } = userData;

      if (!travelStartDate || !travelEndDate) {
        throw new Error("travelStartDate and travelEndDate are required.");
      }

      const result1 = await executeQuery(listCarParkingQuery, [
        travelStartDate,
        travelEndDate,
        refAssociatedAirport,
        refCarParkingTypeId,
        refParkingTypeId,
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
          carParkingDetails: result1,
        },
        true
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
        true
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
          Details: result1,
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
    const token = { id: tokendata.id, roleId: tokendata.roleId };
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
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      let filePath: string | any;

      if (userData.refTravalDataId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getImageRecordQuery, [
          userData.refTravalDataId,
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

        filePath = imageRecord[0].refItinaryMapPath;

        // Delete the image record from the database
        const DeleteImage = await executeQuery(deleteImageRecordQuery, [
          userData.refTravalDataId,
        ]);
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
          message: "Employee profile image deleted successfully",
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
  public async getAllCarV1(userData: any, tokendata: any): Promise<any> {
    try {
      let result;
      const hasFilter =
        userData &&
        userData.refCarTypeId &&
        userData.refVehicleTypeId &&
        userData.refPersonCount;

      if (!hasFilter) {
        result = await executeQuery(listCarsQuery, [userData.refCarTypeId]);
      } else {
        result = await executeQuery(listfilteredCarsQuery, [
          userData.refCarTypeId,
          userData.refVehicleTypeId,
          userData.refPersonCount,
        ]);
      }

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

      // const result2 = await executeQuery(getOtherCarsQuery, [refCarsId]);
      // console.log("result2", result2);

      for (const image of result1) {
        if (image.refCarPath) {
          try {
            const fileBuffer = await viewFile(image.refCarPath);
            image.refCarPath = {
              filename: path.basename(image.refCarPath),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Adjust if needed
            };
          } catch (error) {
            console.error("Error reading image file:", error);
            image.refCarPath = null; // Handle missing/unreadable files
          }
        }
      }

      // for (const image of result1) {
      //   if (image.refCarPath) {
      //     try {
      //       image.refCarPath = path.basename(image.refCarPath);
      //     } catch (error) {
      //       console.error("Error extracting filename from refCarPath:", error);
      //       image.refCarPath = null;
      //     }
      //   }
      // }

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
      const result1 = await executeQuery(listVehicleTypeQuery);
      const result2 = await executeQuery(listCarTypeQuery);
      const result3 = await executeQuery(listCarGroupQuery);

      return encrypt(
        {
          success: true,
          message: "listed destination successfully",
          Details: result,
          VehicleType: result1,
          carType:result2,
          carGroup:result3
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
      const { refFName, refLName, refDOB, refUserEmail, refMoblile } = userData;
      const genPassword = generatePassword();
      const genHashedPassword = await bcrypt.hash(genPassword, 10);

      const check = [refMoblile, refUserEmail];

      const userCheck = await executeQuery(checkQuery, check);
      const count = Number(userCheck[0]?.count || 0); // safely convert to number

      if (count > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            message: "Already exists",
            success: false,
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
        `{3}`,
        CurrentTime(),
        3,
      ];
      const userResult = await client.query(insertUserQuery, params);
      const newUser = userResult.rows[0];

      // Insert into userDomain table
      const domainParams = [
        newUser.refuserId,
        refUserEmail,
        genPassword,
        genHashedPassword,
        refMoblile,
        CurrentTime(),
        3,
      ];

      const domainResult = await client.query(
        insertUserDomainQuery,
        domainParams
      );
      const main = async () => {
        const mailOptions = {
          to: refUserEmail,
          subject: "You Accont has be Created Successfully In our Platform", // Subject of the email
          html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Welcome to Explore Vacation, ${refFName}!</h2>
      <p>We are excited to have you on board. Your account has been successfully created.</p>

      <h3>Here are your login details:</h3>
      <ul style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
        <li><strong>Email:</strong> ${refUserEmail}</li>
        <li><strong>Password:</strong> ${genPassword}</li>
      </ul>

      <p style="color: #e74c3c;"><strong>Please change your password after logging in for the first time.</strong></p>

      <p>If you have any questions or need support, feel free to contact our team.</p>

      <p>Best regards,<br/>The Explore Vacation Team</p>
    </div>
  `,
        };

        // Call the sendEmail function
        try {
          await sendEmail(mailOptions);
        } catch (error) {
          console.error("Failed to send email:", error);
        }
      };
      main().catch(console.error);

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
    // const token = { id: token_data.id }; // Extract token ID
    // const tokens = generateTokenWithExpire(token, true);
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
            // token: tokens,
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
        // token_data.id,
        genPassword,
        genHashedPassword,
        CurrentTime(),
        // token_data.id,
      ]);

      // console.log("token_data.id", token_data.id);
      // const tokenData = {
      //   // id: token_data.id,
      //   email: emailId,
      // };
      await client.query("COMMIT");

      // way 1
      const main = async () => {
        const mailOptions = {
          to: emailId,
          subject: "Password Reset Successful", // Subject of the email
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
          emailId: emailId,
          // token: tokens,
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
          // token: tokens,
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
    const token = { id: tokendata.id, roleId: tokendata.roleId }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    try {
      const profileData = await executeQuery(profileDataQuery, [tokendata.id]);

      return encrypt(
        {
          success: true,
          message: "listed profileData successfully",
          token: tokens,
          profileData: profileData,
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
    const token = { id: tokendata.id, roleId: tokendata.roleId }; // Extract token ID
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

      const domainData = await executeQuery(updatedomainDataQuery, [
        refUserEmail,
        refUserPassword,
        genHashedPassword,
        CurrentTime(),
        tokendata.id,
        tokendata.id,
      ]);

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
    const token = { id: tokendata.id, roleId: tokendata.roleId }; // Extract token ID
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
      console.log("error", error);
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
    const token = { id: tokendata.id, roleId: tokendata.roleId }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    try {
      const CarBookingresult = await executeQuery(userCarBookingHistoryQuery, [
        tokendata.id,
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
      console.log("error", error);
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
    const token = { id: tokendata.id, roleId: tokendata.roleId }; // Extract token ID
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
      console.log("error", error);
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
  public async listParkingTypeV1(userData: any, tokendata: any): Promise<any> {
    try {
      const result1 = await executeQuery(listParkingTypeQuery);

      const result2 = await executeQuery(listCarParkingTypeQuery);
      return encrypt(
        {
          success: true,
          message: "listed Parking Type successfully",
          vehicleType: result1,
          parkingType: result2,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
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
    const token = { id: tokendata.id, roleId: tokendata.roleId }; // Extract token ID
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
          token: tokens,
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
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async carParkingBookingV1(
    userData?: any,
    tokendata?: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();
    try {
      await client.query("BEGIN");
      const {
        travelStartDate,
        travelEndDate,
        refCarParkingId,
        returnFlightNumber,
        returnFlightLocation,
        VehicleModel,
        vehicleNumber,
        refHandOverTime,
        refReturnTime,
        WhoWillHandover,
        HandoverPersonName,
        HandoverPersonPhone,
        HandoverPersonEmail,
        // refAgreementPath,
        transactionId,
      } = userData;

      // Conditionally handle handover details
      const handoverName =
        WhoWillHandover === false ? HandoverPersonName : null;
      const handoverPhone =
        WhoWillHandover === false ? HandoverPersonPhone : null;
      const handoverEmail =
        WhoWillHandover === false ? HandoverPersonEmail : null;

      // Insert into users table
      const params = [
        tokendata.id,
        travelStartDate,
        travelEndDate,
        refCarParkingId,
        returnFlightNumber,
        returnFlightLocation,
        VehicleModel,
        vehicleNumber,
        refHandOverTime,
        refReturnTime,
        WhoWillHandover,
        handoverName,
        handoverPhone,
        handoverEmail,
        // refAgreementPath,
        transactionId,
        CurrentTime(),
        tokendata.id,
      ];

      const Result = await client.query(insertcarParkingBookingQuery, params);

      // const getUserResult:any = await client.query(getUserResultQuery,[tokendata.id])
      // console.log('getUserResult', getUserResult)
      // const {refUserEmail, refFName } = getUserResult[0];

      const getUserResult: any = await client.query(getUserResultQuery, [
        tokendata.id,
      ]);

      if (!getUserResult.rows || getUserResult.rows.length === 0) {
        throw new Error(`No user found with id ${tokendata.id}`);
      }

      const { refUserEmail, refFName } = getUserResult.rows[0];

      // const getParkingResult: any = await client.query(getParkingResultQuery, [
      //   refCarParkingId,
      // ]);
      // console.log("getParkingResult", getParkingResult);
      // const { refParkingName, refParkingCustId } = getParkingResult[0];
      // console.log('refParkingCustId', refParkingCustId)
      // console.log('refParkingName', refParkingName)

      const getParkingResult: any = await client.query(getParkingResultQuery, [
        refCarParkingId,
      ]);

      if (!getParkingResult.rows || getParkingResult.rows.length === 0) {
        throw new Error("No parking data found for the given refCarParkingId");
      }

      const { refParkingName, refParkingCustId } = getParkingResult.rows[0];

      const main = async () => {
        const adminMail = {
          to: "parking@explorevacations.ch",
          subject: "New Car parking Booking Received",
          html: generateCarParkingBookingEmailContent(Result),
        };
        try {
          sendEmail(adminMail);
        } catch (error) {
          console.log("Error in sending the Mail for Admin", error);
        }
      };
      main().catch(console.error);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "car ParkingBooking added successful",
          Result: Result.rows,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during car ParkingBooking addition:", error);
      return encrypt(
        {
          success: false,
          message:
            "An unexpected error occurred during User car Parking Booking ",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async checkofferV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN");

      const { refPackageId, refCouponCode } = userData;

      // if (refApplyOffers === true) {
      //   if (!refCouponCode) {
      //     throw new Error("Coupon code is required when offer is applied.");
      //   }

      const offerCheckRes: any = await client.query(offercheckQuery, [
        refCouponCode,
        tokendata.id,
      ]);

      if (offerCheckRes.rows.length === 0) {
        throw new Error("You are not supposed to use this coupon code.");
      }

      const getPackagePrice = await executeQuery(getPackagePriceQuery, [
        refPackageId,
      ]);

      // if (!getPackagePrice || getPackagePrice.length === 0) {
      //   throw new Error("Package price not found.");
      // }

      const { refTourPrice } = getPackagePrice[0];
      const { refOfferType, refOfferValue } = offerCheckRes.rows[0] ?? {};

      // if (!refOfferType || typeof refOfferValue !== "string") {
      //   throw new Error("Invalid offer details.");
      // }

      let totalAmount: number;

      if (refOfferType === "Percentage") {
        totalAmount = refTourPrice - (refTourPrice * refOfferValue) / 100;
      } else if (refOfferType === "Flat") {
        totalAmount = refTourPrice - refOfferValue;
      } else {
        throw new Error("No valid offers matched.");
      }

      if (totalAmount < 0) totalAmount = 0;
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Listed amount calculated successfully",
          result: totalAmount,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed amount",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  // public async extraKMchargesV1(userData: any, tokendata: any): Promise<any> {
  //   try {
  //     const { isExtraKMneeded, refExtraKm, refCarsId, refFormDetails } =
  //       userData;
  //     console.log("userData", userData);

  //     let kmPrice =0;
  //     let formDetailsPrice = 0;
  //     let refCarPrice = 0;

  //     if (Array.isArray(refFormDetails) && refFormDetails.length > 0) {
  //       const refFormDetailsIds = refFormDetails.map(
  //         (item: any) => item.refFormDetailsId
  //       );
  //       const getFormData = await executeQuery(getFormDataQuery, [
  //         refFormDetailsIds,
  //       ]);
  //       console.log('getFormData', getFormData)
  //       if (getFormData && getFormData.length > 0) {
  //         formDetailsPrice = getFormData.reduce(
  //           (sum: number, item: any) => sum + Number(item.refPrice),
  //           0
  //         );
  //       }
  //     }

  //     if (isExtraKMneeded === true) {
  //       const getCarPrice = await executeQuery(getCarPriceQuery, [refCarsId]);
  //       if (!getCarPrice || getCarPrice.length === 0) {
  //         throw new Error("Car price not found");
  //       }
  //       const { refExtraKMcharges, refCarPrice: carPrice } = getCarPrice[0];
  //       const extraKmCharge = Number(refExtraKMcharges);
  //       const extraKm = Number(refExtraKm);
  //       if (!Number.isFinite(extraKmCharge) || !Number.isFinite(extraKm)) {
  //         throw new Error("Invalid KM charge or extra KM value");
  //       }
  //       kmPrice = extraKmCharge * extraKm;
  //       console.log("kmPrice", kmPrice);
  //       refCarPrice = Number(carPrice);
  //     }
  //     console.log("refCarPrice", refCarPrice);

  //     const totalAmount = kmPrice + formDetailsPrice + refCarPrice;
  //     console.log("totalAmount", totalAmount);
  //     const token = { id: tokendata.id, roleId: tokendata.roleId };
  //     const tokens = generateTokenWithExpire(token, true);

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Listed amount calculated successfully",
  //         result: {
  //           kmPrice,
  //           formDetailsPrice,
  //           totalAmount,
  //         },
  //         token: tokens,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     const token = { id: tokendata.id, roleId: tokendata.roleId };
  //     const tokens = generateTokenWithExpire(token, true);
  //     console.log("error", error);
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An unknown error occurred during listed amount calculation",
  //         error: String(error),
  //         token: tokens,
  //       },
  //       true
  //     );
  //   }
  // }
  public async extraKMchargesV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { isExtraKMneeded, refExtraKm, refCarsId, refFormDetails } =
        userData;
      console.log("userData", userData);

      let kmPrice = 0;
      let formDetailsPrice = 0;
      let refCarPrice = 0;

      // 1. Calculate formDetailsPrice
      if (Array.isArray(refFormDetails) && refFormDetails.length > 0) {
        const refFormDetailsIds = refFormDetails.map(
          (item: any) => item.refFormDetailsId
        );

        const getFormData = await executeQuery(getFormDataQuery, [
          refFormDetailsIds,
        ]);
        console.log("getFormData:", getFormData);

        if (getFormData && getFormData.length > 0) {
          const validFormData = getFormData.filter(
            (item: any) =>
              !item.isDelete &&
              item.refPrice != null &&
              !isNaN(Number(item.refPrice))
          );

          formDetailsPrice = validFormData.reduce(
            (sum: number, item: any) => sum + Number(item.refPrice),
            0
          );

          console.log("formDetailsPrice:", formDetailsPrice);
        }
      }
      const getCarPrice = await executeQuery(getCarPriceQuery, [refCarsId]);
      if (!getCarPrice || getCarPrice.length === 0) {
        throw new Error("Car price not found for given car ID");
      }

      const { refExtraKMcharges, refCarPrice: carPrice } = getCarPrice[0];
      refCarPrice = Number(carPrice ?? 0); // ✅ Always set this

      if (isExtraKMneeded) {
        const extraKmCharge = Number(refExtraKMcharges ?? 0);
        const extraKm = Number(refExtraKm ?? 0);

        if (!Number.isFinite(extraKmCharge) || !Number.isFinite(extraKm)) {
          throw new Error("Invalid KM charge or extra KM value");
        }

        kmPrice = extraKmCharge * extraKm;

        console.log("formDetailsPrice:", formDetailsPrice);
        console.log("extraKmCharge:", extraKmCharge);
        console.log("extraKm:", extraKm);
        console.log("kmPrice:", kmPrice);
      }

      const totalAmount = kmPrice + formDetailsPrice + refCarPrice;
      console.log("totalAmount:", totalAmount);

      return encrypt(
        {
          success: true,
          message: "Listed amount calculated successfully",
          result: {
            kmPrice,
            formDetailsPrice,
            refCarPrice,
            totalAmount,
          },
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.error("extraKMchargesV1 error:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred during listed amount calculation",
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }

  public async checkTourPriceV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { refPackageId, refAdultCount, refChildrenCount } = userData;

      const getPackagePrice = await executeQuery(getPackagePriceQuery, [
        refPackageId,
      ]);
      const { refTourPrice } = getPackagePrice[0];
      const totalAmount =
        Number(refTourPrice) *
        (Number(refAdultCount) + Number(refChildrenCount));

      return encrypt(
        {
          success: true,
          message: "Listed amount calculated successfully",
          totalAmount: totalAmount,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed amount calculation",
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }
}
