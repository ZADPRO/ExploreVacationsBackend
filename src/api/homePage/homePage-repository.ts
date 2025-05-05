import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "../../helper/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { CurrentTime } from "../../helper/common";
import { encrypt } from "../../helper/encrypt";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { addHomePageQuery, updateHistoryQuery } from "./query";
export class homePageRepository {
  public async uploadHomeImagesV1(file: any): Promise<any> {
    if (!file || !file.file || !file.file._data || !file.file.hapi) {
      throw new Error("Invalid file input");
    }
    const fileData = file.file;
    const fileName = `${uuidv4()}_${fileData.hapi.filename}`;
    const contentType = fileData.hapi.headers["content-type"];

    const bucketName = process.env.S3_BUCKET_NAME;

    console.log("bucketName", bucketName);
    if (!bucketName) throw new Error("Missing S3_BUCKET_NAME in environment");

    const uploadParams: PutObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      Body: fileData._data,
      ContentType: contentType,
      ACL: "public-read", // ensure it's a valid ObjectCannedACL
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    // const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return {
      success: true,
      message: "Image uploaded successfully",
      fileName,
      filePath: fileUrl,
      contentType,
      base64: fileData._data.toString("base64"),
    };
  }
  public async deleteHomeImageV1(fileName: string): Promise<any> {
    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) throw new Error("Missing S3_BUCKET_NAME in environment");

    const deleteParams = {
      Bucket: bucketName,
      Key: fileName,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

    return {
      success: true,
      message: "Image deleted successfully",
      fileName,
    };
  }
  public async homeImageContentV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();

    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const {
        homePageHeading,
        homePageContent,
        refOffer,
        refOfferName,
        homePageImage
      } = userData;

      const Result = await client.query(addHomePageQuery, [
        homePageHeading,
        homePageContent,
        refOffer,
        refOfferName,
        homePageImage,
        CurrentTime(),
        tokendata.id
      ]);

      const history = [
        20,
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
          token: tokens
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
          error: String(error)
        },
        true
      );
    } finally {
      client.release();
    }
  }
}
