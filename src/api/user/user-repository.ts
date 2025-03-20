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
import {
  addCarBookingQuery,
  addcustomizeBookingQuery,
  addTourBookingQuery,
  addTravalDataQuery,
  listallTourQuery,
  listOtherTourQuery,
  listTourQuery,
  updateHistoryQuery,
} from "./query";
import fs from "fs";

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

      const history = [27, tokendata.id, "tour booking", CurrentTime(), "user"];

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
        refVaccinationCertificate,
      } = userData;

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
  public async uploadCertificateV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      // Extract the PDF file from userData
      const pdfFile = userData.PdfFile;

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
      const pdfBuffer = await fs.promises.readFile(filePath);
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
  public async userCarBookingV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const {
        refUserName,
        refUserMail,
        refUserMobile,
        refPickupAddress,
        refSubmissionAddress,
        refPickupDate,
        refVehicleTypeId,
        refAdultCount,
        refChildrenCount,
        refInfants,
        refOtherRequirements,
      } = userData;

      const refFormDetails = `{${userData.refFormDetails.join(",")}}`;

      // Insert package details and get refPackageId
      const Result = await client.query(addCarBookingQuery, [
        refUserName,
        refUserMail,
        refUserMobile,
        refPickupAddress,
        refSubmissionAddress,
        refPickupDate,
        refVehicleTypeId,
        refAdultCount,
        refChildrenCount,
        refInfants,
        refFormDetails,
        refOtherRequirements,
        CurrentTime(),
        "Admin",
      ]);

      const history = [29, tokendata.id, "car booking", CurrentTime(), "user"];

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
  // public async listTourV1(userData: any, tokendata: any): Promise<any> {
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);
  //   try {
  //     const {refPackageId} = userData;

  //     const result1 = await executeQuery(listTourQuery, [refPackageId]);

  //     const result2 = await executeQuery(listOtherTourQuery, [refPackageId]);

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "listed Tour successfully",
  //         token: tokens,
  //         tourDetails: result1,
  //         othertourDetails: result2,

  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     return encrypt(
  //       {
  //         success: false,
  //         message:
  //           "An unknown error occurred during listed  Tour ",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   }
  // }
  public async listTourV1(userData: any, tokendata: any): Promise<any> {
    try {
      const { refPackageId } = userData;

      const result1 = await executeQuery(listTourQuery, [refPackageId]);
      console.log("result1", result1);

      const result2 = await executeQuery(listOtherTourQuery, [refPackageId]);
      console.log("result2", result2);

      return encrypt(
        {
          success: true,
          message: "listed Tour successfully",
          tourDetails: result1,
          othertourDetails: result2,
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
  public async getAllTourV1(userData: any, tokendata: any): Promise<any> {
    try {

      const result = await executeQuery(listallTourQuery);

      console.log("result1", result);
        // Convert images to Base64 format
            for (const image of result) {
              if (image.refGallery) {
                try {
                  const fileBuffer = await fs.promises.readFile(image.refGallery);
                  image.refGallery = {
                    filename: path.basename(image.refGallery),
                    content: fileBuffer.toString("base64"),
                    contentType: "image/jpeg", // Adjust if needed
                  };
                } catch (error) {
                  console.error("Error reading image file:", error);
                  image.refGallery = null; // Handle missing/unreadable files
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
  public async addTravalDataV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN"); // Start transaction

      const {
        refPackageId,
        refItinary,
        refItinaryMapPath,
        refSpecialNotes
      } = userData;

      const refTravalInclude = `{${userData.refTravalInclude.join(",")}}`;
      const refTravalExclude = `{${userData.refTravalExclude.join(",")}}`;

      // Insert package details and get refPackageId
      const Result = await client.query(addTravalDataQuery, [
        refPackageId,
        refItinary,
        refItinaryMapPath,
        refTravalInclude,
        refTravalExclude,
        refSpecialNotes,
        CurrentTime(),
        "Admin",
      ]);

      const history = [
        40, 
        tokendata.id, 
        "add traval data", 
        CurrentTime(),
         "user"
        ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Package and gallery images added successfully",
          tokens:tokens,
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
          tokens:tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
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

}
