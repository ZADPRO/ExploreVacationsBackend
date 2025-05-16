import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
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
import { CurrentTime } from "../../helper/common";

import { cli } from "winston/lib/winston/config";
import { updateHistoryQuery } from "./query";

export class newCarsRepository {
// public async addVehicleV1(userData: any, tokendata: any): Promise<any> {
//     const client: PoolClient = await getClient();
//     const token = { id: tokendata.id };
//     const tokens = generateTokenWithExpire(token, true);
//     try {
//       await client.query("BEGIN");
//       const { refVehicleTypeName } = userData;

//       const check: any = await executeQuery(checkVehicleTypeNameQuery, [
//         refVehicleTypeName,
//       ]);

//       const count = Number(check[0]?.count || 0); // safely convert to number

//       if (count > 0) {
//         throw new Error(
//           `Duplicate VehicleType Name found: "${refVehicleTypeName}" already exists.`
//         );
//       }

//       const vehicleResult = await client.query(addVehicleQuery, [
//         refVehicleTypeName,
//         CurrentTime(),
//         tokendata.id,
//       ]);

//       const history = [
//         12,
//         tokendata.id,
//         `${refVehicleTypeName} vehicle added successfully`,
//         CurrentTime(),
//         tokendata.id,
//       ];

//       const updateHistory = await client.query(updateHistoryQuery, history);
//       await client.query("COMMIT");
//       return encrypt(
//         {
//           success: true,
//           message: "vehicle added successfully",
//           data: vehicleResult,
//           token: tokens,
//         },
//         true
//       );
//     } catch (error: unknown) {
//       await client.query("ROLLBACK");
//       return encrypt(
//         {
//           success: false,
//           message: "An unknown error occurred during vehicle addition",
//           token: tokens,
//           error: String(error),
//         },
//         true
//       );
//     } finally {
//       client.release();
//     }
//   }
}
