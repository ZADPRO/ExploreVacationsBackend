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

export const addParkingQuery = `INSERT INTO
  public."refCarParkingTable"  (
    "refParkingTypeId",
    "refParkingName",
    "refAssociatedAirport",
    "refLocation",
    "refAvailability",
    "refOperatingHours",
    "refBookingType",
    "pricePerHourORday",
    "refPrice",
    "refWeeklyDiscount",
    "refExtraCharges",
    "MinimumBookingDuration",
    "MaximumBookingDuration",
    "isCancellationAllowed",
    "isRescheduleAllowed",
    "ServiceFeatures",
    "instructions",
    "description",
    "parkingSlotImage",
    "refStatus",
    "createdAt",
    "createdBy"
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
    $18,
    $19,
    $20,
    $21,
    $22
  )
RETURNING
  *;
`;

export const listCarParkingByIdQuery = `
SELECT
  cp.*,
  pt."refParkingTypeName",
  array_agg(rf."refServiceFeatures") AS "refServiceFeaturesList"
FROM
  public."refCarParkingTable" cp
  LEFT JOIN public."refParkingType" pt ON CAST(pt."refParkingTypeId" AS INTEGER) = cp."refParkingTypeId"
  LEFT JOIN public."refServiceFeatures" rf ON CAST(rf."refServiceFeaturesId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(cp."ServiceFeatures", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  cp."refCarParkingId" = $1
GROUP BY
  cp."refCarParkingId",
  pt."refParkingTypeId"
  ;
`;

export const updateCarParkingQuery = `
UPDATE public."refCarParkingTable"
        SET 
          "refParkingType" = $2,
          "refParkingName" = $3,
          "refAssociatedAirport" = $4,
          "refLocation" = $5,
          "refAvailability" = $6,
          "refOperatingHours" = $7,
          "refBookingType" = $8,
          "pricePerHourORday" = $9,
          "refPrice" = $10,
          "refWeeklyDiscount" = $11,
          "refExtraCharges" = $12,
          "MinimumBookingDuration" = $13,
          "MaximumBookingDuration" = $14,
          "isCancellationAllowed" = $15,
          "isRescheduleAllowed" = $16,
          "ServiceFeatures" = $17,
          "instructions" = $18,
          "description" = $19,
          "parkingSlotImage" = $20,
          "refStatus" = $21,
          "updatedAt" = $22,
          "updatedBy" = $23
        WHERE 
"refCarParkingId" = $1      
RETURNING *;

`;

export const listCarParkingQuery = `
SELECT
  cp.*,
  pt."refParkingTypeName",
  array_agg(rf."refServiceFeatures") AS "refServiceFeaturesList"
FROM
  public."refCarParkingTable" cp
  LEFT JOIN public."refParkingType" pt ON CAST (pt."refParkingTypeId" AS INTEGER) = cp."refParkingTypeId"
  LEFT JOIN public."refServiceFeatures" rf ON CAST(rf."refServiceFeaturesId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(cp."ServiceFeatures", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  cp."isDelete" IS NOT true
GROUP BY
  cp."refCarParkingId",
  pt."refParkingTypeId";
  
`;

//car parking with [{"id":1,"name":"WiFi Included"}]

// export const getCarParkingQuery = `
// SELECT
//   cp.*,
//   JSON_AGG(
//     JSON_BUILD_OBJECT(
//       'id',
//       rf."refServiceFeaturesId",
//       'name',
//       rf."refServiceFeatures"
//     )
//   ) AS "refServiceFeaturesList",
//   array_agg(rf."refServiceFeatures") AS "refServiceFeaturesList"
// FROM
//   public."refCarParkingTable" cp
//   LEFT JOIN public."refServiceFeatures" rf ON CAST(rf."refServiceFeaturesId" AS INTEGER) = ANY (
//     string_to_array(
//       regexp_replace(cp."ServiceFeatures", '[{}]', '', 'g'),
//       ','
//     )::INTEGER[]
//   )
// WHERE
//   cp."refCarParkingId" = $1
//   AND cp."isDelete" IS NOT true
// GROUP BY
//   cp."refCarParkingId"
// `;


export const getCarParkingQuery = `SELECT
  cp.*,
  array_agg(rf."refServiceFeatures") AS "refServiceFeaturesList"
FROM
  public."refCarParkingTable" cp
  LEFT JOIN public."refServiceFeatures" rf ON CAST(rf."refServiceFeaturesId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(cp."ServiceFeatures", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  cp."refCarParkingId" = $1
  AND cp."isDelete" IS NOT true
GROUP BY
  cp."refCarParkingId"
`;
export const deleteCarParkingQuery =`
UPDATE
  public."refCarParkingTable"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refCarParkingId" = $1
RETURNING
  *;
`;
export const getParkingImageRecordQuery = `SELECT
  *
FROM
  public."refCarParkingTable"
WHERE
  "refCarParkingId" = $1;
`;

export const deleteParkingImageRecordQuery = `
UPDATE
  public."refCarParkingTable"
SET
  "parkingSlotImage" = NULL
WHERE
  "refCarParkingId" = $1
RETURNING
  *;
`;


export const checkduplicateQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refServiceFeatures"
WHERE
  "refServiceFeatures" = $1
  AND "isDelete" IS NOT true
LIMIT
  10;
`;

export const addServiceFeaturesQuery = `INSERT INTO
  public."refServiceFeatures" (
    "refServiceFeatures",
    "createdAt",
    "createdBy",
    "isDelete"  
  )
VALUES
  ($1, $2, $3, false)
RETURNING
  *;
`;

export const checkServiceFeaturesQuery = `SELECT COUNT(*) 
AS count FROM public."refServiceFeatures"
WHERE "refServiceFeaturesId" = $1  AND "isDelete" = false;
`;

export const updateServiceFeaturesQuery = `
UPDATE
  public."refServiceFeatures"
SET
  "refServiceFeatures" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refServiceFeaturesId" = $1;
`;

export const listServiceFeaturesQuery = `
SELECT
  *
FROM
  public."refServiceFeatures"
WHERE
  "isDelete" IS NOT true
  `;

  export const deleteServiceFeaturesQuery = `UPDATE
  public."refServiceFeatures"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refServiceFeaturesId" = $1
RETURNING
  *;
  `;

  export const getdeletedFeatureQuery =`
  SELECT
  "refServiceFeatures"
FROM
  public."refServiceFeatures"
WHERE
  "refServiceFeaturesId" = $1;
  `;

