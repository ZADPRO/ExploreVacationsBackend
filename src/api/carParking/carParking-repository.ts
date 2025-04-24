import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import {
  storeFile,
  viewFile,
  convertToBase64,
  storetheFile,
} from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import fs from "fs";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { CurrentTime } from "../../helper/common";
import {
  addParkingQuery,
  addServiceFeaturesQuery,
  checkduplicateQuery,
  checkServiceFeaturesQuery,
  deleteCarParkingQuery,
  deleteParkingImageRecordQuery,
  deleteServiceFeaturesQuery,
  getCarParkingIdQuery,
  getCarParkingQuery,
  getCarParkingTypeQuery,
  getdeletedFeatureQuery,
  getParkingImageRecordQuery,
  listCarParkingByIdQuery,
  listCarParkingQuery,
  listCarParkingTypeQuery,
  listServiceFeaturesQuery,
  updateCarParkingQuery,
  updateHistoryQuery,
  updateServiceFeaturesQuery,
} from "./query";

export class carParkingRepository {
  public async addCarParkingV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    // const refuserId = tokendata.id;
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN"); // Start transaction

      const {
        refParkingTypeId,
        refParkingName,
        refAssociatedAirport,
        refLocation,
        refAvailability,
        refOperatingHours,
        refBookingType,
        pricePerHourORday,
        refPrice,
        refWeeklyDiscount,
        refExtraCharges,
        MinimumBookingDuration,
        MaximumBookingDuration,
        isCancellationAllowed,
        isRescheduleAllowed,
        instructions,
        description,
        parkingSlotImage,
        refStatus,
        refCarParkingTypeId,
      } = userData;

      const ServiceFeatures = Array.isArray(userData.ServiceFeatures)
        ? `{${userData.ServiceFeatures.join(",")}}`
        : `{${userData.ServiceFeatures.split(",").join(",")}}`;
const customerPrefix = "EV-PAR-";
      const baseNumber = 0;

      const lastCustomerResult = await client.query(getCarParkingIdQuery);
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
      const parkingResult = await client.query(addParkingQuery, [
        refParkingTypeId,
        refParkingName,
        refAssociatedAirport,
        refLocation,
        refAvailability,
        refOperatingHours,
        refBookingType,
        pricePerHourORday,
        refPrice,
        refWeeklyDiscount,
        refExtraCharges,
        MinimumBookingDuration,
        MaximumBookingDuration,
        isCancellationAllowed,
        isRescheduleAllowed,
        ServiceFeatures,
        instructions,
        description,
        parkingSlotImage,
        refStatus,
        refCarParkingTypeId,
        newCustomerId,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        53,
        tokendata.id,
        `${refParkingName} car parking Added`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "car parking added successfully",
          token: tokens,
          parkingResult: parkingResult.rows[0],
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback transaction in case of failure
      console.error("Error adding car parking:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while adding the car parking",
          tokens: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async uploadParkingImageV1(
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
      filePath = await storeFile(image, 7);

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
  public async deleteParkingImageV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // let filePath: string | any;

      if (userData.refCarParkingId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getParkingImageRecordQuery, [
          userData.refCarParkingId,
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
      }
      // filePath = imageRecord[0].refImagePath;

      // Delete the image record from the database
      await executeQuery(deleteParkingImageRecordQuery, [
        userData.refCarParkingId,
      ]);
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
  public async updateCarParkingV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const {
        refCarParkingId,
        refParkingTypeId,
        refParkingName,
        refAssociatedAirport,
        refLocation,
        refAvailability,
        refOperatingHours,
        refBookingType,
        pricePerHourORday,
        refPrice,
        refWeeklyDiscount,
        refExtraCharges,
        MinimumBookingDuration,
        MaximumBookingDuration,
        isCancellationAllowed,
        isRescheduleAllowed,
        instructions,
        description,
        parkingSlotImage,
        refStatus,
        refCarParkingTypeId,
      } = userData;

      const ServiceFeatures = `{${userData.ServiceFeatures.join(",")}}`;
      console.log("ServiceFeatures", ServiceFeatures);

      const existingDatas = await client.query(listCarParkingByIdQuery, [
        refCarParkingId,
      ]);
      console.log("existingDatas", existingDatas);

      const existingData = existingDatas.rows[0];

      if (!existingData)
        throw new Error(`car parking with ID ${refCarParkingId} not found`);

      const changes: string[] = [];

      if (existingData.refParkingType !== refParkingTypeId)
        changes.push(
          `ParkingType: '${existingData.refParkingType}' : '${refParkingTypeId}'`
        );

      if (existingData.refParkingName !== refParkingName)
        changes.push(
          `ParkingName: '${existingData.refParkingName}' : '${refParkingName}'`
        );

      if (existingData.refAssociatedAirport !== refAssociatedAirport)
        changes.push(
          `AssociatedAirport: '${existingData.refAssociatedAirport}' : '${refAssociatedAirport}'`
        );

      if (existingData.refLocation !== refLocation)
        changes.push(
          `Location: '${existingData.refLocation}' : '${refLocation}'`
        );

      if (existingData.refAvailability !== refAvailability)
        changes.push(
          `Availability: '${existingData.refAvailability}' : '${refAvailability}'`
        );

      if (existingData.refOperatingHours !== refOperatingHours)
        changes.push(
          `OperatingHours: '${existingData.refOperatingHours}' : '${refOperatingHours}'`
        );

      if (existingData.refBookingType !== refBookingType)
        changes.push(
          `BookingType: '${existingData.refBookingType}' : '${refBookingType}'`
        );

      if (existingData.pricePerHourORday !== pricePerHourORday)
        changes.push(
          `pricePerHourORday: '${existingData.pricePerHourORday}' : '${pricePerHourORday}'`
        );

      if (existingData.refPrice !== refPrice)
        changes.push(`Price: '${existingData.refPrice}' : '${refPrice}'`);

      if (existingData.refWeeklyDiscount !== refWeeklyDiscount)
        changes.push(
          `WeeklyDiscount: '${existingData.refWeeklyDiscount}' : '${refWeeklyDiscount}'`
        );

      if (existingData.refExtraCharges !== refExtraCharges)
        changes.push(
          `ExtraCharges: '${existingData.refExtraCharges}' : '${refExtraCharges}'`
        );

      if (existingData.MinimumBookingDuration !== MinimumBookingDuration)
        changes.push(
          `MinimumBookingDuration: '${existingData.MinimumBookingDuration}' : '${MinimumBookingDuration}'`
        );

      if (existingData.MaximumBookingDuration !== MaximumBookingDuration)
        changes.push(
          `MaximumBookingDuration: '${existingData.MaximumBookingDuration}' : '${MaximumBookingDuration}'`
        );

      if (existingData.isCancellationAllowed !== isCancellationAllowed)
        changes.push(
          `isCancellationAllowed: '${existingData.isCancellationAllowed}' : '${isCancellationAllowed}'`
        );

      if (existingData.isRescheduleAllowed !== isRescheduleAllowed)
        changes.push(
          `isRescheduleAllowed: '${existingData.isRescheduleAllowed}' : '${isCancellationAllowed}'`
        );

      if (existingData.instructions !== instructions)
        changes.push(
          `Instructions: '${existingData.instructions}' : '${instructions}'`
        );

      if (existingData.description !== description)
        changes.push(
          `Description: '${existingData.description}' : '${description}'`
        );
      if (existingData.parkingSlotImage !== parkingSlotImage)
        changes.push(`parkingSlot Image changed`);

      if (existingData.refStatus !== refStatus)
        changes.push(`Status: '${existingData.refStatus}' : '${refStatus}'`);

      const changeSummary = changes.length
        ? `Updated Fields: ${changes.join(", ")}`
        : "No changes detected";

      const params = [
        refCarParkingId,
        refParkingTypeId,
        refParkingName,
        refAssociatedAirport,
        refLocation,
        refAvailability,
        refOperatingHours,
        refBookingType,
        pricePerHourORday,
        refPrice,
        refWeeklyDiscount,
        refExtraCharges,
        MinimumBookingDuration,
        MaximumBookingDuration,
        isCancellationAllowed,
        isRescheduleAllowed,
        ServiceFeatures,
        instructions,
        description,
        parkingSlotImage,
        refStatus,
        refCarParkingTypeId,
        CurrentTime(),
        tokendata.id,
      ];

      const updateResult = await client.query(updateCarParkingQuery, params);

      // Log history of the action
      const history = [
        56,
        tokendata.id,
        changeSummary,
        CurrentTime(),
        tokendata.id,
      ];
      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Car updated successfully",
          token: tokens,
          carParkingResult: updateResult,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback transaction in case of failure
      console.error("Error updating car Parking:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while updating the car Parking",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listCarParkingV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listCarParkingQuery);
      return encrypt(
        {
          success: true,
          message: "list car parking successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during car parking",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getCarParkingV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { refCarParkingId } = userData;
      const result = await executeQuery(getCarParkingQuery, [refCarParkingId]);

      // for (const image of result) {
      //   if (image.parkingSlotImage) {
      //     try {
      //       const fileBuffer = await viewFile(image.parkingSlotImage);
      //       image.parkingSlotImage = {
      //         filename: path.basename(image.parkingSlotImage),
      //         content: fileBuffer.toString("base64"),
      //         contentType: "image/jpeg",
      //       };
      //     } catch (error) {
      //       console.error("Error reading image file for product ,err");
      //       image.parkingSlotImage = null;
      //     }
      //   }
      // }

      for (const image of result) {
        if (image.parkingSlotImage) {
          try {
            image.parkingSlotImage = path.basename(image.parkingSlotImage);
          } catch (error) {
            console.error(
              "Error extracting filename from parkingSlotImage:",
              error
            );
            image.parkingSlotImage = null;
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "list car parking successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during car parking",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteCarParkingV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction
      const { refCarParkingId } = userData;
      const result = await client.query(deleteCarParkingQuery, [
        refCarParkingId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rows.length === 0) {
        throw new Error(`No record found to delete with ID ${refCarParkingId}`);
      }

      const deletedData: any = result.rows[0];
      const refParkingName = deletedData.refParkingName;

      const history = [
        57, // Unique ID for delete action
        tokendata.id,
        `${refParkingName} Parking deleted Successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "car deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting car:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Vehicle",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async getCarParkingTypeV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result1 = await executeQuery(getCarParkingTypeQuery);
      console.log('result1', result1)
      // const result2 = await executeQuery(listCarParkingTypeQuery);

      return encrypt(
        {
          success: true,
          message: "list CarParkingType successfully",
          token: tokens,
          vehicleType: result1,
          // parkingType: result2
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during get CarParkingType",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async addServiceFeaturesV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { ServiceFeatures } = userData;

      if (!Array.isArray(ServiceFeatures) || ServiceFeatures.length === 0) {
        return encrypt(
          {
            success: false,
            message: "No Service Features provided",
            token: tokens,
          },
          true
        );
      }

      const duplicateCheck: any = await client.query(checkduplicateQuery, [
        ServiceFeatures,
      ]);

      const count = Number(duplicateCheck[0]?.count || 0); // safely convert to number

      if (count > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: `ServiceFeatures "${ServiceFeatures}" already exists `,
            token: tokens,
          },
          true
        );
      }

      const resultArray = [];

      for (const feature of ServiceFeatures) {
        const { Feature } = feature;
        if (!Feature) continue;

        const result = await client.query(addServiceFeaturesQuery, [
          Feature,
          CurrentTime(),
          tokendata.id,
        ]);

        resultArray.push(result);
      }

      const historyDescription = `Added Service Features: ${ServiceFeatures.map(
        (item: any) => item.Feature
      ).join(", ")}`;

      const history = [
        54, // module_id or feature_id — adjust as needed
        tokendata.id, // performed_by
        historyDescription,
        CurrentTime(), // timestamp
        tokendata.id, // created_by
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Service Features added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An error occurred during Service Features addition",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateServiceFeaturesV1(
    userData: any,
    tokenData: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const { refServiceFeaturesId, refServiceFeatures } = userData;

      const checkResult = await executeQuery(checkServiceFeaturesQuery, [
        refServiceFeaturesId,
      ]);

      if (checkResult[0]?.count == 0) {
        return encrypt(
          {
            success: false,
            message: "ServiceFeatures ID not found",
            token: tokens,
          },
          true
        );
      }
      const duplicateCheck: any = await client.query(checkduplicateQuery, [
        refServiceFeatures,
      ]);

      const count = Number(duplicateCheck[0]?.count || 0); // safely convert to number

      if (count > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: `ServiceFeatures "${refServiceFeatures}" already exists `,
            token: tokens,
          },
          true
        );
      }
      const params = [
        refServiceFeaturesId,
        refServiceFeatures,
        CurrentTime(),
        tokenData.id,
      ];

      const updateResult = await client.query(
        updateServiceFeaturesQuery,
        params
      );

      const history = [
        55,
        tokenData.id,
        `${refServiceFeatures} updated succesfully`,
        CurrentTime(),
        tokenData.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      console.log("updateHistory", updateHistory);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "service feature updated successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error during service feature update:", error);

      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "service feature update failed",
          error: errorMessage,
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listServiceFeaturesV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const result = await executeQuery(listServiceFeaturesQuery);
      return encrypt(
        {
          success: true,
          message: "list service feature successfully",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error: unknown) {
      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during service feature",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteServiceFeaturesV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN"); // Start transaction

      const { refServiceFeaturesId } = userData;

      const result = await client.query(deleteServiceFeaturesQuery, [
        refServiceFeaturesId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Service Feature not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      const getdeletedFeature: any = await client.query(
        getdeletedFeatureQuery,
        [refServiceFeaturesId]
      );

      // Insert delete action into history
      const history = [
        31,
        tokendata.id,
        `${getdeletedFeature} Feature deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Feature deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Feature:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Feature",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
}
