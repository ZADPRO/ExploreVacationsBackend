import { executeQuery, getClient } from "../../helper/db";
import { Client, PoolClient } from "pg";
import {
  storeFile,
  viewFile,
  convertToBase64,
  storetheFile,
  deleteFile,
} from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import fs from "fs";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { CurrentTime, generatePassword } from "../../helper/common";
import bcrypt from "bcryptjs";
import {
  applyCouponQuery,
  checkQuery,
  deleteOffersQuery,
  deletePartnersQuery,
  getdataQuery,
  getDeletedOfferQuery,
  getDeletedPartnerQuery,
  getLastPartnerIdQuery,
  getOffersQuery,
  getPartnerQuery,
  getPartnersQuery,
  insertoffersQuery,
  insertUserDomainQuery,
  insertUserQuery,
  listOffersQuery,
  listPartnersQuery,
  updateHistoryQuery,
  updateoffersQuery,
  updatePartnerQuery,
} from "./query";
import {
  generatePartnerSignupEmailContent,
  generateSignupEmailContent,
} from "../../helper/mailcontent";
import { sendEmail } from "../../helper/mail";

export class partnerRepository {
  public async addPartnersV1(userData: any, token_data?: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: token_data.id }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const genPassword = generatePassword();
      const genHashedPassword = await bcrypt.hash(genPassword, 10);

      // Check if the username already exists
      const check = [userData.refUserEmail];
      const userCheck = await client.query(checkQuery, check);
      if (userCheck.rows.length > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Already exists",
            token: tokens,
          },
          true
        );
      }

      const customerPrefix = "EV-PART-";
      const baseNumber = 0;

      const lastCustomerResult = await client.query(getLastPartnerIdQuery);
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
        userData.refMoblile,
        userData.refOffersId,
        `{6}`,
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
          59,
          token_data.id,
          `${userData.refFName} Partner added succcesfully`,
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
              html: generatePartnerSignupEmailContent(
                userData.refFName,
                userData.refUserEmail,
                genPassword
              ),
            };

            // Call the sendEmail function
            try {
              sendEmail(mailOptions);
            } catch (error) {
              console.error("Failed to send email:", error);
            }
          };
          main().catch(console.error);

          return encrypt(
            {
              success: true,
              message: "Partner added successful",
              user: newUser,
              roleId: 6,
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
          message: "failed Partner added",
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during Partner added:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during Partner added",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updatePartnerV1(userData: any, tokendata: any): Promise<any> {
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
        refMoblile,
        refOffersId,
      } = userData;

      const existingPartnerRes = await client.query(getPartnerQuery, [
        refuserId,
      ]);
      const existingData = existingPartnerRes.rows[0];

      if (!existingData)
        throw new Error(`Partner with ID ${refuserId} not found`);

      const changes: string[] = [];

      if (existingData.refFName !== refFName)
        changes.push(`First Name: '${existingData.refFName}' : '${refFName}'`);

      if (existingData.refLName !== refLName)
        changes.push(`Last Name: '${existingData.refLName}' : '${refLName}'`);

      if (existingData.refDOB !== refDOB)
        changes.push(`DOB: '${existingData.refDOB}' : '${refDOB}'`);

      const changeSummary = changes.length
        ? `Updated Fields: ${changes.join(", ")}`
        : "No changes detected";

      const updateParams = [
        refuserId,
        refFName,
        refLName,
        refDOB,
        refMoblile,
        refOffersId,
        `{6}`,
        CurrentTime(),
        tokendata.id,
      ];
      await client.query(updatePartnerQuery, updateParams);

      const historyParams = [
        60,
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
          message: "Partner updated successfully",
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error updating Partner:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while updating the Partner",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async getPartnersV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(getPartnersQuery, [userData.userId]);

      return encrypt(
        {
          success: true,
          message: "get partners successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in get partners", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred get the partners",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listPartnersV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listPartnersQuery);

      return encrypt(
        {
          success: true,
          message: "list partners successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in list partners", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred list the partners",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deletePartnersV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const getDeletedPartner: any = await client.query(
        getDeletedPartnerQuery,
        [userData.refuserId]
      );

      if (!getDeletedPartner.rows.length) {
        throw new Error("Partner not found");
      }

      const Partner = getDeletedPartner.rows[0];
      const PartnerName = `${Partner.refFName}, (${Partner.refCustId})`;

      const result = await client.query(deletePartnersQuery, [
        userData.refuserId,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        61,
        tokendata.id,
        `${PartnerName} has been deleted.`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Partner deleted successfully",
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
          message: "An unknown error occurred during deleting Partner",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async addOffersV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();
    try {
      await client.query("BEGIN");
      const {
        refOffersName,
        refOfferType,
        refDescription,
        refOfferValue,
        refCoupon,
        isActive,
      } = userData;

      // Insert into users table
      const params = [
        refOffersName,
        refOfferType,
        refDescription,
        refOfferValue,
        refCoupon,
        isActive,
        CurrentTime(),
        tokendata.id,
      ];
      const Result = await client.query(insertoffersQuery, params);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "offers added successful",
          Result: Result,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during  offers addition:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during offers addition ",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateOffersV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();
    try {
      await client.query("BEGIN");
      const {
        refOffersId,
        refOffersName,
        refOfferType,
        refDescription,
        refOfferValue,
        refCoupon,
        isActive,
      } = userData;

      // Insert into users table
      const params = [
        refOffersId,
        refOffersName,
        refOfferType,
        refDescription,
        refOfferValue,
        refCoupon,
        isActive,
        CurrentTime(),
        tokendata.id,
      ];
      const Result = await client.query(updateoffersQuery, params);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "offers update successful",
          Result: Result,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during  offers update:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during offers update ",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteOffersV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const getDeletedOffer: any = await client.query(getDeletedOfferQuery, [
        userData.refOffersId,
      ]);

      if (!getDeletedOffer.rows.length) {
        throw new Error("Offer not found");
      }

      const result = await client.query(deleteOffersQuery, [
        userData.refOffersId,
        CurrentTime(),
        tokendata.id,
      ]);

      // const history = [
      //   61,
      //   tokendata.id,
      //   `${Offer} has been deleted.`,
      //   CurrentTime(),
      //   tokendata.id,
      // ];

      // const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Offer deleted successfully",
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
          message: "An unknown error occurred during deleting Offer",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listOffersV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listOffersQuery);

      return encrypt(
        {
          success: true,
          message: "list offers successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in list offers", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred list the offers",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getOffersV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(getOffersQuery,[userData.refOffersId]);

      return encrypt(
        {
          success: true,
          message: "get offers successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in get offers", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred get the offers",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async applyCouponV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(applyCouponQuery, [userData.userId]);

      const getData: any[] = await executeQuery(getdataQuery, [
        userData.userId,
      ]);
      console.log('getData', getData)
      if (!getData || getData.length === 0) {
        throw new Error("No coupon data found for the given user.");
      }
      const { refCustId, refFName, refUserEmail, refOffersName, refCoupon } =
        getData[0];

      const main = async () => {
        const adminMail = {
          to: refUserEmail,
          subject: "🎉 Coupon Successfully Applied – Explore Vacation",
          html: `   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #2b6cb0;">Hello ${refFName || "User"},</h2>
      <p style="font-size: 16px; color: #333;">
        Great news! Your coupon code 
        <strong style="color: #d9534f;">${refCoupon}</strong> 
        has been successfully applied.
      </p>

      <p style="font-size: 16px; color: #333;">
        Use this code during checkout to enjoy your exclusive offer:
        <strong style="color: #5cb85c;">${refOffersName}</strong>
      </p>

      <div style="margin-top: 20px; font-size: 15px; line-height: 1.6; color: #555;">
        <p><strong>Customer ID:</strong> ${refCustId}</p>
        <p><strong>Offer Name:</strong> ${refOffersName}</p>
        <p><strong>Coupon Code:</strong> ${refCoupon}</p>
      </div>

      <br/>
      <p style="font-size: 16px; color: #333;">Thank you for choosing <strong>Explore Vacation</strong>! We hope you have a wonderful experience.</p>

      <p style="font-size: 14px; color: #999;">If you have any questions, feel free to reply to this email.</p>
    </div> 
    `,
        };

        try {
          sendEmail(adminMail);
        } catch (error) {
          console.log("Error in sending the Mail for Admin", error);
        }
      };
      main().catch(console.error);

      return encrypt(
        {
          success: true,
          message: "coupon applied successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in coupon applied", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred coupon applied",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
}
