import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { encrypt } from "../../helper/encrypt";
import { generateTokenWithExpire } from "../../helper/token";
import { CurrentTime } from "../../helper/common";
import { storeFile, viewFile } from "../../helper/storage";
import path from "path";
import logger from "../../helper/logger";
import fs from "fs";

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
        true
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
         "specialPrice", "createdAt", "createdBy", "updatedAt", "updatedBy", "isDelete")
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$13,$14,false)
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
        data.car_badges,
        data.car_services,
        data.specialPrice ?? null, // NEW FIELD
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

      const cars = [];

      for (const car of result.rows) {
        let base64Image = "";

        try {
          const buffer = fs.readFileSync(car.car_image); // read file
          base64Image = `data:image/jpeg;base64,${buffer.toString("base64")}`;
        } catch (e) {
          console.log("Image read error:", e);
          base64Image = "";
        }

        cars.push({
          ...car,
          car_image_base64: base64Image,
        });
      }

      return encrypt(
        {
          success: true,
          message: "Cars fetched successfully",
          data: cars,
          token: token,
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
          "specialPrice"=$12,
          "updatedAt"=$13, "updatedBy"=$14
      WHERE id=$15 AND "isDelete" = false
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
        data.specialPrice ?? null, // NEW FIELD
        now,
        tokenData.id,
        id,
      ]);

      await client.query("COMMIT");

      if (result.rows.length === 0) {
        return encrypt({ success: false, message: "Car not found" }, true);
      }

      return encrypt(
        {
          success: true,
          message: "Car updated",
          data: result.rows[0],
          token: token,
        },
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
          token: token,
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
  public async addBadge(data: any, tokenData: any): Promise<any> {
    logger.info("[Badge] Add Request:", data);

    const client = await getClient();
    const token = generateTokenWithExpire(tokenData, true);

    try {
      await client.query("BEGIN");

      const query = `
      INSERT INTO "TransferCarBadges"
      ("badgeName", "badgeColorCode", "createdAt", "createdBy", "updatedAt", "updatedBy", "isDelete")
      VALUES ($1, $2, $3, $4, $3, $4, false)
      RETURNING *;
    `;

      const now = CurrentTime();

      const values = [data.badgeName, data.badgeColorCode, now, tokenData.id];

      const result = await client.query(query, values);

      await client.query("COMMIT");
      return encrypt(
        {
          success: true,
          message: "Badge added successfully",
          data: result.rows[0],
          token: token,
        },
        true
      );
    } catch (err: any) {
      await client.query("ROLLBACK");
      logger.error("Add Badge Error:", err);

      return encrypt(
        {
          success: false,
          message: "Error adding badge",
          error: String(err),
          token: token,
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // READ
  public async getBadges(tokenData: any): Promise<any> {
    logger.info("[Badge] Fetching all badges");

    const token = generateTokenWithExpire(tokenData, true);

    const query = `
    SELECT *
    FROM "TransferCarBadges"
    WHERE "isDelete" = false
    ORDER BY id DESC;
  `;

    const result = await executeQuery(query, []);

    return encrypt(
      {
        success: true,
        message: "Badges fetched successfully",
        data: result,
        token: token,
      },
      true
    );
  }

  // UPDATE
  public async updateBadge(
    id: number,
    data: any,
    tokenData: any
  ): Promise<any> {
    logger.info(`[Badge] Update ID=${id}`, data);

    const token = generateTokenWithExpire(tokenData, true);

    const query = `
    UPDATE "TransferCarBadges"
    SET "badgeName" = $1,
        "badgeColorCode" = $2,
        "updatedAt" = $3,
        "updatedBy" = $4
    WHERE id = $5 AND "isDelete" = false
    RETURNING *;
  `;

    const values = [
      data.badgeName,
      data.badgeColorCode,
      CurrentTime(),
      tokenData.id,
      id,
    ];

    try {
      const result = await executeQuery(query, values);

      if (result.length === 0) {
        return encrypt(
          { success: false, message: "Badge not found", token },
          true
        );
      }

      return encrypt(
        {
          success: true,
          message: "Badge updated successfully",
          data: result[0],
          token,
        },
        true
      );
    } catch (err: any) {
      logger.error("Update Badge Error:", err);

      return encrypt({ success: false, message: err.message, token }, true);
    }
  }

  // DELETE
  public async deleteBadge(id: number, tokenData: any): Promise<any> {
    logger.info(`[Badge] Delete ID=${id}`);

    const token = generateTokenWithExpire(tokenData, true);

    const query = `
    UPDATE "TransferCarBadges"
    SET "isDelete" = true,
        "updatedAt" = $1,
        "updatedBy" = $2
    WHERE id = $3
    RETURNING *;
  `;

    const values = [CurrentTime(), tokenData.id, id];

    try {
      const result = await executeQuery(query, values);

      if (!result.length) {
        return encrypt(
          { success: false, message: "Badge not found", token },
          true
        );
      }

      return encrypt(
        {
          success: true,
          message: "Badge deleted successfully",
          data: result[0],
          token,
        },
        true
      );
    } catch (err: any) {
      logger.error("Delete Badge Error:", err);

      return encrypt({ success: false, message: err.message, token }, true);
    }
  }

  public async getAvailableCars(data: any, tokenData: any): Promise<any> {
    const client = await getClient();
    const token = generateTokenWithExpire(tokenData, true);

    const { passengers, pickupDate, returnDate } = data;

    try {
      const now = CurrentTime();

      // 1️⃣ Get all cars that match passenger capacity
      const carQuery = `
      SELECT * FROM "TransferCars"
      WHERE "isDelete" = false
      AND CAST(passengers AS INTEGER) >= $1
      ORDER BY id DESC;
    `;

      const carsResult = await client.query(carQuery, [passengers]);
      const allCars = carsResult.rows;

      const availableCars: any[] = [];

      // 2️⃣ Loop each car → check if already booked
      for (const car of allCars) {
        const bookingQuery = `
        SELECT * FROM "TransferBookings"
        WHERE "isDelete" = false
        AND "carId" = $1
        AND (
            ($2 <= "returnFrom_lat"::text OR $2 <= "pickupDate")
            AND
            ($3 >= "pickupDate")
        );
      `;

        const bookingResult = await client.query(bookingQuery, [
          car.id,
          pickupDate,
          returnDate,
        ]);

        // If car has bookings → skip
        if (bookingResult.rows.length > 0) {
          continue;
        }

        // 3️⃣ Read car image as base64
        let base64Image = "";
        try {
          const buffer = fs.readFileSync(car.car_image);
          base64Image = `data:image/jpeg;base64,${buffer.toString("base64")}`;
        } catch (e) {
          base64Image = "";
        }

        availableCars.push({
          ...car,
          car_image_base64: base64Image,
        });
      }

      return encrypt(
        {
          success: true,
          message: "Available cars fetched successfully",
          data: availableCars,
          token: token,
        },
        true
      );
    } catch (err) {
      return encrypt(
        {
          success: false,
          message: "Error fetching available cars",
          error: String(err),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // CREATE BOOKING
  public async createBooking(data: any, userId: any) {
    const client = await getClient();

    try {
      const q = `
        INSERT INTO transferbookings (
          out_from_name, out_from_placeid, out_from_lat, out_from_lng, out_from_postalcode,
          out_to_name, out_to_placeid, out_to_lat, out_to_lng, out_to_postalcode,
          out_date, out_time, out_passengers, out_estimatedarrival, out_distance,

          return_from_name, return_from_placeid, return_from_lat, return_from_lng, return_from_postalcode,
          return_to_name, return_to_placeid, return_to_lat, return_to_lng, return_to_postalcode,
          return_date, return_time, return_passengers, return_estimatedarrival, return_distance,

          vehicle_id, vehicle_type, vehicle_brand, vehicle_capacity, vehicle_passengers,
          vehicle_luggage, vehicle_price, vehicle_image, vehicle_mileage, vehicle_badges, vehicle_services,

          extra_flightnumber, extra_childseat, extra_drivernotesoutward, extra_drivernotesreturn,

          passenger_firstname, passenger_lastname, passenger_email, passenger_mobile,
          passenger_emailnotifications, passenger_smsnotifications,

          createdat, createdby
        )
        VALUES (
          $1,$2,$3,$4,$5,
          $6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,

          $16,$17,$18,$19,$20,
          $21,$22,$23,$24,$25,
          $26,$27,$28,$29,$30,

          $31,$32,$33,$34,$35,
          $36,$37,$38,$39,$40,$41,

          $42,$43,$44,$45,

          $46,$47,$48,$49,$50,$51,

          NOW(), $52
        )
        RETURNING id;
      `;

      const params = [
        // OUTBOUND
        data.outbound.from.name,
        data.outbound.from.placeId,
        String(data.outbound.from.lat),
        String(data.outbound.from.lng),
        data.outbound.from.postalCode,

        data.outbound.to.name,
        data.outbound.to.placeId,
        String(data.outbound.to.lat),
        String(data.outbound.to.lng),
        data.outbound.to.postalCode,

        data.outbound.date,
        data.outbound.time,
        String(data.outbound.passengers),
        data.outbound.estimatedArrival,
        data.outbound.distance,

        // RETURN
        data.return?.from?.name || null,
        data.return?.from?.placeId || null,
        data.return?.from?.lat?.toString() || null,
        data.return?.from?.lng?.toString() || null,
        data.return?.from?.postalCode || null,

        data.return?.to?.name || null,
        data.return?.to?.placeId || null,
        data.return?.to?.lat?.toString() || null,
        data.return?.to?.lng?.toString() || null,
        data.return?.to?.postalCode || null,

        data.return?.date || null,
        data.return?.time || null,
        data.return?.passengers?.toString() || null,
        data.return?.estimatedArrival || null,
        data.return?.distance || null,

        // VEHICLE
        data.selectedVehicle.id,
        data.selectedVehicle.type,
        data.selectedVehicle.brand,
        data.selectedVehicle.capacity,
        String(data.selectedVehicle.passengers),

        String(data.selectedVehicle.luggage),
        String(data.selectedVehicle.price),
        data.selectedVehicle.image,
        data.selectedVehicle.mileage,
        data.selectedVehicle.badges,
        data.selectedVehicle.services,

        // EXTRAS
        data.extras.flightNumber,
        data.extras.childSeat,
        data.extras.driverNotesOutward,
        data.extras.driverNotesReturn,

        // PASSENGER
        data.passenger.firstName,
        data.passenger.lastName,
        data.passenger.email,
        data.passenger.mobile,
        data.passenger.emailNotifications,
        data.passenger.smsNotifications,

        // AUDIT
        userId,
      ];

      const result = await client.query(q, params);
      return { success: true, id: result.rows[0].id };
    } catch (err) {
      console.error("❌ Create Booking Error", err);
      throw err;
    } finally {
      client.release();
    }
  }

  // GET BOOKING BY ID
  public async getBookingById(id: any) {
    const client = await getClient();

    try {
      const q = `
        SELECT * FROM transferbookings
        WHERE id = $1 AND isdeleted = false;
      `;
      const result = await client.query(q, [id]);
      return { success: true, data: result.rows[0] || null };
    } finally {
      client.release();
    }
  }

  // GET ALL BOOKINGS
  public async getAllBookings() {
    const client = await getClient();

    try {
      const q = `
        SELECT * FROM transferbookings
        WHERE isdeleted = false
        ORDER BY id DESC;
      `;
      const result = await client.query(q);
      return { success: true, data: result.rows };
    } finally {
      client.release();
    }
  }

  // DELETE BOOKING (SOFT DELETE)
  public async deleteBooking(id: any, userId: any) {
    const client = await getClient();

    try {
      const q = `
        UPDATE transferbookings
        SET isdeleted = true,
            updatedat = NOW(),
            updatedby = $2
        WHERE id = $1;
      `;

      await client.query(q, [id, userId]);

      return { success: true, message: "Booking soft-deleted" };
    } finally {
      client.release();
    }
  }

  // ➕ CREATE DRIVER
  public async addDriver(data: any) {
    const client = await getClient();
    try {
      const now = CurrentTime();

      const query = `
        INSERT INTO "transferDrivers"
        (
          reffirstlastname, refdob, refnationality, refaddress, refphonewhatsapp,
          refemail, refdrivinglicensecategory, refdrivinglicensenumber,
          refdrivinglicenseexpirydate, refissuingcountry,
          refidpassportnumber, refidpassportexpirydate,
          refemploymenttype, refstartdate, refnotes,
          createdat, createdby, updatedat, updatedby
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
        RETURNING *;
      `;

      const params = [
        data.refFirstLastName,
        data.refDOB,
        data.refNationality,
        data.refAddress,
        data.refPhoneWhatsApp,
        data.refEmail,
        data.refDrivingLicenseCategory,
        data.refDrivingLicenseNumber,
        data.refDrivingLicenseExpiryDate,
        data.refIssuingCountry,
        data.refIDPassportNumber,
        data.refIDPassportExpiryDate,
        data.refEmploymentType,
        data.refStartDate,
        data.refNotes,
        now,
        data.createdBy || "system",
        now,
        data.createdBy || "system",
      ];

      const result = await client.query(query, params);

      return encrypt(
        {
          success: true,
          message: "Driver added successfully",
          data: result.rows[0],
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // 📥 GET DRIVERS
  public async getDrivers() {
    const client = await getClient();
    try {
      const query = `SELECT * FROM "transferDrivers" WHERE isdeleted = false ORDER BY id DESC`;
      const result = await client.query(query);

      return encrypt(
        {
          success: true,
          data: result.rows,
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // ✏ UPDATE DRIVER
  public async updateDriver(id: string, data: any) {
    const client = await getClient();
    try {
      const now = CurrentTime();

      const query = `
        UPDATE "transferDrivers"
        SET
          reffirstlastname=$1, refdob=$2, refnationality=$3, refaddress=$4,
          refphonewhatsapp=$5, refemail=$6, refdrivinglicensecategory=$7,
          refdrivinglicensenumber=$8, refdrivinglicenseexpirydate=$9,
          refissuingcountry=$10, refidpassportnumber=$11,
          refidpassportexpirydate=$12, refemploymenttype=$13, refstartdate=$14,
          refnotes=$15, updatedat=$16, updatedby=$17
        WHERE id=$18
        RETURNING *;
      `;

      const params = [
        data.refFirstLastName,
        data.refDOB,
        data.refNationality,
        data.refAddress,
        data.refPhoneWhatsApp,
        data.refEmail,
        data.refDrivingLicenseCategory,
        data.refDrivingLicenseNumber,
        data.refDrivingLicenseExpiryDate,
        data.refIssuingCountry,
        data.refIDPassportNumber,
        data.refIDPassportExpiryDate,
        data.refEmploymentType,
        data.refStartDate,
        data.refNotes,
        now,
        data.updatedBy || "system",
        id,
      ];

      const result = await client.query(query, params);

      return encrypt(
        {
          success: true,
          message: "Driver updated successfully",
          data: result.rows[0],
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // ❌ DELETE DRIVER
  public async deleteDriver(id: string) {
    const client = await getClient();
    try {
      const query = `
        UPDATE "transferDrivers"
        SET isdeleted = true
        WHERE id = $1
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      return encrypt(
        {
          success: true,
          message: "Driver deleted successfully",
          data: result.rows[0],
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async allocateDriver(data: any, tokenData: any) {
    const client = await getClient();
    const token = generateTokenWithExpire(tokenData, true);

    const { transferId, driverId } = data;
    const now = CurrentTime();

    try {
      const query = `
      INSERT INTO "TransferDriverMap"
        (transfer_id, driver_id, status, created_at, updated_at)
      VALUES ($1, $2, 'ACTIVE', $3, $3)
      RETURNING *;
    `;

      const result = await client.query(query, [transferId, driverId, now]);

      return encrypt(
        {
          success: true,
          message: "Driver allocated successfully",
          data: result.rows[0],
          token: token,
        },
        true
      );
    } catch (err) {
      return encrypt(
        {
          success: false,
          message: "Error allocating driver",
          error: String(err),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async getBookingsWithDriver(tokenData: any) {
    const client = await getClient();
    const token = generateTokenWithExpire(tokenData, true);

    try {
      const query = `
      SELECT 
        tb.*, 

        td.id AS driver_id,
        td.reffirstlastname AS driver_name,
        td.refphonewhatsapp AS driver_phone,
        td.refemail AS driver_email,
        td.refdrivinglicensecategory AS driver_license_category,

        tdm.id AS map_id,
        tdm.status AS map_status,
        tdm.created_at AS map_created_at,
        tdm.updated_at AS map_updated_at

      FROM transferbookings tb

      LEFT JOIN "TransferDriverMap" tdm
        ON tb.id = tdm.transfer_id

      LEFT JOIN "transferDrivers" td
        ON tdm.driver_id = td.id

      WHERE tb.isdeleted = false

      ORDER BY tb.id DESC;
    `;

      const result = await client.query(query);

      return encrypt(
        {
          success: true,
          message: "Bookings with driver data fetched successfully",
          data: result.rows,
          token: token,
        },
        true
      );
    } catch (err) {
      return encrypt(
        {
          success: false,
          message: "Error fetching bookings with drivers",
          error: String(err),
        },
        true
      );
    } finally {
      client.release();
    }
  }
}
