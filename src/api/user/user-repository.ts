import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import { formatDate } from "../../helper/common";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { CurrentTime } from "../../helper/common";
import { addcustomizeBookingQuery, addTourBookingQuery, updateHistoryQuery } from "./query";

export class userRepository {
  public async tourBookingV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

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

      // Insert package details and get refPackageId
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
        "Admin",
      ]);

      //  // Store image paths and convert to base64
      //  let storedImages: any[] = [];
      //  if (Array.isArray(images) && images.length > 0) {
      //    for (const image of images) {
      //      if (!image || typeof image === "string") continue; // Skip invalid entries

      //      console.log(`Processing Image: ${image.hapi?.filename}`);

      //      const filename = image.hapi?.filename;
      //      if (!filename) {
      //        console.error("Invalid image: Missing filename");
      //        continue;
      //      }

      //      // Store file and get path
      //      const uploadType = 2; // Assuming upload type 2 for gallery
      //      const imagePath = await storeFile(image, uploadType);
      //      console.log(`Stored Image Path: ${imagePath}`);

      //      // Convert image to Base64
      //      const imageBuffer = await viewFile(imagePath);
      //      const imageBase64 = imageBuffer.toString("base64");

      //      // Store image path in the database
      //      await client.query(insertGalleryQuery, [
      //        refPackageId,
      //        imagePath,
      //        CurrentTime(),
      //        "Admin",
      //      ]);

      //      storedImages.push({
      //        filename: filename,
      //        path: imagePath,
      //        content: imageBase64,
      //        contentType: "image/jpeg", // Adjust based on file type
      //      });
      //    }
      //  }

      const history = [
        27, 
        tokendata.id, 
        "tour booking", 
        CurrentTime(), 
        "user"
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Package and gallery images added successfully",
          token: token,
          Data: Result.rows[0],
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback transaction in case of failure
      console.error("Error adding package:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while adding the package",
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
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);

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
  //       refVaccinationCertificate,
  //       refOtherRequirements,
  //     } = userData;

  //     // Insert package details and get refPackageId
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
  //       refVaccinationCertificate,
  //       refOtherRequirements,        
  //       CurrentTime(),
  //       "Admin",
  //     ]);

  //     const pdfFile = userData.file; // Expecting a single PDF file
  //     console.log("Received file:", pdfFile);

  //     if (!pdfFile || typeof pdfFile === "string") {
  //         return encrypt(
  //             {
  //                 success: false,
  //                 message: "No valid PDF file provided for upload.",
  //                 token: tokens,
  //             },
  //             false
  //         );
  //     }

  //     const filename = pdfFile.hapi?.filename;
  //     if (!filename || !filename.endsWith(".pdf")) {
  //         return encrypt(
  //             {
  //                 success: false,
  //                 message: "Invalid file type. Only PDFs are allowed.",
  //                 token: tokens,
  //             },
  //             false
  //         );
  //     }

  //     // Set uploadType to 3 for PDF files
  //     const uploadType = 3;

  //     // Store file and get path
  //     const filePath = await storeFile(pdfFile, uploadType);
  //     console.log(`Stored PDF Path: ${filePath}`);

  //     // Read the PDF file
  //     const fileBuffer = await viewFile(filePath);
  //     const fileBase64 = fileBuffer.toString("base64");


  //     //  let storedImages: any[] = [];
  //     //  if (Array.isArray(images) && images.length > 0) {
  //     //    for (const image of images) {
  //     //      if (!image || typeof image === "string") continue; // Skip invalid entries

  //     //      console.log(`Processing Image: ${image.hapi?.filename}`);

  //     //      const filename = image.hapi?.filename;
  //     //      if (!filename) {
  //     //        console.error("Invalid image: Missing filename");
  //     //        continue;
  //     //      }

  //     //      // Store file and get path
  //     //      const uploadType = 2; // Assuming upload type 2 for gallery
  //     //      const imagePath = await storeFile(image, uploadType);
  //     //      console.log(`Stored Image Path: ${imagePath}`);

  //     //      // Convert image to Base64
  //     //      const imageBuffer = await viewFile(imagePath);
  //     //      const imageBase64 = imageBuffer.toString("base64");

  //     //      // Store image path in the database
  //     //      await client.query(insertGalleryQuery, [
  //     //        refPackageId,
  //     //        imagePath,
  //     //        CurrentTime(),
  //     //        "Admin",
  //     //      ]);

  //     //      storedImages.push({
  //     //        filename: filename,
  //     //        path: imagePath,
  //     //        content: imageBase64,
  //     //        contentType: "image/jpeg", // Adjust based on file type
  //     //      });
  //     //    }
  //     //  }

  //     const history = [
  //       28, 
  //       tokendata.id, 
  //       "add customize tour booking", 
  //       CurrentTime(), 
  //       "user"
  //     ];

  //     const updateHistory = await client.query(updateHistoryQuery, history);
  //     await client.query("COMMIT"); // Commit transaction

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "customize tour booking added successfully",
  //         token: token,
  //         Data: Result.rows[0],
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
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
        await client.query("BEGIN"); // Start transaction

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
        } = userData;

        let refVaccinationCertificate = ""; // Initialize as empty string

        // Handle PDF upload
        const pdfFile = userData.file; // Expecting a single PDF file
        console.log("Received file:", pdfFile);

        if (pdfFile && typeof pdfFile !== "string") {
            const filename = pdfFile.hapi?.filename;
            if (filename && filename.endsWith(".pdf")) {
                // Store file and get path
                const uploadType = 3; // Upload type for PDFs
                refVaccinationCertificate = await storeFile(pdfFile, uploadType);
                console.log(`Stored PDF Path: ${refVaccinationCertificate}`);

                // Convert PDF to Base64 for verification
                const fileBuffer = await viewFile(refVaccinationCertificate);
                const fileBase64 = fileBuffer.toString("base64");
                console.log("File stored successfully in Base64 format.");
            } else {
                return encrypt(
                    {
                        success: false,
                        message: "Invalid file type. Only PDFs are allowed.",
                        token: tokens,
                    },
                    false
                );
            }
        }

        // Insert booking details with PDF path
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
            refVaccinationCertificate, // Store the file path
            refOtherRequirements,
            CurrentTime(),
            "Admin",
        ]);

        // Insert history
        const history = [
            28,
            tokendata.id,
            "add customize tour booking",
            CurrentTime(),
            "user",
        ];

        await client.query(updateHistoryQuery, history);
        await client.query("COMMIT"); // Commit transaction

        return encrypt(
            {
                success: true,
                message: "Customize tour booking added successfully",
                token: token,
                Data: Result.rows[0],
                pdfPath: refVaccinationCertificate, // Returning stored PDF path for confirmation
            },
            true
        );
    } catch (error: unknown) {
        await client.query("ROLLBACK"); // Rollback transaction in case of failure
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



}
