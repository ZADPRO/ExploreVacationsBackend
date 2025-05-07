// import { executeQuery, getClient } from "../../helper/db";
// import { PoolClient } from "pg";
// import { storeFile, viewFile, deleteFile } from "../../helper/storage";
// import path from "path";
// import { encrypt } from "../../helper/encrypt";
// import fs from "fs";

// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { buildUpdateQuery, getChanges } from "../../helper/buildquery";

// import {
//   generateTokenWithExpire,
//   generateTokenWithoutExpire,
// } from "../../helper/token";
// import { CurrentTime } from "../../helper/common";
// import {
//     addHomePageQuery,
//     deleteHomeImageContentQuery,
//     deleteImageRecordQuery,
//     getImageRecordQuery,
//     getModuleQuery,
//     updateHistoryQuery,
//     updateHomePageQuery,
//   } from "./query";

// export class bannerRepository {
//   public async homeImageContentV1(userData: any, tokendata: any): Promise<any> {
//     const client: PoolClient = await getClient();
//     const token = { id: tokendata.id };
//     const tokens = generateTokenWithExpire(token, true);
//     try {
//       await client.query("BEGIN");
//       const {
//         refHomePageName,
//         homePageHeading,
//         homePageContent,
//         refOffer,
//         refOfferName,
//         homePageImage
//       } = userData;

//       const getModule = await executeQuery(getModuleQuery);

//       const Result = await client.query(addHomePageQuery, [
//         refHomePageName,
//         homePageHeading,
//         homePageContent,
//         refOffer,
//         refOfferName,
//         homePageImage,
//         CurrentTime(),
//         tokendata.id
//       ]);

//       const history = [
//         58,
//         tokendata.id,
//         `${homePageHeading} Home page added successfully`,
//         CurrentTime(),
//         tokendata.id,
//       ];

//       const updateHistory = await client.query(updateHistoryQuery, history);
//       await client.query("COMMIT");

//       return encrypt(
//         {
//           success: true,
//           message: "home page content added successfully",
//           data: Result,
//           // moduleResult: getModule,
//           token: tokens,
//         },
//         true
//       );
//     } catch (error: unknown) {
//       await client.query("ROLLBACK");
//       return encrypt(
//         {
//           success: false,
//           message:
//             "An unknown error occurred during home page content addition",
//           token: tokens,
//           error: String(error),
//         },
//         true
//       );
//     } finally {
//       client.release();
//     }
//   }
//   public async updateContentV1(userData: any, tokendata: any): Promise<any> {
//     const client: PoolClient = await getClient();

//     const token = { id: tokendata.id };
//     const tokens = generateTokenWithExpire(token, true);
//     try {
//       await client.query("BEGIN");
//       const {
//         refHomePageId,
//         refHomePageName,
//         homePageHeading,
//         homePageContent,
//         refOffer,
//         refOfferName,
//         homePageImage,
//       } = userData;

//       const Result = await client.query(updateHomePageQuery, [
//         refHomePageId,
//         refHomePageName,
//         homePageHeading,
//         homePageContent,
//         refOffer,
//         refOfferName,
//         homePageImage,
//         CurrentTime(),
//         tokendata.id
//       ]);

//       const history = [
//         59,
//         tokendata.id,
//         `Home page With Name: ${refHomePageName} is updated Successfully successfully`,
//         CurrentTime(),
//         tokendata.id,
//       ];

//       const updateHistory = await client.query(updateHistoryQuery, history);
//       await client.query("COMMIT");

//       return encrypt(
//         {
//           success: true,
//           message: "home page content updated successfully",
//           data: Result,
//           token: tokens,
//         },
//         true
//       );
//     } catch (error: unknown) {
//       await client.query("ROLLBACK");

//       return encrypt(
//         {
//           success: false,
//           message: "An unknown error occurred during home page content update",
//           token: tokens,
//           error: String(error),
//         },
//         true
//       );
//     } finally {
//       client.release();
//     }
//   }
//   public async deletehomeImageContentV1(
//     userData: any,
//     tokendata: any
//   ): Promise<any> {
//     const client: PoolClient = await getClient();
//     const token = { id: tokendata.id };
//     const tokens = generateTokenWithExpire(token, true);

//     try {
//       await client.query("BEGIN"); // Start transaction

//       const { refHomePageId } = userData;
//       const result = await client.query(deleteHomeImageContentQuery, [
//         refHomePageId,
//         CurrentTime(),
//         tokendata.id,
//       ]);

//       console.log("result", result);
//       if (result.rowCount === 0) {
//         await client.query("ROLLBACK");
//         return encrypt(
//           {
//             success: false,
//             message: "Exclude not found or already deleted",
//             token: tokens,
//           },
//           true
//         );
//       }

//       // Insert delete action into history
//       const history = [
//         37, // Unique ID for delete action
//         tokendata.id,
//         "delete Exclude",
//         CurrentTime(),
//         tokendata.id,
//       ];

//       await client.query(updateHistoryQuery, history);
//       await client.query("COMMIT"); // Commit transaction

//       return encrypt(
//         {
//           success: true,
//           message: "Exclude deleted successfully",
//           token: tokens,
//           deletedData: result.rows[0], // Return deleted record for reference
//         },
//         true
//       );
//     } catch (error: unknown) {
//       await client.query("ROLLBACK"); // Rollback on error
//       console.error("Error deleting Exclude:", error);

//       return encrypt(
//         {
//           success: false,
//           message: "An error occurred while deleting the Exclude",
//           token: tokens,
//           error: String(error),
//         },
//         true
//       );
//     } finally {
//       client.release();
//     }
//   }
//   public async uploadImagesV1(userData: any, tokendata: any): Promise<any> {
//     const token = { id: tokendata.id };
//     const tokens = generateTokenWithExpire(token, true);
//     try {
//       // Extract the image from userData
//       const image = userData.images;
//       console.log("userData.images", userData.images);
//       console.log("image", image);

//       // Ensure that only one image is provided
//       if (!image) {
//         throw new Error("Please provide an image.");
//       }

//       let filePath: string = "";
//       let storedFiles: any[] = [];
//       console.log("storedFiles", storedFiles);

//       // Store the image
//       console.log("Storing image...");
//       filePath = await storeFile(image, 12);
//       console.log("filePath", filePath);

//       // Read the file buffer and convert it to Base64

//       const imageBuffer = await viewFile(filePath);
//       const imageBase64 = imageBuffer.toString("base64");

//       // const contentType = mime.lookup(filePath) || "application/octet-stream";
//       // console.log('contentType', contentType)
//       // const contentType = fileData.hapi.headers["content-type"];

//       storedFiles.push({
//         filename: path.basename(filePath),
//         content: imageBase64,
//         contentType: "image/jpg", // Assuming the image is in JPEG format

//         // contentType:contentType
//       });
//       console.log("storedFiles", storedFiles);

//       // Return success response
//       return encrypt(
//         {
//           success: true,
//           message: "Image Stored Successfully",
//           token: tokens,
//           filePath: filePath,
//           files: storedFiles,
//         },
//         true
//       );
//     } catch (error) {
//       console.error("Error occurred:", error);
//       return encrypt(
//         {
//           success: false,
//           message: "Error in Storing the Image",
//           token: tokens,
//         },
//         true
//       );
//     }
//   }
//   public async deletehomeImageV1(userData: any, tokendata: any): Promise<any> {
//     const token = { id: tokendata.id };
//     const tokens = generateTokenWithExpire(token, true);
//     try {
//       let filePath: string | any;

//       if (userData.refHomePageId) {
//         // Retrieve the image record from the database
//         const imageRecord = await executeQuery(getImageRecordQuery, [
//           userData.refHomePageId,
//         ]);
//         if (imageRecord.length === 0) {
//           return encrypt(
//             {
//               success: false,
//               message: "Image record not found",
//               token: tokens,
//             },
//             true
//           );
//         }

//         filePath = imageRecord[0].homePageImage;
//         console.log("filePath", filePath);

//         // Delete the image record from the database
//         // await executeQuery(deleteImageRecordQuery, [userData.refHomePageId]);
//       } else if (userData.filePath) {
//         // Fallback path deletion
//         filePath = userData.filePath;
//       } else {
//         return encrypt(
//           {
//             success: false,
//             message: "No user ID or file path provided for deletion",
//             token: tokens,
//           },
//           true
//         );
//       }
//       if (filePath) {
//         await deleteFile(filePath); // Delete file from local storage
//       }

//       return encrypt(
//         {
//           success: true,
//           message: "gallery image deleted successfully",
//           token: tokens,
//         },
//         true
//       );
//     } catch (error) {
//       console.error("Error in deleting file:", (error as Error).message); // Log the error for debugging
//       return encrypt(
//         {
//           success: false,
//           message: `Error In Deleting Image: ${(error as Error).message}`,
//           token: tokens,
//         },
//         true
//       );
//     }
//   }
// }