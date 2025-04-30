export const approveTourBookingQuery = `
UPDATE
  public."userTourBooking"
SET
  "refStatus" = 'Approved'
WHERE
  "refuserId" = $1
  RETURNING *;
  `;

export const getUserdataTourQuery = `
SELECT
  ub.*,
  rp.*
FROM
  public."userTourBooking" ub
  LEFT JOIN public."refPackage" rp ON CAST (rp."refPackageId" AS INTEGER) = ub."refPackageId"
WHERE
  ub."refuserId" = $1 

`;
export const approveCarBookingQuery = `
UPDATE
  public."userCarBooking"
SET
  "refStatus" = 'Approved'
WHERE
  "refuserId" = $1
  RETURNING *;
`;

export const getUserdataCarQuery = `
SELECT
  cb.*,
  ct.*
FROM
  public."userCarBooking" cb
  LEFT JOIN public."refCarsTable" ct ON CAST(ct."refCarsId" AS INTEGER) = cb."refCarsId"
WHERE
  cb."refuserId" = $1
`;

export const approveCustomizeBookingQuery = `
UPDATE
  public."customizeTourBooking"
SET
  "refStatus" = 'Approved'
WHERE
  "refuserId" = $1
  RETURNING *;
`;
export const getUserdataCustomizeTourQuery =`
SELECT
  cb.*,
  rp.*
FROM
  public."customizeTourBooking" cb
  LEFT JOIN public."refPackage" rp ON CAST (rp."refPackageId" AS INTEGER) = cb."refPackageId"::INTEGER
WHERE
  cb."refuserId" = $1
`;
export const approveParkingBookingQuery =`
UPDATE
  public."userCarParkingBooking"
SET
  "refStatus" = 'Approved'
WHERE
  "refuserId" = $1
RETURNING
  *;
`;

export const getUserdataParkingQuery = `
SELECT
  pb.*,
  pt.*,
  u."refFName",
  ud."refUserEmail"
FROM
  public."userCarParkingBooking" pb
  LEFT JOIN public."refCarParkingTable" pt ON CAST(pt."refCarParkingId" AS INTEGER) = pb."refCarParkingId"
  LEFT JOIN public.users u ON CAST(u."refuserId" AS INTEGER) = pb."refuserId"
  LEFT JOIN public."refUserDomain" ud ON CAST(ud."refUserId" AS INTEGER) = pb."refuserId"
WHERE
  pb."refuserId" = $1
`;



