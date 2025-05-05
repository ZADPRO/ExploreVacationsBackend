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
    "homePageHeading",
    "homePageContent",
    "refOffer",
    "refOfferName",
    "homePageImage"
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7)
RETURNING
  *;
`;