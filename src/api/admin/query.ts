export const  selectUserByLogin =`SELECT *
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