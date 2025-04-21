import fs from "fs";
import path from "path";
import { viewFile } from "./storage";

export const getAdjustedTime = (): string => {
  const serverTime = new Date();
  serverTime.setMinutes(serverTime.getMinutes() + 330);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-IN", options).format(serverTime);
};



// export const CurrentTime = (): string => {
//   const today = new Date();
//   return today.toISOString().replace("T", " ").slice(0, 19); // "YYYY-MM-DD HH:mm:ss"
// };

export const CurrentTime = (): string => {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-CH', {
    timeZone: 'Europe/Zurich',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Ensures 24-hour format
  });

  const parts = formatter.formatToParts(date);
  const timeParts: Record<string, string> = {};

  parts.forEach(({ type, value }) => {
    if (type !== 'literal') timeParts[type] = value;
  });

  return `${timeParts.year}-${timeParts.month}-${timeParts.day} ${timeParts.hour}:${timeParts.minute}:${timeParts.second}`;
};



// export function generateFileName(): string {
//   // Generate a random string of 6 alphabets
//   const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@$*";
//   const randomChars = Array.from({ length: 6 }, () =>
//     alphabets.charAt(Math.floor(Math.random() * alphabets.length))
//   ).join("");

//   // Get current date in DDMMYYYY format
//   const today = new Date();
//   const datePart = `${String(today.getDate()).padStart(2, "0")}${String(
//     today.getMonth() + 1
//   ).padStart(2, "0")}${today.getFullYear()}`;

//   // Combine random characters with date
//   return `${randomChars}${datePart}`;
// }

export function generateFileName(): string {
  const timestamp = Date.now(); // Milliseconds since Jan 1, 1970
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${timestamp}${random}`; // e.g., "17132654798341234"
}

export function base64ToFile(
  base64String: string,
  fileName: string
): { file: File; fileType: string } {
  const matches = base64String.match(/^data:(.+);base64,(.*)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  const fileType = matches[1];
  const byteCharacters = atob(matches[2]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const file = new File([byteArray], fileName, { type: fileType });

  return { file, fileType };
}

// Mark the function as async to use await inside it
export async function processImages(result: any[]) {
  for (const image of result) {
    console.log("image", image);
    for (const key of ["refGallery", "refItinaryMapPath", "refCoverImage"]) {
      console.log("key", key);
      if (image[key]) {
        console.log("key line 217", key);
        try {
          console.log("key line 219", key);
          const fileBuffer = await viewFile(image[key]);
          image[key] = {
            filename: path.basename(image[key]),
            content: fileBuffer.toString("base64"),
            contentType: "image/jpeg", // Adjust if needed based on the image type
          };
        } catch (error) {
          console.error(`Error reading ${key} file:`, error);
          image[key] = null; // Handle missing/unreadable files
        }
      }
    }
  }
}

export function generatePassword(length: number = 8): string {
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const symbols = "!@#$%^&*()_+{}[]<>?";
  const allChars = upperCase + lowerCase + symbols;

  let password = "";
  password += upperCase[Math.floor(Math.random() * upperCase.length)];
  password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 3; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}
