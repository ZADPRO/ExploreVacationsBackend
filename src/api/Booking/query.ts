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
export const getUserdataCustomizeTourQuery = `
SELECT
  cb.*,
  rp.*
FROM
  public."customizeTourBooking" cb
  LEFT JOIN public."refPackage" rp ON CAST (rp."refPackageId" AS INTEGER) = cb."refPackageId"::INTEGER
WHERE
  cb."refuserId" = $1
`;
export const approveParkingBookingQuery = `
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

export const getTourAgreementQuery = `
SELECT
  "refAgreementPath"
FROM
  public."userTourBooking"
WHERE
  "userTourBookingId" = $1
`;

export const deleteAgreementQuery =`
UPDATE
  public."userTourBooking"
SET
  "refAgreementPath" = NULL
WHERE
  "userTourBookingId" = $1
RETURNING
  *;
`;

export const getCarAgreementQuery = `
SELECT
  "refAgreementPath"
FROM
  public."userCarBooking"
WHERE
  "userCarBookingId" = $1
`;

export const deleteCarAgreementQuery = `
UPDATE
  public."userCarBooking"
SET
  "refAgreementPath" = NULL
WHERE
  "userCarBookingId" = $1
RETURNING
  *;
`;

export const getParkingAgreementQuery = `
SELECT
  "refAgreementPath"
FROM
  public."userCarParkingBooking"
WHERE
  "carParkingBookingId" = $1
`;

export const deleteParkingAgreementQuery = `
UPDATE
  public."userCarParkingBooking"
SET
  "refAgreementPath" = NULL
WHERE
  "carParkingBookingId" = $1
RETURNING
  *;
`;

// --------------------------------------------------------------------------------

export const updateHistoryQuery = `
INSERT INTO
  public."refTxnHistory" (
    "refTransactionHistoryId",
    "refUserId",
    "transData",
    "updatedAt",
    "updatedBy"
  )
VALUES
  ($1, $2, $3, $4, $5)
RETURNING
  *;
`;

export const addHomePageQuery = `
INSERT INTO
  public."refHomePage" (
 "refHomePageName",
    "homePageHeading",
    "homePageContent",
    "refOffer",
    "refOfferName",
    "homePageImage",
    "refModuleId",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING
  *;
`;

export const updateHomePageQuery = `
UPDATE
  public."refHomePage"
SET
"refHomePageName" = $2,
  "homePageHeading" = $3,
  "homePageContent" = $4,
  "refOffer" = $5,
  "refOfferName" = $6,
  "homePageImage" = $7,
  "refModuleId" = $8
  "updatedAt" =  $9,
  "updatedBy" = $10
WHERE
  "refHomePageId" = $1
  RETURNING *;
`;

export const getModuleQuery = `
SELECT
  *
FROM
  public."refModule"
`;

export const deleteHomeImageContentQuery = `
UPDATE
  public."refHomePage"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refHomePageId" = $1
RETURNING
  *;
`;

export const getImageRecordQuery = `
SELECT
  "homePageImage"
FROM
  public."refHomePage" 
WHERE
  "refHomePageId" = $1;
`;
export const listhomeImageQuery = `
SELECT
  *
FROM
  public."refHomePage"
WHERE
  "isDelete" IS NOT true
`;

export const getHomeImageQuery = `
SELECT
  *
FROM
  public."refHomePage"
WHERE
  "isDelete" IS NOT true
  AND
  "refHomePageId" = $1
`;
