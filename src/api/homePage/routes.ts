// import * as Hapi from "@hapi/hapi";
// import IRoute from "../../helper/routes";
// import { validateToken } from "../../helper/token";
// import { homePageController } from "./controller";

// export class homePageRoutes implements IRoute {
//   public async register(server: any): Promise<any> {
//     return new Promise((resolve) => {
//       const controller = new homePageController();
//       server.route([
//         {
//           method: "POST",
//           path: "/api/v1/homePageRoutes/uploadHomeImages",
//           config: {
//             pre: [{ method: validateToken, assign: "token" }],
//             handler: controller.uploadHomeImages,
//             description: "uploadHomeImages",
//             tags: ["api", "Users"],
//             auth: false,
//           },
//         },
//       ]);
//       resolve(true);
//     });
//   }
// }


// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { s3 } from "../../../helper/s3Client";
// import { RouteOptions } from "@hapi/hapi";
// import Boom from "@hapi/boom";

// export const uploadToS3Route: RouteOptions = {
//   method: "POST",
//   path: "/api/v1/upload-to-s3",
//   options: {
//     payload: {
//       output: "stream",
//       parse: true,
//       allow: "multipart/form-data",
//       multipart: true,
//       maxBytes: 10 * 1024 * 1024, // 10MB
//     },
//     handler: async (request, h) => {
//       const { file }: any = request.payload;
//       if (!file) {
//         throw Boom.badRequest("No file uploaded");
//       }

//       const fileName = file.hapi.filename;
//       const contentType = file.hapi.headers["content-type"];
//       const key = `uploads/${Date.now()}-${fileName}`;

//       const chunks: Buffer[] = [];
//       for await (const chunk of file) {
//         chunks.push(chunk);
//       }
//       const buffer = Buffer.concat(chunks);

//       const params = {
//         Bucket: process.env.S3_BUCKET_NAME!,
//         Key: key,
//         Body: buffer,
//         ContentType: contentType,
//       };

//       try {
//         await s3.send(new PutObjectCommand(params));

//         return h.response({
//           fileName,
//           filePath: key,
//           content: buffer.toString("base64"),
//           contentType,
//         });
//       } catch (err) {
//         console.error("Upload failed:", err);
//         throw Boom.internal("Failed to upload file");
//       }
//     },
//   },
// };
