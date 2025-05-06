export const updateHistoryQuery = `
INSERT INTO
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

export const addHomePageQuery = `
INSERT INTO
  public."refHomePage" (
 "refHomePageName",
    "homePageHeading",
    "homePageContent",
    "refOffer",
    "refOfferName",
    "homePageImage",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING
  *;
`;

export const updateHomePageQuery = `
UPDATE
  public."refHomePage"
SET
"refHomePageName" = $2
  "homePageHeading" = $3,
  "homePageContent" = $4,
  "refOffer" = $5,
  "refOfferName" = $6,
  "homePageImage" = $7,
  "updatedAt" =  $8,
  "updatedBy" = $9
WHERE
  "refHomePageId" = $1
  RETURNING *;
`;

export const getModuleQuery = `
SELECT
  *
FROM
  public."refModule"
`;

export const deleteHomeImageContentQuery = `
UPDATE
  public."refHomePage"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refHomePageId" = $1
RETURNING
  *;
`;

export const getImageRecordQuery = `
SELECT
  "homePageImage"
FROM
  public."refHomePage" 
WHERE
  "refHomePageId" = $1;
`;
export const deleteImageRecordQuery = `

`;