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

export const listTourQuery = `SELECT
  rp."refPackageId",
  rp."refPackageName",
  rd."refDestinationName",
  rp."refDurationIday",
  rp."refDurationINight",
  rc."refCategoryName",
  rp."refGroupSize",
  rp."refTourPrice",
  rp."refSeasonalPrice",
  rp."refCoverImage",
  STRING_AGG(DISTINCT rl."refLocationName", ', ') AS "refLocation",
  STRING_AGG(DISTINCT ra."refActivitiesName", ', ') AS "refActivity",
  rg."refGallery",
  rtd."refItinary",
  rtd."refItinaryMapPath",
  STRING_AGG(DISTINCT rti."refTravalInclude", ', ') AS "refTravalInclude",
  STRING_AGG(DISTINCT rte."refTravalExclude", ', ') AS "refTravalExclude",
  rtd."refSpecialNotes",
  rtd."refTravalOverView"
FROM
  public."refPackage" rp
  LEFT JOIN public."refGallery" rg ON CAST(rg."refPackageId" AS INTEGER) = rp."refPackageId"
    LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
  LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
  LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
  LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rp."refLocation", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
  LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rp."refActivity", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
  LEFT JOIN public."refTravalInclude" rti ON CAST(rti."refTravalIncludeId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rtd."refTravalInclude", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
  LEFT JOIN public."refTravalExclude" rte ON CAST(rte."refTravalExcludeId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rtd."refTravalExclude", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
WHERE
  rp."isDelete" IS NOT true AND rp."refPackageId" = $1
GROUP BY
  rp."refPackageId",
  rg."refGalleryId",
  rtd."refTravalDataId",
  rd."refDestinationId",
  rc."refCategoryId";
`;

export const listOtherTourQuery = `SELECT
  rp."refPackageId",
  rp."refPackageName",
  rd."refDestinationName",
  rp."refDurationIday",
  rp."refDurationINight",
  rc."refCategoryName",
  rp."refGroupSize",
  rp."refTourPrice",
  rp."refSeasonalPrice",
  rp."refCoverImage",
  STRING_AGG(DISTINCT rl."refLocationName", ', ') AS "refLocation",
  STRING_AGG(DISTINCT ra."refActivitiesName", ', ') AS "refActivity",
  rg."refGallery",
  rtd."refItinary",
  rtd."refItinaryMapPath",
  STRING_AGG(DISTINCT rti."refTravalInclude", ', ') AS "refTravalInclude",
  STRING_AGG(DISTINCT rte."refTravalExclude", ', ') AS "refTravalExclude",
  rtd."refSpecialNotes",
  rtd."refTravalOverView"
FROM
  public."refPackage" rp
  LEFT JOIN public."refGallery" rg ON CAST(rg."refPackageId" AS INTEGER) = rp."refPackageId"
    LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
  LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
  LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
  LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rp."refLocation", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
  LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rp."refActivity", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
  LEFT JOIN public."refTravalInclude" rti ON CAST(rti."refTravalIncludeId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rtd."refTravalInclude", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
  LEFT JOIN public."refTravalExclude" rte ON CAST(rte."refTravalExcludeId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rtd."refTravalExclude", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
WHERE
  rp."isDelete" IS NOT true AND rp."refPackageId" NOT IN ($1)
GROUP BY
  rp."refPackageId",
  rg."refGalleryId",
  rtd."refTravalDataId",
  rd."refDestinationId",
  rc."refCategoryId";



`;

export const listallTourQuery = `
SELECT
  rp."refPackageId",
  rp."refPackageName",
  rd."refDestinationName",
  rp."refDurationIday",
  rp."refDurationINight",
  rc."refCategoryName",
  rp."refGroupSize",
  rp."refTourPrice",
  rp."refSeasonalPrice",
  rp."refCoverImage", 
  STRING_AGG(DISTINCT rl."refLocationName", ', ') AS "refLocation",
  STRING_AGG(DISTINCT ra."refActivitiesName", ', ') AS "refActivity",
  rg."refGallery",
  rtd."refItinary",
  rtd."refItinaryMapPath",
  STRING_AGG(DISTINCT rti."refTravalInclude", ', ') AS "refTravalInclude",
  STRING_AGG(DISTINCT rte."refTravalExclude", ', ') AS "refTravalExclude",
  rtd."refSpecialNotes",
  rtd."refTravalOverView"
FROM
  public."refPackage" rp
  LEFT JOIN public."refGallery" rg ON CAST(rg."refPackageId" AS INTEGER) = rp."refPackageId"
  LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
  LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
  LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
  LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rp."refLocation", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
  LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rp."refActivity", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
  LEFT JOIN public."refTravalInclude" rti ON CAST(rti."refTravalIncludeId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rtd."refTravalInclude", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
  LEFT JOIN public."refTravalExclude" rte ON CAST(rte."refTravalExcludeId" AS INTEGER) = ANY (
    SELECT
      CAST(x AS INTEGER)
    FROM
      unnest(
        string_to_array(
          regexp_replace(rtd."refTravalExclude", '[{}]', '', 'g'),
          ','
        )
      ) AS x
    WHERE
      x ~ '^\d+$'
  )
WHERE
  rp."isDelete" IS NOT true
GROUP BY
  rp."refPackageId",
  rg."refGalleryId",
  rtd."refTravalDataId",
  rd."refDestinationId",
  rc."refCategoryId"
  ;
`;

export const addTravalDataQuery = `INSERT INTO
  public."refTravalData" (
    "refPackageId",
    "refItinary",
    "refItinaryMapPath",
    "refTravalInclude",
    "refTravalExclude",
    "refOtherRequirements",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, false)
RETURNING
  *;
`;

export const updateTravalDataQuery = `UPDATE
  public."refTravalData"
SET
  "refPackageId" = $2,
  "refItinary" = $3,
  "refItinaryMapPath" = $4,
  "refTravalInclude" = $5,
  "refTravalExclude" = $6,
  "refSpecialNotes" = $7,
  "updatedAt" = $8,
  "updatedBy" = $9
WHERE
  "refTravalDataId" = $1 
RETURNING
  *;
`;

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

export const getCarsByIdQuery = `SELECT
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
  WHERE rc."refCarsId" = $1;
`;

export const getOtherCarsQuery = `SELECT *
FROM public."refCarsTable"
WHERE "refCarsId" NOT IN ($1);
`;

export const listDestinationQuery = `SELECT * FROM public."refDestination" WHERE "isDelete" IS NOT true
        `;
