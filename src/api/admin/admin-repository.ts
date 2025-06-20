import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";
import { encrypt } from "../../helper/encrypt";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import nodemailer from "nodemailer";
import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import {
  carResultQuery,
  checkQuery,
  customizeTourResultQuery,
  dashBoardQuery,
  deleteAuditQuery,
  deleteCarBookingsQuery,
  deleteCarParkingBookingsQuery,
  deleteCustomizeTourBookingsQuery,
  deleteEmployeeImageQuery,
  deleteEmployeesQuery,
  deleteTourBookingsQuery,
  deleteUserDomainQuery,
  deleteUserQuery,
  getDeletedEmployeeCountQuery,
  getDeletedEmployeeQuery,
  getEmployeeProfileQuery,
  getEmployeeQuery,
  getEmployeesQuery,
  getLastEmployeeIdQuery,
  getUserdataQuery,
  insertUserDomainQuery,
  insertUserQuery,
  listAllAuditPageQuery,
  listAuditPageQuery,
  listCarBookingAgreementQuery,
  listCarBookingsQuery,
  listCustomizeTourBookingsQuery,
  listEmployeesQuery,
  listParkingBookingsQuery,
  listTourBookingsQuery,
  listTransactionTypeQuery,
  listUserDataQuery,
  listUserTypeQuery,
  parkingResultQuery,
  selectUserByLogin,
  tourResultQuery,
  updatedomainDataQuery,
  updateEmployeeProfileQuery,
  updateEmployeeQuery,
  updateHistoryQuery,
} from "./query";
import { CurrentTime, generatePassword } from "../../helper/common";
import { generateSignupEmailContent } from "../../helper/mailcontent";
import { sendEmail } from "../../helper/mail";
import { deleteFile, storeFile, viewFile } from "../../helper/storage";

export class adminRepository {
  public async adminLoginV1(user_data: any, domain_code?: any): Promise<any> {
    const client: PoolClient = await getClient();
    try {
      const params = [user_data.login];
      console.log("params", params);
      console.log("user_data.login", user_data.login);
      const users = await client.query(selectUserByLogin, params);
      console.log("users", users);

      if (!users.rows || users.rows.length === 0) {
        return encrypt(
          {
            success: false,
            message: "Invalid login credentials. User not found.",
          },
          true
        );
      }

      const { userTypeId } = users.rows[0];

      const user = users.rows[0];

      const getDeletedEmployee = await executeQuery(
        getDeletedEmployeeCountQuery,
        params
      );

      const count = Number(getDeletedEmployee[0]?.count || 0); // safely convert to number

      if (count > 0) {
        return encrypt(
          {
            success: false,
            message: "The Person was already deleted",
          },
          true
        );
      }

      if (!user.refUserHashedPassword) {
        console.error("Error: User has no hashed password stored.");
        return encrypt(
          {
            success: false,
            message: "Invalid login credentials UserHashedPassword not match",
          },
          true
        );
      }

      const validPassword = await bcrypt.compare(
        user_data.password,
        user.refUserHashedPassword
      );

      if (!validPassword) {
        return encrypt(
          {
            success: false,
            message: "Invalid login credentials, validPassword is in false",
          },
          true
        );
      }

      // validPassword === true
      const tokenData = { id: user.refUserId, roleId: userTypeId };
      console.log("tokenData", tokenData);

      const history = [
        1,
        user.refUserId,
        `${user_data.login} login successfully`,
        CurrentTime(),
        user.refUserId,
      ];

      await client.query(updateHistoryQuery, history);

      return encrypt(
        {
          success: true,
          message: "Login successful",
          userId: user.refUserId,
          roleId: userTypeId,
          token: generateTokenWithExpire(tokenData, true),
        },
        true
      );

      // return encrypt(
      //   {
      //     success: false,
      //     message: "Invalid login credentials",
      //   },
      //   true
      // );
    } catch (error) {
      console.error("Error during login:", error);
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listTourBookingsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listTourBookingsQuery);

      return encrypt(
        {
          success: true,
          message: "listed tour bookings successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed tour bookings",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listCarBookingsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listCarBookingsQuery);
      console.log("result", result);

      for (const certificate of result) {
        if (certificate.refAgreementPath) {
          try {
            const fileBuffer = await viewFile(certificate.refAgreementPath);
            certificate.refAgreementPath = {
              filename: path.basename(certificate.refAgreementPath),
              // content: fileBuffer.toString("base64"),
              contentType: "application/pdf",
            };
          } catch (error) {
            console.log("error", error);
            certificate.refAgreementPath = null;
          }
        }
        if (certificate.refCarPath) {
          try {
            const fileBuffer = await viewFile(certificate.refCarPath);
            certificate.refCarPath = {
              filename: path.basename(certificate.refCarPath),
              // content: fileBuffer.toString("base64"),
              contentType: "application/pdf",
            };
          } catch (error) {
            console.log("error", error);
            certificate.refCarPath = null;
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "listed car bookings successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed car bookings",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listCustomizeTourBookingsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listCustomizeTourBookingsQuery);

      // for (const certificate of result) {
      //   if (certificate.refVaccinationCertificate) {
      //     try {
      //       const fileBuffer = await viewFile(
      //         certificate.refVaccinationCertificate
      //       );
      //       certificate.refVaccinationCertificate = {
      //         filename: path.basename(certificate.refVaccinationCertificate),
      //         content: fileBuffer.toString("base64"),
      //         contentType: "application/pdf",
      //       };
      //     } catch (error) {
      //       console.log("error", error);
      //       certificate.refVaccinationCertificate = null;
      //     }
      //   }
      // }

      result.map((data, index) => {
        if (
          data.refVaccinationCertificate !== null &&
          data.refVaccinationCertificate !== "{}" &&
          data.refPassPort !== null &&
          data.refPassPort !== "{}"
        ) {
        }
      });

      for (const certificate of result) {
        // Handle vaccination certificate
        if (certificate.refVaccinationCertificate) {
          try {
            const fileBuffer = await viewFile(
              certificate.refVaccinationCertificate
            );
            certificate.refVaccinationCertificate = {
              filename: path.basename(certificate.refVaccinationCertificate),
              content: fileBuffer.toString("base64"),
              contentType: "application/pdf",
            };
          } catch (error) {
            console.log(
              "Error loading vaccination certificate: line ------ 381 \n",
              error
            );
            certificate.refVaccinationCertificate = null;
          }
        }

        // Handle passport
        if (certificate.refPassPort) {
          try {
            const fileBuffer = await viewFile(certificate.refPassPort);
            certificate.refPassPort = {
              filename: path.basename(certificate.refPassPort),
              content: fileBuffer.toString("base64"),
              contentType: "application/pdf",
            };
          } catch (error) {
            console.log("Error loading passport: line ------- 398 \n", error);
            certificate.refPassPort = null;
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "listed Customize Tour Bookings successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message:
            "An unknown error occurred during listed Customize Tour Bookings",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listParkingBookingsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listParkingBookingsQuery);

      return encrypt(
        {
          success: true,
          message: "listed Parking Bookings successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message:
            "An unknown error occurred during listed car Parking Bookings",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  // public async listAuditPageV1(userData: any, tokendata: any): Promise<any> {
  //   const token = { id: tokendata.id, roleId: tokendata.roleId };
  //   const tokens = generateTokenWithExpire(token, true);

  //   try {
  //     let result;

  //     const { updatedAt } = userData;
  //     const hasFilter = userData && updatedAt;

  //     const date = updatedAt ? updatedAt : CurrentTime();

  //     const TransactionTypeArray = Array.isArray(userData.TransactionType)
  //       ? userData.TransactionType.map(Number)
  //       : [];

  //     if (!hasFilter) {
  //       const result = await executeQuery(listAllAuditPageQuery);
  //     } else {
  //       const result = await executeQuery(listAuditPageQuery, [
  //         date,
  //         TransactionTypeArray,
  //       ]);
  //     }
  //     return encrypt(
  //       {
  //         success: true,
  //         message: "listed audit page successfully",
  //         token: tokens,
  //         result: result,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     console.log("error line ----- 285", error);
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An unknown error occurred during listed audit bookings",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   }
  // }

  public async listAuditPageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { updatedAt, TransactionType } = userData || {};

      const hasFilter =
        !!updatedAt ||
        (Array.isArray(TransactionType) && TransactionType.length > 0);
      const date = updatedAt || CurrentTime();
      const transactionTypeArray = Array.isArray(TransactionType)
        ? TransactionType.map(Number)
        : [];

      const query = hasFilter ? listAuditPageQuery : listAllAuditPageQuery;
      const params = hasFilter ? [date, transactionTypeArray] : [];

      const result = await executeQuery(query, params);

      return encrypt(
        {
          success: true,
          message: "Listed audit page successfully",
          token: tokens,
          result,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in listAuditPageV1:", error);
      return encrypt(
        {
          success: false,
          message: "An error occurred while listing audit page",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  // public async listAuditPageV1(userData: any, tokendata: any): Promise<any> {
  //   const token = { id: tokendata.id, roleId: tokendata.roleId };
  //   const tokens = generateTokenWithExpire(token, true);

  //   try {
  //     const { updatedAt } = userData;

  //     const date = updatedAt ? updatedAt : CurrentTime();

  //     const TransactionTypeArray = Array.isArray(userData.TransactionType)
  //       ? userData.TransactionType.map(Number)
  //       : [];

  //     const result = await executeQuery(listAuditPageQuery, [
  //       date,
  //       TransactionTypeArray,
  //     ]);

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "listed audit page successfully",
  //         token: tokens,
  //         result: result,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     console.log("error line ----- 285", error);
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An unknown error occurred during listed audit bookings",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   }
  // }

  public async listTransactionTypeV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listTransactionTypeQuery);

      return encrypt(
        {
          success: true,
          message: "listed audit page successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed audit bookings",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async addEmployeeV1(userData: any, token_data: any): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: token_data.id }; // Extract token ID
    const token = { id: token_data.id, roleId: token_data.roleId };

    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const genPassword = generatePassword();
      const genHashedPassword = await bcrypt.hash(genPassword, 10);

      // Check if the username already exists
      const check = [userData.refMoblile];
      const userCheck = await client.query(checkQuery, check);
      if (userCheck.rows.length > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: true,
            message: "Already exists",
            token: tokens,
          },
          true
        );
      }

      const customerPrefix = "EV-EMP-";
      const baseNumber = 0;

      const lastCustomerResult = await client.query(getLastEmployeeIdQuery);
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
      const refUserTypeId = Array.isArray(userData.refUserTypeId)
        ? `{${userData.refUserTypeId.join(",")}}`
        : "{}";

      // Insert into users table
      const params = [
        newCustomerId,
        userData.refFName,
        userData.refLName,
        userData.refDOB,
        userData.refDesignation,
        userData.refQualification,
        userData.refProfileImage,
        userData.refMoblile,
        refUserTypeId,
        CurrentTime(),
        token_data.id,
      ];

      const userResult = await client.query(insertUserQuery, params);
      const newUser = userResult.rows[0];

      // Insert into userDomain table
      const domainParams = [
        newUser.refuserId,
        userData.refUserEmail,
        genPassword,
        genHashedPassword,
        userData.refMoblile,
        CurrentTime(),
        token_data.id,
      ];

      const domainResult = await client.query(
        insertUserDomainQuery,
        domainParams
      );

      if ((userResult.rowCount ?? 0) > 0 && (domainResult.rowCount ?? 0) > 0) {
        const history = [
          49,
          token_data.id,
          `${userData.refFName} added succcesfully`,
          CurrentTime(),
          token_data.id,
        ];
        const updateHistory = await client.query(updateHistoryQuery, history);

        if ((updateHistory.rowCount ?? 0) > 0) {
          const tokenData = {
            id: newUser.refUserId,
            email: userData.refUserEmail,
          };
          await client.query("COMMIT");
          const main = async () => {
            const mailOptions = {
              to: userData.refUserEmail,
              subject: "You Accont has be Created Successfully In our Platform", // Subject of the email
              html: generateSignupEmailContent(
                userData.refFName,
                userData.refUserEmail,
                genPassword
              ),
            };

            // Call the sendEmail function
            try {
              await sendEmail(mailOptions);
            } catch (error) {
              console.error("Failed to send email:", error);
            }
          };
          main().catch(console.error);

          // const adminMail = {
          //       to: userData.refUserEmail,
          //       subject: "You Accont has be Created Successfully In our Platform",
          //       html: generateSignupEmailContent( userData.refMoblile,
          //               genPassword)
          //     };
          //     // await sendEmail(adminMail);

          //     const transporter = nodemailer.createTransport({
          //       service: "gmail",
          //       auth: {
          //         user: process.env.EMAILID,
          //         pass: process.env.PASSWORD,
          //       },
          //     });

          //       const mailoption = {
          //         from: process.env.EMAILID,
          //         to: "indumathi123indumathi@gmail.com",
          //         subject: "New Tour Booking Received",
          //         html:  generateSignupEmailContent( userData.refMoblile,
          //           genPassword)

          // };
          //       await transporter.sendMail(mailoption);

          return encrypt(
            {
              success: true,
              message: "Employee added successful",
              user: newUser,
              roleId: refUserTypeId,
              token: tokens,
            },
            true
          );
        }
      }

      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "failed Employee added",
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during Employee added:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during Employee added",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async uploadEmployeeImageV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
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
      filePath = await storeFile(image, 6);

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
          message: "employee profile Image Stored Successfully",
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
  public async deleteEmployeeImageV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    console.log("userData", userData);
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { refuserId } = userData;
      let filePath: string | null = null;

      if (refuserId) {
        // Retrieve the image record from the database
        const imageRecord: any = await executeQuery(getEmployeeQuery, [
          refuserId,
        ]);

        if (!imageRecord || imageRecord.length === 0) {
          return encrypt(
            {
              success: false,
              message: "Image record not found",
              token: tokens,
            },
            true
          );
        }

        // filePath = imageRecord[0]?.refProfileImage;

        // Delete from DB
      } else if (userData.filePath) {
        // Fallback path deletion
        filePath = userData.filePath;
        console.log("filePath", filePath);
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
    } catch (error: unknown) {
      console.error("Error deleting Employee profile image:", error);
      return encrypt(
        {
          success: false,
          message:
            "An error occurred while deleting the Employee profile image",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async updateEmployeeV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const {
        refuserId,
        refFName,
        refLName,
        refDOB,
        refDesignation,
        refQualification,
        refProfileImage,
        refMoblile,
        // refUserTypeId,
      } = userData;

      const refUserTypeId = Array.isArray(userData.refUserTypeId)
        ? `{${userData.refUserTypeId.join(",")}}`
        : "{}";
      const existingEmployeeRes = await client.query(getEmployeeQuery, [
        refuserId,
      ]);
      const existingData = existingEmployeeRes.rows[0];

      if (!existingData)
        throw new Error(`Employee with ID ${refuserId} not found`);

      const changes: string[] = [];

      if (existingData.refFName !== refFName)
        changes.push(`First Name: '${existingData.refFName}' : '${refFName}'`);

      if (existingData.refLName !== refLName)
        changes.push(`Last Name: '${existingData.refLName}' : '${refLName}'`);

      if (existingData.refDOB !== refDOB)
        changes.push(`DOB: '${existingData.refDOB}' : '${refDOB}'`);

      if (existingData.refDesignation !== refDesignation)
        changes.push(
          `Designation: '${existingData.refDesignation}' : '${refDesignation}'`
        );

      if (existingData.refQualification !== refQualification)
        changes.push(
          `Qualification: '${existingData.refQualification}' : '${refQualification}'`
        );

      if (existingData.refProfileImage !== refProfileImage)
        changes.push(`Profile Image changed`);

      if (existingData.refMoblile !== refMoblile)
        changes.push(`Mobile: '${existingData.refMoblile}' : '${refMoblile}'`);

      const changeSummary = changes.length
        ? `Updated Fields: ${changes.join(", ")}`
        : "No changes detected";

      const updateParams = [
        refuserId,
        refFName,
        refLName,
        refDOB,
        refDesignation,
        refQualification,
        refProfileImage,
        refMoblile,
        refUserTypeId,
        CurrentTime(),
        tokendata.id,
      ];
      const updateProfile = await client.query(
        updateEmployeeQuery,
        updateParams
      );

      const historyParams = [
        50,
        tokendata.id,
        changeSummary,
        CurrentTime(),
        tokendata.id,
      ];
      await client.query(updateHistoryQuery, historyParams);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Employee updated successfully",
          token: tokens,
          updateProfile: updateProfile,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error updating employee:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while updating the employee",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateEmployeeProfileV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const {
        refFName,
        refLName,
        refDOB,
        refDesignation,
        refQualification,
        refProfileImage,
        refMoblile,
        refUserPassword,
        refUserEmail,
      } = userData;

      const genHashedPassword = await bcrypt.hash(refUserPassword, 10);

      const existingEmployeeRes = await client.query(getEmployeeQuery, [
        tokendata.id,
      ]);
      const existingData = existingEmployeeRes.rows[0];

      if (!existingData)
        throw new Error(`Employee with ID ${tokendata.id} not found`);

      const changes: string[] = [];

      if (existingData.refFName !== refFName)
        changes.push(`First Name: '${existingData.refFName}' : '${refFName}'`);

      if (existingData.refLName !== refLName)
        changes.push(`Last Name: '${existingData.refLName}' : '${refLName}'`);

      if (existingData.refDOB !== refDOB)
        changes.push(`DOB: '${existingData.refDOB}' : '${refDOB}'`);

      if (existingData.refDesignation !== refDesignation)
        changes.push(
          `Designation: '${existingData.refDesignation}' : '${refDesignation}'`
        );

      if (existingData.refQualification !== refQualification)
        changes.push(
          `Qualification: '${existingData.refQualification}' : '${refQualification}'`
        );

      if (existingData.refProfileImage !== refProfileImage)
        changes.push(`Profile Image changed`);

      if (existingData.refMoblile !== refMoblile)
        changes.push(`Mobile: '${existingData.refMoblile}' : '${refMoblile}'`);

      const changeSummary = changes.length
        ? `Updated Fields: ${changes.join(", ")}`
        : "No changes detected";

      const updateParams = [
        tokendata.id,
        refFName,
        refLName,
        refDOB,
        refDesignation,
        refQualification,
        refProfileImage,
        refMoblile,
        // refUserTypeId,
        CurrentTime(),
        tokendata.id,
      ];
      const updateProfile = await client.query(
        updateEmployeeProfileQuery,
        updateParams
      );

      const updatedomain = [
        refUserEmail,
        refUserPassword,
        genHashedPassword,
        CurrentTime(),
        tokendata.id,
        tokendata.id,
      ];
      const domainData = await executeQuery(
        updatedomainDataQuery,
        updatedomain
      );
      const historyParams = [
        65,
        tokendata.id,
        changeSummary,
        CurrentTime(),
        tokendata.id,
      ];
      await client.query(updateHistoryQuery, historyParams);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Employee profile updated successfully",
          token: tokens,
          updateProfile: updateProfile,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error updating employee profile:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while updating the employee profile",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listEmployeesV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listEmployeesQuery);

      // for (const profile of result) {
      //   if (profile.refProfileImage) {
      //     try {
      //       const fileBuffer = await fs.promises.readFile(profile.refProfileImage);
      //       profile.refProfileImage = {
      //         filename: path.basename(profile.refProfileImage),
      //         content: fileBuffer.toString("base64"),
      //         contentType: "image/jpeg", // Change based on actual file type if necessary
      //       };
      //     } catch (err) {
      //       console.error("Error reading image file for product ",err);
      //       profile.refProfileImage = null; // Handle missing or unreadable files gracefully
      //     }
      //   }
      // }
      return encrypt(
        {
          success: true,
          message: "listed Employee successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed Employee ",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getEmployeeV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(getEmployeesQuery, [
        userData.refuserId,
      ]);

      for (const profile of result) {
        if (profile.refProfileImage) {
          try {
            const fileBuffer = await viewFile(profile.refProfileImage);
            profile.refProfileImage = {
              filename: path.basename(profile.refProfileImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error("Error reading image file for product ", err);
            profile.refProfileImage = null; // Handle missing or unreadable files gracefully
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "get Employee successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during get Employee ",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async deleteEmployeeV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const getDeletedEmployee: any = await client.query(
        getDeletedEmployeeQuery,
        [userData.refuserId]
      );

      if (!getDeletedEmployee.rows.length) {
        throw new Error("Employee not found");
      }

      const employee = getDeletedEmployee.rows[0];
      const employeeName = `${employee.refFName}, (${employee.refCustId})`;

      const result = await client.query(deleteEmployeesQuery, [
        userData.refuserId,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        51,
        tokendata.id,
        `${employeeName} has been deleted.`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Employee deleted successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during deleting employee",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listUserTypeV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listUserTypeQuery);
      return encrypt(
        {
          success: true,
          message: "listed userType successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed userType ",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async dashBoardV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const dashBoard: any = await executeQuery(dashBoardQuery);
      console.log("dashBoard", dashBoard);

      return encrypt(
        {
          success: true,
          message: "listed dashboard successfully",
          dashBoard: dashBoard,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed dashboard ",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteCarBookingsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { userCarBookingId } = userData;
      const result = await client.query(deleteCarBookingsQuery, [
        userCarBookingId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "car booking not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      // const history = [
      //   36, // Unique ID for delete action
      //   tokendata.id,
      //   "delete Include",
      //   CurrentTime(),
      //   tokendata.id,
      // ];

      // await client.query(updateHistoryQuery, history);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "car booking deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting car booking:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the car booking",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteTourBookingsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { userTourBookingId } = userData;
      const result = await client.query(deleteTourBookingsQuery, [
        userTourBookingId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "tour booking not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      // const history = [
      //   36, // Unique ID for delete action
      //   tokendata.id,
      //   "delete Include",
      //   CurrentTime(),
      //   tokendata.id,
      // ];

      // await client.query(updateHistoryQuery, history);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "tour booking deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting car booking:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the car booking",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteCustomizeTourBookingsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { customizeTourBookingId } = userData;
      const result = await client.query(deleteCustomizeTourBookingsQuery, [
        customizeTourBookingId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Customize tour booking not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // Insert delete action into history
      // const history = [
      //   36, // Unique ID for delete action
      //   tokendata.id,
      //   "delete Include",
      //   CurrentTime(),
      //   tokendata.id,
      // ];

      // await client.query(updateHistoryQuery, history);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Customize tour booking deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Customize tour booking:", error);

      return encrypt(
        {
          success: false,
          message:
            "An error occurred while deleting the Customize tour booking",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteCarParkingBookingsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { carParkingBookingId } = userData;
      const result = await client.query(deleteCarParkingBookingsQuery, [
        carParkingBookingId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: " CarParking booking not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "CarParking Booking deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Car Parking Bookings", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Car Parking Booking",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listUserDataV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listUserDataQuery);

      return encrypt(
        {
          success: true,
          message: "list User data deleted successfully",
          token: tokens,
          userData: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in list user data", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred list the user data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getUserDataV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(getUserdataQuery, [userData.userId]);
      const tour = await executeQuery(tourResultQuery, [userData.userId]);
      const car = await executeQuery(carResultQuery, [userData.userId]);
      const customizeTour = await executeQuery(customizeTourResultQuery, [
        userData.userId,
      ]);
      const parking = await executeQuery(parkingResultQuery, [userData.userId]);

      return encrypt(
        {
          success: true,
          message: "get User data deleted successfully",
          token: tokens,
          userData: result, // Return deleted record for reference
          tour: tour,
          car: car,
          customizeTour: customizeTour,
          parking: parking,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in get user data", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred get the user data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async viewCarAgreementV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    console.log("userData", userData);
    try {
      const result = await executeQuery(listCarBookingAgreementQuery, [
        userData.refuserId,
      ]);
      console.log("result", result);

      for (const certificate of result) {
        if (certificate.refAgreementPath) {
          try {
            // const fileBuffer = await viewFile(certificate.refAgreementPath);
            certificate.refAgreementPath = {
              filename: path.basename(certificate.refAgreementPath),
              // content: fileBuffer.toString("base64"),
              contentType: "application/pdf",
            };
          } catch (error) {
            console.log("error", error);
            certificate.refAgreementPath = null;
          }
        }
        if (certificate.refCarPath) {
          try {
            const fileBuffer = await viewFile(certificate.refCarPath);
            certificate.refCarPath = {
              filename: path.basename(certificate.refCarPath),
              content: fileBuffer.toString("base64"),
              contentType: "application/pdf",
            };
          } catch (error) {
            console.log("error", error);
            certificate.refCarPath = null;
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "listed car bookings successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during listed car bookings",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteAuditV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { transId } = userData;
      const result: any = await executeQuery(deleteAuditQuery, [
        transId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        return encrypt(
          {
            success: false,
            message: "audit not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      return encrypt(
        {
          success: true,
          message: "audit deleted successfully",
          token: tokens,
          deletedData: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error deleting audit", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the audit",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteUsersV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { userId } = userData;
      const result: any = await executeQuery(deleteUserQuery, [
        userId,
        CurrentTime(),
        tokendata.id,
      ]);

      const result2: any = await executeQuery(deleteUserDomainQuery, [userId]);

      if (result.rowCount === 0) {
        return encrypt(
          {
            success: false,
            message: "user not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      return encrypt(
        {
          success: true,
          message: "user deleted successfully",
          token: tokens,
          deletedData: result, // Return deleted record for reference
          result2: result2,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error deleting user", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the user",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async employeeProfileV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(getEmployeeProfileQuery, [
        tokendata.id,
      ]);

      const { refProfileImage } = result[0];

      for (const image of result) {
        if (image.refProfileImage) {
          try {
            const fileBuffer = await fs.promises.readFile(
              image.refProfileImage
            );
            image.refProfileImage = {
              filepath: refProfileImage,
              filename: path.basename(image.refProfileImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Adjust if needed
            };
          } catch (error) {
            console.error("Error reading image file:", error);
            image.refProfileImage = null; // Handle missing/unreadable files
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "get User data deleted successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in get user data", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred get the user data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
}
