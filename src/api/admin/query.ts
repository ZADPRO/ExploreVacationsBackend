export const selectUserByLogin = `SELECT *
FROM  public."refUserDomain" rd
WHERE rd."refUserEmail" = $1 OR rd."refUsername" = $1;`;

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


export const listTourBookingsQuery =`
WITH
  base AS (
    SELECT
      urt."userTourBookingId",
      urt."refUserName",
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
    FROM public."userTourBooking" urt
    LEFT JOIN public."refPackage" rp ON CAST(rp."refPackageId" AS INTEGER) = urt."refPackageId"
    LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
    LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
    LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
    WHERE rp."isDelete" IS NULL OR rp."isDelete" = false
  ),
  locations AS (
    SELECT
      rp."refPackageId",
      ARRAY_AGG(DISTINCT rl."refLocationName") AS "refLocationName"
    FROM public."refPackage" rp
    LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
      string_to_array(regexp_replace(rp."refLocation", '[{}]', '', 'g'), ',')::INTEGER[]
    )
    GROUP BY rp."refPackageId"
  ),
  galleries AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT "refGallery") AS "refGallery"
    FROM public."refGallery"
    GROUP BY "refPackageId"
  ),
  activities AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT ra."refActivitiesName") AS "Activity"
    FROM public."refPackage" rp
    LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
      string_to_array(regexp_replace(rp."refActivity", '[{}]', '', 'g'), ',')::INTEGER[]
    )
    GROUP BY rp."refPackageId"
  ),
  includes AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT ti."refTravalInclude") AS "travalInclude"
    FROM public."refPackage" rp
    LEFT JOIN public."refTravalInclude" ti ON CAST(ti."refTravalIncludeId" AS INTEGER) = ANY (
      string_to_array(regexp_replace((SELECT rtd."refTravalInclude" FROM public."refTravalData" rtd WHERE CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId" LIMIT 1), '[{}]', '', 'g'), ',')::INTEGER[]
    )
    GROUP BY rp."refPackageId"
  ),
  excludes AS (
    SELECT
      "refPackageId",
      ARRAY_AGG(DISTINCT te."refTravalExclude") AS "travalExclude"
    FROM public."refPackage" rp
    LEFT JOIN public."refTravalExclude" te ON CAST(te."refTravalExcludeId" AS INTEGER) = ANY (
      string_to_array(regexp_replace((SELECT rtd."refTravalExclude" FROM public."refTravalData" rtd WHERE CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId" LIMIT 1), '[{}]', '', 'g'), ',')::INTEGER[]
    )
    GROUP BY rp."refPackageId"
  )

SELECT
  b.*,
  l."refLocationName",
  g."refGallery",
  a."Activity",
  i."travalInclude",
  e."travalExclude"
FROM base b
LEFT JOIN locations l ON b."refPackageId" = l."refPackageId"
LEFT JOIN galleries g ON b."refPackageId" = g."refPackageId"
LEFT JOIN activities a ON b."refPackageId" = a."refPackageId"
LEFT JOIN includes i ON b."refPackageId" = i."refPackageId"
LEFT JOIN excludes e ON b."refPackageId" = e."refPackageId"
ORDER BY b."refPackageId", b."userTourBookingId";
`;

export const listCarBookingsQuery = `SELECT 
rcb.*
FROM public."userCarBooking" rcb
JOIN public."refCarsTable" ct ON CAST ( ct."refCarsId" AS INTEGER ) = rcb."refCarsId"
`;

export const listCustomizeTourBookingsQuery = `SELECT 
ctb.*,
rp."refPackageName"
FROM public."customizeTourBooking" ctb
LEFT JOIN public."refPackage" rp ON CAST ( rp."refPackageId" AS INTEGER ) = ctb."refPackageId"::INTEGER
`;



export const listAuditPageQuery = `SELECT
  th.*,
  td."refTransactionHistory",
  ut."refUserType"
FROM
  public."refTxnHistory" th
  INNER JOIN public."refTransactionTable" td ON CAST(th."refTransactionHistoryId" AS INTEGER) = td."refTransactionHistoryId"
  INNER JOIN public."refUserType" ut ON CAST (th."updatedBy" AS INTEGER) = ut."refUserTypeId"
WHERE
  (th."updatedAt"::DATE = TO_DATE($1, 'DD/MM/YYYY')) AND
  th."refTransactionHistoryId" = ANY($2::integer[]);

`;



export const listTransactionTypeQuery = `SELECT
  *
FROM
  public."refTransactionTable";
`;

export const checkQuery = `SELECT
  *
FROM
  public."refUserDomain"
WHERE
  "refUsername" = $1
LIMIT
  10;`;

export const getLastEmployeeIdQuery = `
SELECT
  COUNT(*)
FROM
  public.users u
WHERE
  u."refCustId" LIKE 'EV-EMP-%';
  `
  ;

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

export const updateEmployeeQuery = `UPDATE
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
export const getEmployeeQuery =   `
SELECT
  *
FROM
  public.users
WHERE
  "refuserId" = $1`;
  
export const deleteEmployeeImageQuery = `
  `;

export const listEmployeesQuery = `
SELECT
  u.*,
  ud."refUserEmail",
  ud."refUsername"
FROM
  public."users" u
  LEFT JOIN public."refUserDomain" ud ON CAST (ud."refUserId" AS INTEGER) = u."refuserId"
WHERE
  u."isDelete" IS NOT true;
  `;

export const getEmployeesQuery = `SELECT
  u.*,
  ud."refUserEmail"
FROM
  public."users" u
  JOIN public."refUserDomain" ud ON CAST ( ud."refUserId" AS INTEGER) = u."refuserId"
WHERE
  "refuserId" = $1
  `;

export const deleteEmployeesQuery = `UPDATE
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

export const getDeletedEmployeeQuery = `SELECT
  "refCustId",
  "refFName"
FROM
  public."users" 
WHERE
  "refuserId" = $1;
`;



export const listUserTypeQuery = `SELECT
  *
FROM
  public."refUserType";
`;

export const dashBoardQuery =`
SELECT
  (SELECT COUNT(*) FROM public."userTourBooking") AS "tourBookingCount",
  (SELECT COUNT(*) FROM public."userCarBooking") AS "carBookingCount",
  -- (SELECT COUNT(*) FROM public."userCarParkingBooking") AS "carParkingBookingCount",
  (SELECT COUNT(*) FROM public."customizeTourBooking") AS "customizeTourBookingCount",
  (SELECT COUNT(*) FROM public."refCarsTable") AS "carCount",
  (SELECT COUNT(*) FROM public."refPackage") AS "tourCount",
  (SELECT COUNT(*) FROM public."refCarParkingTable") AS "CarParkingCount",
  (SELECT COUNT(*) FROM public."users" WHERE "refCustId" LIKE 'EV-EMP-%') AS "EmployeeCount",
  (SELECT COUNT(*) FROM public."users" WHERE "refCustId" LIKE 'EV-CUS-%') AS "logInClientCount",
  (SELECT COUNT(*) FROM public."users" WHERE "refCustId" LIKE 'EV-CUS-%') AS "logInClientCount";
`;