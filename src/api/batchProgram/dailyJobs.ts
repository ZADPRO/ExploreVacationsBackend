
import cron from "node-cron";
import { CurrentTime } from "../../helper/common";
import { userRepository } from "../user/user-repository";

export const startCronJobs = () => {
    cron.schedule("0 9 * * *", async () => {
        console.log("Running daily batch job at 9:00 AM", CurrentTime());
    
    try {
      const batchRepo1 = new userRepository();
      await batchRepo1.tourBookingV1();
      const batchRepo2 = new userRepository();
      await batchRepo2.customizeBookingV1();
      const batchRepo3 = new userRepository();
      await batchRepo3.userCarBookingV1();
      const batchRepo4 = new userRepository();
      await batchRepo4.carParkingBookingV1();
      console.log("Daily batch job completed successfully", CurrentTime());
    } catch (error) {
      console.error("Error in daily batch job:", error, CurrentTime());
    }
  });
};

// import cron from "node-cron";
// import { userRepository } from "../user/user-repository";
// import { CurrentTime } from "../../helper/common";
// import { sendTourRemainder } from "../../helper/mailcontent";
// import { sendEmail } from "../../helper/mail";

// export const startCronJobs = () => {
//   cron.schedule("0 9 * * *", async () => {
//     console.log("Running 9 AM tour reminder cron job -", CurrentTime());

//     try {
//       const userRepo = new userRepository();
//       const upcomingTours = await userRepo.getTomorrowTours(); // Implement this

//       for (const tour of upcomingTours) {
//         const daysLeft = 1;
//         const userMailData = {
//           daysLeft: daysLeft,
//           refPickupDate: tour.refPickupDate,
//           refUserName: tour.refUserName,
//           refPackageName: tour.refPackageName,
//           refTourCustID: tour.refTourCustID,
//         };

//         const reminderMail = {
//           to: tour.refUserMail,
//           subject: "📅 Tour Reminder – Explore Vacations",
//           html: sendTourRemainder(userMailData),
//         };

//         await sendEmail(reminderMail);
//         console.log("Reminder sent to:", tour.refUserMail);
//       }
//     } catch (error) {
//       console.error("Error sending tour reminders:", error);
//     }
//   });
// };
