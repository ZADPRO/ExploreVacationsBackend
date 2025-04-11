import nodemailer from "nodemailer";
import cron from "node-cron";
import { getClient } from "./db";
import { CurrentTime } from "./common";
import { generateReminderEmailContent } from "./mailcontent";

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILID,
    pass: process.env.PASSWORD,
  },
});

/**
 * Sends an email using Nodemailer.
 * @param {MailOptions} mailOptions - Options for the email.
 */
export const sendEmail = async (mailOptions: MailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAILID, // Sender address
      ...mailOptions,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// import nodemailer from "nodemailer";

// interface MailOptions {
//   to: string;
//   subject: string;
//   text?: string;
//   html?: string;
// }

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAILID,
//     pass: process.env.PASSWORD,
//   },
// });

// /**
//  * Sends an email using Nodemailer.
//  * @param {MailOptions} mailOptions - Options for the email.
//  */
// export const sendEmail = async (mailOptions: MailOptions): Promise<void> => {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAILID, // Sender address
//       ...mailOptions,
//     });
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };



// File: tourReminderBatch.ts



// export const sendTourReminders = async () => {
//   const client = await getClient();
//   try {
//     const result = await client.query(`
//     SELECT
//   "refUserMail",
//   "refUserName",
//   "refPackageId",
//   "refPickupDate"
// FROM
//   public."userTourBooking"
// WHERE
//   "refPickupDate" = CURRENT_DATE + INTERVAL '1 day'
//     `);

//     for (const user of result.rows) {
//       const emailContent = generateReminderEmailContent(user);
//       await sendEmail({
//         to: user.refusermail,
//         subject: "⏰ Your tour is tomorrow!",
//         html: emailContent,
//       });
//     }

//     console.log(`[${CurrentTime()}] Tour reminders sent successfully.`);
//   } catch (error) {
//     console.error(`[${CurrentTime()}] Error sending reminders:`, error);
//   } finally {
//     client.release();
//   }
// };

// // Schedule to run daily at 8 AM
// cron.schedule("0 8 * * *", () => {
//   console.log("Running daily reminder batch...");
//   sendTourReminders();
// });


cron.schedule("0 8 * * *", async () => {
  const client = await getClient();

  try {
    const result = await client.query(`
      SELECT
        "refUserMail",
        "refUserName",
        "refPackageId",
        "refPickupDate"
      FROM
        public."userTourBooking"
      WHERE
        "refPickupDate" >= CURRENT_DATE
    `);

    const today = new Date();
    for (const user of result.rows) {
      const daysLeft = Math.ceil(
        (new Date(user.refPickupDate).getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
      );

      if (daysLeft > 0) {
        const emailContent = `
          <h2>Good Morning ${user.refUserName} 👋</h2>
          <p>Just a reminder, your tour is in <strong>${daysLeft}</strong> day(s)!</p>
          <p>Tour Date: <strong>${user.refPickupDate}</strong></p>
          <p>Pack your bags and get ready! 🧳</p>
        `;

        await sendEmail({
          to: user.refUserMail,
          subject: "🕗 Daily Tour Reminder",
          html: emailContent,
        });
      }
    }

    console.log(`[${CurrentTime()}] Daily reminders sent.`);
  } catch (err) {
    console.error("Error sending daily tour reminders:", err);
  } finally {
    client.release();
  }
});


cron.schedule("0 8 * * *", async () => {
  const client = await getClient();

  try {
    const result = await client.query(`
      SELECT
        "refUserMail",
        "refUserName",
        "refPickupDate"
      FROM public."userCarBooking"
      WHERE "refPickupDate" >= CURRENT_DATE
    `);

    const today = new Date();

    for (const user of result.rows) {
      const daysLeft = Math.ceil(
        (new Date(user.refPickupDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysLeft > 0) {
        const html = `
          <h2>Good Morning ${user.refUserName} 👋</h2>
          <p>This is your daily reminder: Your car booking is in <strong>${daysLeft}</strong> day(s)!</p>
          <p>Pickup Date: <strong>${user.refPickupDate}</strong></p>
          <p>We're excited to serve you 🚗</p>
        `;

        await sendEmail({
          to: user.refUserMail,
          subject: "🚗 Daily Car Booking Reminder",
          html,
        });
      }
    }

    console.log(`[${CurrentTime()}] Daily car booking reminders sent.`);
  } catch (err) {
    console.error("Error sending daily car reminders:", err);
  } finally {
    client.release();
  }
});
