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
import { addPackageQuery, insertGalleryQuery, listPackageQuery, updatePackageQuery } from "./query";


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
      images // Expecting an array of images
    } = userData;

    const refLocation = `{${userData.refLocation.join(",")}}`;
    const refActivity = `{${userData.refActivity.join(",")}}`;

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
      CurrentTime(),
      "Admin"
    ]);

    const refPackageId = packageResult.rows[0].refPackageId;
    console.log("Inserted Package ID:", refPackageId);

    // Store image paths and convert to base64
    let storedImages: any[] = [];
    if (Array.isArray(images) && images.length > 0) {
      for (const image of images) {
        if (!image || typeof image === "string") continue; // Skip invalid entries

        console.log(`Processing Image: ${image.hapi?.filename}`);

        const filename = image.hapi?.filename;
        if (!filename) {
          console.error("Invalid image: Missing filename");
          continue;
        }

        // Store file and get path
        const uploadType = 2; // Assuming upload type 2 for gallery
        const imagePath = await storeFile(image, uploadType);
        console.log(`Stored Image Path: ${imagePath}`);

        // Convert image to Base64
        const imageBuffer = await viewFile(imagePath);
        const imageBase64 = imageBuffer.toString("base64");

        // Store image path in the database
        await client.query(insertGalleryQuery, [
          refPackageId, 
          imagePath,
          CurrentTime(),
          "Admin"
        ]);

        storedImages.push({
          filename: filename,
          path: imagePath,
          content: imageBase64,
          contentType: "image/jpeg" // Adjust based on file type
        });
      }
    }

    await client.query("COMMIT"); // Commit transaction

    return encrypt(
      {
        success: true,
        message: "Package and gallery images added successfully",
        token: token,
        packageData: packageResult.rows[0],
        galleryImages: storedImages
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
        error: String(error)
      },
      true
    );
  } finally {
    client.release();
  }
}
 public async UpdatePackageV1(userData: any, tokenData: any): Promise<any> {
  const client: PoolClient = await getClient();
  const token = { id: tokenData.id };
  const tokens = generateTokenWithExpire(token, true);  try {
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
      } = userData;

      const refLocation = `{${userData.refLocation.join(",")}}`;
      const refActivity = `{${userData.refActivity.join(",")}}`;

    // Update payment information in the database
    const packageDetails = await executeQuery(updatePackageQuery, [
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
        CurrentTime(),
        "Admin"
    ]);

  
    // Return success response
    return encrypt(
      {
        success: true,
        message: "package updated successfully",
        token:tokens,
        packageDetails: packageDetails,

      },
      false
    );

  } catch (error) {
    
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    // Return error response
    return encrypt(
      {
        success: false,
        message: "package update failed",
        error: errorMessage,
        token:tokens
      },
      false
    );
  }
}
 public async galleryUploadV1(userData: any, tokendata: any): Promise<any> {
  const token = { id: tokendata.id };
  const tokens = generateTokenWithExpire(token, true);
  try {
    const images = userData.images || []; // Expecting an array of images
    console.log("Received images:", images);

    if (!Array.isArray(images) || images.length === 0) {
      return encrypt(
        {
          success: false,
          message: "No images provided for upload.",
          tokens:tokens
        },
        true
      );
    }

    let filePaths: string[] = [];
    let storedFiles: any[] = [];

    for (const image of images) {
      if (!image || typeof image === "string") continue; // Skip invalid entries

      const filename = image.hapi?.filename;
      if (!filename) {
        console.error("Invalid image: Missing filename");
        continue;
      }

      // Set uploadType to 2 for all images
      const uploadType = 2;

      // Store file and get path
      const imagePath = await storeFile(image, uploadType);
      console.log(`Stored Image Path: ${imagePath}`);
      filePaths.push(imagePath);

      // Convert image to Base64 for verification
      const imageBuffer = await viewFile(imagePath);
      const imageBase64 = imageBuffer.toString("base64");

      storedFiles.push({
        filename: filename,
        content: imageBase64,
        contentType: "image/jpeg", // Adjust based on file type
      });
    }

    // Return success response
    return encrypt(
      {
        success: true,
        message: "Images uploaded successfully",
        token:tokens,
        filePaths: filePaths,
        files: storedFiles,
      },
      true
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return encrypt(
      {
        success: false,
        message: "Error in uploading images",
        token:tokens,
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
 
       return encrypt(
         {
           success: true,
           message: "activities added successfully",
           token:tokens,
           result: result,
         },
         true
       );
     } catch (error: unknown) {
       return encrypt(
         {
           success: false,
           message: "An unknown error occurred during location addition",
           token:tokens,
           error: String(error),
         },
         true
       );
     }
}
// public async deleteImageV1(userData: any): Promise<any> {
//   try {
//       let filePath: string | any;

//       if (userData.refGalleryId) {
//           // Retrieve the image record from the database
//           const imageRecord = await executeQuery(getImageRecordQuery, [userData.refGalleryId]);
//           if (imageRecord.length === 0) {
//               return encrypt(
//                   {
//                       success: false,
//                       message: "Image record not found",
//                   },
//                   true
//               );
//           }
//           filePath = imageRecord[0].refImagePath;

//           // Delete the image record from the database
//           await executeQuery(deleteImageRecordQuery, [userData.loffid]);
//       } else {
//           filePath = userData.filePath;
//       }

//       if (filePath) {
//           // Delete the file from local storage
//           await deleteFile(filePath);
//       }

//       return encrypt(
//           {
//               success: true,
//               message: "The Landing Page Offer Image Deleted Successfully",
//           },
//           false
//       );
//   } catch (error) {
//       console.error('Error in deleting file:', (error as Error).message); // Log the error for debugging
//       return encrypt(
//           {
//               success: false,
//               message: `Error In Deleting the Landing Page Offer Image: ${(error as Error).message}`,
//           },
//           true
//       );
//   }
// }

}