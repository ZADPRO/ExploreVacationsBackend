import { CurrentTime } from "./common";

export const generateSignupEmailContent = (
  username: string,
  password: string
) => {
  return `
      <h3>Welcome to Our Platform!</h3>
      <p>Dear User,</p>
      <p>Your account has been successfully created. Below are your login details:</p>
      <ul>
        <li><strong>Email:</strong> ${username}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>Please log in and change your password for security reasons.</p>
      <p>Best Regards,<br/>The Team</p>
    `;
};

export function generateTourBookingEmailContent(result: any): string {
  const data = result.rows[0];

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #2c3e50; text-align: center;">New Tour Booking Received</h2>
      <p style="text-align: center; color: #555;">A customer has booked a new tour. Please find the booking details below:</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tbody>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Customer Name</td>
            <td style="padding: 8px;">${data.refUserName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Email</td>
            <td style="padding: 8px;">${data.refUserMail}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Mobile</td>
            <td style="padding: 8px;">${data.refUserMobile}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Pickup Date</td>
            <td style="padding: 8px;">${data.refPickupDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Adults</td>
            <td style="padding: 8px;">${data.refAdultCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Children</td>
            <td style="padding: 8px;">${data.refChildrenCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Infants</td>
            <td style="padding: 8px;">${data.refInfants}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Other Requirements</td>
            <td style="padding: 8px;">${data.refOtherRequirements || "N/A"}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 20px; color: #888; text-align: center;">
        <em>Booking created on: ${CurrentTime()}</em>
      </p>
    </div>
  `;
}

// export function userTourBookingMail ( data:any):string {
//   return `
//   <h2>Hi ${data.refUserName},</h2>
//           <p>🎉 Your tour has been successfully booked!</p>
//           <p>Your tour starts on <strong>${data.refPickupDate}</strong>.</p>
//           <p>🧳 Only <strong>${data.daysLeft}</strong> day(s) to go!</p>
//           <p>We’ll send you daily reminders so you don’t miss a thing!</p>
//           <br/>
//           <p>Thank you,<br>Team Explore Vacations</p>
//   `

// }

export function userTourBookingMail(data: any): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4faff; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 123, 255, 0.1); overflow: hidden;">
        <div style="background-color: #007bff; color: white; padding: 20px 30px;">
          <h2 style="margin: 0;">Explore Vacations</h2>
        </div>
        <div style="padding: 30px;">
          <h3 style="color: #007bff;">Hi ${data.refUserName},</h3>
          <p>🎉 Great news! Your tour <strong>"${data.refPackageName}"</strong> has been successfully booked.</p>
          <p><strong>Tour Code:</strong> ${data.refTourCustID}</p>
          <p>Your adventure begins on <strong>${data.refPickupDate}</strong>.</p>
          <p>🧳 Only <strong>${data.daysLeft}</strong> day(s) left to go!</p>
          <p>We'll send you daily reminders so you’re fully prepared for the journey ahead.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

          <p>Thank you for choosing <strong>Explore Vacations</strong>!</p>
          <p>We look forward to giving you an unforgettable experience.</p>

          <p style="margin-top: 30px;">Warm regards,<br/><strong>Team Explore Vacations</strong></p>
        </div>
      </div>
    </div>
  `;
}

export function generateCustomizeTourBookingEmailContent(data: any): string {
  console.log("data", data); // This should now log the actual row

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #2c3e50; text-align: center;">🧳 New Customized Tour Booking Request</h2>
      <p style="text-align: center; color: #555;">A customer has booked a new Customized tour. Please find the booking details below:</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tbody>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Customer Name</td>
            <td style="padding: 8px;">${data.refUserName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Email</td>
            <td style="padding: 8px;">${data.refUserMail}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Mobile</td>
            <td style="padding: 8px;">${data.refUserMobile}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Arrival Date</td>
            <td style="padding: 8px;">${data.refArrivalDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Single Room</td>
            <td style="padding: 8px;">${data.refSingleRoom}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Twin Room</td>
            <td style="padding: 8px;">${data.refTwinRoom}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Triple Room</td>
            <td style="padding: 8px;">${data.refTripleRoom}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Adults</td>
            <td style="padding: 8px;">${data.refAdultCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Children</td>
            <td style="padding: 8px;">${data.refChildrenCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Vaccination Type</td>
            <td style="padding: 8px;">${data.refVaccinationType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Other Requirements</td>
            <td style="padding: 8px;">${data.refOtherRequirements || "N/A"}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 20px; color: #888; text-align: center;">
        <em>Booking created on: ${CurrentTime()}</em>
      </p>
    </div>
  `;
}

// export function generateCarBookingEmailContent(data: any): string {
//   console.log("data", data); // This should now log the actual row

//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
//       <h2 style="color: #2c3e50; text-align: center;">🧳 New Customized Tour Booking Request</h2>
//       <p style="text-align: center; color: #555;">A customer has booked a new Customized tour. Please find the booking details below:</p>

//       <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
//         <tbody>
//           <tr>
//             <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Customer Name</td>
//             <td style="padding: 8px;">${data.refUserName}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Email</td>
//             <td style="padding: 8px;">${data.refUserMail}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Mobile</td>
//             <td style="padding: 8px;">${data.refUserMobile}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Pickup Address</td>
//             <td style="padding: 8px;">${data.refPickupAddress}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Submission Address</td>
//             <td style="padding: 8px;">${data.refSubmissionAddress}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Pickup Date</td>
//             <td style="padding: 8px;">${data.refPickupDate}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Adult</td>
//             <td style="padding: 8px;">${data.refAdultCount}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Children</td>
//             <td style="padding: 8px;">${data.refChildrenCount}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Infants</td>
//             <td style="padding: 8px;">${data.refInfants}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Other Requirements</td>
//             <td style="padding: 8px;">${data.refOtherRequirements}</td>
//           </tr>
//         </tbody>
//       </table>

//       <p style="margin-top: 20px; color: #888; text-align: center;">
//         <em>Booking created on: ${new Date().toLocaleString()}</em>
//       </p>
//     </div>
//   `;
// }

export interface AdminCarBookingMailData {
  refUserName: string;
  refUserMail: string;
  refUserMobile: string;
  refPickupAddress: string;
  refSubmissionAddress: string;
  refPickupDate: string;
  refCarTypeName: string;
  refVehicleTypeName: string;
  refCarCustId: string;
  refCarPrice: number;
  refAdultCount: number;
  refChildrenCount: number;
  refInfants: number;
  refOtherRequirements?: string;
}

// export const generateCarBookingEmailContent = (data: any): string => {
//   console.log("data line 254", data);
//   let firstName;
//   if (Array.isArray(data) && data.length > 0 && data[0]) {
//     firstName = data[0].refUserName;
//     const mobile = data[0].refUserMobile;
//     console.log("First Name:", firstName);
//     console.log("Mobile:", mobile);
//   } else {
//     console.error("No valid data found:", data);
//   }

//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 1px solid #dcdcdc; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); overflow: hidden;">
//       <div style="background-color: #007BFF; color: white; padding: 20px; text-align: center;">
//         <h2 style="margin: 0;">🚘 New Car Booking - Explore Vacations</h2>
//       </div>

//       <div style="padding: 30px; background-color: #f7f9fc;">
//         <h3 style="color: #007BFF;">Customer Information</h3>
//         <table style="width: 100%; font-size: 15px; color: #333;">
//           <tr><td><strong>Name:</strong></td><td>${firstName}</td></tr>
//           <tr><td><strong>Email:</strong></td><td>${
//             data.refUserMail
//           }</td></tr>
//           <tr><td><strong>Mobile:</strong></td><td>${
//             data.refUserMobile
//           }</td></tr>
//         </table>

//         <h3 style="color: #007BFF; margin-top: 25px;">Booking Details</h3>
//         <table style="width: 100%; font-size: 15px; color: #333;">
//           <tr><td><strong>Booking ID:</strong></td><td>${
//             data.refCarCustId
//           }</td></tr>
//           <tr><td><strong>Pickup Address:</strong></td><td>${
//             data.refPickupAddress
//           }</td></tr>
//           <tr><td><strong>Drop Address:</strong></td><td>${
//             data.refSubmissionAddress
//           }</td></tr>
//           <tr><td><strong>Pickup Date:</strong></td><td>${
//             data.refPickupDate
//           }</td></tr>
//           <tr><td><strong>Vehicle Type:</strong></td><td>${
//             data.refVehicleTypeName
//           }</td></tr>
//           <tr><td><strong>Car Category:</strong></td><td>${
//             data.refCarTypeName
//           }</td></tr>
//           <tr><td><strong>Adults:</strong></td><td>${
//             data.refAdultCount
//           }</td></tr>
//           <tr><td><strong>Children:</strong></td><td>${
//             data.refChildrenCount
//           }</td></tr>
//           <tr><td><strong>Infants:</strong></td><td>${
//             data.refInfants
//           }</td></tr>
//           <tr><td><strong>Other Requirements:</strong></td><td>${
//             data.refOtherRequirements || "N/A"
//           }</td></tr>
//           <tr><td><strong>Price:</strong></td><td>₹${
//             data.refCarPrice
//           }</td></tr>
//         </table>

//         <p style="margin-top: 30px; font-size: 16px; color: #333;">Please follow up with the customer to confirm and finalize the booking.</p>

//         <p style="margin-top: 30px; color: #007BFF; font-size: 16px;"><strong>Explore Vacations Admin Panel</strong></p>
//       </div>

//       <div style="background-color: #007BFF; color: white; padding: 15px; text-align: center;">
//         &copy; ${CurrentTime()} Explore Vacations | Admin Notification
//       </div>
//     </div>
//   `;
// };

export const generateCarBookingEmailContent = (data: any): string => {
  console.log("data line 254", data);

  let firstName,
    email,
    mobile,
    bookingId,
    pickupAddress,
    dropAddress,
    pickupDate,
    vehicleType,
    carCategory,
    adults,
    children,
    infants,
    otherRequirements,
    price;

  if (Array.isArray(data) && data.length > 0 && data[0]) {
    const bookingData = data[0]; // Extract the first element for easier access
    firstName = bookingData.refUserName;
    email = bookingData.refUserMail;
    mobile = bookingData.refUserMobile;
    bookingId = bookingData.refCarCustId;
    console.log('bookingId', bookingId)
    pickupAddress = bookingData.refPickupAddress;
    dropAddress = bookingData.refSubmissionAddress;
    pickupDate = bookingData.refPickupDate;
    vehicleType = bookingData.refVehicleTypeName;
    console.log('vehicleType', vehicleType)
    carCategory = bookingData.refCarTypeName;
    console.log('carCategory', carCategory)
    adults = bookingData.refAdultCount;
    children = bookingData.refChildrenCount;
    infants = bookingData.refInfants;
    otherRequirements = bookingData.refOtherRequirements || "N/A";
    price = bookingData.refCarPrice;
    console.log('price', price)

  } else {

    console.error("No valid data found:", data);
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 1px solid #dcdcdc; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background-color: #007BFF; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">🚘 New Car Booking - Explore Vacations</h2>
      </div>

      <div style="padding: 30px; background-color: #f7f9fc;">
        <h3 style="color: #007BFF;">Customer Information</h3>
        <table style="width: 100%; font-size: 15px; color: #333;">
          <tr><td><strong>Name:</strong></td><td>${firstName}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
          <tr><td><strong>Mobile:</strong></td><td>${mobile}</td></tr>
        </table>
        <h3 style="color: #007BFF; margin-top: 25px;">Booking Details</h3>
        <table style="width: 100%; font-size: 15px; color: #333;">
          <tr><td><strong>Pickup Address:</strong></td><td>${pickupAddress}</td></tr>
          <tr><td><strong>Drop Address:</strong></td><td>${dropAddress}</td></tr>
          <tr><td><strong>Pickup Date:</strong></td><td>${pickupDate}</td></tr>
          <tr><td><strong>Adults:</strong></td><td>${adults}</td></tr>
          <tr><td><strong>Children:</strong></td><td>${children}</td></tr>
          <tr><td><strong>Infants:</strong></td><td>${infants}</td></tr>
          <tr><td><strong>Other Requirements:</strong></td><td>${otherRequirements}</td></tr>
        </table>
       <p style="margin-top: 30px; font-size: 16px; color: #333;">Please follow up with the customer to confirm and finalize the booking.</p>

         <p style="margin-top: 30px; color: #007BFF; font-size: 16px;"><strong>Explore Vacations Admin Panel</strong></p>
       </div>
       <div style="background-color: #007BFF; color: white; padding: 15px; text-align: center;">
         &copy; ${CurrentTime()} Explore Vacations | Admin Notification
       </div>
     </div>
   `;
};

export interface UserMailData {
  daysLeft: number;
  refPickupDate: string;
  refUserName: string;
  refCarTypeName: string;
  refVehicleTypeName: string;
  refCarCustId: string;
  refCarPrice: number;
}

export const userCarEmailContent = (data: UserMailData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background-color: #007BFF; padding: 20px; color: white; text-align: center;">
        <h1 style="margin: 0;">Explore Vacations</h1>
        <p style="margin: 0;">Ride into comfort 🚗</p>
      </div>
      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="color: #007BFF;">Hello ${data.refUserName} 👋</h2>
        <p style="font-size: 16px; color: #333;">Your car booking has been <strong>successfully received</strong>.</p>

        <table style="width: 100%; margin-top: 20px; font-size: 15px; color: #444;">
          <tr>
            <td style="padding: 8px 0;"><strong>🆔 Booking ID:</strong></td>
            <td style="padding: 8px 0;">${data.refCarCustId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>🚘 Vehicle Type:</strong></td>
            <td style="padding: 8px 0;">${data.refVehicleTypeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>🏷️ Car Category:</strong></td>
            <td style="padding: 8px 0;">${data.refCarTypeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>📅 Pickup Date:</strong></td>
            <td style="padding: 8px 0;">${data.refPickupDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>⏳ Days Left:</strong></td>
            <td style="padding: 8px 0;">${data.daysLeft} day(s)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>💰 Price:</strong></td>
            <td style="padding: 8px 0;">₹${data.refCarPrice}</td>
          </tr>
        </table>

        <p style="margin-top: 25px; font-size: 16px; color: #333;">
          Our team will contact you soon to finalize your ride details.
        </p>
        
        <p style="margin-top: 30px; font-size: 16px; color: #007BFF;"><strong>Thank you for choosing Explore Vacations! 😊</strong></p>
      </div>
      <div style="background-color: #007BFF; color: white; padding: 15px; text-align: center; font-size: 14px;">
        &copy; ${CurrentTime()} Explore Vacations. All rights reserved.
      </div>
    </div>
  `;
};

interface TourReminderUser {
  refUserName: string;
  refPackageId: string;
  refPickupDate: string;
  refUserMail: string;
}

// export const generateReminderEmailContent = (user: TourReminderUser): string => {
//   const { refUserName, refPackageId, refPickupDate } = user;

//   return `
//     <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//       <h2>Hi ${refUserName},</h2>

//       <p>Just a quick reminder that your tour is scheduled for <strong>tomorrow</strong>!</p>

//       <ul>
//         <li><strong>Package:</strong> ${refPackageId}</li>
//         <li><strong>Pickup Date:</strong> ${new Date(refPickupDate).toDateString()}</li>
//       </ul>

//       <p>Make sure you're ready with all your essentials. We're excited to have you on board!</p>

//       <p>Safe travels,<br/>
//       The Tour Team</p>

//       <hr style="margin-top: 20px;" />
//       <p style="font-size: 12px; color: #666;">If you have any questions or need help, just reply to this email.</p>
//     </div>
//   `;
// };

export const generateforgotPasswordEmailContent = (
  emailId: string,
  newPassword: string
): string => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Password Reset</h2>
      <p>Hello,</p>
      <p>Your temporary password has been generated.</p>
      <p><strong>Email:</strong> ${emailId}</p>
      <p><strong>New Password:</strong> ${newPassword}</p>
      <p>Please login and change it immediately.</p>
      <br>
      <p>Regards,<br>Team</p>
    </div>
  `;
};



export function userCarParkingBookingMail(userMailData: any): string {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f8fb; padding: 20px; color: #333;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
        <h1>🚗 Booking Confirmed!</h1>
        <p>Thanks for choosing <strong>Explore Vacations</strong></p>
      </div>

      <div style="padding: 20px;">
        <p>Hi <strong>${userMailData.refUserName}</strong>,</p>
        <p>We’re excited to confirm your car parking booking at <strong>${userMailData.refParkingName}</strong>.</p>

        <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Customer ID:</strong></td>
            <td style="padding: 8px 0;">${userMailData.refParkingCustId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Pickup Date:</strong></td>
            <td style="padding: 8px 0;">${userMailData.refPickupDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Days Left:</strong></td>
            <td style="padding: 8px 0;">${userMailData.daysLeft} day(s)</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">We’ll be ready and waiting. If you have any questions, feel free to contact us!</p>

        <p style="margin-top: 20px;">Safe travels! 🌍</p>
        <p style="color: #007bff; font-weight: bold;">— The Explore Vacations Team</p>
      </div>

      <div style="background-color: #e3f0ff; padding: 15px; text-align: center; font-size: 12px; color: #555;">
        © ${CurrentTime()} Explore Vacations. All rights reserved.
      </div>
    </div>
  </div>
  `;
}


export function generateCarParkingBookingEmailContent(result: any): string {
  const booking = result.rows[0];
  return `
    <h2>🚗 New Car Parking Booking</h2>
    <p><strong>User ID:</strong> ${booking.refuserId}</p>
    <p><strong>Travel Start Date:</strong> ${booking.travelStartDate}</p>
    <p><strong>Travel End Date:</strong> ${booking.travelEndDate}</p>
    <p><strong>Vehicle Model:</strong> ${booking.VehicleModel}</p>
    <p><strong>Vehicle Number:</strong> ${booking.vehicleNumber}</p>
    <p><strong>Parking Location ID:</strong> ${booking.refCarParkingId}</p>
    <p><strong>Return Flight Number:</strong> ${booking.returnFlightNumber}</p>
    <p><strong>Return Flight Location:</strong> ${booking.returnFlightLocation}</p>
    <p><strong>Who Will Handover:</strong> ${booking.WhoWillHandover ? 'Self' : 'Someone else'}</p>
    ${
      !booking.WhoWillHandover
        ? `<p><strong>Handover Name:</strong> ${booking.HandoverPersonName}</p>
           <p><strong>Handover Phone:</strong> ${booking.HandoverPersonPhone}</p>
           <p><strong>Handover Email:</strong> ${booking.HandoverPersonEmail}</p>`
        : ''
    }
    <p><strong>Booking Time:</strong> ${booking.createdAt}</p>
  `;
}
