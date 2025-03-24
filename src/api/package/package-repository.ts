import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import { formatDate } from "../../helper/common";
import fs from "fs";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { CurrentTime } from "../../helper/common";
import {
  addPackageQuery,
  addTravalDataQuery,
  addTravalExcludeQuery,
  addTravalIncludeQuery,
  checkTravalExcludeQuery,
  checkTravalIncludeQuery,
  deleteCoverImageRecordQuery,
  deleteImageRecordQuery,
  deletePackageQuery,
  deleteTravalExcludeQuery,
  deleteTravalIncludeQuery,
  getCoverImageRecordQuery,
  getImageRecordQuery,
  insertGalleryQuery,
  listPackageQuery,
  listTourByIdQuery,
  listTravalExcludeQuery,
  listTravalIncludeQuery,
  updateHistoryQuery,
  updatePackageQuery,
  updateTravalDataQuery,
  updateTravalExcludeQuery,
  updateTravalIncludeQuery,
} from "./query";

export class packageRepository {
  //  public async addPackageV1(userData: any, tokendata: any): Promise<any> {
  //   const client: PoolClient = await getClient();
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);
  //      try {
  //        const {
  //         refPackageName,
  //         refDesignationId,
  //         refDurationIday,
  //         refDurationINight,
  //         refCategoryId,
  //         refGroupSize,
  //         refTourCode,
  //         refTourPrice,
  //         refSeasonalPrice,
  //         } = userData;

  //       const refLocation = `{${userData.refLocation.join(",")}}`;
  //       const refActivity = `{${userData.refActivity.join(",")}}`;

  //        const PackageResult = await executeQuery(addPackageQuery, [
  //         refPackageName,
  //         refDesignationId,
  //         refDurationIday,
  //         refDurationINight,
  //         refLocation,
  //         refCategoryId,
  //         refActivity,
  //         refGroupSize,
  //         refTourCode,
  //         refTourPrice,
  //         refSeasonalPrice,
  //         CurrentTime(),
  //         "Admin"
  //        ]);

  //        return encrypt(
  //          {
  //            success: true,
  //            message: "package added successfully",
  //            token:token,
  //            data: PackageResult,
  //          },
  //          true
  //        );
  //      } catch (error: unknown) {
  //        return encrypt(
  //          {
  //            success: false,
  //            message: "An unknown error occurred during destination addition",
  //            error: String(error),
  //          },
  //          true
  //        );
  //      }

  //  }
  public async addPackageV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const {
        refPackageName,
        refDesignationId,
        refDurationIday,
        refDurationINight,
        refCategoryId,
        refGroupSize,
        refTourCode,
        refTourPrice,
        refSeasonalPrice,
        images,
        refItinary,
        refItinaryMapPath,
        refSpecialNotes,
        refTravalOverView,
        refCoverImage
      } = userData;

      // const refLocation = `{${userData.refLocation.join(",")}}`;
      const refLocation = Array.isArray(userData.refLocation)? `{${userData.refLocation.join(",")}}` : `{${userData.refLocation.split(",").join(",")}}`;
      const refActivity = Array.isArray(userData.refActivity)? `{${userData.refActivity.join(",")}}` : `{${userData.refActivity.split(",").join(",")}}`;
      const refTravalInclude = Array.isArray(userData.refTravalInclude)? `{${userData.refTravalInclude.join(",")}}` : `{${userData.refTravalInclude.split(",").join(",")}}`;
      const refTravalExclude = Array.isArray(userData.refTravalExclude)? `{${userData.refTravalExclude.join(",")}}` : `{${userData.refTravalExclude.split(",").join(",")}}`;

      
      // const refActivity = `{${userData.refActivity.join(",")}}`;
      // const refTravalInclude = `{${userData.refTravalInclude.join(",")}}`;
      // const refTravalExclude = `{${userData.refTravalExclude.join(",")}}`;

      // Insert package details and get refPackageId
      const packageResult = await client.query(addPackageQuery, [
        refPackageName,
        refDesignationId,
        refDurationIday,
        refDurationINight,
        refLocation,
        refCategoryId,
        refActivity,
        refGroupSize,
        refTourCode,
        refTourPrice,
        refSeasonalPrice,
        refCoverImage,
        CurrentTime(),
        "Admin",
      ]);

      const refPackageId = packageResult.rows[0].refPackageId;

      // Store image path in the database
      const image = await client.query(insertGalleryQuery, [
        refPackageId,
        images,
        CurrentTime(),
        "Admin",
      ]);
      // console.log('image', image)
      
      //     storedImages.push({
        //       filename: filename,
        //       path: imagePath,
        //       content: imageBase64,
        //       contentType: "image/jpeg", // Adjust based on file type
        //     });
        //   }
        // }
        
        console.log('image------------------------------------------------195', image)


      const Result = await client.query(addTravalDataQuery, [
        refPackageId,
        refTravalOverView,
        refItinary,
        refItinaryMapPath,
        refTravalInclude,
        refTravalExclude,
        refSpecialNotes,
        CurrentTime(),
        "Admin"
      ]);
      console.log("Result--------------------------------------------------------------------------------------", Result);

      const history = [
        10, 
        tokendata.id,
         "add package", 
         CurrentTime(),
          "Admin"
        ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Package and gallery images added successfully",
          token: token,
          packageData: packageResult.rows[0],
          ResultTravalData: Result,
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

  // public async addPackageV1(userData: any, tokendata: any): Promise<any> {
  //   const client: PoolClient = await getClient();
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);

  //   try {
  //     await client.query("BEGIN"); // Start transaction

  //     const {
  //       refPackageName,
  //       refDesignationId,
  //       refDurationIday,
  //       refDurationINight,
  //       refCategoryId,
  //       refGroupSize,
  //       refTourCode,
  //       refTourPrice,
  //       refSeasonalPrice,
  //       images, // Expecting an array of images
  //     } = userData;

  //     const refLocation = `{${userData.refLocation.join(",")}}`;
  //     const refActivity = `{${userData.refActivity.join(",")}}`;

  //     // Insert package details and get refPackageId
  //     const packageResult = await client.query(addPackageQuery, [
  //       refPackageName,
  //       refDesignationId,
  //       refDurationIday,
  //       refDurationINight,
  //       refLocation,
  //       refCategoryId,
  //       refActivity,
  //       refGroupSize,
  //       refTourCode,
  //       refTourPrice,
  //       refSeasonalPrice,
  //       CurrentTime(),
  //       "Admin",
  //     ]);

  //     const refPackageId = packageResult.rows[0].refPackageId;
  //     console.log("Inserted Package ID:", refPackageId);

  //     // Store image paths and convert to base64
  //     let storedImages: any[] = [];
  //     if (Array.isArray(images) && images.length > 0) {
  //       for (const image of images) {
  //         if (!image || typeof image === "string") continue; // Skip invalid entries

  //         console.log(`Processing Image: ${image.hapi?.filename}`);

  //         const filename = image.hapi?.filename;
  //         if (!filename) {
  //           console.error("Invalid image: Missing filename");
  //           continue;
  //         }

  //         // Store file and get path
  //         const uploadType = 2; // Assuming upload type 2 for gallery
  //         const imagePath = await storeFile(image, uploadType);
  //         console.log(`Stored Image Path: ${imagePath}`);

  //         // Convert image to Base64
  //         const imageBuffer = await viewFile(imagePath);
  //         const imageBase64 = imageBuffer.toString("base64");

  //         // Store image path in the database
  //         await client.query(insertGalleryQuery, [
  //           refPackageId,
  //           imagePath,
  //           CurrentTime(),
  //           "Admin",
  //         ]);

  //         storedImages.push({
  //           filename: filename,
  //           path: imagePath,
  //           content: imageBase64,
  //           contentType: "image/jpeg", // Adjust based on file type
  //         });
  //       }
  //     }

  //     const history = [10, tokendata.id, "add package", CurrentTime(), "Admin"];

  //     const updateHistory = await client.query(updateHistoryQuery, history);
  //     await client.query("COMMIT"); // Commit transaction

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Package and gallery images added successfully",
  //         token: token,
  //         packageData: packageResult.rows[0],
  //         galleryImages: storedImages,
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
  //         error: String(error),
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }

  public async UpdatePackageV1(userData: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const {
        refPackageId,
        refPackageName,
        refDesignationId,
        refDurationIday,
        refDurationINight,
        refCategoryId,
        refGroupSize,
        refTourCode,
        refTourPrice,
        refSeasonalPrice,
        refTravalDataId,
        refTravalOverView,
        refItinary,
        refItinaryMapPath,
        refTravalInclude,
        refTravalExclude,
        refSpecialNotes,
        refCoverImage,
      } = userData;
      console.log("userData", userData);

      if (
        !userData ||
        !Array.isArray(userData.refLocation) ||
        !Array.isArray(userData.refActivity)
      ) {
        throw new Error(
          "Invalid userData: refLocation or refActivity is missing or not an array"
        );
      }

      const refLocation = Array.isArray(userData.refLocation)
        ? `{${userData.refLocation.join(",")}}`
        : "{}";
      const refActivity = Array.isArray(userData.refActivity)
        ? `{${userData.refActivity.join(",")}}`
        : "{}";

      console.log("Processed refLocation:", refLocation);
      console.log("Processed refActivity:", refActivity);

      const packageDetails = await client.query(updatePackageQuery, [
        refPackageId,
        refPackageName,
        refDesignationId,
        refDurationIday,
        refDurationINight,
        refLocation,
        refCategoryId,
        refActivity,
        refGroupSize,
        refTourCode,
        refTourPrice,
        refSeasonalPrice,
        refCoverImage,
        CurrentTime(),
        "Admin",
      ]);
      console.log("packageDetails", packageDetails);

      // let storedImages: any[] = [];
      // if (Array.isArray(images) && images.length > 0) {
      //   for (const image of images) {
      //     if (!image || typeof image === "string") continue; // Skip invalid entries

      //     console.log(`Processing Image: ${image.hapi?.filename}`);

      //     const filename = image.hapi?.filename;
      //     if (!filename) {
      //       console.error("Invalid image: Missing filename");
      //       continue;
      //     }

      //     // Store file and get path
      //     const uploadType = 2; // Assuming upload type 2 for gallery
      //     const imagePath = await storeFile(image, uploadType);
      //     console.log(`Stored Image Path: ${imagePath}`);

      //     // Convert image to Base64
      //     const imageBuffer = await viewFile(imagePath);
      //     const imageBase64 = imageBuffer.toString("base64");

      //     // Store image path in the database
      //     await client.query(insertGalleryQuery, [
      //       refPackageId,
      //       imagePath,
      //       CurrentTime(),
      //       "Admin",
      //     ]);

      //     storedImages.push({
      //       filename: filename,
      //       path: imagePath,
      //       content: imageBase64,
      //       contentType: "image/jpeg", // Adjust based on file type
      //     });
      //   }
      // }

      const Result = await client.query(updateTravalDataQuery, [
        refTravalDataId,
        refPackageId,
        refTravalOverView,
        refItinary,
        refItinaryMapPath,
        refTravalInclude,
        refTravalExclude,
        refSpecialNotes,
        CurrentTime(),
        "Admin",
      ]);

      const history = [
        11,
        tokenData.id,
        "update package",
        CurrentTime(),
        "Admin",
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT");

      // Return success response
      return encrypt(
        {
          success: true,
          message: "package updated successfully",
          token: tokens,
          packageDetails: packageDetails.rows,
        },
        true
      );
    } catch (error) {
      console.log(
        "error-----------------------------------------------------271",
        error
      );
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      await client.query("ROLLBACK");

      // Return error response
      return encrypt(
        {
          success: false,
          message: "package update failed",
          error: errorMessage,
          token: tokens,
        },
        true
      );
    }
  }

public async deletePackageV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refPackageId } = userData;
      const result = await client.query(deletePackageQuery, [
        refPackageId,
        CurrentTime(),
        "Admin",
      ]);

      // if (result.rowCount === 0) {
      //   await client.query("ROLLBACK");
      //   return encrypt(
      //     {
      //       success: false,
      //       message: "car not found or already deleted",
      //       token: tokens,
      //     },
      //     true
      //   );
      // }

      // Insert delete action into history
      const history = [
        48, // Unique ID for delete action
        tokendata.id,
        "delete Package",
        CurrentTime(),
        "admin",
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "package deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting package:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the package",
          tokens: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // public async galleryUploadV1(userData: any, tokendata: any): Promise<any> {
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);
  //   try {
  //     // Extract images from userData
  //     const images = userData.images; // Expecting an array of images

  //     // Ensure that at least one image is provided
  //     if (!images || !Array.isArray(images) || images.length === 0) {
  //       throw new Error("Please provide at least one image.");
  //     }

  //     let storedFiles: any[] = [];

  //     // Process each image
  //     for (const image of images) {
  //       console.log("Storing image...");
  //       const filePath = await storeFile(image, 1);

  //       // Read the file buffer and convert it to Base64
  //       const imageBuffer = await viewFile(filePath);
  //       const imageBase64 = imageBuffer.toString("base64");

  //       storedFiles.push({
  //         filename: path.basename(filePath),
  //         content: imageBase64,
  //         contentType: "image/jpeg", // Assuming JPEG format
  //       });
  //     }

  //     // Return success response
  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Images Stored Successfully",
  //         token: tokens,
  //         files: storedFiles,
  //       },
  //       true
  //     );
  //   } catch (error) {
  //     console.error("Error occurred:", error);
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "Error in Storing the Images",
  //         token: tokens,
  //       },
  //       true
  //     );
  //   }
  // }

  // public async galleryUploadV1(userData: any, tokendata: any): Promise<any> {
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);

  //   try {
  //     // Extract the images from userData
  //     const images = userData.images;
  //     console.log('userData', userData)

  //     // Ensure that at least one image is provided
  //     if (!images || images.length === 0) {
  //       throw new Error("Please provide at least one image.");
  //     }

  //     let filePaths: string[] = [];
  //     let storedFiles: any[] = [];

  //     // Store each image
  //     console.log("Storing images...");
  //     for (const image of images) {
  //       const filePath = await storeFile(image, 1);
  //       filePaths.push(filePath);

  //       // Read the file buffer and convert it to Base64
  //       const imageBuffer = await viewFile(filePath);
  //       const imageBase64 = imageBuffer.toString("base64");

  //       storedFiles.push({
  //         filename: path.basename(filePath),
  //         content: imageBase64,
  //         contentType: "image/jpeg", // Assuming all images are in JPEG format
  //       });
  //     }

  //     // Return success response
  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Images Stored Successfully",
  //         token: tokens,
  //         filePaths: filePaths,
  //         files: storedFiles,
  //       },
  //       true
  //     );
  //   } catch (error) {
  //     console.error("Error occurred:", error);
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "Error in Storing the Images",
  //         token: tokens,
  //       },
  //       false
  //     );
  //   }
  // }

  public async galleryUploadV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
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
      console.log("Storing image...");
      filePath = await storeFile(image, 1);

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

  public async listPackageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listPackageQuery);

      // Ensure result is an array before processing
      if (!Array.isArray(result)) {
        throw new Error("Invalid data received from database");
      }

      // Convert images to Base64 format

      // for (const image of result) {
      //   if (image.refGallery) {
      //     try {
      //       const fileBuffer = await fs.promises.readFile(image.refGallery);
      //       image.refGallery = {
      //         filename: path.basename(image.refGallery),
      //         content: fileBuffer.toString("base64"),
      //         contentType: "image/jpeg", // Adjust if needed
      //       };
      //     } catch (error) {
      //       console.error("Error reading image file:", error);
      //       image.refGallery = null; // Handle missing/unreadable files
      //     }
      //   }
      // }

      for (const image of result) {
        for (const key of ["refGallery", "refItenaryMap", "refCoverImage"]) {
          if (image[key]) {
            try {
              const fileBuffer = await fs.promises.readFile(image[key]);
              image[key] = {
                filename: path.basename(image[key]),
                content: fileBuffer.toString("base64"),
                contentType: "image/jpeg", // Adjust if needed
              };
            } catch (error) {
              console.error(`Error reading ${key} file:`, error);
              image[key] = null; // Handle missing/unreadable files
            }
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "Listed package successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in listing packages:", error);
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred while listing packages",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }


  // public async listPackageV1(userData: any, tokendata: any): Promise<any> {
  //     const token = { id: tokendata.id };
  //     const tokens = generateTokenWithExpire(token, true);

  //     try {
  //         const result = await executeQuery(listPackageQuery);

  //         // Ensure result is an array before processing
  //         if (!Array.isArray(result)) {
  //             throw new Error("Invalid data received from database");
  //         }

  //         // Convert multiple images to Base64 format
  //         for (const item of result) {
  //             if (item.refGallery) {
  //                 try {
  //                     // If refGallery is a string, convert it to an array
  //                     const imagePaths = Array.isArray(item.refGallery)
  //                         ? item.refGallery
  //                         : item.refGallery.split(",");

  //                     // Process each image
  //                     item.refGallery = await Promise.all(
  //                         imagePaths.map(async (filePath: string) => {
  //                             try {
  //                                 const fileBuffer = await fs.promises.readFile(filePath.trim());
  //                                 return {
  //                                     filename: path.basename(filePath),
  //                                     content: fileBuffer.toString("base64"),
  //                                     contentType: "image/jpeg",
  //                                 };
  //                             } catch (error) {
  //                                 console.error("Error reading image file:", filePath, error);
  //                                 return null; // Handle missing/unreadable files gracefully
  //                             }
  //                         })
  //                     );

  //                     // Remove any null entries from the array
  //                     item.refGallery = item.refGallery.filter((img: any) => img !== null);
  //                 } catch (error) {
  //                     console.error("Error processing images:", error);
  //                     item.refGallery = [];
  //                 }
  //             }
  //         }

  //         return encrypt(
  //             {
  //                 success: true,
  //                 message: "Listed packages successfully",
  //                 token: tokens,
  //                 result: result,
  //             },
  //             false
  //         );
  //     } catch (error: unknown) {
  //         console.error("Error in listing packages:", error);
  //         return encrypt(
  //             {
  //                 success: false,
  //                 message: "An error occurred while listing packages",
  //                 token: tokens,
  //                 error: String(error),
  //             },
  //             false
  //         );
  //     }
  // }

  public async deleteImageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // let filePath: string | any;

      if (userData.refGalleryId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getImageRecordQuery, [
          userData.refGalleryId,
        ]);
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
        await executeQuery(deleteImageRecordQuery, [userData.refGalleryId]);
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

  public async addTravalIncludeV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { refTravalInclude } = userData;

      console.log("Received userData:", userData);

      if (!Array.isArray(refTravalInclude) || refTravalInclude.length === 0) {
        return encrypt(
          {
            success: false,
            message: "No inlcude provided",
            token: tokens,
          },
          true
        );
      }

      let resultArray: any[] = [];

      for (const include of refTravalInclude) {
        const { refTravalInclude: refTravalInclude } = include;

        if (!refTravalInclude) {
          continue;
        }

        const result = await client.query(addTravalIncludeQuery, [
          refTravalInclude,
          CurrentTime(),
          "Admin",
        ]);

        console.log("Include added result:", result);

        resultArray.push(result);
      }

      // Log history of the action
      const history = [
        41,
        tokendata.id,
        "add travel includes",
        CurrentTime(),
        "Admin",
      ];

      // Commit transaction
      await client.query("COMMIT");

      await client.query(updateHistoryQuery, history);

      // Return success response
      return encrypt(
        {
          success: true,
          message: "Include added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error) {
      // Rollback transaction in case of error
      await client.query("ROLLBACK");

      // Handle the error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during Include addition";

      return encrypt(
        {
          success: false,
          message: errorMessage,
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async updateTravalIncludeV1(
    userData: any,
    tokenData: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refTravalIncludeId, refTravalInclude } = userData;

      const checkResult = await executeQuery(checkTravalIncludeQuery, [
        refTravalIncludeId,
      ]);
      console.log("checkResult", checkResult);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "include ID not found",
            token: tokens,
          },
          true
        );
      }

      const params = [
        refTravalIncludeId,
        refTravalInclude,
        CurrentTime(),
        "Admin",
      ];

      const updateBenifits = await client.query(
        updateTravalIncludeQuery,
        params
      );

      const history = [
        42,
        tokenData.id,
        "Update travel include",
        CurrentTime(),
        "Admin",
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Include updated successfully",
          token: tokens,
          updateBenifits: updateBenifits,
        },
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "Include update failed",
          token: tokens,
          error: errorMessage,
        },
        true
      );
    }
  }
  public async deleteTravalIncludeV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refTravalIncludeId } = userData;
      const result = await client.query(deleteTravalIncludeQuery, [
        refTravalIncludeId,
        CurrentTime(),
        "Admin",
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Include not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      const history = [
        43, // Unique ID for delete action
        tokendata.id,
        "delete travel Include",
        CurrentTime(),
        "admin",
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Include deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Include:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Include",
          tokens: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listTravalIncludeV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listTravalIncludeQuery);

      return encrypt(
        {
          success: true,
          message: "list Include successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list Includes",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async addTravalExcludeV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { refTravalExclude } = userData;

      console.log("Received userData:", userData);

      if (!Array.isArray(refTravalExclude) || refTravalExclude.length === 0) {
        return encrypt(
          {
            success: false,
            message: "No Exlcude provided",
            token: tokens,
          },
          true
        );
      }

      let resultArray: any[] = [];

      for (const exclude of refTravalExclude) {
        const { refTravalExclude: refTravalExclude } = exclude;

        if (!refTravalExclude) {
          continue;
        }

        const result = await client.query(addTravalExcludeQuery, [
          refTravalExclude,
          CurrentTime(),
          "Admin",
        ]);

        console.log("Benefit added result:", result);

        resultArray.push(result);
      }

      // Log history of the action
      const history = [
        44,
        tokendata.id,
        "add travel Excludes",
        CurrentTime(),
        "Admin",
      ];

      // Commit transaction
      await client.query("COMMIT");

      await client.query(updateHistoryQuery, history);

      // Return success response
      return encrypt(
        {
          success: true,
          message: "exclude added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error) {
      // Rollback transaction in case of error
      await client.query("ROLLBACK");

      // Handle the error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during exclude addition";

      return encrypt(
        {
          success: false,
          message: errorMessage,
          error: String(error),
          token: tokens,
        },
        true
      );
    }
  }
  public async updateTravalExcludeV1(
    userData: any,
    tokenData: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refTravalExcludeId, refTravalExclude } = userData;

      const checkResult = await executeQuery(checkTravalExcludeQuery, [
        refTravalExcludeId,
      ]);
      console.log("checkResult", checkResult);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "include ID not found",
            token: tokens,
          },
          true
        );
      }

      const params = [
        refTravalExcludeId,
        refTravalExclude,
        CurrentTime(),
        "Admin",
      ];

      const updateBenifits = await client.query(
        updateTravalExcludeQuery,
        params
      );

      const history = [
        45,
        tokenData.id,
        "Update travel Exclude",
        CurrentTime(),
        "Admin",
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "exclude updated successfully",
          token: tokens,
          updateBenifits: updateBenifits.rows,
        },
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "exclude update failed",
          token: tokens,
          error: errorMessage,
        },
        true
      );
    }
  }
  public async deleteTravalExcludeV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refTravalExcludeId } = userData;
      const result = await client.query(deleteTravalExcludeQuery, [
        refTravalExcludeId,
        CurrentTime(),
        "Admin",
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Exclude not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      const history = [
        46, // Unique ID for delete action
        tokendata.id,
        "delete travel Exclude",
        CurrentTime(),
        "admin",
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Exclude deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Exclude:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Exclude",
          tokens: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listTravalExcludeV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listTravalExcludeQuery);

      return encrypt(
        {
          success: true,
          message: "list Exclude successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during list Excludes",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async uploadCoverImageV1(userData: any, tokendata: any): Promise<any> {
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
        filePath = await storeFile(image, 5);
  
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
  public async deleteCoverImageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // let filePath: string | any;

      if (userData.refPackageId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getCoverImageRecordQuery, [
          userData.refPackageId,
        ]);
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
        await executeQuery(deleteCoverImageRecordQuery, [userData.refPackageId]);
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
  
  public async  getTourV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
  
      const { refPackageId } = userData;
  
      // Step 1: Execute Queries
      const result1 = await executeQuery(listTourByIdQuery, [refPackageId]);
      console.log("result1:", result1);

      for (const image of result1) {
          for (const key of ["refGallery", "refItenaryMap", "refCoverImage"]) {
            if (image[key]) {
              try {
                const fileBuffer = await fs.promises.readFile(image[key]);
                image[key] = {
                  filename: path.basename(image[key]),
                  content: fileBuffer.toString("base64"),
                  contentType: "image/jpeg", // Adjust if needed
                };
              } catch (error) {
                console.error(`Error reading ${key} file:`, error);
                image[key] = null; // Handle missing/unreadable files
              }
            }
          }
        }
  
      // Step 3: Return success response
      return encrypt(
        {
          success: true,
          message: "Listed Tour successfully",
          tokens:tokens,
          tourDetails: result1,
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
          tokens:tokens,
          error: String(error), // Return detailed error for debugging
        },
        true
      );
    }
  }
}
