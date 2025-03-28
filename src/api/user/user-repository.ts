import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import { formatDate, processImages } from "../../helper/common";

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
  deleteImageRecordQuery,
  getCarsByIdQuery,
  getImageRecordQuery,
  getOtherCarsQuery,
  listallTourQuery,
  listCarsQuery,
  listDestinationQuery,
  listOtherTourQuery,
  listTourQuery,
  updateHistoryQuery
  
} from "./query";
import fs from "fs";

export class userRepository {
  public async tourBookingV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    
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




      // const history = [27, tokendata.id, "tour booking", CurrentTime(), "user"];

      // const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "tour booking successfully",
          Data: Result.rows[0],
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback transaction in case of failure
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

      // const history = [
      //   28,
      //   tokendata.id,
      //   "add customize tour booking",
      //   CurrentTime(),
      //   "user",
      // ];

      // await client.query(updateHistoryQuery, history);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Customize tour booking added successfully",
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

      const refFormDetails = `{${userData.refFormDetails.join(",")}}`;

      // Insert package details and get refPackageId
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
        refFormDetails,
        refOtherRequirements,
        CurrentTime(),
        "Admin",
      ]);

      // const history = [29, tokendata.id, "car booking", CurrentTime(), "user"];

      // const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "user car booking  added successfully",
          Data: Result.rows[0],
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback transaction in case of failure
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

  

//   public async listTourV1(userData: any, tokendata: any): Promise<any> {
//     try {
//       const { refPackageId } = userData;

//       const result1 = await executeQuery(listTourQuery, [refPackageId]);
//       console.log("result1", result1);

//       const result2 = await executeQuery(listOtherTourQuery, [refPackageId]);
//       console.log("result2", result2);


//      for (const image of result) {
//   for (const key of ["refGallery", "refItenaryMap", "refCoverImage"]) {
//     if (image[key]) {
//       try {
//         const fileBuffer = await fs.promises.readFile(image[key]);
//         image[key] = {
//           filename: path.basename(image[key]),
//           content: fileBuffer.toString("base64"),
//           contentType: "image/jpeg", // Adjust if needed
//         };
//       } catch (error) {
//         console.error(`Error reading ${key} file:`, error);
//         image[key] = null; // Handle missing/unreadable files
//       }
//     }
//   }
// }




//       return encrypt(
//         {
//           success: true,
//           message: "listed Tour successfully",
//           tourDetails: result1,
//           othertourDetails: result2,
//         },
//         true
//       );
//     } catch (error: unknown) {
//       return encrypt(
//         {
//           success: false,
//           message: "An unknown error occurred during listed  Tour ",
//           error: String(error),
//         },
//         true
//       );
//     }
//   }


public async  listTourV1(userData: any, tokendata: any): Promise<any> {

  try {

    const { refPackageId } = userData;

    // Step 1: Execute Queries
    const result1 = await executeQuery(listTourQuery, [refPackageId]);
    console.log("result1:", result1);

    const result2 = await executeQuery(listOtherTourQuery, [refPackageId]);
    console.log("result2:", result2);

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
                  const fileBuffer = await fs.promises.readFile(image.refCoverImage);
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
  
  // public async addTravalDataV1(userData: any, tokendata: any): Promise<any> {
  //   const client: PoolClient = await getClient();
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);
  //   try {
  //     await client.query("BEGIN"); // Start transaction

  //     const {
  //       refPackageId,
  //       refItinary,
  //       refItinaryMapPath,
  //       refSpecialNotes
  //     } = userData;

  //     const refTravalInclude = `{${userData.refTravalInclude.join(",")}}`;
  //     const refTravalExclude = `{${userData.refTravalExclude.join(",")}}`;

  //     // Insert package details and get refPackageId
  //     const Result = await client.query(addTravalDataQuery, [
  //       refPackageId,
  //       refItinary,
  //       refItinaryMapPath,
  //       refTravalInclude,
  //       refTravalExclude,
  //       refSpecialNotes,
  //       CurrentTime(),
  //       "Admin",
  //     ]);

  //     const history = [
  //       40, 
  //       tokendata.id, 
  //       "add traval data", 
  //       CurrentTime(),
  //        "user"
  //       ];

  //     const updateHistory = await client.query(updateHistoryQuery, history);
  //     await client.query("COMMIT"); // Commit transaction

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Package and gallery images added successfully",
  //         tokens:tokens,
  //         Data: Result.rows[0],
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     await client.query("ROLLBACK"); // Rollback transaction in case of failure
  //     console.error("Error adding package:", error);

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred while adding the package",
  //         tokens:tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }
  // public async updateTravalDataV1(userData: any, tokendata: any): Promise<any> {
  //   const client: PoolClient = await getClient();
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);
  //   try {
  //     await client.query("BEGIN"); // Start transaction

  //     const {
  //       refTravalDataId,
  //       refPackageId,
  //       refItinary,
  //       refItinaryMapPath,
  //       refTravalInclude,
  //       refTravalExclude,
  //       refSpecialNotes
  //     } = userData;


  //     // Insert package details and get refPackageId
  //     const Result = await client.query(updateTravalDataQuery, [
  //       refTravalDataId,
  //       refPackageId,
  //       refItinary,
  //       refItinaryMapPath,
  //       refTravalInclude,
  //       refTravalExclude,
  //       refSpecialNotes,
  //       CurrentTime(),
  //       "Admin",
  //     ]);

  //     const history = [
  //       47, 
  //       tokendata.id, 
  //       "update traval data", 
  //       CurrentTime(),
  //       "Admin"
  //       ];

  //     const updateHistory = await client.query(updateHistoryQuery, history);
  //     await client.query("COMMIT"); // Commit transaction

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Package and gallery images added successfully",
  //         tokens:tokens,
  //         Data: Result.rows[0],
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     await client.query("ROLLBACK"); // Rollback transaction in case of failure
  //     console.error("Error adding package:", error);

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred while adding the package",
  //         tokens:tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }

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
        console.log('userData.refTravalDataId', userData.refTravalDataId)
        
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getImageRecordQuery, [
          userData.refTravalDataId,
        ]);
        console.log('imageRecord', imageRecord)
        if (imageRecord.length === 0) {
          return encrypt(
            {
              success: false,
              message: "Image record not found",
              tokens:tokens
            },
            true
          );
        }
      }
        // filePath = imageRecord[0].refImagePath;

        // Delete the image record from the database
      const DeleteImage = await executeQuery(deleteImageRecordQuery, [userData.refTravalDataId]);
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
          tokens:tokens
        },
        true
      );
    } catch (error) {
      console.error("Error in deleting file:", (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Deleting Image: ${(error as Error).message}`,
          tokens:tokens
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
            const fileBuffer = await fs.promises.readFile(image.refCarPath);
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
            const fileBuffer = await fs.promises.readFile(image.refCarPath);
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
          message: "An unknown error occurred during listed  destination ",
          error: String(error),
        },
        true
      );
    }
  }

}
