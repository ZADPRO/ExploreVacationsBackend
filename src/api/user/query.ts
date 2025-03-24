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
        "createdAt", 
        "createdBy"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
    RETURNING *;

`;

export const listTourQuery = `

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
      rc."refCategoryName",
      ARRAY_AGG(rl."refLocationName") AS "refLocationName"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refGallery" rg ON CAST(rg."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
      LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
      LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rp."refLocation", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    WHERE
     (rp."isDelete" IS null
      OR "rp"."isDelete" IS false ) AND rp."refPackageId" = $1
    GROUP BY
      rp."refPackageId",
      rtd."refTravalDataId",
      rd."refDestinationId",
      rg."refGallery",
      rc."refCategoryId"
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
      l."refGallery",
      l."refCategoryName",
      l."refDurationIday",
      l."refDurationINight",
      l."refGroupSize",
      l."refTourCode",
      l."refTourPrice",
      l."refSeasonalPrice",
      l."refCoverImage"
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
      l."refGallery",
      l."refCategoryName",
      l."refDurationIday",
      l."refDurationINight",
      l."refGroupSize",
      l."refTourCode",
      l."refTourPrice",
      l."refSeasonalPrice",
      l."refCoverImage"
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
  aa."refGallery",
  aa."refCategoryName",
  aa."refDurationIday",
  aa."refDurationINight",
  aa."refGroupSize",
  aa."refTourCode",
  aa."refTourPrice",
  aa."refSeasonalPrice",
  aa."refCoverImage";
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
      rc."refCategoryName",
      ARRAY_AGG(rl."refLocationName") AS "refLocationName"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refGallery" rg ON CAST(rg."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
      LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
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
      rg."refGallery",
      rc."refCategoryId"
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
      l."refGallery",
      l."refCategoryName",
      l."refDurationIday",
      l."refDurationINight",
      l."refGroupSize",
      l."refTourCode",
      l."refTourPrice",
      l."refSeasonalPrice",
      l."refCoverImage"
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
      l."refGallery",
      l."refCategoryName",
      l."refDurationIday",
      l."refDurationINight",
      l."refGroupSize",
      l."refTourCode",
      l."refTourPrice",
      l."refSeasonalPrice",
      l."refCoverImage"
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
  aa."refGallery",
  aa."refCategoryName",
  aa."refDurationIday",
  aa."refDurationINight",
  aa."refGroupSize",
  aa."refTourCode",
  aa."refTourPrice",
  aa."refSeasonalPrice",
  aa."refCoverImage"; 
  `;

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
rc."refCarsId",
  rvt."refVehicleTypeName",
  rc."refPersonCount",
  rc."refBagCount",
  rc."refFuelType",
  rc."refcarManufactureYear",
  rc."refMileage",
  rc."refTrasmissionType",
  rc."refFuleLimit",
  rc."refCarPath",
  rc."refCarPrice"
FROM
  public."refCarsTable" rc
  LEFT JOIN public."refVehicleType" rvt ON CAST(rvt."refVehicleTypeId" AS INTEGER) = rc."refVehicleTypeId"
  WHERE rc."isDelete" IS NOT true ;
      `;


export const getCarsByIdQuery = `
 WITH
  "carData" AS (
    SELECT
      rvt."refVehicleTypeName",
      rc."refPersonCount",
      rc."refBagCount",
      rc."refFuelType",
      rc."refcarManufactureYear",
      rc."refMileage",
      rc."refTrasmissionType",
      rc."refFuleLimit",
      rc."refCarPath",
      rc."refCarPrice",
      rc."refOtherRequirements",
      rc."refInclude",
      rc."refExclude",
      rc."refFormDetails",
      rdd."refDriverDetailsId",
      rdd."refDriverName",
      rdd."refDriverAge",
      rdd."refDriverMail",
      rdd."refDriverMobile",
      rdd."refDriverLocation",
      rdd."isVerified",
      tc."refRentalAgreement",
      tc."refPaymentTerms",
      tc."refFuelPolicy",
      ARRAY_AGG(rb."refBenifitsName") AS "refBenifitsName"
    FROM
      public."refCarsTable" rc
      LEFT JOIN public."refVehicleType" rvt ON CAST(rvt."refVehicleTypeId" AS INTEGER) = rc."refVehicleTypeId"
      LEFT JOIN public."refDriverDetails" rdd ON CAST(rdd."refDriverDetailsId" AS INTEGER) = rc."refDriverDetailsId"
      LEFT JOIN public."refTermsAndConditions" tc ON CAST(tc."refCarsId" AS INTEGER) = rc."refCarsId"
      LEFT JOIN public."refBenifits" rb ON CAST(rb."refBenifitsId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rc."refBenifits", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    WHERE
      rc."isDelete" IS NOT true
      AND rc."refCarsId" = $1
    GROUP BY
      rc."refCarsId",
      rvt."refVehicleTypeName",
      rc."refPersonCount",
      rc."refBagCount",
      rc."refFuelType",
      rc."refcarManufactureYear",
      rc."refMileage",
      rc."refTrasmissionType",
      rc."refFuleLimit",
      rc."refCarPath",
      rc."refCarPrice",
      rc."refOtherRequirements",
      rdd."refDriverDetailsId",
      rdd."refDriverName",
      rdd."refDriverAge",
      rdd."refDriverMail",
      rdd."refDriverMobile",
      rdd."refDriverLocation",
      rdd."isVerified",
      tc."refRentalAgreement",
      tc."refPaymentTerms",
      tc."refFuelPolicy",
      tc."refPaymentTerms"
  )
SELECT
  cd."refVehicleTypeName",
  cd."refPersonCount",
  cd."refBagCount",
  cd."refFuelType",
  cd."refcarManufactureYear",
  cd."refMileage",
  cd."refTrasmissionType",
  cd."refFuleLimit",
  cd."refCarPath",
  cd."refCarPrice",
  cd."refOtherRequirements",
  ARRAY_AGG(DISTINCT ri."refIncludeName") AS "refIncludeName",
  ARRAY_AGG(DISTINCT re."refExcludeName") AS "refExcludeName",
  ARRAY_AGG(DISTINCT fd."refFormDetails") AS "refFormDetails",
  cd."refDriverDetailsId",
  cd."refDriverName",
  cd."refDriverAge",
  cd."refDriverMail",
  cd."refDriverMobile",
  cd."refDriverLocation",
  cd."isVerified",
  cd."refRentalAgreement",
  cd."refPaymentTerms",
  cd."refFuelPolicy",
  cd."refPaymentTerms"
FROM
  "carData" cd
  LEFT JOIN public."refInclude" ri ON CAST(ri."refIncludeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(cd."refInclude", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refExclude" re ON CAST(re."refExcludeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(cd."refExclude", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refFormDetails" fd ON CAST(fd."refFormDetailsId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(cd."refFormDetails", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
GROUP BY
  cd."refVehicleTypeName",
  cd."refPersonCount",
  cd."refBagCount",
  cd."refFuelType",
  cd."refcarManufactureYear",
  cd."refMileage",
  cd."refTrasmissionType",
  cd."refFuleLimit",
  cd."refCarPath",
  cd."refCarPrice",
  cd."refOtherRequirements",
  cd."refDriverDetailsId",
  cd."refDriverName",
  cd."refDriverAge",
  cd."refDriverMail",
  cd."refDriverMobile",
  cd."refDriverLocation",
  cd."isVerified",
  cd."refRentalAgreement",
  cd."refPaymentTerms",
  cd."refFuelPolicy",
  cd."refPaymentTerms";
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
