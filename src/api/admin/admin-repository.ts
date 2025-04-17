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
 
  checkQuery,
  dashBoardQuery,
  deleteEmployeeImageQuery,
  deleteEmployeesQuery,
  getDeletedEmployeeQuery,
  getEmployeeQuery,
  getEmployeesQuery,
  getLastEmployeeIdQuery,
  insertUserDomainQuery,
  insertUserQuery,
  listAuditPageQuery,
  listCarBookingsQuery,
  listCustomizeTourBookingsQuery,
  listEmployeesQuery,
  listTourBookingsQuery,
  listTransactionTypeQuery,
  listUserTypeQuery,
  selectUserByLogin,

  updateEmployeeQuery,
  updateHistoryQuery,
} from "./query";
import { CurrentTime, generatePassword } from "../../helper/common";
import { generateSignupEmailContent } from "../../helper/mailcontent";
import { sendEmail } from "../../helper/mail";
import { storeFile, viewFile } from "../../helper/storage";

export class adminRepository {
  public async adminLoginV1(user_data: any, domain_code?: any): Promise<any> {
    const client: PoolClient = await getClient();

    try {
      const params = [user_data.login];
      console.log("params line ------ 25", params);
      const users:any = await client.query(selectUserByLogin, params);
      console.log("users", users);

      
      if (users.rows.length > 0) {
        const user = users.rows[0];

        console.log("User data:", user);
        console.log("User hashed password:", user.refUserHashedPassword); // Correct field name
        console.log("Entered password:", user_data.password);

        if (!user.refUserHashedPassword) {
          console.error("Error: User has no hashed password stored.");
          return encrypt(
            {
              success: false,
              message: "Invalid login credentials",
            },
            true
          );
        }

        const validPassword = await bcrypt.compare(
          user_data.password,
          user.refUserHashedPassword
        );
        console.log("validPassword", validPassword);
        if (validPassword) {
          const tokenData = { id: user.refUserId };
          console.log("tokenData", tokenData);

          const history = [
            1,
            user.refUserId,
           `${user_data.login} login succesfully`,
            CurrentTime(),
            user.refUserId,
          ];

          const updateHistory = await client.query(updateHistoryQuery, history);

          return encrypt(
            {
              success: true,
              message: "Login successful",
              token: generateTokenWithExpire(tokenData, true),
            },
            true
          );
        }
      }

      return encrypt(
        {
          success: false,
          message: "Invalid login credentials",
        },
        true
      );
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
    const token = { id: tokendata.id };
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
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listCarBookingsQuery);

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
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listCustomizeTourBookingsQuery);

      // Convert images to Base64 format
      for (const certificate of result) {
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
            console.log("error", error);
            certificate.refVaccinationCertificate = null;
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
  // public async listAuditPageV1(userData: any, tokendata: any): Promise<any> {
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);
  //   try {

  //     const{
  //        TransactionType,
  //        updatedAt
  //     }= userData
  //     const result = await executeQuery(listAuditPageQuery,[
  //       TransactionType,
  //       updatedAt
  //     ]);

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "listed audit page successfully",
  //         token: tokens,
  //         result: result,
  //       },
  //       false
  //     );
  //   } catch (error: unknown) {
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An unknown error occurred during listed audit bookings",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       false
  //     );
  //   }
  // }
  public async listAuditPageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { TransactionType, updatedAt } = userData;

      // const date = updatedAt
      //   ? updatedAt
      //   : (() => {
      //       const now = new Date();
      //       const day = String(now.getDate()).padStart(2, "0");
      //       const month = String(now.getMonth() + 1).padStart(2, "0");
      //       const year = now.getFullYear();
      //       return `${day}/${month}/${year}`; // Format: 'DD/MM/YYYY'
      //     })();

      const date = updatedAt ? updatedAt : CurrentTime();

      // const result = await executeQuery(listAuditPageQuery, [
      //   date,
      //   [TransactionType],
      // ]);
      

      const result = await executeQuery(listAuditPageQuery, [
        date,
        [parseInt(TransactionType)], // ensure it's an integer array
      ]);
      
      console.log('result', result)
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
      console.log("error line ----- 285", error);
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

  public async listTransactionTypeV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
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
  public async addEmployeeV1(userData: any, token_data?: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: token_data.id }; // Extract token ID
    console.log('token', token)
    console.log('token_data.id', token_data.id)
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
        userData.refUserTypeId,
        CurrentTime(),
        "Admin",
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
        "Admin",
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
                userData.refMoblile,
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
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refuserId } = userData;
      const result = await client.query(deleteEmployeeImageQuery, [refuserId]);

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

      return encrypt(
        {
          success: true,
          message: "Employee profile image deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Employee profile image :", error);

      return encrypt(
        {
          success: false,
          message:
            "An error occurred while deleting the Employee  profile image ",
          tokens: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  // public async updateEmployeeV1(userData: any, tokendata: any): Promise<any> {
  //   const client: PoolClient = await getClient();
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);
  //   try {
  //     await client.query("BEGIN");

  //     const {
  //       refuserId,
  //       refFName,
  //       refLName,
  //       refDOB,
  //       refDesignation,
  //       refQualification,
  //       refProfileImage,
  //       refMoblile,
  //       refUserTypeId,
  //     } = userData;

  //     const params = [
  //       refuserId,
  //       refFName,
  //       refLName,
  //       refDOB,
  //       refDesignation,
  //       refQualification,
  //       refProfileImage,
  //       refMoblile,
  //       // refUserTypeId,
  //       CurrentTime(),
  //       "Admin",
  //     ];
  //     const updateResult = await client.query(updateEmployeeQuery, params);
  //     // Log history of the action
  //     const history = [
  //       50,
  //       tokendata.id,
  //       "update employee",
  //       CurrentTime(),
  //       tokendata.id,
  //     ];

  //     const updateHistory = await client.query(updateHistoryQuery, history);
  //     await client.query("COMMIT"); // Commit transaction

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "employee updated successfully",
  //         token: tokens,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     await client.query("ROLLBACK"); // Rollback transaction in case of failure
  //     console.error("Error updating employee:", error);

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred while updating the employee",
  //         error: String(error),
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }
  public async updateEmployeeV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
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
      } = userData;
  
      const existingEmployeeRes = await client.query(
        getEmployeeQuery,
        [refuserId]
      );
      const existingData = existingEmployeeRes.rows[0];
  
      if (!existingData) throw new Error(`Employee with ID ${refuserId} not found`);
  
      const changes: string[] = [];
  
      if (existingData.refFName !== refFName)
        changes.push(`First Name: '${existingData.refFName}' : '${refFName}'`);
  
      if (existingData.refLName !== refLName)
        changes.push(`Last Name: '${existingData.refLName}' : '${refLName}'`);
  
      if (existingData.refDOB!== refDOB)
        changes.push(`DOB: '${existingData.refDOB}' : '${refDOB}'`);
  
      if (existingData.refDesignation !== refDesignation)
        changes.push(`Designation: '${existingData.refDesignation}' : '${refDesignation}'`);
  
      if (existingData.refQualification !== refQualification)
        changes.push(`Qualification: '${existingData.refQualification}' : '${refQualification}'`);
  
      if (existingData.refProfileImage !== refProfileImage)
        changes.push(`Profile Image changed`);
  
      if (existingData.refMoblile !== refMoblile)
        changes.push(`Mobile: '${existingData.refMoblile}' : '${refMoblile}'`);
  
      const changeSummary = changes.length ? `Updated Fields: ${changes.join(", ")}` : "No changes detected";
  
      const updateParams = [
        refuserId,
        refFName,
        refLName,
        refDOB,
        refDesignation,
        refQualification,
        refProfileImage,
        refMoblile,
        CurrentTime(),
        "Admin",
      ];
      await client.query(updateEmployeeQuery, updateParams);
  
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
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listEmployeesV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
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
      //       console.error("Error reading image file for product ${product.productId}",err);
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
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(getEmployeesQuery, [
        userData.refuserId,
      ]);

      for (const profile of result) {
        if (profile.refProfileImage) {
          try {
            const fileBuffer = await viewFile(
              profile.refProfileImage
            );
            profile.refProfileImage = {
              filename: path.basename(profile.refProfileImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error(
              "Error reading image file for product ${product.productId}",
              err
            );
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
  // public async deleteEmployeeV1(userData: any, tokendata: any): Promise<any> {
  //   const client: PoolClient = await getClient();

  //   const token = { id: tokendata.id };

  //   const tokens = generateTokenWithExpire(token, true);
  //   try {
  //     const result = await client.query(deleteEmployeesQuery, [
  //       userData.refuserId,
  //       CurrentTime(),
  //       "Admin",
  //     ]);
      
  //     const getDeletedEmployee: any = await client.query(getDeletedEmployeeQuery,[userData.refuserId]);

  //     const employeeName = `${getDeletedEmployee[0].refFName}, (${getDeletedEmployee[0].refCustId})`;
  //     console.log('employeeName', employeeName)

  //     const history = [
  //       51,
  //       tokendata.id,
  //       `${employeeName} has been deleted.`,
  //       CurrentTime(),
  //       tokendata.id,
  //     ];

  //     const updateHistory = await client.query(updateHistoryQuery, history);
  //     console.log('updateHistory', updateHistory)

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "get Employee successfully",
  //         token: tokens,
  //         result: result,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An unknown error occurred during get Employee ",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   }
  // }
  public async deleteEmployeeV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
  
    try {
      await client.query("BEGIN");
  
      const getDeletedEmployee: any = await client.query(getDeletedEmployeeQuery, [userData.refuserId]);
  
      if (!getDeletedEmployee.rows.length) {
        throw new Error("Employee not found");
      }
  
      const employee = getDeletedEmployee.rows[0];
      const employeeName = `${employee.refFName}, (${employee.refCustId})`;
      console.log("employeeName", employeeName);
  
      const result = await client.query(deleteEmployeesQuery, [
        userData.refuserId,
        CurrentTime(),
        "Admin",
      ]);
  
      const history = [
        51,
        tokendata.id,
        `${employeeName} has been deleted.`,
        CurrentTime(),
        tokendata.id,
      ];
  
      const updateHistory = await client.query(updateHistoryQuery, history);
      console.log("updateHistory", updateHistory);
  
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
    const token = { id: tokendata.id };
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
        false
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
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const dashBoard = await executeQuery(dashBoardQuery);
  
      return encrypt(
        {
          success: true,
          message: "listed dashboard successfully",
          token: tokens,
          dashBoard: dashBoard,
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
}
