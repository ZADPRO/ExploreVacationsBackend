export const updateHistoryQuery = `INSERT INTO
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

export const checkCarGroupQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refCarGroup"
WHERE
  "refCarGroupName" = $1
  AND "isDelete" IS NOT true
`;
export const checkCarGroupIdQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refCarGroup"
WHERE
  "refCarGroupId" = $1
  AND "isDelete" IS NOT true
`;
export const addCarGroupQuery = `
INSERT INTO
  public."refCarGroup" ("refCarGroupName", "createdAt", "createdBy")
VALUES
  ($1, $2, $3)
RETURNING
  *;
`;

export const updateCarGroupQuery = `
UPDATE
  public."refCarGroup"
SET
  "refCarGroupName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refCarGroupId" = $1
  RETURNING *;
`;

export const deleteCarGroupQuery = `
UPDATE
  public."refCarGroup"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refCarGroupId" = $1
RETURNING
  *;
`;
export const getCarGroupQuery = `
SELECT
  "refCarGroupName"
FROM
  public."refCarGroup"
WHERE
  "refCarGroupId" = $1
`;

export const listCarGroupQuery = `
SELECT
  *
FROM
  public."refCarGroup"
WHERE
  "isDelete" IS NOT true
`;

export const addOfflineCarBookingQuery = `
INSERT INTO
  public."offlineCarBooking" (
    "refCarsId",
    "refUserName",
    "refUserMail",
    "refUserMobile",
    "refPickupAddress",
    "refSubmissionAddress",
    "refPickupDate",
    "refAdultCount",
    "refChildrenCount",
    "refInfants",
    "refFormDetails",
    "refOtherRequirements",
    "refBookingType",
    "isExtraKMneeded",
    "refExtraKm",
    "createdAt",
    "createdBy",
    "refuserId"
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14,
    $15,
    $16,
    $17,
    $18
  )
RETURNING
  *;
`;

export const drivarDetailsQuery = `
INSERT INTO
  public."refDriverDetails" (
    "refDriverName",
    "refDriverAge",
    "refDriverMail",
    "refDriverMobile",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, false)
RETURNING
  *;
`;

export const listOfflineCarBookingQuery = `
SELECT
  ob.*,
  ct.*,
  vt."refVehicleTypeName",
  cty."refCarTypeName"
FROM
  public."offlineCarBooking" ob
  LEFT JOIN public."refCarsTable" ct ON CAST(ct."refCarsId" AS INTEGER) = ob."refCarsId"
  LEFT JOIN public."refVehicleType" vt ON CAST(vt."refVehicleTypeId" AS INTEGER) = ct."refVehicleTypeId"
  LEFT JOIN public."refCarType" cty ON CAST(cty."refCarTypeId" AS INTEGER) = ct."refCarTypeId"
WHERE
  ob."isDelete" IS NOT true
`;

export const deleteOfflineCarBookingQuery =  `
UPDATE
  public."offlineCarBooking"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "offlineCarBookingId" = $1
RETURNING
  *;
`;