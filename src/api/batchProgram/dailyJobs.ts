
import cron from "node-cron";
import { CurrentTime } from "../../helper/common";
import { userRepository } from "../user/user-repository";
import { BatchRepository } from "../batch/batch-repository";

// export const startCronJobs = () => {
//     // cron.schedule("0 9 * * *", async () => {
//     //     console.log("Running daily batch job at 9:00 AM", CurrentTime());
//       cron.schedule("20 11 * * *", async () => {
//     console.log("Running daily batch job at 11:20 AM", CurrentTime());

//     try {
//       const batchRepo1 = new userRepository();
//       await batchRepo1.tourBookingV1();
//       const batchRepo2 = new userRepository();
//       await batchRepo2.customizeBookingV1();
//       const batchRepo3 = new userRepository();
//       await batchRepo3.userCarBookingV1();
//       const batchRepo4 = new userRepository();
//       await batchRepo4.carParkingBookingV1();
//       console.log("Daily batch job completed successfully", CurrentTime());
//     } catch (error) {
//       console.error("Error in daily batch job:", error, CurrentTime());
//     }
//   });
// };

export const startCronJobs = () => {
    cron.schedule("0 9 * * *", async () => {
        console.log("Running daily batch job at 9:00 AM", CurrentTime());
    //   cron.schedule("20 11 * * *", async () => {
    // console.log("Running daily batch job at 11:20 AM", CurrentTime());

    try {
      const batchRepo1 = new BatchRepository();
      await batchRepo1.sendTourRemV1([]);
      const batchRepo2 = new BatchRepository();
      await batchRepo2.sendCustomizeTourRemV1([]);
      const batchRepo3 = new BatchRepository();
      await batchRepo3.sendCarRemV1([]);
      const batchRepo4 = new BatchRepository();
      await batchRepo4.sendParkingRemV1([]);
      console.log("Daily batch job completed successfully", CurrentTime());
    } catch (error) {
      console.error("Error in daily batch job:", error, CurrentTime());
    }
  });
};
