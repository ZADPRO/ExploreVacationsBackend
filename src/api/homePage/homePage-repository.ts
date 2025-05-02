import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "../../helper/s3Client";

export class homePageRepository {
  public async uploadHomeImagesV1(file: any): Promise<any> {
    if (!file || !file.file || !file.file._data || !file.file.hapi) {
      throw new Error("Invalid file input");
    }
    const fileData = file.file;
    const fileName = `${uuidv4()}_${fileData.hapi.filename}`;
    const contentType = fileData.hapi.headers["content-type"];
    
    // const bucketName = process.env.AWS_BUCKET_NAME;

        const bucketName = process.env.S3_BUCKET_NAME;

    console.log('bucketName', bucketName)
    if (!bucketName) throw new Error("Missing AWS_BUCKET_NAME in environment");
  
    const uploadParams: PutObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      Body: fileData._data,
      ContentType: contentType,
      ACL: "public-read", // ensure it's a valid ObjectCannedACL
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return {
      success: true,
      message: "Image uploaded successfully",
      fileName,
      filePath: fileUrl,
      contentType,
      base64: fileData._data.toString("base64"),
    };
  }
}
