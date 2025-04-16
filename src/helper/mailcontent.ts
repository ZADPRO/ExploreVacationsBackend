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
        <em>Booking created on: ${new Date().toLocaleString()}</em>
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
        <em>Booking created on: ${new Date().toLocaleString()}</em>
      </p>
    </div>
  `;
}


export function generateCarBookingEmailContent(data: any): string {
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
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Pickup Address</td>
            <td style="padding: 8px;">${data.refPickupAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Submission Address</td>
            <td style="padding: 8px;">${data.refSubmissionAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Pickup Date</td>
            <td style="padding: 8px;">${data.refPickupDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8f8f8;">Adult</td>
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
            <td style="padding: 8px;">${data.refOtherRequirements}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 20px; color: #888; text-align: center;">
        <em>Booking created on: ${new Date().toLocaleString()}</em>
      </p>
    </div>
  `;
}

interface TourReminderUser {
  refUserName: string;
  refPackageId: string;
  refPickupDate: string;
  refUserMail:string;
}

export const generateReminderEmailContent = (user: TourReminderUser): string => {
  const { refUserName, refPackageId, refPickupDate } = user;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hi ${refUserName},</h2>

      <p>Just a quick reminder that your tour is scheduled for <strong>tomorrow</strong>!</p>

      <ul>
        <li><strong>Package:</strong> ${refPackageId}</li>
        <li><strong>Pickup Date:</strong> ${new Date(refPickupDate).toDateString()}</li>
      </ul>

      <p>Make sure you're ready with all your essentials. We're excited to have you on board!</p>

      <p>Safe travels,<br/>
      The Tour Team</p>

      <hr style="margin-top: 20px;" />
      <p style="font-size: 12px; color: #666;">If you have any questions or need help, just reply to this email.</p>
    </div>
  `;
};

export const generateforgotPasswordEmailContent= (emailId: string, newPassword: string): string => {
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
}
