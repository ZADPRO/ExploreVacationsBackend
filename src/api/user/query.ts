//update Transaction
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

export const addTourBookingQuery = `INSERT INTO
  public."userTourBooking" (
    "refPackageId",
    "refUserName",
    "refUserMail",
    "refUserMobile",
    "refPickupDate",
    "refAdultCount",
    "refChildrenCount",
    "refInfants",
    "refOtherRequirements",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING
  *;
`;

export const addcustomizeBookingQuery = `
    INSERT INTO public."customizeTourBooking" (
        "refUserName", 
        "refUserMail", 
        "refUserMobile", 
        "refPackageId", 
        "refArrivalDate", 
        "refSingleRoom", 
        "refTwinRoom", 
        "refTripleRoom", 
        "refAdultCount", 
        "refChildrenCount", 
        "refVaccinationType", 
        "refVaccinationCertificate", 
        "refOtherRequirements", 
        "createdAt", 
        "createdBy"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
    RETURNING *;
`;

export const addCarBookingQuery = ` INSERT INTO public."userCarBooking" (
        "refUserName", 
        "refUserMail", 
        "refUserMobile", 
        "refPickupAddress", 
        "refSubmissionAddress", 
        "refPickupDate", 
        "refVehicleTypeId", 
        "refAdultCount", 
        "refChildrenCount", 
        "refInfants", 
        "refFormDetails", 
        "refOtherRequirements", 
        "createdAt", 
        "createdBy"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
    RETURNING *;

`;

export const listTourQuery = `WITH
  "location" AS (
    SELECT
      rp.*,
      rtd."refItinary",
      rtd."refItinaryMapPath",
      rtd."refTravalInclude",
      rtd."refTravalExclude",
      rtd."refSpecialNotes",
      rtd."refTravalOverView",
      rd.*,
      rg."refGallery",
      ARRAY_AGG(rl."refLocationName") AS "refLocationName"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refGallery" rg ON CAST(rg."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
      LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rp."refLocation", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    WHERE
      (
        rp."isDelete" IS null
        OR "rp"."isDelete" IS false
      )
      AND rp."refPackageId" = $1
    GROUP BY
      rp."refPackageId",
      rtd."refTravalDataId",
      rd."refDestinationId",
      rg."refGallery"
  ),
  "activity" AS (
    SELECT
      l."refPackageName",
      l."refLocationName",
      l."refDestinationName",
      ARRAY_AGG(ra."refActivitiesName") AS "Activity",
      l."refDesignationId",
      l."refTravalInclude",
      l."refTravalExclude",
      l."refPackageId",
      l."refTravalDataId",
      l."refItinary",
      l."refItinaryMapPath",
      l."refSpecialNotes",
      l."refTravalOverView",
      l."refGallery"
    FROM
      "location" l
      LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(l."refActivity", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    GROUP BY
      l."refPackageName",
      l."refLocationName",
      l."refDestinationName",
      l."refDesignationId",
      l."refTravalInclude",
      l."refTravalExclude",
      l."refPackageId",
      l."refItinary",
      l."refItinaryMapPath",
      l."refSpecialNotes",
      l."refTravalOverView",
      l."refTravalDataId",
      l."refGallery"
  )
SELECT
  aa.*,
  ARRAY_AGG(ti."refTravalInclude") AS "travalInclude",
  ARRAY_AGG(te."refTravalExclude") AS "travalExclude"
FROM
  "activity" aa
  LEFT JOIN public."refTravalInclude" ti ON CAST(ti."refTravalIncludeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(aa."refTravalInclude", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refTravalExclude" te ON CAST(te."refTravalExcludeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(aa."refTravalExclude", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
GROUP BY
  aa."refPackageName",
  aa."refLocationName",
  aa."refDestinationName",
  aa."Activity",
  aa."refDesignationId",
  aa."refTravalInclude",
  aa."refTravalExclude",
  aa."refPackageId",
  aa."refItinary",
  aa."refItinaryMapPath",
  aa."refSpecialNotes",
  aa."refTravalOverView",
  aa."refTravalDataId",
  aa."refGallery"
`;

export const listOtherTourQuery = `WITH
  "location" AS (
    SELECT
      rp.*,
      rtd."refItinary",
      rtd."refItinaryMapPath",
      rtd."refTravalInclude",
      rtd."refTravalExclude",
      rtd."refSpecialNotes",
      rtd."refTravalOverView",
      rd.*,
      rg."refGallery",
      ARRAY_AGG(rl."refLocationName") AS "refLocationName"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refGallery" rg ON CAST(rg."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
      LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rp."refLocation", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    WHERE
      (
        rp."isDelete" IS null
        OR "rp"."isDelete" IS false
      )
      AND rp."refPackageId" NOT IN ($1)
    GROUP BY
      rp."refPackageId",
      rtd."refTravalDataId",
      rd."refDestinationId",
      rg."refGallery"
  ),
  "activity" AS (
    SELECT
      l."refPackageName",
      l."refLocationName",
      l."refDestinationName",
      ARRAY_AGG(ra."refActivitiesName") AS "Activity",
      l."refDesignationId",
      l."refTravalInclude",
      l."refTravalExclude",
      l."refPackageId",
      l."refTravalDataId",
      l."refItinary",
      l."refItinaryMapPath",
      l."refSpecialNotes",
      l."refTravalOverView",
      l."refGallery"
    FROM
      "location" l
      LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(l."refActivity", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    GROUP BY
      l."refPackageName",
      l."refLocationName",
      l."refDestinationName",
      l."refDesignationId",
      l."refTravalInclude",
      l."refTravalExclude",
      l."refPackageId",
      l."refItinary",
      l."refItinaryMapPath",
      l."refSpecialNotes",
      l."refTravalOverView",
      l."refTravalDataId",
      l."refGallery"
  )
SELECT
  aa.*,
  ARRAY_AGG(ti."refTravalInclude") AS "travalInclude",
  ARRAY_AGG(te."refTravalExclude") AS "travalExclude"
FROM
  "activity" aa
  LEFT JOIN public."refTravalInclude" ti ON CAST(ti."refTravalIncludeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(aa."refTravalInclude", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refTravalExclude" te ON CAST(te."refTravalExcludeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(aa."refTravalExclude", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
GROUP BY
  aa."refPackageName",
  aa."refLocationName",
  aa."refDestinationName",
  aa."Activity",
  aa."refDesignationId",
  aa."refTravalInclude",
  aa."refTravalExclude",
  aa."refPackageId",
  aa."refItinary",
  aa."refItinaryMapPath",
  aa."refSpecialNotes",
  aa."refTravalOverView",
  aa."refTravalDataId",
  aa."refGallery"

`;

export const listallTourQuery = `
WITH
  "location" AS (
    SELECT
      rp.*,
      rtd."refItinary",
      rtd."refItinaryMapPath",
      rtd."refTravalInclude",
      rtd."refTravalExclude",
      rtd."refSpecialNotes",
      rtd."refTravalOverView",
      rd.*,
      rg."refGallery",
      ARRAY_AGG(rl."refLocationName") AS "refLocationName"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refGallery" rg ON CAST(rg."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
      LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rp."refLocation", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    WHERE
      rp."isDelete" IS null
      OR "rp"."isDelete" IS false
    GROUP BY
      rp."refPackageId",
      rtd."refTravalDataId",
      rd."refDestinationId",
      rg."refGallery"
  ),
  "activity" AS (
    SELECT
      l."refPackageName",
      l."refLocationName",
      l."refDestinationName",
      ARRAY_AGG(ra."refActivitiesName") AS "Activity",
      l."refDesignationId",
      l."refTravalInclude",
      l."refTravalExclude",
      l."refPackageId",
      l."refTravalDataId",
      l."refItinary",
      l."refItinaryMapPath",
      l."refSpecialNotes",
      l."refTravalOverView",
      l."refGallery"
    FROM
      "location" l
      LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(l."refActivity", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    GROUP BY
      l."refPackageName",
      l."refLocationName",
      l."refDestinationName",
      l."refDesignationId",
      l."refTravalInclude",
      l."refTravalExclude",
      l."refPackageId",
      l."refItinary",
      l."refItinaryMapPath",
      l."refSpecialNotes",
      l."refTravalOverView",
      l."refTravalDataId",
      l."refGallery"
  )
SELECT
  aa.*,
  ARRAY_AGG(ti."refTravalInclude") AS "travalInclude",
  ARRAY_AGG(te."refTravalExclude") AS "travalExclude"
FROM
  "activity" aa
  LEFT JOIN public."refTravalInclude" ti ON CAST(ti."refTravalIncludeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(aa."refTravalInclude", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refTravalExclude" te ON CAST(te."refTravalExcludeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(aa."refTravalExclude", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
GROUP BY
  aa."refPackageName",
  aa."refLocationName",
  aa."refDestinationName",
  aa."Activity",
  aa."refDesignationId",
  aa."refTravalInclude",
  aa."refTravalExclude",
  aa."refPackageId",
  aa."refItinary",
  aa."refItinaryMapPath",
  aa."refSpecialNotes",
  aa."refTravalOverView",
  aa."refTravalDataId",
  aa."refGallery"`;

// export const addTravalDataQuery = `INSERT INTO
//   public."refTravalData" (
//     "refPackageId",
//     "refItinary",
//     "refItinaryMapPath",
//     "refTravalInclude",
//     "refTravalExclude",
//     "refOtherRequirements",
//     "createdAt",
//     "createdBy",
//     "isDelete"
//   )
// VALUES
//   ($1, $2, $3, $4, $5, $6, $7, $8, false)
// RETURNING
//   *;
// `;

// export const updateTravalDataQuery = `UPDATE
//   public."refTravalData"
// SET
//   "refPackageId" = $2,
//   "refItinary" = $3,
//   "refItinaryMapPath" = $4,
//   "refTravalInclude" = $5,
//   "refTravalExclude" = $6,
//   "refSpecialNotes" = $7,
//   "updatedAt" = $8,
//   "updatedBy" = $9
// WHERE
//   "refTravalDataId" = $1 
// RETURNING
//   *;
// `;

export const listCarsQuery = `SELECT
  rvt."refVehicleTypeName",
  rc."refPersonCount",
  rc."refBagCount",
  rc."refFuelType",
  rc."refcarManufactureYear",
  rc."refMileage",
  rc."refTrasmissionType",
  rc."refFuleLimit",
  rc."refCarPath"
FROM
  public."refCarsTable" rc
  LEFT JOIN public."refVehicleType" rvt ON CAST(rvt."refVehicleTypeId" AS INTEGER) = rc."refVehicleTypeId"
  WHERE rc."isDelete" IS NOT true ;
      `;

export const getCarsByIdQuery = `
  SELECT
  rvt."refVehicleTypeName",
  rc."refPersonCount",
  rc."refBagCount",
  rc."refFuelType",
  rc."refcarManufactureYear",
  rc."refMileage",
  rc."refTrasmissionType",
  rc."refFuleLimit",
  rc."refCarPath"
FROM
  public."refCarsTable" rc
  LEFT JOIN public."refVehicleType" rvt ON CAST(rvt."refVehicleTypeId" AS INTEGER) = rc."refVehicleTypeId"
  WHERE rc."isDelete" IS NOT true AND rc."refCarsId" = $1;
`;

export const getOtherCarsQuery = `SELECT
rc."refCarsId",
  rvt."refVehicleTypeName",
  rc."refPersonCount",
  rc."refBagCount",
  rc."refFuelType",
  rc."refcarManufactureYear",
  rc."refMileage",
  rc."refTrasmissionType",
  rc."refFuleLimit",
  rc."refCarPath"
FROM
  public."refCarsTable" rc
  LEFT JOIN public."refVehicleType" rvt ON CAST(rvt."refVehicleTypeId" AS INTEGER) = rc."refVehicleTypeId"
  WHERE rc."isDelete" IS NOT true AND "refCarsId" NOT IN ($1);
`;

export const listDestinationQuery = `SELECT * FROM public."refDestination" WHERE "isDelete" IS NOT true
        `;

export const getImageRecordQuery = `SELECT
  *
FROM
  public."refTravalData" 
WHERE
  "refTravalDataId" = $1;
`;

export const deleteImageRecordQuery = `UPDATE
  public."refTravalData"
SET
  "refItinaryMapPath" = NULL
WHERE
  "refTravalDataId" = $1
RETURNING
  *;
`;
