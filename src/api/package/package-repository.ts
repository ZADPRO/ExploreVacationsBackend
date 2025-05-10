import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
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
  getdeletedExcludeQuery,
  getdeletedincludeQuery,
  getdeletedPackageQuery,
  getImageRecordQuery,
  gettourIdIdQuery,
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
  //         tokendata.id
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
    const refuserId = tokendata.id;
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
        refCoverImage,
      } = userData;

      // const refLocation = `{${userData.refLocation.join(",")}}`;
      const refLocation = Array.isArray(userData.refLocation)
        ? `{${userData.refLocation.join(",")}}`
        : `{${userData.refLocation.split(",").join(",")}}`;
      const refActivity = Array.isArray(userData.refActivity)
        ? `{${userData.refActivity.join(",")}}`
        : `{${userData.refActivity.split(",").join(",")}}`;
      const refTravalInclude = Array.isArray(userData.refTravalInclude)
        ? `{${userData.refTravalInclude.join(",")}}`
        : `{${userData.refTravalInclude.split(",").join(",")}}`;
      const refTravalExclude = Array.isArray(userData.refTravalExclude)
        ? `{${userData.refTravalExclude.join(",")}}`
        : `{${userData.refTravalExclude.split(",").join(",")}}`;

      const customerPrefix = "EV-TOUR-";
      const baseNumber = 0;

      const lastCustomerResult = await client.query(gettourIdIdQuery);
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
        newCustomerId,
        CurrentTime(),
        refuserId,
      ]);

      const refPackageId = packageResult.rows[0].refPackageId;

      //   // Store image path in the database
      //   const image = await client.query(insertGalleryQuery, [
      //     refPackageId,
      //     images,
      //     CurrentTime(),
      //     refuserId,
      //   ]
      // );

      // if (Array.isArray(images)) {
      //   for (const imgPath of images) {
      //     await client.query(insertGalleryQuery, [
      //       refPackageId,
      //       imgPath,
      //       CurrentTime(),
      //       refuserId,
      //     ]);
      //   }
      // }

      //     let parsedImages = [];

      // if (typeof images === "string") {
      //   try {
      //     parsedImages = Object.keys(JSON.parse(images.replace(/\\/g, "\\\\")));
      //   } catch (e) {
      //     console.error("Invalid image paths format in `images`");
      //     parsedImages = [];
      //   }
      // }

      // console.log('image', image)

      //     storedImages.push({
      //       filename: filename,
      //       path: imagePath,
      //       content: imageBase64,
      //       contentType: "image/jpeg", // Adjust based on file type
      //     });
      //   }
      // }

      if (images) {
        console.log("images", images);
        let parsedImages: string[] = [];

        // If `images` is a stringified object like: {"path1": "", "path2": ""}
        if (typeof images === "string") {
          try {
            const temp = JSON.parse(images.replace(/\\/g, "\\\\"));
            parsedImages = Object.keys(temp);
          } catch (e) {
            console.error("Failed to parse images:", e);
          }
        } else if (Array.isArray(images)) {
          parsedImages = images;
          console.log("parsedImages", parsedImages);
        }

        // Insert each image path into the gallery table
        for (const imgPath of parsedImages) {
          try {
            await client.query(insertGalleryQuery, [
              refPackageId,
              imgPath,
              CurrentTime(),
              refuserId,
            ]);
          } catch (err) {
            console.error(`Failed to insert gallery image ${imgPath}:`, err);
          }
        }
      }

      const Result = await client.query(addTravalDataQuery, [
        refPackageId,
        refTravalOverView,
        refItinary,
        refItinaryMapPath,
        refTravalInclude,
        refTravalExclude,
        refSpecialNotes,
        CurrentTime(),
        refuserId,
      ]);
      console.log(
        "Result--------------------------------------------------------------------------------------",
        Result
      );

      const history = [
        10,
        refuserId,
        `${refPackageName} tour Added`,
        CurrentTime(),
        refuserId,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Package and gallery images added successfully",
          token: tokens,
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
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // public async UpdatePackageV1(userData: any, tokenData: any): Promise<any> {
  //   const client: PoolClient = await getClient();
  //   const token = { id: tokenData.id };
  //   const tokens = generateTokenWithExpire(token, true);
  //   try {
  //     await client.query("BEGIN");

  //     const {
  //       refPackageId,
  //       refPackageName,
  //       refDesignationId,
  //       refDurationIday,
  //       refDurationINight,
  //       refCategoryId,
  //       refGroupSize,
  //       refTourCode,
  //       refTourPrice,
  //       refSeasonalPrice,
  //       refTravalOverView,
  //       refItinary,
  //       refItinaryMapPath,
  //       refTravalInclude,
  //       refTravalExclude,
  //       refSpecialNotes,
  //       refCoverImage,
  //     } = userData;
  //     console.log("userData", userData);

  //     if (
  //       !userData ||
  //       !Array.isArray(userData.refLocation) ||
  //       !Array.isArray(userData.refActivity)
  //     ) {
  //       throw new Error(
  //         "Invalid userData: refLocation or refActivity is missing or not an array"
  //       );
  //     }

  //     const refLocation = Array.isArray(userData.refLocation)
  //       ? `{${userData.refLocation.join(",")}}`
  //       : "{}";
  //     const refActivity = Array.isArray(userData.refActivity)
  //       ? `{${userData.refActivity.join(",")}}`
  //       : "{}";

  //     console.log("Processed refLocation:", refLocation);
  //     console.log("Processed refActivity:", refActivity);

  //     const packageDetails = await client.query(updatePackageQuery, [
  //       refPackageId,
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
  //       refCoverImage,
  //       CurrentTime(),
  // tokendata.id
  //     ]);
  //     console.log("packageDetails", packageDetails);

  //     // let storedImages: any[] = [];
  //     // if (Array.isArray(images) && images.length > 0) {
  //     //   for (const image of images) {
  //     //     if (!image || typeof image === "string") continue; // Skip invalid entries

  //     //     console.log(`Processing Image: ${image.hapi?.filename}`);

  //     //     const filename = image.hapi?.filename;
  //     //     if (!filename) {
  //     //       console.error("Invalid image: Missing filename");
  //     //       continue;
  //     //     }

  //     //     // Store file and get path
  //     //     const uploadType = 2; // Assuming upload type 2 for gallery
  //     //     const imagePath = await storeFile(image, uploadType);
  //     //     console.log(`Stored Image Path: ${imagePath}`);

  //     //     // Convert image to Base64
  //     //     const imageBuffer = await viewFile(imagePath);
  //     //     const imageBase64 = imageBuffer.toString("base64");

  //     //     // Store image path in the database
  //     //     await client.query(insertGalleryQuery, [
  //     //       refPackageId,
  //     //       imagePath,
  //     //       CurrentTime(),
  //     //      tokendata.id,
  //     //     ]);

  //     //     storedImages.push({
  //     //       filename: filename,
  //     //       path: imagePath,
  //     //       content: imageBase64,
  //     //       contentType: "image/jpeg", // Adjust based on file type
  //     //     });
  //     //   }
  //     // }

  //     const Result = await client.query(updateTravalDataQuery, [
  //       refPackageId,
  //       refTravalOverView,
  //       refItinary,
  //       refItinaryMapPath,
  //       refTravalInclude,
  //       refTravalExclude,
  //       refSpecialNotes,
  //       CurrentTime(),
  //      tokendata.id
  //     ]);

  //     const history = [
  //       11,
  //       tokenData.id,
  //       "update package ",
  //       CurrentTime(),
  //       tokenData.id,
  //     ];

  //     const updateHistory = await client.query(updateHistoryQuery, history);

  //     await client.query("COMMIT");

  //     // Return success response
  //     return encrypt(
  //       {
  //         success: true,
  //         message: "package updated successfully",
  //         token: tokens,
  //         packageDetails: packageDetails.rows,
  //       },
  //       true
  //     );
  //   } catch (error) {
  //     console.log(
  //       "error-----------------------------------------------------271",
  //       error
  //     );
  //     const errorMessage =
  //       error instanceof Error ? error.message : "An unknown error occurred";
  //     await client.query("ROLLBACK");

  //     // Return error response
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "package update failed",
  //         error: errorMessage,
  //         token: tokens,
  //       },
  //       true
  //     );
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
        refTravalOverView,
        refItinary,
        refItinaryMapPath,
        refSpecialNotes,
        refCoverImage,
      } = userData;

      // if (
      //   !userData ||
      //   !Array.isArray(userData.refLocation) ||
      //   !Array.isArray(userData.refActivity)
      // ) {
      //   throw new Error(
      //     "Invalid userData: refLocation or refActivity is missing or not an array"
      //   );
      // }

      const refLocation = `{${userData.refLocation.join(",")}}`;
      const refActivity = `{${userData.refActivity.join(",")}}`;
      const refTravalInclude = `{${userData.refTravalInclude.join(",")}}`;
      const refTravalExclude = `{${userData.refTravalExclude.join(",")}}`;

      const existingDatas = await client.query(listTourByIdQuery, [
        refPackageId,
      ]);

      // if (existingDataQuery.rows.length === 0) {
      //   throw new Error("Package not found for update");
      // }
      // const existingData = existingDataQuery.rows[0];

      // const changes: string[] = [];

      // const compareField = (key: string, label?: string) => {
      //   const oldValue = existingData[key];
      //   const newValue = userData[key];
      //   if (String(oldValue) !== String(newValue)) {
      //     changes.push(`${label || key}: '${oldValue}' -> '${newValue}'`);
      //   }
      // };

      // compareField("refPackageName", "Package Name");
      // compareField("refDesignationId", "Designation");
      // compareField("refDurationIday", "Duration Day");
      // compareField("refDurationINight", "Duration Night");
      // compareField("refLocation", "Location");
      // compareField("refCategoryId", "Category");
      // compareField("refActivity", "Activity");
      // compareField("refGroupSize", "Group Size");
      // compareField("refTourCode", "Tour Code");
      // compareField("refTourPrice", "Tour Price");
      // compareField("refSeasonalPrice", "Seasonal Price");
      // compareField("refCoverImage", "Cover Image");

      // const changeLog = changes.length ? `Changes: ${changes.join(", ")}` : "No actual changes";

      const existingData = existingDatas.rows[0];

      if (!existingData)
        throw new Error(`package with ID ${refPackageId} not found`);

      const changes: string[] = [];

      if (existingData.refPackageName !== refPackageName)
        changes.push(
          `PackageName: '${existingData.refPackageName}' : '${refPackageName}'`
        );

      if (existingData.refDesignationId !== refDesignationId)
        changes.push(
          `DesignationId: '${existingData.refDesignationId}' : '${refDesignationId}'`
        );

      if (existingData.refDurationIday !== refDurationIday)
        changes.push(
          `Duration In day: '${existingData.refDurationIday}' : '${refDurationIday}'`
        );

      if (existingData.refDurationINight !== refDurationINight)
        changes.push(
          `Duration In Night: '${existingData.refDurationINight}' : '${refDurationINight}'`
        );

      if (existingData.refCategoryId !== refCategoryId)
        changes.push(
          `Category: '${existingData.refCategoryId}' : '${refCategoryId}'`
        );

      if (existingData.refGroupSize !== refGroupSize)
        changes.push(
          `GroupSize: '${existingData.refGroupSize}' : '${refGroupSize}'`
        );

      if (existingData.refTourCode !== refTourCode)
        changes.push(
          `TourCode: '${existingData.refTourCode}' : '${refTourCode}'`
        );

      if (existingData.refTourPrice !== refTourPrice)
        changes.push(
          `TourPrice: '${existingData.refTourPrice}' : '${refTourPrice}'`
        );

      if (existingData.refSeasonalPrice !== refSeasonalPrice)
        changes.push(
          `SeasonalPrice: '${existingData.refSeasonalPrice}' : '${refSeasonalPrice}'`
        );

      if (existingData.refTravalOverView !== refTravalOverView)
        changes.push(
          `TravalOverView: '${existingData.refTravalOverView}' : '${refTravalOverView}'`
        );

      if (existingData.refItinary !== refItinary)
        changes.push(`Itinary: '${existingData.refItinary}' : '${refItinary}'`);

      if (existingData.refItinaryMapPath !== refItinaryMapPath)
        changes.push(`ItinaryMap Image changed`);

      if (existingData.refTravalInclude !== refTravalInclude)
        changes.push(
          `TravalInclude: '${existingData.refTravalInclude}' : '${refTravalInclude}'`
        );

      if (existingData.refTravalExclude !== refTravalExclude)
        changes.push(
          `TravalExclude: '${existingData.refTravalExclude}' : '${refTravalExclude}'`
        );

      if (existingData.refSpecialNotes !== refSpecialNotes)
        changes.push(
          `SpecialNotes: '${existingData.refSpecialNotes}' : 'updated for ${refPackageName}'`
        );

      const changeSummary = changes.length
        ? `Updated Fields: ${changes.join(", ")}`
        : "No changes detected";

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
        tokenData.id,
      ]);

      const Result = await client.query(updateTravalDataQuery, [
        refPackageId,
        refTravalOverView,
        refItinary,
        refItinaryMapPath,
        refTravalInclude,
        refTravalExclude,
        refSpecialNotes,
        CurrentTime(),
        tokenData.id,
      ]);

      const history = [
        11,
        tokenData.id,
        changeSummary,
        CurrentTime(),
        tokenData.id,
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT");

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

      return encrypt(
        {
          success: false,
          message: "package update failed",
          error: errorMessage,
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
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
        tokendata.id,
      ]);

      const deletedPackage: any = await client.query(getdeletedPackageQuery, [
        refPackageId,
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
        `${deletedPackage[0]} is Deleted`,
        CurrentTime(),
        tokendata.id,
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
          token: tokens,
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

      // if (!Array.isArray(result)) {
      //   throw new Error("Invalid data received from database");
      // }

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

      // for (const image of result) {
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
      let filePath: string | any;

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
              token: tokens,
            },
            true
          );
        }

        filePath = imageRecord[0].refImagePath;

        // Delete the image record from the database
        await executeQuery(deleteImageRecordQuery, [userData.refGalleryId]);
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
          tokendata.id,
        ]);

        console.log("Include added result:", result);

        resultArray.push(result);
      }

      // Log history of the action
      const history = [
        41,
        tokendata.id,
        `Added travel includes: ${refTravalInclude
          .map((item: any) => item.refTravalInclude)
          .join(", ")}`,
        CurrentTime(),
        tokendata.id,
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
    } finally {
      client.release();
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
        tokenData.id,
      ];

      const updateBenifits = await client.query(
        updateTravalIncludeQuery,
        params
      );

      const history = [
        42,
        tokenData.id,
        `${refTravalInclude} TravalInclude updated succesfully`,
        CurrentTime(),
        tokenData.id,
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
    } finally {
      client.release();
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
        tokendata.id,
      ]);

      const getdeletedinclude: any = await client.query(
        getdeletedincludeQuery,
        [refTravalIncludeId]
      );

      const { refTravalInclude } = getdeletedinclude.rows[0];
      console.log("refTravalInclude", refTravalInclude);

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
        `${refTravalInclude} deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];
      console.log("history", history);

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
          token: tokens,
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
          tokendata.id,
        ]);

        resultArray.push(result);
      }
      // Log history of the action
      const history = [
        44,
        tokendata.id,
        `Added travel Excludes: ${refTravalExclude
          .map((item: any) => item.refTravalExclude)
          .join(", ")}`,
        CurrentTime(),
        tokendata.id,
      ];

      // Commit transaction

      const updateHistory = await client.query(updateHistoryQuery, history);
      console.log("updateHistory", updateHistory);

      await client.query("COMMIT");

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
    } finally {
      client.release();
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
        tokenData.id,
      ];

      const updateBenifits = await client.query(
        updateTravalExcludeQuery,
        params
      );

      const history = [
        45,
        tokenData.id,
        `${refTravalExclude} updated succesfully`,
        CurrentTime(),
        tokenData.id,
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
    } finally {
      client.release();
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
        tokendata.id,
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

      const getdeletedExclude = await client.query(getdeletedExcludeQuery, [
        refTravalExcludeId,
      ]);
      const { refTravalExclude } = getdeletedExclude.rows[0];

      // Insert delete action into history
      const history = [
        46, // Unique ID for delete action
        tokendata.id,
        `${refTravalExclude} deleted succesfully`,
        CurrentTime(),
        tokendata.id,
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
          token: tokens,
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
      let filePath: string | any;

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
              token: tokens,
            },
            true
          );
        }

        filePath = imageRecord[0].refCoverImage;
        console.log("filePath", filePath);

        // Delete the image record from the database
        await executeQuery(deleteCoverImageRecordQuery, [
          userData.refPackageId,
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
          message: " cover image deleted successfully",
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
  public async getTourV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refPackageId } = userData;

      const result1 = await executeQuery(listTourByIdQuery, [refPackageId]);

      // for (const image of result1) {
      //   for (const key of ["refGallery", "refItenaryMap", "refCoverImage"]) {
      //     if (image[key]) {
      //       try {
      //         const fileBuffer = await viewFile(image[key]);
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

      // for (const image of result1) {
      //   // Handle gallery images
      //   const galleryValue = image["refGallery"];
      //   if (galleryValue) {
      //     try {
      //       const galleryPaths =
      //         typeof galleryValue === "string"
      //           ? galleryValue
      //               .replace(/^{|}$/g, "") // Remove {}
      //               .split(/","?/) // Split by "," or "
      //               .map((p) => p.replace(/^"|"$/g, "").trim()) // Remove quotes
      //           : galleryValue;

      //       image["refGallery"] = galleryPaths.map((imgPath: string) =>
      //         path.basename(imgPath)
      //       );
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
      //         image[key] = path.basename(value);
      //       } catch (error) {
      //         console.error(`Error processing ${key}:`, error);
      //         image[key] = null;
      //       }
      //     }
      //   }
      // }

      // step 2
      for (const image of result1) {
        // Handle refGallery
        if (image.refGallery) {
          try {
            const fileBuffer = await viewFile(image.refGallery);
            image.refGallery = {
              filename: path.basename(image.refGallery),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Adjust if needed
            };
          } catch (error) {
            console.error("Error reading refGallery file:", error);
            image.refGallery = null;
          }
        }

        // Handle refItenaryMap
        if (image.refItenaryMap) {
          try {
            const fileBuffer = await viewFile(image.refItenaryMap);
            image.refItenaryMap = {
              filename: path.basename(image.refItenaryMap),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg",
            };
          } catch (error) {
            console.error("Error reading refItenaryMap file:", error);
            image.refItenaryMap = null;
          }
        }

        // Handle refCoverImage
        if (image.refCoverImage) {
          try {
            const fileBuffer = await viewFile(image.refCoverImage);
            image.refCoverImage = {
              filename: path.basename(image.refCoverImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg",
            };
          } catch (error) {
            console.error("Error reading refCoverImage file:", error);
            image.refCoverImage = null;
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "Listed Tour successfully",
          token: tokens,
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
          token: tokens,
          error: String(error), // Return detailed error for debugging
        },
        true
      );
    }
  }
}
