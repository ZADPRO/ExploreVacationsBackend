import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { encrypt } from "../../helper/encrypt";
import { generateTokenWithExpire } from "../../helper/token";
import { CurrentTime } from "../../helper/common";
import { storeFile, viewFile } from "../../helper/storage";
import path from "path";

export class transferRepository {
  // CREATE
  public async addCarServices(userData: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id, roleId: tokenData.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { carService } = userData;

      const insertQuery = `
        INSERT INTO "TransferCarServices"
          ("carService", "createdAt", "createdBy", "updatedAt", "updatedBy", "isDelete")
        VALUES ($1, $2, $3, $2, $3, $4)
        RETURNING *;
      `;

      const now = CurrentTime();
      const isDelete = false;

      const result = await client.query(insertQuery, [
        carService,
        now,
        tokenData.id, // createdBy & updatedBy = user id
        isDelete,
      ]);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Service added successfully",
          data: result.rows[0],
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during service addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // READ - get all non-deleted services
  public async getCarServices(tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id, roleId: tokenData.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const selectQuery = `
        SELECT id, "carService", "createdAt", "createdBy", "updatedAt", "updatedBy", "isDelete"
        FROM "TransferCarServices"
        WHERE "isDelete" = false
        ORDER BY id DESC;
      `;

      const result = await client.query(selectQuery);

      return encrypt(
        {
          success: true,
          message: "Services fetched successfully",
          data: result.rows,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred while fetching services",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // UPDATE
  public async updateCarService(
    serviceId: number,
    userData: any,
    tokenData: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id, roleId: tokenData.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { carService } = userData;

      const updateQuery = `
        UPDATE "TransferCarServices"
        SET "carService" = $1,
            "updatedAt" = $2,
            "updatedBy" = $3
        WHERE id = $4 AND "isDelete" = false
        RETURNING *;
      `;

      const now = CurrentTime();

      const result = await client.query(updateQuery, [
        carService,
        now,
        tokenData.id,
        serviceId,
      ]);

      await client.query("COMMIT");

      if (result.rows.length === 0) {
        return encrypt(
          {
            success: false,
            message: "Service not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      return encrypt(
        {
          success: true,
          message: "Service updated successfully",
          data: result.rows[0],
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during service update",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // DELETE (soft delete: isDelete = true)
  public async deleteCarService(
    serviceId: number,
    tokenData: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokenData.id, roleId: tokenData.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const now = CurrentTime();

      const deleteQuery = `
        UPDATE "TransferCarServices"
        SET "isDelete" = true,
            "updatedAt" = $1,
            "updatedBy" = $2
        WHERE id = $3 AND "isDelete" = false
        RETURNING *;
      `;

      const result = await client.query(deleteQuery, [
        now,
        tokenData.id,
        serviceId,
      ]);

      await client.query("COMMIT");

      if (result.rows.length === 0) {
        return encrypt(
          {
            success: false,
            message: "Service not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      return encrypt(
        {
          success: true,
          message: "Service deleted successfully",
          data: result.rows[0],
          token: tokens,
        },
        false
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during service deletion",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // UPLOAD IMAGE SERVICE
  public async uploadImagesV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const image = userData.images;

      if (!image) {
        throw new Error("Please provide an image.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      filePath = await storeFile(image, 7);
      const imageBuffer = await viewFile(filePath);
      const imageBase64 = imageBuffer.toString("base64");

      storedFiles.push({
        filename: path.basename(filePath),
        content: imageBase64,
        contentType: "image/jpg",
      });

      return encrypt(
        {
          success: true,
          message: "Image Stored Successfully",
          token: tokens,
          filePath: filePath,
          files: storedFiles,
        },
        false
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

  // CREATE CAR
  public async addCar(data: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = generateTokenWithExpire(tokenData, true);

    try {
      await client.query("BEGIN");

      const now = CurrentTime();

      const insertQuery = `
        INSERT INTO "TransferCars"
          (car_name, car_brand, car_image, price, passengers, luggage,
           manufacturer_year, mileage, description, car_badges, car_services,
           "createdAt", "createdBy", "updatedAt", "updatedBy", "isDelete")
        VALUES
          ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$12,$13,false)
        RETURNING *;
      `;

      const result = await client.query(insertQuery, [
        data.car_name,
        data.car_brand,
        data.car_image,
        data.price,
        data.passengers,
        data.luggage,
        data.manufacturer_year,
        data.mileage,
        data.description,
        data.car_badges, // comma-separated text from frontend
        data.car_services, // comma-separated text from frontend
        now,
        tokenData.id,
      ]);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Car added successfully",
          data: result.rows[0],
          token: token,
        },
        true
      );
    } catch (err) {
      await client.query("ROLLBACK");
      return encrypt(
        { success: false, message: "Error adding car", error: String(err) },
        true
      );
    } finally {
      client.release();
    }
  }

  // READ
  public async getCars(tokenData: any): Promise<any> {
    const client = await getClient();
    const token = generateTokenWithExpire(tokenData, true);

    try {
      const query = `
        SELECT * FROM "TransferCars"
        WHERE "isDelete" = false
        ORDER BY id DESC;
      `;

      const result = await client.query(query);
      console.log("\n\n\nresult", result.rows);

      return encrypt(
        {
          success: true,
          message: "Cars fetched successfully",
          data: result.rows,
        },
        true
      );
    } catch (err) {
      return encrypt(
        { success: false, message: "Error fetching cars", error: String(err) },
        true
      );
    } finally {
      client.release();
    }
  }

  // UPDATE
  public async updateCar(id: number, data: any, tokenData: any): Promise<any> {
    const client = await getClient();
    const token = generateTokenWithExpire(tokenData, true);

    try {
      await client.query("BEGIN");

      const now = CurrentTime();

      const updateQuery = `
        UPDATE "TransferCars"
        SET car_name=$1, car_brand=$2, car_image=$3, price=$4,
            passengers=$5, luggage=$6, manufacturer_year=$7, mileage=$8,
            description=$9, car_badges=$10, car_services=$11,
            "updatedAt"=$12, "updatedBy"=$13
        WHERE id=$14 AND "isDelete" = false
        RETURNING *;
      `;

      const result = await client.query(updateQuery, [
        data.car_name,
        data.car_brand,
        data.car_image,
        data.price,
        data.passengers,
        data.luggage,
        data.manufacturer_year,
        data.mileage,
        data.description,
        data.car_badges,
        data.car_services,
        now,
        tokenData.id,
        id,
      ]);

      await client.query("COMMIT");

      if (result.rows.length === 0) {
        return encrypt({ success: false, message: "Car not found" }, true);
      }

      return encrypt(
        { success: true, message: "Car updated", data: result.rows[0] },
        true
      );
    } catch (err) {
      await client.query("ROLLBACK");
      return encrypt(
        { success: false, message: "Error updating car", error: String(err) },
        true
      );
    } finally {
      client.release();
    }
  }

  // DELETE
  public async deleteCar(id: number, tokenData: any): Promise<any> {
    const client = await getClient();
    const token = generateTokenWithExpire(tokenData, true);

    try {
      await client.query("BEGIN");

      const now = CurrentTime();

      const deleteQuery = `
        UPDATE "TransferCars"
        SET "isDelete" = true,
            "updatedAt" = $1,
            "updatedBy" = $2
        WHERE id = $3 AND "isDelete" = false
        RETURNING *;
      `;

      const result = await client.query(deleteQuery, [now, tokenData.id, id]);

      await client.query("COMMIT");

      if (result.rows.length === 0) {
        return encrypt(
          { success: false, message: "Car not found or already deleted" },
          true
        );
      }

      return encrypt(
        {
          success: true,
          message: "Car deleted successfully",
          data: result.rows[0],
        },
        true
      );
    } catch (err) {
      await client.query("ROLLBACK");
      return encrypt(
        { success: false, message: "Error deleting car", error: String(err) },
        true
      );
    } finally {
      client.release();
    }
  }

  // CAR BADGES
  public async addBadge(data: any, user: any): Promise<any> {
    const client = await getClient();
    const tokens = generateTokenWithExpire({ id: user.id }, true);

    try {
      await client.query("BEGIN");

      const query = `
        INSERT INTO "TransferCarBadges" 
        ("badgeName", "badgeColorCode", "createdAt", "createdBy", "isDelete")
        VALUES ($1, $2, $3, $4, false)
        RETURNING *;
      `;

      const values = [
        data.badgeName,
        data.badgeColorCode,
        CurrentTime(),
        user.id,
      ];

      const result = await client.query(query, values);

      await client.query("COMMIT");
      return encrypt(
        { success: true, data: result.rows[0], token: tokens },
        true
      );
    } catch (err: any) {
      await client.query("ROLLBACK");
      return encrypt(
        { success: false, message: err.message, token: tokens },
        false
      );
    } finally {
      client.release();
    }
  }

  // READ
  public async getBadges(): Promise<any> {
    const query = `SELECT * FROM "TransferCarBadges" WHERE "isDelete" = false ORDER BY id DESC`;
    const result = await executeQuery(query, []);
    return { success: true, data: result };
  }

  // UPDATE
  public async updateBadge(id: number, data: any, user: any): Promise<any> {
    const query = `
      UPDATE "TransferCarBadges"
      SET 
        "badgeName" = $1,
        "badgeColorCode" = $2,
        "updatedAt" = $3,
        "updatedBy" = $4
      WHERE id = $5
      RETURNING *;
    `;

    const values = [
      data.badgeName,
      data.badgeColorCode,
      CurrentTime(),
      user.id,
      id,
    ];

    const result = await executeQuery(query, values);
    return { success: true, data: result[0] };
  }

  // DELETE (soft delete)
  public async deleteBadge(id: number, user: any): Promise<any> {
    const query = `
      UPDATE "TransferCarBadges"
      SET "isDelete" = true,
          "updatedAt" = $1,
          "updatedBy" = $2
      WHERE id = $3
      RETURNING *;
    `;

    const values = [CurrentTime(), user.id, id];
    const result = await executeQuery(query, values);

    return {
      success: true,
      message: "Badge deleted successfully",
      data: result[0],
    };
  }
}
