export const gettourIdIdQuery = `
SELECT
  COUNT(*)
FROM
  public."refPackage"
WHERE
  "refTourCustID" LIKE 'EV-TOUR-%';
`;

export const addPackageQuery = `INSERT INTO
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
    "refCoverImage",
    "refTourCustID",
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
    $13,
    $14,
    $15
  )
RETURNING
  "refPackageId";
`;

export const insertGalleryQuery = `INSERT INTO public."refGallery" (
    "refPackageId",
    "refGallery",
    "createdAt",
    "createdBy"
  )
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

export const addTravalDataQuery = `INSERT INTO
  public."refTravalData" (
    "refPackageId",
    "refTravalOverView",
    "refItinary",
    "refItinaryMapPath",
    "refTravalInclude",
    "refTravalExclude",
    "refSpecialNotes",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, false)
RETURNING
  *;
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
  "refCoverImage" = $13,
  "updatedAt" = $14,
  "updatedBy" = $15
WHERE
  "refPackageId" = $1;

`;

export const deletePackageQuery = `UPDATE
  public."refPackage"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refPackageId" = $1
RETURNING *
`;
export const getdeletedPackageQuery = `
SELECT
  "refPackageName"
FROM
  public."refPackage"
WHERE
  "refPackageId" = $1
`;

// export const updateTravalDataQuery = `UPDATE
//   public."refTravalData"
// SET
//   "refPackageId" = $2,
//   "refTravalOverView" = $3
//   "refItinary" = $4,
//   "refItinaryMapPath" = $5,
//   "refTravalInclude" = $6,
//   "refTravalExclude" = $7,
//   "refSpecialNotes" = $8,
//   "updatedAt" = $9,
//   "updatedBy" = $10
// WHERE
//   "refTravalDataId" = $1
// RETURNING
//   *;
// `;

export const updateTravalDataQuery = `UPDATE
  public."refTravalData"
SET
  "refTravalOverView" = $2,
  "refItinary" = $3,
  "refItinaryMapPath" = $4,
  "refTravalInclude" = $5,
  "refTravalExclude" = $6,
  "refSpecialNotes" = $7,
  "updatedAt" = $8,
  "updatedBy" = $9
WHERE
  "refPackageId" = $1 
RETURNING
  *;
`;

// export const listPackageQuery = `
//   WITH
//     "location" AS (
//       SELECT
//         rp.*,
//         rtd."refItinary",
//         rtd."refItinaryMapPath",
//         rtd."refTravalInclude",
//         rtd."refTravalExclude",
//         rtd."refSpecialNotes",
//         rtd."refTravalOverView",
//         rd.*,
//         rg."refGallery",
//         rc."refCategoryName",
//         ARRAY_AGG(rl."refLocationName") AS "refLocationName"
//       FROM
//         public."refPackage" rp
//         LEFT JOIN public."refGallery" rg ON CAST(rg."refPackageId" AS INTEGER) = rp."refPackageId"
//         LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
//         LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
//         LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
//         LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
//           string_to_array(
//             regexp_replace(rp."refLocation", '[{}]', '', 'g'),
//             ','
//           )::INTEGER[]
//         )
//       WHERE
//         rp."isDelete" IS null
//         OR "rp"."isDelete" IS false
//       GROUP BY
//         rp."refPackageId",
//         rtd."refTravalDataId",
//         rd."refDestinationId",
//         rg."refGallery",
//         rc."refCategoryId"
//     ),
//     "activity" AS (
//       SELECT
//         l."refPackageName",
//         l."refLocationName",
//         l."refDestinationName",
//         ARRAY_AGG(ra."refActivitiesName") AS "Activity",
//         l."refDesignationId",
//         l."refTravalInclude",
//         l."refTravalExclude",
//         l."refPackageId",
//         l."refTravalDataId",
//         l."refItinary",
//         l."refItinaryMapPath",
//         l."refSpecialNotes",
//         l."refTravalOverView",
//         l."refGallery",
//         l."refCategoryName",
//         l."refDurationIday",
//         l."refDurationINight",
//         l."refGroupSize",
//         l."refTourCode",
//         l."refTourPrice",
//         l."refSeasonalPrice",
//         l."refCoverImage"
//       FROM
//         "location" l
//         LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
//           string_to_array(
//             regexp_replace(l."refActivity", '[{}]', '', 'g'),
//             ','
//           )::INTEGER[]
//         )
//       GROUP BY
//         l."refPackageName",
//         l."refLocationName",
//         l."refDestinationName",
//         l."refDesignationId",
//         l."refTravalInclude",
//         l."refTravalExclude",
//         l."refPackageId",
//         l."refItinary",
//         l."refItinaryMapPath",
//         l."refSpecialNotes",
//         l."refTravalOverView",
//         l."refTravalDataId",
//         l."refGallery",
//         l."refCategoryName",
//         l."refDurationIday",
//         l."refDurationINight",
//         l."refGroupSize",
//         l."refTourCode",
//         l."refTourPrice",
//         l."refSeasonalPrice",
//         l."refCoverImage"
//     )
//   SELECT
//     aa.*,
//     ARRAY_AGG(ti."refTravalInclude") AS "travalInclude",
//     ARRAY_AGG(te."refTravalExclude") AS "travalExclude"
//   FROM
//     "activity" aa
//     LEFT JOIN public."refTravalInclude" ti ON CAST(ti."refTravalIncludeId" AS INTEGER) = ANY (
//       string_to_array(
//         regexp_replace(aa."refTravalInclude", '[{}]', '', 'g'),
//         ','
//       )::INTEGER[]
//     )
//     LEFT JOIN public."refTravalExclude" te ON CAST(te."refTravalExcludeId" AS INTEGER) = ANY (
//       string_to_array(
//         regexp_replace(aa."refTravalExclude", '[{}]', '', 'g'),
//         ','
//       )::INTEGER[]
//     )
//   GROUP BY
//     aa."refPackageName",
//     aa."refLocationName",
//     aa."refDestinationName",
//     aa."Activity",
//     aa."refDesignationId",
//     aa."refTravalInclude",
//     aa."refTravalExclude",
//     aa."refPackageId",
//     aa."refItinary",
//     aa."refItinaryMapPath",
//     aa."refSpecialNotes",
//     aa."refTravalOverView",
//     aa."refTravalDataId",
//     aa."refGallery",
//     aa."refCategoryName",
//     aa."refDurationIday",
//     aa."refDurationINight",
//     aa."refGroupSize",
//     aa."refTourCode",
//     aa."refTourPrice",
//     aa."refSeasonalPrice",
//     aa."refCoverImage";

//     `;

export const listPackageQuery = `
     WITH
  base AS (
    SELECT
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

export const getImageRecordQuery = `
SELECT *
    FROM public."refGallery" rg
    WHERE rg."refGalleryId" = $1;
`;

export const deleteImageRecordQuery = `UPDATE public."refGallery"
SET "refGallery" = NULL
WHERE "refGalleryId" = $1
RETURNING *;
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

export const getdeletedincludeQuery = `SELECT
  "refTravalInclude"
FROM
  public."refTravalInclude"
WHERE
 "refTravalIncludeId"= $1;
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

export const getdeletedExcludeQuery = `SELECT
  "refTravalExclude"
FROM
  public."refTravalExclude"
WHERE
  "refTravalExcludeId" = $1
`;

export const listTravalExcludeQuery = `SELECT * FROM public."refTravalExclude"
WHERE
  "isDelete" = false;
`;

export const getCoverImageRecordQuery = `
SELECT *
    FROM public."refPackage" rp
    WHERE rp."refPackageId" = $1;
`;
// export const listTourByIdQuery = `
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
//      (rp."isDelete" IS null
//       OR "rp"."isDelete" IS false ) AND rp."refPackageId" = $1
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
//   aa."refCoverImage";
//   `;

// export const listTourByIdQuery = `
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
//     rp."refPackageId" = $1 AND
//       (rp."isDelete" IS null
//       OR "rp"."isDelete" IS false)
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
//   aa."refCoverImage";
//     `;

export const deleteCoverImageRecordQuery = `
UPDATE
  public."refPackage"
SET
  "refCoverImage" = NULL
WHERE
  "refPackageId" = $1
RETURNING
  *;
`;

//     export const listTourByIdQuery = `
//    WITH
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
//     rp."refPackageId" = $1 AND
//       (rp."isDelete" IS null
//       OR "rp"."isDelete" IS false)
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
//  l."refCategoryId",
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
//     l."refCategoryId",
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
//   aa."refCategoryId",
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
//   aa."refCoverImage"
//   ;

//   `;

export const listTourByIdQuery = `
 WITH
  "location_base" AS (
    SELECT
      rp."refPackageId",
      rp."refPackageName",
      rp."refActivity",
      rp."refLocation",
      rp."refDesignationId",
      rp."refCategoryId",
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
      rg."refGallery",
      rc."refCategoryName"
    FROM public."refPackage" rp
    LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refPackageId" AS INTEGER) = rp."refPackageId"
    LEFT JOIN public."refDestination" rd ON CAST(rd."refDestinationId" AS INTEGER) = rp."refDesignationId"
    LEFT JOIN public."refGallery" rg ON CAST(rg."refPackageId" AS INTEGER) = rp."refPackageId"
    LEFT JOIN public."refCategory" rc ON CAST(rc."refCategoryId" AS INTEGER) = rp."refCategoryId"
    WHERE (rp."isDelete" IS NULL OR rp."isDelete" = FALSE)
      AND rp."refPackageId" = $1
  ),

  "refLocationList" AS (
    SELECT
      rp."refPackageId",
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', rl."refLocationId",
          'name', rl."refLocationName"
        )
      ) AS "refLocationList"
    FROM public."refPackage" rp
    LEFT JOIN public."refLocation" rl ON CAST(rl."refLocationId" AS INTEGER) = ANY (
      string_to_array(regexp_replace(rp."refLocation", '[{}]', '', 'g'), ',')::INTEGER[]
    )
    WHERE rp."refPackageId" = $1
    GROUP BY rp."refPackageId"
  ),

  "activityList" AS (
    SELECT
      rp."refPackageId",
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', ra."refActivitiesId",
          'name', ra."refActivitiesName"
        )
      ) AS "Activity"
    FROM public."refPackage" rp
    LEFT JOIN public."refActivities" ra ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
      string_to_array(regexp_replace(rp."refActivity", '[{}]', '', 'g'), ',')::INTEGER[]
    )
    WHERE rp."refPackageId" = $1
    GROUP BY rp."refPackageId"
  ),

  "travalIncludeList" AS (
    SELECT
      rtd."refPackageId",
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', ti."refTravalIncludeId",
          'name', ti."refTravalInclude"
        )
      ) AS "travalInclude"
    FROM public."refTravalData" rtd
    LEFT JOIN public."refTravalInclude" ti ON CAST(ti."refTravalIncludeId" AS INTEGER) = ANY (
      string_to_array(regexp_replace(rtd."refTravalInclude", '[{}]', '', 'g'), ',')::INTEGER[]
    )
    WHERE rtd."refPackageId" = $1
    GROUP BY rtd."refPackageId"
  ),

  "travalExcludeList" AS (
    SELECT
      rtd."refPackageId",
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', te."refTravalExcludeId",
          'name', te."refTravalExclude"
        )
      ) AS "travalExclude"
    FROM public."refTravalData" rtd
    LEFT JOIN public."refTravalExclude" te ON CAST(te."refTravalExcludeId" AS INTEGER) = ANY (
      string_to_array(regexp_replace(rtd."refTravalExclude", '[{}]', '', 'g'), ',')::INTEGER[]
    )
    WHERE rtd."refPackageId" = $1
    GROUP BY rtd."refPackageId"
  )

SELECT
  lb.*,
  rl."refLocationList",
  al."Activity",
  ti."travalInclude",
  te."travalExclude"
FROM "location_base" lb
LEFT JOIN "refLocationList" rl ON rl."refPackageId" = lb."refPackageId"
LEFT JOIN "activityList" al ON al."refPackageId" = lb."refPackageId"
LEFT JOIN "travalIncludeList" ti ON ti."refPackageId" = lb."refPackageId"
LEFT JOIN "travalExcludeList" te ON te."refPackageId" = lb."refPackageId";
  
  `;
