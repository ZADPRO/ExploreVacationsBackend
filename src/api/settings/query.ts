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

export const checkDestinationQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refDestination"
WHERE
  "refDestinationName" = $1
  AND "isDelete" IS NOT true;
`;

export const addDestinationQuery = `INSERT INTO public."refDestination" (
    "refDestinationName",
    "createdAt",
    "createdBy",
  "isDelete"
  )
  VALUES ($1, $2, $3, false)
  RETURNING *;
`;

export const updateDestinationQuery = `UPDATE
  public."refDestination"
SET
  "refDestinationName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refDestinationId" = $1;
`;

export const checkQuery = `SELECT COUNT(*) AS count FROM public."refDestination" WHERE "refDestinationId" = $1  AND "isDelete" = false;`;

export const deleteDestinationQuery = `
            UPDATE
  public."refDestination"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
  
WHERE
  "refDestinationId" = $1
RETURNING
  *;
        `;

export const getdeletedDestinationQuery = `SELECT
  "refDestinationName"
FROM
  public."refDestination"
WHERE
  "refDestinationId" = $1;
`;         

export const listDestinationQuery = `SELECT
  *
FROM
  public."refDestination"
WHERE
  "isDelete" IS NOT true;
        `;

// location
export const checkLocationQuery = `SELECT COUNT(*) AS count FROM public."refLocation" WHERE "refLocationId" = $1  AND "isDelete" = false;
`;

export const addLocationQuery = `INSERT INTO
  public."refLocation" (
    "refLocationName",
    "refDestinationId",
    "createdAt",
    "createdBy",
    "isDelete"  
  )
VALUES
  ($1, $2, $3, $4, false)
RETURNING
  *;
`;

export const checkduplicateQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refLocation"
WHERE
  "refLocation" = $1 AND "isDelete" IS NOT true
LIMIT
  10;
`;

export const updateLocationQuery = `UPDATE
  public."refLocation"
SET
  "refLocationName" = $2,
  "refDestinationId" = $3,
  "updatedAt" = $4,
  "updatedBy" = $5
WHERE
  "refLocationId" = $1;

`;

// export const listLocationQuery = `
// SELECT
//   *
// FROM
//   public."refLocation"
// WHERE
//   "isDelete" IS NOT true;
// `
// ;
export const listLocationQuery = `
SELECT
  rl."refLocationId",
  rl."refLocationName",
  rl."refDestinationId",
  rd."refDestinationName"
FROM
  public."refLocation" rl
  LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rl."refDestinationId"
WHERE
  rl."isDelete" IS NOT true;`
;
export const deletelocationQuery = `UPDATE
  public."refLocation"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refDestinationId" = $1
RETURNING
  *;
`;

export const getdeletedLocationQuery  = `SELECT
  "refLocationName"
FROM
  public."refLocation"
WHERE
  "refLocationId" = $1;
`;

// category

export const addCategoryQuery = `INSERT INTO public."refCategory" (
    "refCategoryName",
    "createdAt",
    "createdBy",
    "isDelete"
  )
  VALUES ($1, $2, $3, false)
  RETURNING *;
`;

export const checkDuplicateCategoryQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refCategory"
WHERE
  "refCategoryName" = $1
  AND "isDelete" IS NOT true
LIMIT
  10;

`;

// export const checkCategoryQuery = `SELECT COUNT(*) AS count FROM public."refCategory" WHERE "refCategoryId" = $1
// `;

export const checkCategoryQuery = `SELECT COUNT(*) AS count FROM public."refCategory" WHERE "refCategoryId" = $1 AND "isDelete" = false
`;

export const updateCategoryQuery = `UPDATE
  public."refCategory"
SET
  "refCategoryName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refCategoryId" = $1;
`;

export const listCategoryQuery = `SELECT * FROM public."refCategory" WHERE "isDelete" = false
`;

export const deletecategoryQuery = `UPDATE
  public."refCategory"
SET
  "isDelete" = TRUE,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refCategoryId" = $1
RETURNING
  *;

`;

export const getdeletedCategoriesQuery = `SELECT
  "refCategoryName"
FROM
  public."refCategory"
WHERE
  "refCategoryId" = $1;
`;
// activity
export const addActivitiesQuery = `INSERT INTO
  public."refActivities" (
    "refActivitiesName",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, $2, $3, false)
RETURNING
  *;
`;

export const checkActivityQuery = `
SELECT
  COUNT(*) AS "count"
FROM
  public."refActivities"
WHERE
  "refActivitiesName" = $1
  AND "isDelete" IS NOT true
LIMIT
  10;
`;

export const checkActivitiesQuery = `SELECT
  COUNT(*) AS count
FROM
  public."refActivities"
WHERE
  "refActivitiesId" = $1
  AND "isDelete" = false;
`;

export const updateActivityQuery = `UPDATE
  public."refActivities"
SET
  "refActivitiesName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refActivitiesId" = $1;
`;

export const listActivitiesQuery = `SELECT * FROM public."refActivities" WHERE "isDelete" = false;
`;

export const deleteActivityQuery = `UPDATE
  public."refActivities"
SET
  "isDelete" = TRUE,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refActivitiesId" = $1
RETURNING
  *;

`;

export const getdeletedActivityQuery =`SELECT
  "refActivitiesName"
FROM
  public."refActivities"
WHERE
  "refActivitiesId" = $1;
`;