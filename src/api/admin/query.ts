// export const selectUserByLogin = `
// SELECT *
// FROM  public."refUserDomain" rd
// WHERE rd."refUserEmail" = $1 OR rd."refUsername" = $1;
// `;

export const selectUserByLogin = `
SELECT
  u."refFName",
  rd.*,
  u."refUserTypeId",
  array_agg(ut."refUserType") AS "refUserType",
  array_to_json(
    string_to_array(
      trim(
        both '{}'
        from
          u."refUserTypeId"
      ),
      ','
    )::int[]
  ) AS "userTypeId"
FROM
  public."refUserDomain" rd
  LEFT JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = rd."refUserId"
  LEFT JOIN public."refUserType" ut ON CAST(ut."refUserTypeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(u."refUserTypeId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  (
    rd."refUserEmail" = $1
  )
  AND u."isDelete" IS NOT true
GROUP BY
  rd."refUserDomId",
  u."refUserTypeId",
  u."refuserId"
  `;

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

// export const listTourBookingsQuery = `

// WITH
//   "location" AS (
//     SELECT
//       rp.*,
//       urt."userTourBookingId",
//       urt."refUserName",
//       urt."refUserMail",
//       urt."refUserMobile",
//       urt."refPickupDate",
//       urt."refAdultCount",
//       urt."refChildrenCount",
//       urt."refInfants",
//       urt."refOtherRequirements",
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
//       public."userTourBooking" urt
//       LEFT JOIN public."refPackage" rp ON CAST(rp."refPackageId" AS INTEGER) = urt."refPackageId"
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
//       rc."refCategoryId",
//       urt."userTourBookingId"
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
//       l."refCoverImage",
//       l."userTourBookingId",
//       l."refUserName",
//       l."refUserMail",
//       l."refUserMobile",
//       l."refPickupDate",
//       l."refAdultCount",
//       l."refChildrenCount",
//       l."refInfants",
//       l."refOtherRequirements"
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
//       l."refCoverImage",
//       l."userTourBookingId",
//       l."refUserName",
//       l."refUserMail",
//       l."refUserMobile",
//       l."refPickupDate",
//       l."refAdultCount",
//       l."refChildrenCount",
//       l."refInfants",
//       l."refOtherRequirements"
//   )
// SELECT
//   aa.*,
//   ARRAY_AGG(ti."refTravalInclude") AS "travalInclude",
//   ARRAY_AGG(te."refTravalExclude") AS "travalExclude"
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
//   aa."refCoverImage",
//   aa."userTourBookingId",
//   aa."refUserName",
//   aa."refUserMail",
//   aa."refUserMobile",
//   aa."refPickupDate",
//   aa."refAdultCount",
//   aa."refChildrenCount",
//   aa."refInfants",
//   aa."refOtherRequirements";

// `;

export const listTourBookingsQuery = `

WITH
  "base" AS (
    SELECT
      u.*,
      urt."userTourBookingId",
      urt."refuserId",
      urt."refAgreementPath",
      urt."refStatus",
      urt."refUserFname",
      urt."refUserLname",
      urt."refUserMail",
      urt."refUserMobile",
      urt."refPickupDate",
      urt."refAdultCount",
      urt."refChildrenCount",
      urt."refInfants",
      urt."refOtherRequirements",
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
      rc."refCategoryName",
      rp."refTourCustID"
    FROM
      public."userTourBooking" urt
      LEFT JOIN public."refPackage" rp ON CAST(rp."refPackageId" AS INTEGER) = urt."refPackageId"
      LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
      LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
      LEFT JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = urt."refuserId"
    WHERE
      rp."isDelete" IS NOT true
      AND urt."isDelete" IS NOT true
  ),
  locations AS (
    SELECT
      rp."refPackageId",
      ARRAY_AGG(DISTINCT rl."refLocationName") AS "refLocationName"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rp."refLocation", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    GROUP BY
      rp."refPackageId"
  ),
  "galleries" AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT "refGallery") AS "refGallery"
    FROM
      public."refGallery"
    GROUP BY
      "refPackageId"
  ),
  "activities" AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT ra."refActivitiesName") AS "Activity"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rp."refActivity", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    GROUP BY
      rp."refPackageId"
  ),
  "includes" AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT ti."refTravalInclude") AS "travalInclude"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refTravalInclude" ti ON CAST(ti."refTravalIncludeId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(
            (
              SELECT
                rtd."refTravalInclude"
              FROM
                public."refTravalData" rtd
              WHERE
                CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
              LIMIT
                1
            ),
            '[{}]',
            '',
            'g'
          ),
          ','
        )::INTEGER[]
      )
    GROUP BY
      rp."refPackageId"
  ),
  "excludes" AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT te."refTravalExclude") AS "travalExclude"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refTravalExclude" te ON CAST(te."refTravalExcludeId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(
            (
              SELECT
                rtd."refTravalExclude"
              FROM
                public."refTravalData" rtd
              WHERE
                CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
              LIMIT
                1
            ),
            '[{}]',
            '',
            'g'
          ),
          ','
        )::INTEGER[]
      )
    GROUP BY
      rp."refPackageId"
  )
SELECT
  b.*,
  l."refLocationName",
  g."refGallery",
  a."Activity",
  i."travalInclude",
  e."travalExclude"
FROM
  "base" b
  LEFT JOIN locations l ON b."refPackageId" = l."refPackageId"
  LEFT JOIN galleries g ON b."refPackageId" = g."refPackageId"
  LEFT JOIN activities a ON b."refPackageId" = a."refPackageId"
  LEFT JOIN includes i ON b."refPackageId" = i."refPackageId"
  LEFT JOIN excludes e ON b."refPackageId" = e."refPackageId"
ORDER BY
  b."refPackageId",
  b."userTourBookingId";
     `;

export const listCarBookingsQuery = `
SELECT DISTINCT ON (rcb."userCarBookingId")
  cg."refCarGroupName",
  u.*,
  rcb.*,
  ct.*,
  vt."refVehicleTypeName",
  cty."refCarTypeName",
  dd."refDriverName",
  dd."refDriverAge",
  dd."refDriverMail",
  dd."refDriverMobile",
  dd."refDriverLocation"
FROM public."userCarBooking" rcb
JOIN public."refCarsTable" ct ON CAST(ct."refCarsId" AS INTEGER) = rcb."refCarsId"
LEFT JOIN public."refVehicleType" vt ON CAST(vt."refVehicleTypeId" AS INTEGER) = ct."refVehicleTypeId"
LEFT JOIN public."refCarType" cty ON CAST(cty."refCarTypeId" AS INTEGER) = ct."refCarTypeId"
LEFT JOIN public."refCarGroup" cg ON CAST(cg."refCarGroupId" AS INTEGER) = ct."refCarGroupId"
LEFT JOIN public."refDriverDetails" dd ON CAST(dd."createdBy" AS INTEGER) = rcb."refuserId"
LEFT JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = rcb."refuserId"
WHERE rcb."isDelete" IS NOT TRUE
ORDER BY rcb."userCarBookingId", dd."refDriverName";
`;

export const listCustomizeTourBookingsQuery = `
SELECT
  u.*,
  ctb.*,
  rp."refPackageName",
  rp."refTourCustID",
  rp."refTourPrice"
FROM
  public."customizeTourBooking" ctb
  LEFT JOIN public."refPackage" rp ON CAST(rp."refPackageId" AS INTEGER) = ctb."refPackageId"::INTEGER
  LEFT JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = ctb."refuserId"::INTEGER
WHERE
  ctb."isDelete" IS NOT true;
`;

export const listParkingBookingsQuery = `

SELECT
  ud."refUserEmail",
  u.*,
  cp.*,
  pt."refParkingName",
  pt."refAssociatedAirport",
  pt."refLocation",
  pt."refAvailability",
  pt."refOperatingHours",
  pt."refBookingType",
  pt."pricePerHourORday",
  pt."refPrice",
  pt."refWeeklyDiscount",
  pt."refExtraCharges",
  pt."MinimumBookingDuration",
  pt."MaximumBookingDuration",
  pt."isCancellationAllowed",
  pt."isRescheduleAllowed",
  pt."ServiceFeatures",
  pt.instructions,
  pt.description,
  pt."parkingSlotImage",
  pa."refParkingTypeName",
  cpt."refCarParkingTypeName",
  array_agg(rf."refServiceFeatures") AS "refServiceFeaturesList"
FROM
  public."userCarParkingBooking" cp
  LEFT JOIN public."refCarParkingTable" pt ON CAST(pt."refCarParkingId" AS INTEGER) = cp."refCarParkingId"
  LEFT JOIN public."refParkingType" pa ON CAST(pa."refParkingTypeId" AS INTEGER) = pt."refParkingTypeId"
  LEFT JOIN public."refCarParkingType" cpt ON CAST(cpt."refCarParkingTypeId" AS INTEGER) = pt."refCarParkingTypeId"
  LEFT JOIN public."users" u ON u."refuserId" = cp."refuserId"
  LEFT JOIN public."refUserDomain" ud ON ud."refUserId" = u."refuserId"
  LEFT JOIN public."refServiceFeatures" rf ON CAST(rf."refServiceFeaturesId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(pt."ServiceFeatures", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  cp."isDelete" IS NOT true
GROUP BY
  cp."carParkingBookingId",
  pt."refCarParkingId",
  pa."refParkingTypeName",
  cpt."refCarParkingTypeName",
  u."refuserId",
  ud."refUserDomId"
  `;
export const listAuditPageQuery = `
SELECT
  th.*,
  td."refTransactionHistory",
  ut."refUserType"
FROM
  public."refTxnHistory" th
  INNER JOIN public."refTransactionTable" td ON CAST(th."refTransactionHistoryId" AS INTEGER) = td."refTransactionHistoryId"
  INNER JOIN public."refUserType" ut ON CAST(th."updatedBy" AS INTEGER) = ut."refUserTypeId"
WHERE
  (th."updatedAt"::DATE = TO_DATE($1, 'DD/MM/YYYY'))
  AND th."refTransactionHistoryId" = ANY ($2::integer[]) AND 
  th."isDelete" IS NOT true;
`;

export const listAllAuditPageQuery = `
SELECT
  th.*,
  td."refTransactionHistory",
  ut."refUserType"
FROM
  public."refTxnHistory" th
  INNER JOIN public."refTransactionTable" td ON CAST(th."refTransactionHistoryId" AS INTEGER) = td."refTransactionHistoryId"
  INNER JOIN public."refUserType" ut ON CAST(th."updatedBy" AS INTEGER) = ut."refUserTypeId"
WHERE
  th."isDelete" IS NOT true;
`;

export const listTransactionTypeQuery = `SELECT
  *
FROM
  public."refTransactionTable";
`;

export const checkQuery = `
SELECT
  *
FROM
  public."refUserDomain" ud
  LEFT JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = ud."refUserId"
WHERE
  ud."refUsername" = $1
  AND u."isDelete" IS NOT true
LIMIT
  10;
  `;

export const getLastEmployeeIdQuery = `
SELECT
  COUNT(*)
FROM
  public.users u
WHERE
  u."refCustId" LIKE 'EV-EMP-%';
  `;

export const insertUserQuery = `INSERT INTO
  public.users(
    "refCustId",
    "refFName",
    "refLName",
    "refDOB",
    "refDesignation",
    "refQualification",
    "refProfileImage",
    "refMoblile",
    "refUserTypeId",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING
  *;`;

export const insertUserDomainQuery = `INSERT INTO
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

export const updateEmployeeQuery = `
UPDATE
  public."users" 
SET
  "refFName" = $2,
  "refLName" = $3,
  "refDOB" = $4,
  "refDesignation" = $5,
  "refQualification" = $6,
  "refProfileImage" =$7,
  "refMoblile" = $8,
  "refUserTypeId" = $9,
  "updatedAt" = $10,
  "updatedBy" = $11
WHERE
  "refuserId" = $1
RETURNING
  *;
  `;

export const updateEmployeeProfileQuery = `
UPDATE
  public."users" 
SET
  "refFName" = $2,
  "refLName" = $3,
  "refDOB" = $4,
  "refDesignation" = $5,
  "refQualification" = $6,
  "refProfileImage" =$7,
  "refMoblile" = $8,
  "updatedAt" = $9,
  "updatedBy" = $10
WHERE
  "refuserId" = $1
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

export const getEmployeeQuery = `
SELECT
  *
FROM
  public."users"
WHERE
  "refuserId" = $1
  `;

export const deleteEmployeeImageQuery = `
UPDATE
  public."users"
SET
  "refProfileImage" = NULL
WHERE
  "refuserId" = $1
RETURNING
  *;
  `;

export const listEmployeesQuery = `
SELECT
  u.*,
  ud."refUserEmail",
  ud."refUsername",
  ud."refUserHashedPassword",
  array_agg(ut."refUserType") AS "refUserType"
FROM
  public."users" u
  LEFT JOIN public."refUserDomain" ud ON CAST(ud."refUserId" AS INTEGER) = u."refuserId"
  LEFT JOIN public."refUserType" ut ON CAST(ut."refUserTypeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(u."refUserTypeId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  u."isDelete" IS NOT true AND u."refCustId" LIKE 'EV-EMP-%' AND
  u."refuserId" != '1'
GROUP BY
  u."refuserId",
  ud."refUserEmail",
  ud."refUsername",
  ud."refUserHashedPassword"
  ORDER BY
  u."refuserId" DESC;
    `;

export const getEmployeesQuery = `
SELECT
  u.*,
  ud."refUserEmail",
  ud."refUsername",
  ud."refUserHashedPassword",
  array_agg(ut."refUserType") AS "refUserType",
  array_to_json(
    string_to_array(
      trim(
        both '{}'
        from
          u."refUserTypeId"
      ),
      ','
    )::int[]
  ) AS "userTypeId"
FROM
  public."users" u
  LEFT JOIN public."refUserDomain" ud ON CAST(ud."refUserId" AS INTEGER) = u."refuserId"
  LEFT JOIN public."refUserType" ut ON CAST(ut."refUserTypeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(u."refUserTypeId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  u."isDelete" IS NOT true
  AND u."refuserId" = $1
GROUP BY
  u."refuserId",
  ud."refUserEmail",
  ud."refUsername",
  ud."refUserHashedPassword";
    
  `;

export const deleteEmployeesQuery = `
UPDATE
  public."users"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refuserId" = $1
RETURNING
  *;
  `;

export const getDeletedEmployeeQuery = `
SELECT
  "refCustId",
  "refFName"
FROM
  public."users" 
WHERE
  "refuserId" = $1;
`;
export const getDeletedEmployeeCountQuery = `
SELECT
  COUNT(*)
FROM
  public."users" u
  LEFT JOIN public."refUserDomain" ud ON CAST (ud."refUserId" AS INTEGER) = u."refuserId"
WHERE
  u."isDelete" is true
  AND ( ud."refUserEmail" = $1 OR ud."refUsername" = $1)
`;
export const listUserTypeQuery = `
SELECT
  *
FROM
  public."refUserType"
WHERE
  "refUserTypeId" != 3 AND 
  "refUserTypeId"  != 6
ORDER BY
  "refUserTypeId" ASC;
`;

export const dashBoardQuery = `
SELECT
  (SELECT COUNT(*) FROM public."userTourBooking" WHERE "isDelete" IS NOT true) AS "tourBookingCount",
  (SELECT COUNT(*) FROM public."userCarBooking" WHERE "isDelete" IS NOT true) AS "carBookingCount",
  (SELECT COUNT(*) FROM public."userCarParkingBooking" WHERE "isDelete" IS NOT true) AS "carParkingBookingCount",
  (SELECT COUNT(*) FROM public."customizeTourBooking" WHERE "isDelete" IS NOT true) AS "customizeTourBookingCount",
  (SELECT COUNT(*) FROM public."refCarsTable" WHERE "isDelete" IS NOT true) AS "carCount",
  (SELECT COUNT(*) FROM public."refPackage" WHERE "isDelete" IS NOT true) AS "tourCount",
  (SELECT COUNT(*) FROM public."refCarParkingTable" WHERE "isDelete" IS NOT true) AS "CarParkingCount",
  (SELECT COUNT(*) FROM public."users" WHERE "refCustId" LIKE 'EV-EMP-%' AND "isDelete" IS NOT true ) AS "EmployeeCount",
  (SELECT COUNT(*) FROM public."users" WHERE "refCustId" LIKE 'EV-CUS-%' AND "isDelete" IS NOT true) AS "logInClientCount";
`;

export const deleteCarBookingsQuery = `
UPDATE
  public."userCarBooking"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "userCarBookingId" = $1
RETURNING
  *;
`;

export const deleteTourBookingsQuery = `

UPDATE
  public."userTourBooking"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "userTourBookingId" = $1
RETURNING
  *;
`;

export const deleteCustomizeTourBookingsQuery = `
UPDATE
  public."userCarParkingBooking"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "carParkingBookingId" = $1
RETURNING
  *;
`;

export const deleteCarParkingBookingsQuery = `
UPDATE
  public."userCarParkingBooking"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "carParkingBookingId" = $1
RETURNING
  *;
`;

export const listUserDataQuery = `
SELECT DISTINCT
  u.*,
  ud.*,
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
u."refCustId" LIKE 'EV-CUS-%' AND u."isDelete" IS NOT true;
`;

export const getUserdataQuery = `
SELECT DISTINCT
  u.*,
  ud.*,
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
  u."refCustId" LIKE 'EV-CUS-%'
  AND u."refuserId" = $1
  AND u."isDelete" IS NOT true;
`;

export const tourResultQuery = `
WITH
  "base" AS (
    SELECT
      rp."refTourCustID",
      urt."userTourBookingId",
      urt."refUserFname",
      urt."refUserLname",
      urt."refUserMail",
      urt."refUserMobile",
      urt."refPickupDate",
      urt."refAdultCount",
      urt."refChildrenCount",
      urt."refInfants",
      urt."refOtherRequirements",
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
      public."userTourBooking" urt
      LEFT JOIN public."refPackage" rp ON CAST(rp."refPackageId" AS INTEGER) = urt."refPackageId"
      LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
      LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
      LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
    WHERE
      rp."isDelete" IS NOT true
      AND urt."isDelete" IS NOT true
      AND urt."refuserId" = $1
  ),
  locations AS (
    SELECT
      rp."refPackageId",
      ARRAY_AGG(DISTINCT rl."refLocationName") AS "refLocationName"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rp."refLocation", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    GROUP BY
      rp."refPackageId"
  ),
  "galleries" AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT "refGallery") AS "refGallery"
    FROM
      public."refGallery"
    GROUP BY
      "refPackageId"
  ),
  "activities" AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT ra."refActivitiesName") AS "Activity"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rp."refActivity", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
    GROUP BY
      rp."refPackageId"
  ),
  "includes" AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT ti."refTravalInclude") AS "travalInclude"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refTravalInclude" ti ON CAST(ti."refTravalIncludeId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(
            (
              SELECT
                rtd."refTravalInclude"
              FROM
                public."refTravalData" rtd
              WHERE
                CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
              LIMIT
                1
            ),
            '[{}]',
            '',
            'g'
          ),
          ','
        )::INTEGER[]
      )
    GROUP BY
      rp."refPackageId"
  ),
  "excludes" AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT te."refTravalExclude") AS "travalExclude"
    FROM
      public."refPackage" rp
      LEFT JOIN public."refTravalExclude" te ON CAST(te."refTravalExcludeId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(
            (
              SELECT
                rtd."refTravalExclude"
              FROM
                public."refTravalData" rtd
              WHERE
                CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
              LIMIT
                1
            ),
            '[{}]',
            '',
            'g'
          ),
          ','
        )::INTEGER[]
      )
    GROUP BY
      rp."refPackageId"
  )
SELECT
  b.*,
  l."refLocationName",
  g."refGallery",
  a."Activity",
  i."travalInclude",
  e."travalExclude"
FROM
  "base" b
  LEFT JOIN locations l ON b."refPackageId" = l."refPackageId"
  LEFT JOIN galleries g ON b."refPackageId" = g."refPackageId"
  LEFT JOIN activities a ON b."refPackageId" = a."refPackageId"
  LEFT JOIN includes i ON b."refPackageId" = i."refPackageId"
  LEFT JOIN excludes e ON b."refPackageId" = e."refPackageId"
ORDER BY
  b."refPackageId",
  b."userTourBookingId";
  `;

export const carResultQuery = `
SELECT
  rcb.*,
  ct.*,
  rc."refCarTypeName",
  vt."refVehicleTypeName"
FROM
  public."userCarBooking" rcb
  JOIN public."refCarsTable" ct ON CAST(ct."refCarsId" AS INTEGER) = rcb."refCarsId"
  JOIN public."refCarType" rc ON CAST(rc."refCarTypeId" AS INTEGER) = ct."refCarTypeId"
  JOIN public."refVehicleType" vt ON CAST(vt."refVehicleTypeId" AS INTEGER) = ct."refVehicleTypeId"
  AND rcb."isDelete" IS NOT true
  AND rcb."refuserId" = $1;
`;

export const customizeTourResultQuery = `
SELECT
  ctb.*,
  rp."refPackageName",
  rp."refTourCustID",
  rp."refTourCode",
  rp."refTourPrice"
FROM
  public."customizeTourBooking" ctb
  LEFT JOIN public."refPackage" rp ON CAST(rp."refPackageId" AS INTEGER) = ctb."refPackageId"::INTEGER
WHERE
  ctb."isDelete" IS NOT true
  AND ctb."refuserId" = $1;
`;

export const parkingResultQuery = `
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
WHERE
  cp."isDelete" IS NOT true
  AND cp."refuserId" = $1
GROUP BY
  cp."carParkingBookingId",
  pt."refCarParkingId",
  pa."refParkingTypeName",
  cpt."refCarParkingTypeName"
`;

export const listCarBookingAgreementQuery = `
SELECT
  cg."refCarGroupName",
  u.*,
  rcb.*,
  ct.*,
  vt."refVehicleTypeName",
  cty."refCarTypeName",
  dd."refDriverName",
  dd."refDriverAge",
  dd."refDriverMail",
  dd."refDriverMobile",
  dd."refDriverLocation"
FROM
  public."userCarBooking" rcb
  JOIN public."refCarsTable" ct ON CAST(ct."refCarsId" AS INTEGER) = rcb."refCarsId"
  LEFT JOIN public."refVehicleType" vt ON CAST(vt."refVehicleTypeId" AS INTEGER) = ct."refVehicleTypeId"
  LEFT JOIN public."refCarType" cty ON CAST(cty."refCarTypeId" AS INTEGER) = ct."refCarTypeId"
  LEFT JOIN public."refCarGroup" cg ON CAST(cg."refCarGroupId" AS INTEGER) = ct."refCarGroupId"
  LEFT JOIN public."refDriverDetails" dd ON CAST(dd."createdBy" AS INTEGER) = rcb."refuserId"::INTEGER
  JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = rcb."refuserId"
WHERE
  rcb."refuserId" = $1
  AND rcb."isDelete" IS NOT true;
`;

export const deleteAuditQuery = `
UPDATE
  public."refTxnHistory"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "transId" = $1
RETURNING
  *;
`;

export const deleteUserQuery = `
UPDATE public.users
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refuserId" = $1
  RETURNING *;
`;

export const deleteUserDomainQuery = `
UPDATE public."refUserDomain"
SET
  "isDelete" = true
WHERE
  "refUserId" = $1;
`;


export const getEmployeeProfileQuery = `
SELECT
  u.*,
  ud."refUserEmail",
  ud."refUserHashedPassword",
  ud."refUsername"
FROM
  public."users" u
  LEFT JOIN public."refUserDomain" ud ON CAST(ud."refUserId" AS INTEGER) = u."refuserId"
WHERE
  u."refuserId" = $1
  AND u."isDelete" IS NOT true
`;