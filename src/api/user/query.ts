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

export const addTourBookingQuery = `
INSERT INTO
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
    "refAgreementPath",
    "paymentId",
    "createdAt",
    "createdBy",
    "refuserId"
    
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 )
RETURNING
  *;
`;

export const getPackageNameQuery = `SELECT
  "refPackageName",
  "refTourCustID"
FROM
  public."refPackage"
WHERE
  "refPackageId" = $1;
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
        "refPassPort",
        "refAgreementPath",
        "paymentId",
        "createdAt", 
        "createdBy",
        "refuserId"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
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
        "refOtherRequirements", 
        "refFormDetails",
        "refAgreementPath",
        "paymentId",
        "createdAt", 
        "createdBy",
        "refuserId"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,$16, $17) 
    RETURNING *;

`;

export const getcarNameQuery = `
SELECT
  vt."refVehicleTypeName",
  cc."refCarTypeName",
  ct."refCarCustId",
  ct."refCarPrice"
FROM
  public."refCarsTable" ct
  LEFT JOIN public."refVehicleType" vt ON CAST(vt."refVehicleTypeId" AS INTEGER) = ct."refVehicleTypeId"
  LEFT JOIN public."refCarType" cc ON CAST(cc."refCarTypeId" AS INTEGER) = ct."refCarTypeId"
WHERE
  ct."refCarsId" = $1;
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

// export const listallTourQuery = `
// WITH
//   "location" AS (
//     SELECT
//       rp.*,
//       rtd."refItinary",
//       rtd."refItinaryMapPath",
//       rtd."refTravalInclude",
//       rtd."refTravalExclude",
//       rtd."refSpecialNotes",
//       rtd."refTravalOverView",
//       rd.*,
//       rg."refGallery",
//       rc."refCategoryName",
//       ARRAY_AGG(rl."refLocationName") AS "refLocationName"
//     FROM
//       public."refPackage" rp
//       LEFT JOIN public."refGallery" rg ON CAST(rg."refPackageId" AS INTEGER) = rp."refPackageId"
//       LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
//       LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
//       LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
//       LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
//         string_to_array(
//           regexp_replace(rp."refLocation", '[{}]', '', 'g'),
//           ','
//         )::INTEGER[]
//       )
//     WHERE
//       rp."isDelete" IS null
//       OR "rp"."isDelete" IS false
//     GROUP BY
//       rp."refPackageId",
//       rtd."refTravalDataId",
//       rd."refDestinationId",
//       rg."refGallery",
//       rc."refCategoryId"
//   ),
//   "activity" AS (
//     SELECT
//       l."refPackageName",
//       l."refLocationName",
//       l."refDestinationName",
//       ARRAY_AGG(ra."refActivitiesName") AS "Activity",
//       l."refDesignationId",
//       l."refTravalInclude",
//       l."refTravalExclude",
//       l."refPackageId",
//       l."refTravalDataId",
//       l."refItinary",
//       l."refItinaryMapPath",
//       l."refSpecialNotes",
//       l."refTravalOverView",
//       l."refGallery",
//       l."refCategoryName",
//       l."refDurationIday",
//       l."refDurationINight",
//       l."refGroupSize",
//       l."refTourCode",
//       l."refTourPrice",
//       l."refSeasonalPrice",
//       l."refCoverImage"
//     FROM
//       "location" l
//       LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
//         string_to_array(
//           regexp_replace(l."refActivity", '[{}]', '', 'g'),
//           ','
//         )::INTEGER[]
//       )
//     GROUP BY
//       l."refPackageName",
//       l."refLocationName",
//       l."refDestinationName",
//       l."refDesignationId",
//       l."refTravalInclude",
//       l."refTravalExclude",
//       l."refPackageId",
//       l."refItinary",
//       l."refItinaryMapPath",
//       l."refSpecialNotes",
//       l."refTravalOverView",
//       l."refTravalDataId",
//       l."refGallery",
//       l."refCategoryName",
//       l."refDurationIday",
//       l."refDurationINight",
//       l."refGroupSize",
//       l."refTourCode",
//       l."refTourPrice",
//       l."refSeasonalPrice",
//       l."refCoverImage"
//   )
// SELECT
//   aa.*,
//   ARRAY_AGG(DISTINCT ti."refTravalInclude") AS "travalInclude",
//   ARRAY_AGG(DISTINCT te."refTravalExclude") AS "travalExclude"
// FROM
//   "activity" aa
//   LEFT JOIN public."refTravalInclude" ti ON CAST(ti."refTravalIncludeId" AS INTEGER) = ANY (
//     string_to_array(
//       regexp_replace(aa."refTravalInclude", '[{}]', '', 'g'),
//       ','
//     )::INTEGER[]
//   )
//   LEFT JOIN public."refTravalExclude" te ON CAST(te."refTravalExcludeId" AS INTEGER) = ANY (
//     string_to_array(
//       regexp_replace(aa."refTravalExclude", '[{}]', '', 'g'),
//       ','
//     )::INTEGER[]
//   )
// GROUP BY
//   aa."refPackageName",
//   aa."refLocationName",
//   aa."refDestinationName",
//   aa."Activity",
//   aa."refDesignationId",
//   aa."refTravalInclude",
//   aa."refTravalExclude",
//   aa."refPackageId",
//   aa."refItinary",
//   aa."refItinaryMapPath",
//   aa."refSpecialNotes",
//   aa."refTravalOverView",
//   aa."refTravalDataId",
//   aa."refGallery",
//   aa."refCategoryName",
//   aa."refDurationIday",
//   aa."refDurationINight",
//   aa."refGroupSize",
//   aa."refTourCode",
//   aa."refTourPrice",
//   aa."refSeasonalPrice",
//   aa."refCoverImage";
//   `;

export const listallTourQuery = `
 WITH
  base AS (
    SELECT
      rp."refCategoryId",
      rp."refPackageId",
      rp."refPackageName",
      rp."refLocation",
      rp."refActivity",
      rp."refDesignationId",
      rp."refDurationIday",
      rp."refDurationINight",
      rp."refGroupSize",
      rp."refTourCode",
      rp."refTourPrice",
      rp."refSeasonalPrice",
      rp."refCoverImage",
      rtd."refTravalDataId",
      rtd."refItinary",
      rtd."refItinaryMapPath",
      rtd."refTravalInclude",
      rtd."refTravalExclude",
      rtd."refSpecialNotes",
      rtd."refTravalOverView",
      rd."refDestinationName",
      rc."refCategoryName"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
      LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
    WHERE
      rp."isDelete" IS NULL
      OR rp."isDelete" = false
  ),
  final AS (
    SELECT
      b.*,
      (
        SELECT
          ARRAY_AGG(DISTINCT rl."refLocationName")
        FROM
          public."refLocation" rl
        WHERE
          CAST(rl."refLocationId" AS INTEGER) = ANY (
            string_to_array(
              regexp_replace(b."refLocation", '[{}]', '', 'g'),
              ','
            )::INTEGER[]
          )
      ) AS "refLocationName",
      (
        SELECT
          ARRAY_AGG(DISTINCT rg."refGallery")
        FROM
          public."refGallery" rg
        WHERE
          CAST(rg."refPackageId" AS INTEGER) = b."refPackageId"
      ) AS "refGallery",
      (
        SELECT
          ARRAY_AGG(DISTINCT ra."refActivitiesName")
        FROM
          public."refActivities" ra
        WHERE
          CAST(ra."refActivitiesId" AS INTEGER) = ANY (
            string_to_array(
              regexp_replace(b."refActivity", '[{}]', '', 'g'),
              ','
            )::INTEGER[]
          )
      ) AS "Activity",
      (
        SELECT
          ARRAY_AGG(DISTINCT ti."refTravalInclude")
        FROM
          public."refTravalInclude" ti
        WHERE
          CAST(ti."refTravalIncludeId" AS INTEGER) = ANY (
            string_to_array(
              regexp_replace(b."refTravalInclude", '[{}]', '', 'g'),
              ','
            )::INTEGER[]
          )
      ) AS "travalInclude",
      (
        SELECT
          ARRAY_AGG(DISTINCT te."refTravalExclude")
        FROM
          public."refTravalExclude" te
        WHERE
          CAST(te."refTravalExcludeId" AS INTEGER) = ANY (
            string_to_array(
              regexp_replace(b."refTravalExclude", '[{}]', '', 'g'),
              ','
            )::INTEGER[]
          )
      ) AS "travalExclude"
    FROM
      base b
  )
SELECT
  *
FROM
  final
ORDER BY
  "refPackageId"; 
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

export const listCarsQuery = `
SELECT
  rc."refCarsId",
  rvt."refVehicleTypeName",
  ct."refCarTypeName",
  rc."refCarCustId",
  rc."refPersonCount",
  rc."refBagCount",
  rc."refFuelType",
  rc."refcarManufactureYear",
  rc."refMileage",
  rc."refTrasmissionType",
  rc."refFuleLimit",
  rc."refCarPath",
  rc."refCarPrice",
  rc."refCarTypeId"
FROM
  public."refCarsTable" rc
  LEFT JOIN public."refVehicleType" rvt ON CAST(rvt."refVehicleTypeId" AS INTEGER) = rc."refVehicleTypeId"
  LEFT JOIN public."refCarType" ct ON CAST(ct."refCarTypeId" AS INTEGER) = rc."refCarTypeId"
WHERE
  rc."isDelete" IS NOT true
  AND rc."refCarTypeId" = $1;
     
  `;

// export const getCarsByIdQuery = `
//  WITH
//   "carData" AS (
//     SELECT
//       rvt."refVehicleTypeId",
//       rvt."refVehicleTypeName",
//       rc."refPersonCount",
//       rc."refBagCount",
//       rc."refFuelType",
//       rc."refcarManufactureYear",
//       rc."refMileage",
//       rc."refTrasmissionType",
//       rc."refFuleLimit",
//       rc."refCarPath",
//       rc."refCarPrice",
//       rc."refOtherRequirements",
//       rc."refInclude",
//       rc."refExclude",
//       rc."refFormDetails",
//       tc."refRentalAgreement",
//       tc."refPaymentTerms",
//       tc."refFuelPolicy",
//       ARRAY_AGG(rb."refBenifitsName") AS "refBenifitsName"
//     FROM
//       public."refCarsTable" rc
//       LEFT JOIN public."refVehicleType" rvt ON CAST(rvt."refVehicleTypeId" AS INTEGER) = rc."refVehicleTypeId"
//       LEFT JOIN public."refTermsAndConditions" tc ON CAST(tc."refCarsId" AS INTEGER) = rc."refCarsId"
//       LEFT JOIN public."refBenifits" rb ON CAST(rb."refBenifitsId" AS INTEGER) = ANY (
//         string_to_array(
//           regexp_replace(rc."refBenifits", '[{}]', '', 'g'),
//           ','
//         )::INTEGER[]
//       )
//     WHERE
//       rc."isDelete" IS NOT true
//       AND rc."refCarsId" = $1
//     GROUP BY
//       rc."refCarsId",
//       rvt."refVehicleTypeName",
//       rc."refPersonCount",
//       rc."refBagCount",
//       rc."refFuelType",
//       rc."refcarManufactureYear",
//       rc."refMileage",
//       rc."refTrasmissionType",
//       rc."refFuleLimit",
//       rc."refCarPath",
//       rc."refCarPrice",
//       rc."refOtherRequirements",
//       tc."refRentalAgreement",
//       tc."refPaymentTerms",
//       tc."refFuelPolicy",
//       tc."refPaymentTerms",
//       rvt."refVehicleTypeId"
//   )
// SELECT
//   cd."refVehicleTypeId",
//   cd."refVehicleTypeName",
//   cd."refPersonCount",
//   cd."refBagCount",
//   cd."refFuelType",
//   cd."refcarManufactureYear",
//   cd."refMileage",
//   cd."refTrasmissionType",
//   cd."refFuleLimit",
//   cd."refCarPath",
//   cd."refCarPrice",
//   cd."refOtherRequirements",
//   ARRAY_AGG(DISTINCT ri."refIncludeName") AS "refIncludeName",
//   ARRAY_AGG(DISTINCT re."refExcludeName") AS "refExcludeName",
//   ARRAY_AGG(DISTINCT fd."refFormDetails") AS "refFormDetails",
//   cd."refRentalAgreement",
//   cd."refPaymentTerms",
//   cd."refFuelPolicy",
//   cd."refPaymentTerms"
// FROM
//   "carData" cd
//   LEFT JOIN public."refInclude" ri ON CAST(ri."refIncludeId" AS INTEGER) = ANY (
//     string_to_array(
//       regexp_replace(cd."refInclude", '[{}]', '', 'g'),
//       ','
//     )::INTEGER[]
//   )
//   LEFT JOIN public."refExclude" re ON CAST(re."refExcludeId" AS INTEGER) = ANY (
//     string_to_array(
//       regexp_replace(cd."refExclude", '[{}]', '', 'g'),
//       ','
//     )::INTEGER[]
//   )
//   LEFT JOIN public."refFormDetails" fd ON CAST(fd."refFormDetailsId" AS INTEGER) = ANY (
//     string_to_array(
//       regexp_replace(cd."refFormDetails", '[{}]', '', 'g'),
//       ','
//     )::INTEGER[]
//   )
// GROUP BY
//   cd."refVehicleTypeName",
//   cd."refPersonCount",
//   cd."refBagCount",
//   cd."refFuelType",
//   cd."refcarManufactureYear",
//   cd."refMileage",
//   cd."refTrasmissionType",
//   cd."refFuleLimit",
//   cd."refCarPath",
//   cd."refCarPrice",
//   cd."refOtherRequirements",
//   cd."refRentalAgreement",
//   cd."refPaymentTerms",
//   cd."refFuelPolicy",
//   cd."refPaymentTerms",
//   cd."refVehicleTypeId";
// `;
export const getCarsByIdQuery = `

WITH
  "carData" AS (
    SELECT
      rvt."refVehicleTypeId",
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
      tc."refRentalAgreement",
      tc."refPaymentTerms",
      tc."refFuelPolicy",
    rc."refCarTypeId",
    ct."refCarTypeName",
      ARRAY_AGG(rb."refBenifitsName") AS "refBenifitsName"
    FROM
      public."refCarsTable" rc
      LEFT JOIN public."refVehicleType" rvt ON CAST(rvt."refVehicleTypeId" AS INTEGER) = rc."refVehicleTypeId"
      LEFT JOIN public."refTermsAndConditions" tc ON CAST(tc."refCarsId" AS INTEGER) = rc."refCarsId"
    LEFT JOIN public."refCarType" ct ON CAST(ct."refCarTypeId" AS INTEGER) = rc."refCarTypeId"
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
      tc."refRentalAgreement",
      tc."refPaymentTerms",
      tc."refFuelPolicy",
      tc."refPaymentTerms",
      rvt."refVehicleTypeId",
    rc."refCarTypeId",
    ct."refCarTypeName"
  )
SELECT
  cd."refVehicleTypeId",
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
  cd."refCarTypeId",
    cd."refCarTypeName",
  ARRAY_AGG(DISTINCT ri."refIncludeName") AS "refIncludeName",
  ARRAY_AGG(DISTINCT re."refExcludeName") AS "refExcludeName",
  ARRAY_AGG(DISTINCT fd."refFormDetails") AS "refFormDetails",
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
  cd."refRentalAgreement",
  cd."refPaymentTerms",
  cd."refFuelPolicy",
  cd."refPaymentTerms",
  cd."refVehicleTypeId",
  cd."refCarTypeId",
  cd."refCarTypeName";
`;

// export const listCarParkingQuery = `
// SELECT
//   cp.*,
//   pt."refParkingTypeName",
//   cpt."refCarParkingTypeName",
//   cpb."travelStartDate",
//   cpb."travelEndDate",
//   array_agg(DISTINCT rf."refServiceFeatures") AS "ServiceFeaturesList"
// FROM
//   public."refCarParkingTable" AS cp
//   LEFT JOIN public."refParkingType" pt ON pt."refParkingTypeId" = cp."refParkingTypeId"
//   LEFT JOIN public."userCarParkingBooking" cpb ON cpb."refCarParkingId" = cp."refCarParkingId"
//   LEFT JOIN public."refCarParkingType" cpt ON cpt."refCarParkingTypeId" = cp."refCarParkingTypeId"
//   LEFT JOIN public."refServiceFeatures" rf ON rf."refServiceFeaturesId" = ANY (
//     string_to_array(
//       regexp_replace(cp."ServiceFeatures", '[{}]', '', 'g'),
//       ','
//     )::int[]
//   )
// WHERE
//   $1::TEXT BETWEEN cp."MinimumBookingDuration" AND cp."MaximumBookingDuration"
//   AND NOT (
//     cpb."travelStartDate" <= $2::TEXT
//     AND cpb."travelEndDate" >= $1::TEXT
//   )
//   AND cp."refAssociatedAirport" = $3
//   AND cp."refCarParkingTypeId" = $4
//   AND cp."refParkingTypeId" = $5
//   AND cp."isDelete" IS NOT true
// GROUP BY
//   cp."refCarParkingId",
//   cp."MinimumBookingDuration",
//   cp."MaximumBookingDuration",
//   cp."refParkingTypeId",
//   cp."refCarParkingTypeId",
//   cp."refAssociatedAirport",
//   cp."isDelete",
//   pt."refParkingTypeName",
//   cpt."refCarParkingTypeName",
//   cpb."travelStartDate",
//   cpb."travelEndDate"

// `;

export const listCarParkingQuery = `
SELECT DISTINCT
  cp.*,
  pt."refParkingTypeName",
  cpt."refCarParkingTypeName",
  cpb."travelStartDate",
  cpb."travelEndDate",
  array_agg(DISTINCT rf."refServiceFeatures") AS "ServiceFeaturesList"
FROM
  public."refCarParkingTable" AS cp
  LEFT JOIN public."refParkingType" pt 
    ON CAST(pt."refParkingTypeId" AS INTEGER) = CAST(cp."refParkingTypeId" AS INTEGER)
  LEFT JOIN public."userCarParkingBooking" cpb 
    ON CAST(cpb."refCarParkingId" AS INTEGER) = CAST(cp."refCarParkingId" AS INTEGER)
  LEFT JOIN public."refCarParkingType" cpt 
    ON CAST(cpt."refCarParkingTypeId" AS INTEGER) = CAST(cp."refCarParkingTypeId" AS INTEGER)
  LEFT JOIN public."refServiceFeatures" rf 
    ON CAST(rf."refServiceFeaturesId" AS INTEGER) = ANY (
      string_to_array(
        regexp_replace(cp."ServiceFeatures", '[{}]', '', 'g'),
        ','
      )::INTEGER[]
    )
    
    WHERE
    
  $1::date BETWEEN cp."MinimumBookingDuration"::date AND cp."MaximumBookingDuration"::date
  AND (
    cpb."isDelete" IS NOT true AND
    cpb."travelStartDate"::date IS NULL OR
    NOT (
      cpb."travelStartDate"::date <= $2::date AND
      cpb."travelEndDate"::date >= $1::date
    )
  )
  AND cp."refAssociatedAirport" = $3
  AND cp."refCarParkingTypeId" = $4
  AND cp."refParkingTypeId" = $5
  AND cp."isDelete" IS NOT true
    
    GROUP BY 
    cp."refCarParkingId",
    pt."refParkingTypeId",
    cpt."refCarParkingTypeName",
    cpb."carParkingBookingId"
   
  
`;
export const listCarParkingByIdQuery = `
SELECT
  cp.*,
  pt."refParkingTypeName",
  cpt."refCarParkingTypeName",
  array_agg(rf."refServiceFeatures") AS "ServiceFeaturesList"
FROM
  public."refCarParkingTable" AS cp
  LEFT JOIN public."refParkingType" pt ON CAST(pt."refParkingTypeId" AS INTEGER) = cp."refParkingTypeId"
  LEFT JOIN public."refCarParkingType" cpt ON CAST(cpt."refCarParkingTypeId" AS INTEGER) = cp."refCarParkingTypeId"
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
  cp."refCarParkingId",
  pt."refParkingTypeName",
  cpt."refCarParkingTypeId";
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

export const getImageRecordQuery = `
SELECT
  *
FROM
  public."refTravalData" 
WHERE
  "refTravalDataId" = $1;
`;

export const deleteImageRecordQuery = `
UPDATE
  public."refTravalData"
SET
  "refItinaryMapPath" = NULL
WHERE
  "refTravalDataId" = $1
RETURNING
  *;
`;

// export const checkQuery = `
// SELECT
//   *
// FROM
//   public."refUserDomain"
// WHERE
//   "refUsername" = $1
//   OR "refUserEmail" = $1
// LIMIT
//   10;
//   `;

export const checkQuery = `
SELECT
  *
FROM
  public."refUserDomain"
WHERE
  "refUsername" = $1
  OR "refUserEmail" = $2
LIMIT 1;
`;

export const getLastCustomerIdQuery = `SELECT
  COUNT(*)
FROM
  public.users u
WHERE
  u."refCustId" LIKE 'EV-CUS-%';
  `;

export const insertUserQuery = `INSERT INTO
  public.users(
    "refCustId",
    "refFName",
    "refLName",
    "refDOB",
    "refMoblile",
    "refUserTypeId",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING
  *;`;

export const insertUserDomainQuery = `
INSERT INTO
  public."refUserDomain" (
    "refUserId",
    "refUserEmail",
    "refUserPassword",
    "refUserHashedPassword",
    "refUsername",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7)
RETURNING
  *;`;

export const getUsersQuery = `SELECT
  *
FROM
  public.users u
  LEFT JOIN public."refUserDomain" ud ON CAST(ud."refUserId" AS INTEGER) = u."refuserId"
WHERE
  ud."refUserEmail" = $1
  AND u."refCustId" LIKE 'EV-CUS-%';
  `;

export const updateUserPasswordQuery = `UPDATE
  public."refUserDomain"
SET
  "refUserPassword" = $3,
  "refUserHashedPassword" = $4,
  "updatedAt" = $5,
  "updatedBy" = $6
WHERE
  "refUserEmail" = $1
  AND "refUserId" = $2
RETURNING
  *;
`;

export const listTourBrochureQuery = `
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

export const profileDataQuery = `
SELECT
  u.*,
  ud."refUserEmail",
  ud."refUserHashedPassword",
  ud."refUsername",
  ua."refUserAddress",
  ua."refUserCity",
  ua."refUserState",
  ua."refUserCountry",
  ua."refUserZipCode"
FROM
  public."users" u
  LEFT JOIN public."refUserDomain" ud ON CAST(ud."refUserId" AS INTEGER) = u."refuserId"
  LEFT JOIN public."refUserAddress" ua ON CAST(ua."refUserId" AS INTEGER) = u."refuserId"
WHERE
  u."refuserId" = $1
  AND u."isDelete" IS NOT true
`;

export const updateProfileDataQuery = `UPDATE
  public."users"
SET
  "refFName" = $1,
  "refLName" = $2,
  "refDOB" = $3,
  "refMoblile" = $4,
  "updatedAt" = $5,
  "updatedBy" = $6
  WHERE "refuserId" = $7
RETURNING
  *;
`;
export const updatedomainDataQuery = `
UPDATE
  public."refUserDomain"
SET
  "refUserEmail" = $1,
  "refUserPassword" = $2,
  "refUserHashedPassword" = $3,
  "updatedAt" = $4,
  "updatedBy" = $5
   WHERE "refUserId" = $6
RETURNING
  *;

`;

export const updateAddressDataQuery = `
UPDATE
  public."refUserAddress"
SET
  "refUserAddress" = $1,
  "refUserCity" = $2,
  "refUserState" = $3,
  "refUserCountry" = $4,
  "refUserZipCode" = $5,
  "updatedAt" = $6,
  "updatedBy" = $7
WHERE
  "refUserId" = $8
RETURNING
  *;
`;

export const userTourBookingHistoryQuery = `
SELECT
  tb.*,
  rp."refPackageName",
  rp."refDurationIday",
  rp."refDurationINight",
  rp."refTourCode",
  rp."refTourPrice"
FROM
  public."userTourBooking" tb
  LEFT JOIN public."refPackage" rp ON CAST(rp."refPackageId" AS INTEGER) = tb."refPackageId"
WHERE
  tb."refuserId" = $1
  `;

export const userCarBookingHistoryQuery = `
SELECT
  cb.*,
  vt."refVehicleTypeName",
  ct."refPersonCount",
  ct."refBagCount",
  ct."refCarPath",
  ct."refCarPrice",
  ct."refCarCustId",
  rc."refCarTypeName"
FROM
  public."userCarBooking" cb
  LEFT JOIN public."refCarsTable" ct ON CAST(ct."refCarsId" AS INTEGER) = cb."refCarsId"
  LEFT JOIN public."refVehicleType" vt ON CAST(vt."refVehicleTypeId" AS INTEGER) = ct."refVehicleTypeId"
  LEFT JOIN public."refCarType" rc ON CAST(rc."refCarTypeId" AS INTEGER) = ct."refCarTypeId"
WHERE
  cb."refuserId" = $1
  `;

export const userCarParkingBookingHistoryQuery = `
SELECT
  cp.*,
  pt.*,
  pa."refParkingTypeName",
  cpt."refCarParkingTypeName",
  array_agg(rf."refServiceFeatures") AS "refServiceFeaturesList"
FROM
  public."userCarParkingBooking" cp
  LEFT JOIN public."refCarParkingTable" pt ON CAST(pt."refCarParkingId" AS INTEGER) = cp."refCarParkingId"
  LEFT JOIN public."refParkingType" pa ON CAST(pa."refParkingTypeId" AS INTEGER) = pt."refParkingTypeId"
  LEFT JOIN public."refCarParkingType" cpt ON CAST(cpt."refCarParkingTypeId" AS INTEGER) = pt."refCarParkingTypeId"
LEFT JOIN public."refServiceFeatures" rf ON CAST(rf."refServiceFeaturesId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(pt."ServiceFeatures", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
 WHERE cp."isDelete" IS NOT true AND cp."refuserId" = $1

GROUP BY 
cp."carParkingBookingId",
pt."refCarParkingId",
pa."refParkingTypeName",
cpt."refCarParkingTypeName"
  `;

export const listAssociateAirportQuery = `
SELECT
  "refAssociatedAirport"
FROM
  public."refCarParkingTable"
WHERE
  "isDelete" IS NOT true;
`;
export const listParkingTypeQuery = `
SELECT
  *
FROM
  public."refCarParkingType"
`;

export const listCarParkingTypeQuery = `
SELECT
  *
FROM
  public."refParkingType"
`;

export const insertUserAddressQuery = `
INSERT INTO
  public."refUserAddress" (
    "refUserId",
    "refUserAddress",
    "refUserCity",
    "refUserState",
    "refUserCountry",
    "refUserZipCode",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING
  *;
`;

export const insertcarParkingBookingQuery = `
INSERT INTO
  public."userCarParkingBooking" (
    "refuserId",
    "travelStartDate",
    "travelEndDate",
    "refCarParkingId",
    "returnFlightNumber",
    "returnFlightLocation",
    "VehicleModel",
    "vehicleNumber",
    "refHandOverTime",
    "refReturnTime",
    "WhoWillHandover",
    "HandoverPersonName",
    "HandoverPersonPhone",
    "HandoverPersonEmail",
    "refAgreementPath",
    "paymentId",
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
    $18
  )
RETURNING
  *;
`;

export const getUserResultQuery = `
SELECT
  u.*,
  d.*
FROM
  public."users" u
  LEFT JOIN public."refUserDomain" d ON CAST (d."refUserId" AS INTEGER ) = u."refuserId"
WHERE
  u."refuserId" = $1 AND u."isDelete" IS NOT true
`;

export const getParkingResultQuery = `
SELECT
  *
FROM
  public."refCarParkingTable"
WHERE
  "refCarParkingId" = $1
  
`
;