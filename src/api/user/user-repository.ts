import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import {
  formatDate,
  generatePassword,
  processImages,
} from "../../helper/common";

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
  getCarsByIdQuery,
  getImageRecordQuery,
  getLastCustomerIdQuery,
  getOtherCarsQuery,
  getUsersQuery,
  insertUserDomainQuery,
  insertUserQuery,
  listallTourQuery,
  listCarsQuery,
  listDestinationQuery,
  listOtherTourQuery,
  listTourBrochureQuery,
  listTourQuery,
  updateHistoryQuery,
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
  generateReminderEmailContent,
  generateTourBookingEmailContent,
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
        "User",
      ]);

      // 1. Admin email
      const adminMail = {
        to: "indumathi123indumathi@gmail.com",
        subject: "New Tour Booking Received",
        html: generateTourBookingEmailContent(Result),
      };
      // await sendEmail(adminMail);

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
        subject: "New Tour Booking Received",
        html: generateTourBookingEmailContent(Result),
      };

      await transporter.sendMail(mailoption);

      // 2. User confirmation email with countdown
      const daysLeft = Math.ceil(
        (new Date(refPickupDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const adminmailoption = {
        from: process.env.EMAILID,
        to: refUserMail,
        subject: "✅ Your Tour Has Been Booked!",
        html: `
          <h2>Hi ${refUserName},</h2>
          <p>🎉 Your tour has been successfully booked!</p>
          <p>Your tour starts on <strong>${refPickupDate}</strong>.</p>
          <p>🧳 Only <strong>${daysLeft}</strong> day(s) to go!</p>
          <p>We’ll send you daily reminders so you don’t miss a thing!</p>
          <br/>
          <p>Thank you,<br>Team Explore Vacations</p>
        `,
      };

      await transporter.sendMail(adminmailoption);

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
        CurrentTime(),
        "User",
      ]);

      const bookingData = Result.rows[0];

      const sendAdminMail = async () => {
        const mailOptions = {
          to: "indumathi123indumathi@gmail.com",
          subject: "New Customize Tour Booking Received",
          html: generateCustomizeTourBookingEmailContent(bookingData),
        };

        try {
          await sendEmail(mailOptions);
        } catch (error) {
          console.error("Failed to send admin email:", error);
        }
      };

      const sendUserConfirmationMail = async () => {
        const daysLeft = Math.ceil(
          (new Date(refArrivalDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );

        const mailOptions = {
          to: refUserMail,
          subject: "🌍 Customize Tour Booking Confirmed",
          html: `
            <h2>Hello ${refUserName} 👋</h2>
            <p>Your customized tour request has been received successfully.</p>
            <p><strong>Arrival Date:</strong> ${refArrivalDate}</p>
            <p><strong>Days left:</strong> ${daysLeft} day(s)</p>
            <br>
            <p>Our team will contact you shortly to finalize the details.</p>
            <p>Thank you for choosing our service! 😊</p>
          `,
        };

        try {
          await sendEmail(mailOptions);
        } catch (error) {
          console.error("Failed to send confirmation email to user:", error);
        }
      };

      await Promise.all([sendAdminMail(), sendUserConfirmationMail()]);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Customize tour booking added successfully",
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
    try {
      // Extract the PDF file from userData
      const pdfFile = userData.PdfFile;
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
      } = userData;

      // const refFormDetails = `{${userData.refFormDetails.join(",")}}`;

      // Insert booking data
      const Result = await client.query(addCarBookingQuery, [
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
        "User",
      ]);

      // const sendAdminMail = async () => {
      //   const mailOptions = {
      //     to: "indumathi123indumathi@gmail.com",
      //     subject: "New Car Booking Received",
      //     html: generateCarBookingEmailContent(Result.rows[0]),
      //   };

      //   try {
      //     await sendEmail(mailOptions);
      //   } catch (error) {
      //     console.error("Failed to send admin email:", error);
      //   }
      // };

      // // === 2. Send confirmation email to User ===
      // const sendUserConfirmationMail = async () => {
      //   const daysLeft = Math.ceil(
      //     (new Date(refPickupDate).getTime() - new Date().getTime()) /
      //       (1000 * 60 * 60 * 24)
      //   );

      //   const mailOptions = {
      //     to: refUserMail,
      //     subject: "🚗 Car Booking Confirmed",
      //     html: `
      //       <h2>Hello ${refUserName} 👋</h2>
      //       <p>Your car has been booked successfully with us.</p>
      //       <p><strong>Pickup Date:</strong> ${refPickupDate}</p>
      //       <p><strong>Pickup Address:</strong> ${refPickupAddress}</p>
      //       <p><strong>Drop Address:</strong> ${refSubmissionAddress}</p>
      //       <p><strong>Days left:</strong> ${daysLeft} day(s)</p>
      //       <br>
      //       <p>Thank you for choosing our service! 😊</p>
      //     `,
      //   };

      //   try {
      //     await sendEmail(mailOptions);

      //   } catch (error) {
      //     console.error("Failed to send confirmation email to user:", error);
      //   }
      // };

      // await Promise.all([sendAdminMail(), sendUserConfirmationMail()]);

      // 1. Admin email
      const adminMail = {
        to: "indumathi123indumathi@gmail.com",
        subject: "New Tour Booking Received",
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
        subject: "New Tour Booking Received",
        html: generateTourBookingEmailContent(Result),
      };

      await transporter.sendMail(mailoption);

      // 2. User confirmation email with countdown
      const daysLeft = Math.ceil(
        (new Date(refPickupDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const adminmailoption = {
        from: process.env.EMAILID,
        to: refUserMail,
        subject: "🚗 Car Booking Confirmed",
        html: `
              <h2>Hello ${refUserName} 👋</h2>
              <p>Your car has been booked successfully with us.</p>
              <p><strong>Pickup Date:</strong> ${refPickupDate}</p>
              <p><strong>Pickup Address:</strong> ${refPickupAddress}</p>
              <p><strong>Drop Address:</strong> ${refSubmissionAddress}</p>
              <p><strong>Days left:</strong> ${daysLeft} day(s)</p>
              <br>
              <p>Thank you for choosing our service! 😊</p>
            `,
      };

      await transporter.sendMail(adminmailoption);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "User car booking added successfully",
          Data: Result.rows[0],
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

      // Step 2: Process images for both sets of results
      if (result1 && result1.length) {
        await processImages(result1);
      }
      if (result2 && result2.length) {
        await processImages(result2);
      }

      // Step 3: Return success response
      return encrypt(
        {
          success: true,
          message: "Listed Tour successfully",
          tourDetails: result1,
          othertourDetails: result2,
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
      const result = await executeQuery(listallTourQuery);

      console.log("result1", result);
      // Convert images to Base64 format
      for (const image of result) {
        if (image.refCoverImage) {
          try {
            const fileBuffer = await viewFile(image.refCoverImage);
            image.refCoverImage = {
              filename: path.basename(image.refCoverImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Adjust if needed
            };
          } catch (error) {
            console.error("Error reading image file:", error);
            image.refCoverImage = null; // Handle missing/unreadable files
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "listed Tour successfully",
          tourDetails: result,
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
      const result = await executeQuery(listCarsQuery);

      for (const image of result) {
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

      const result2 = await executeQuery(getOtherCarsQuery, [refCarsId]);
      console.log("result2", result2);

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

      return encrypt(
        {
          success: true,
          message: "listed car successfully",
          tourDetails: result1,
          othertourDetails: result2,
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

      const hashedPassword = await bcrypt.hash(temp_password, 10);

      const check = [refMoblile];
      console.log(check);

      const userCheck = await client.query(checkQuery, check);

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
        // userData.refUserTypeId,
        CurrentTime(),
        3,
      ];
      const userResult = await client.query(insertUserQuery, params);
      const newUser = userResult.rows[0];

      // Insert into userDomain table
      const domainParams = [
        newUser.refuserId,
        refUserEmail,
        temp_password,
        hashedPassword,
        refMoblile,
        CurrentTime(),
        "Admin",
      ];

      const domainResult = await client.query(
        insertUserDomainQuery,
        domainParams
      );
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
        "3",
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
  public async userBookingHistoryV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    try {

      const tourBookingresult = await executeQuery(userTourBookingHistoryQuery, [tokendata.id]);
      const CarBookingresult = await executeQuery(userCarBookingHistoryQuery, [tokendata.id]);
      const CarParkingBookingresult = await executeQuery(userCarParkingBookingHistoryQuery, [tokendata.id]);

      return encrypt(
        {
          success: true,
          message: "listed userBooking List",
          token:tokens
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed userBooking List ",
          error: String(error),
          token:tokens
        },
        true
      );
    }
  }

}
