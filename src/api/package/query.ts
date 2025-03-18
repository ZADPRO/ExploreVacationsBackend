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
    STRING_AGG(DISTINCT rl."refLocationName", ', ') AS refLocationLabel,
    STRING_AGG(DISTINCT ra."refActivitiesName", ', ') AS refActivityLabel
FROM public."refPackage" rp
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
GROUP BY rp."refPackageId";

`;