export const checkQuery = `
SELECT
  *
FROM
  public."refUserDomain" ud
  LEFT JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = ud."refUserId"
WHERE
  ud."refUserEmail" = $1
  AND u."isDelete" IS NOT true
LIMIT
  10;
  `;

export const getLastPartnerIdQuery = `
  SELECT
  COUNT(*)
FROM
  public.users u
WHERE
  u."refCustId" LIKE 'EV-PART-%';
`;

export const insertUserQuery = `INSERT INTO
  public.users(
    "refCustId",
    "refFName",
    "refLName",
    "refDOB",
    "refMoblile",
    "refUserTypeId",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8)
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

export const getPartnerQuery = `
SELECT
  *
FROM
  public."users"
WHERE
  "refuserId" = $1
`;
export const updatePartnerQuery = `
UPDATE
  public."users" 
SET
  "refFName" = $2,
  "refLName" = $3,
  "refDOB" = $4,
  "refMoblile" = $5,
  "refUserTypeId" = $6,
  "updatedAt" =$7,
  "updatedBy" = $8
WHERE
  "refuserId" = $1
RETURNING
  *;
`;

export const getPartnersQuery = `
SELECT
  u.*,
  ud."refUserEmail",
  ud."refUsername",
  ud."refUserPassword",
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
  u."refuserId" = $1
GROUP BY
  u."refuserId",
  ud."refUserEmail",
  ud."refUsername",
  ud."refUserHashedPassword",
  ud."refUserPassword"
ORDER BY
  u."refuserId" DESC;
`;

export const listPartnersQuery = `
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
  u."isDelete" IS NOT true AND u."refCustId" LIKE 'EV-PART-%'
GROUP BY
  u."refuserId",
  ud."refUserEmail",
  ud."refUsername",
  ud."refUserHashedPassword"
  ORDER BY
  u."refuserId" DESC;
`;

export const getDeletedPartnerQuery = `
SELECT
  "refCustId",
  "refFName"
FROM
  public."users" 
WHERE
  "refuserId" = $1;
`;
export const deletePartnersQuery = `
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
