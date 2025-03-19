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

export const addDestinationQuery = `INSERT INTO public."refDestination" (
    "refDestinationName",
    "createdAt",
    "createdBy"
  )
  VALUES ($1, $2, $3)
  RETURNING *;
`;

export const updateDestinationQuery =`UPDATE
  public."refDestination"
SET
  "refDestinationName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refDestinationId" = $1;
`;

export const checkQuery = `SELECT COUNT(*) AS count FROM public."refDestination" WHERE "refDestinationId" = $1;`;


export const getDestinationQuery = `SELECT
  *
FROM
  public."refDestination"
WHERE
  "refDestinationId" = $1;
`;

export const deleteDestinationQuery = ` DELETE FROM public."refDestination" rd 
WHERE rd."refDestinationId" = $1;
`;


// location
export const checkLocationQuery =`SELECT COUNT(*) AS count FROM public."refLocation" WHERE "refLocationId" = $1;
`;

export const listDestinationQuery =`SELECT * FROM public."refDestination";
`;

export const addLocationQuery =`INSERT INTO public."refLocation" (
    "refLocationName",
    "refDestinationId",
    "createdAt",
    "createdBy"
  )
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

export const updateLocationQuery =`UPDATE
  public."refLocation"
SET
  "refLocationName" = $2,
  "refDestinationId" = $3,
  "updatedAt" = $4,
  "updatedBy" = $5
WHERE
  "refLocationId" = $1;

`;

export const listLoacationQuery =`SELECT * FROM public."refLocation";
`;

// category

export const addCategoryQuery =`INSERT INTO public."refCategory" (
    "refCategoryName",
    "createdAt",
    "createdBy"
  )
  VALUES ($1, $2, $3)
  RETURNING *;
`;

export const checkCategoryQuery =`SELECT COUNT(*) AS count FROM public."refCategory" WHERE "refCategoryId" = $1
`;

export const updateCategoryQuery=`UPDATE
  public."refCategory"
SET
  "refCategoryName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refCategoryId" = $1;
`;

export const listCategoryQuery =`SELECT * FROM public."refCategory";
`;

// activity
export const addActivitiesQuery = `INSERT INTO public."refActivities" (
    "refActivitiesName",
    "createdAt",
    "createdBy"
  )
  VALUES ($1, $2, $3)
  RETURNING *;
`;

export const checkActivitiesQuery = `SELECT COUNT(*) AS count 
FROM public."refActivities" WHERE "refActivitiesId" = $1;
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

export const listActivitiesQuery =`SELECT * FROM public."refActivities";
`;