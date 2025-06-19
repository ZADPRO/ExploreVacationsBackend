// import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
// import { s3 } from "../../helper/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { CurrentTime } from "../../helper/common";
import { encrypt } from "../../helper/encrypt";
import mime from "mime-types";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import {
  addHomePageQuery,
  deleteHomeImageContentQuery,
  getHomeImageQuery,
  getImageRecordQuery,
  getModuleQuery,
  listhomeImageQuery,
  updateHistoryQuery,
  updateHomePageQuery,
} from "./query";
import { deleteFile, storeFile, viewFile } from "../../helper/storage";
import path from "path";
export class homePageRepository {
  // public async uploadHomeImagesV1(file: any): Promise<any> {
  //   if (!file || !file.file || !file.file._data || !file.file.hapi) {
  //     throw new Error("Invalid file input");
  //   }
  //   const fileData = file.file;
  //   const fileName = `${uuidv4()}_${fileData.hapi.filename}`;
  //   const contentType = fileData.hapi.headers["content-type"];

  //   const bucketName = process.env.S3_BUCKET_NAME;

  //   if (!bucketName) throw new Error("Missing S3_BUCKET_NAME in environment");

  //   const uploadParams: PutObjectCommandInput = {
  //     Bucket: process.env.S3_BUCKET_NAME!,
  //     Key: fileName,
  //     Body: fileData._data,
  //     ContentType: contentType,
  //     ACL: "public-read", // ensure it's a valid ObjectCannedACL
  //   };

  //   // await s3.send(new PutObjectCommand(uploadParams));

  //   const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  //   // const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

  //   return {
  //     success: true,
  //     message: "Image uploaded successfully",
  //     fileName,
  //     filePath: fileUrl,
  //     contentType,
  //     base64: fileData._data.toString("base64"),
  //   };
  // }
  // public async deleteHomeImageV1(fileName: string): Promise<any> {
  //   const bucketName = process.env.S3_BUCKET_NAME;
  //   if (!bucketName) throw new Error("Missing S3_BUCKET_NAME in environment");

  //   const deleteParams = {
  //     Bucket: bucketName,
  //     Key: fileName,
  //   };

  //   // await s3.send(new DeleteObjectCommand(deleteParams));

  //   return {
  //     success: true,
  //     message: "Image deleted successfully",
  //     fileName,
  //   };
  // }

  public async homeImageContentV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
        const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const {
        refHomePageName,
        homePageHeading,
        homePageContent,
        refOffer,
        refOfferName,
        homePageImage,
      } = userData;

      const getModule = await executeQuery(getModuleQuery);

      const Result = await client.query(addHomePageQuery, [
        refHomePageName,
        homePageHeading,
        homePageContent,
        refOffer,
        refOfferName,
        homePageImage,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        58,
        tokendata.id,
        `${homePageHeading} Home page added successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "home page content added successfully",
          data: Result,
          // moduleResult: getModule,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message:
            "An unknown error occurred during home page content addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateContentV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();

        const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const {
        refHomePageId,
        refHomePageName,
        homePageHeading,
        homePageContent,
        refOffer,
        refOfferName,
        homePageImage,
      } = userData;

      const Result = await client.query(updateHomePageQuery, [
        refHomePageId,
        refHomePageName,
        homePageHeading,
        homePageContent,
        refOffer,
        refOfferName,
        homePageImage,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        59,
        tokendata.id,
        `Home page With Name: ${refHomePageName} is updated Successfully successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "home page content updated successfully",
          data: Result,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during home page content update",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deletehomeImageContentV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
        const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refHomePageId } = userData;
      const result = await client.query(deleteHomeImageContentQuery, [
        refHomePageId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "refHomePageId not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      const history = [
        60, // Unique ID for delete action
        tokendata.id,
        "The homepage deleted successfully",
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "HomePage deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting HomePage:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the HomePage",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async uploadImagesV1(userData: any, tokendata: any): Promise<any> {
        const token = { id: tokendata.id, roleId: tokendata.roleId };
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
      filePath = await storeFile(image, 12);

      // Read the file buffer and convert it to Base64

      const imageBuffer = await viewFile(filePath);
      const imageBase64 = imageBuffer.toString("base64");

      // const contentType = mime.lookup(filePath) || "application/octet-stream";
      // console.log('contentType', contentType)
      // const contentType = fileData.hapi.headers["content-type"];

      storedFiles.push({
        filename: path.basename(filePath),
        content: imageBase64,
        contentType: "image/jpg", // Assuming the image is in JPEG format

        // contentType:contentType
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
  public async deletehomeImageV1(userData: any, tokendata: any): Promise<any> {
        const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      let filePath: string | any;

      if (userData.refHomePageId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getImageRecordQuery, [
          userData.refHomePageId,
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

        filePath = imageRecord[0].homePageImage;

        // Delete the image record from the database
        // await executeQuery(deleteImageRecordQuery, [userData.refHomePageId]);
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
          message: "gallery image deleted successfully",
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
  public async listhomeImageV1(userData: any, tokendata: any): Promise<any> {
        const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listhomeImageQuery)
      return encrypt(
        {
          success: true,
          message: "list data successfully",
          token: tokens,
          result:result
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list data:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getHomeImageV1(userData: any, tokendata: any): Promise<any> {
        const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(getHomeImageQuery)
      return encrypt(
        {
          success: true,
          message: "get data successfully",
          token: tokens,
          result:result
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error get data:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while get data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listhomeImageUserSideV1(userData: any, tokendata: any): Promise<any> {
    //     const token = { id: tokendata.id, roleId: tokendata.roleId };
    // const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listhomeImageQuery)
      return encrypt(
        {
          success: true,
          message: "list data successfully",
          result:result
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list data:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list data",
          error: String(error),
        },
        true
      );
    }
  }
}
