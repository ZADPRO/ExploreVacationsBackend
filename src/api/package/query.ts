export const addPackageQuery =`INSERT INTO
  public."refPackage" (
    "refPackageName",
    "refDesignationId",
    "refDurationIday",
    "refDurationINight",
    "refLocation",
    "refCategoryId",
    "refActivity",
    "refGroupSize",
    "refTourCode",
    "refTourPrice",
    "refSeasonalPrice",
    "createdAt",
    "createdBy"
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5::integer[],
    $6,
    $7::integer[],
    $8,
    $9,
    $10,
    $11,
    $12,
    $13
  )
RETURNING
  "refPackageId";
`;

export const insertGalleryQuery =`INSERT INTO public."refGallery" (
    "refPackageId",
    "refGallery",
    "createdAt",
    "createdBy"
  )
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;
export const updatePackageQuery = `UPDATE
  public."refPackage"
SET
  "refPackageName" = $2,
  "refDesignationId" = $3,
  "refDurationIday" = $4,
  "refDurationINight" = $5,
  "refLocation" = $6,
  "refCategoryId" = $7,
  "refActivity" = $8,
  "refGroupSize" = $9,
  "refTourCode" = $10,
  "refTourPrice" = $11,
  "refSeasonalPrice" = $12,
  "updatedAt" = $13,
  "updatedBy" = $14
WHERE
  "refPackageId" = $1;

`;

export const listPackageQuery = `
SELECT 
  rp."refPackageName",
  rp."refDesignationId",
  rp."refDurationIday",
  rp."refDurationINight",
  rp."refCategoryId",
  rp."refGroupSize",
  rp."refTourPrice",
  rp."refSeasonalPrice",
    STRING_AGG(DISTINCT rl."refLocationName", ', ') AS "refLocation",
    STRING_AGG(DISTINCT ra."refActivitiesName", ', ') AS "refActivity",
    rg."refGallery"
FROM public."refPackage" rp
LEFT JOIN public."refGallery" rg ON CAST (rg."refPackageId" AS INTEGER ) = rp."refPackageId"
LEFT JOIN public."refLocation" rl 
    ON CAST(rl."refLocationId" AS INTEGER) = ANY (
        string_to_array(
            regexp_replace(rp."refLocation", '[{}]', '', 'g'),
            ','
        )::INTEGER[]
    )
LEFT JOIN public."refActivities" ra 
    ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
        string_to_array(
            regexp_replace(rp."refActivity", '[{}]', '', 'g'),
            ','
        )::INTEGER[]
    )
GROUP BY rp."refPackageId", rg."refGalleryId";

`;



export const getImageRecordQuery = `SELECT *
    FROM public."refGallery" rg
    WHERE rg."refGalleryId" = $1;
`;

export const deleteImageRecordQuery =`DELETE FROM public."refGallery" rg 
WHERE rg."refGalleryId" = $1;
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


export const addTravalIncludeQuery = `INSERT INTO public."refTravalInclude"(
    "refTravalInclude",
    "createdAt",
    "createdBy",
  "isDelete"
  )
  VALUES ($1, $2, $3, false)
  RETURNING *;
`;

export const checkTravalIncludeQuery = `SELECT
  COUNT(*) AS count
FROM
  public."refTravalInclude"
WHERE
  "refTravalIncludeId" = $1
  AND "isDelete" = false
`;

export const updateTravalIncludeQuery = `UPDATE
public."refTravalInclude"
SET
"refTravalInclude" = $2,
"updatedAt" = $3,
"updatedBy" = $4
WHERE
"refTravalIncludeId" = $1;
`;

export const deleteTravalIncludeQuery = `UPDATE
  public."refTravalInclude"
SET
  "isDelete" = TRUE,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refTravalIncludeId" = $1
RETURNING
  *;
`;

export const listTravalIncludeQuery = `SELECT * FROM public."refTravalInclude"
WHERE
  "isDelete" = false;
`;


export const addTravalExcludeQuery = `INSERT INTO
  public."refTravalExclude" (
    "refTravalExclude",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, $2, $3, false)
RETURNING
  *;
`;

export const checkTravalExcludeQuery = `SELECT
  COUNT(*) AS count
FROM
  public."refTravalExclude"
WHERE
  "refTravalExcludeId" = $1
  AND "isDelete" = false
`;

export const updateTravalExcludeQuery = `UPDATE
public."refTravalExclude"
SET
"refTravalExclude" = $2,
"updatedAt" = $3,
"updatedBy" = $4
WHERE
"refTravalExcludeId" = $1;
`;

export const deleteTravalExcludeQuery = `UPDATE
  public."refTravalExclude"
SET
  "isDelete" = TRUE,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refTravalExcludeId" = $1
RETURNING
  *;
`;

export const listTravalExcludeQuery = `SELECT * FROM public."refTravalExclude"
WHERE
  "isDelete" = false;
`;