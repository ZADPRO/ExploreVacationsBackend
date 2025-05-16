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
    "refOffersId",
    "refUserTypeId",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
  "refOffersId" = $6,
  "refUserTypeId" = $7,
  "updatedAt" =$8,
  "updatedBy" = $9
WHERE
  "refuserId" = $1
RETURNING
  *;
`;

export const getPartnersQuery = `
SELECT
  u.*,
  o.*,
  ud."refUserEmail",
  ud."refUsername",
  ud."refUserPassword",
  ud."refUserHashedPassword",
  array_agg(ut."refUserType") AS "refUserType"
FROM
  public."users" u
  LEFT JOIN public."refUserDomain" ud ON CAST(ud."refUserId" AS INTEGER) = u."refuserId"
  LEFT JOIN public."refOffers" o ON CAST(o."refOffersId" AS INTEGER) = u."refOffersId"
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
  ud."refUserPassword",
  o."refOffersId"
ORDER BY
  u."refuserId" DESC;
`;

export const listPartnersQuery = `
SELECT
  u.*,
  o.*,
  ud."refUserEmail",
  ud."refUsername",
  ud."refUserHashedPassword",
  array_agg(ut."refUserType") AS "refUserType"
FROM
  public."users" u
  LEFT JOIN public."refUserDomain" ud ON CAST(ud."refUserId" AS INTEGER) = u."refuserId"
  LEFT JOIN public."refOffers" o ON CAST(o."refOffersId" AS INTEGER) = u."refOffersId"
  LEFT JOIN public."refUserType" ut ON CAST(ut."refUserTypeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(u."refUserTypeId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  u."isDelete" IS NOT true
  AND u."refCustId" LIKE 'EV-PART-%'
GROUP BY
  u."refuserId",
  ud."refUserEmail",
  ud."refUsername",
  ud."refUserHashedPassword",
  o."refOffersId"
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

export const insertoffersQuery = `
INSERT INTO
  public."refOffers" (
    "refOffersName",
    "refOfferType",
    "refDescription",
    "refOfferValue",
    "refCoupon",
    "isActive",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING
  *;
`;

export const updateoffersQuery = `
UPDATE
  public."refOffers"
SET
  "refOffersName" = $2,
  "refOfferType" = $3,
  "refDescription" = $4,
  "refOfferValue" = $5,
  "refCoupon" = $6,
  "isActive" = $7,
  "updatedAt" = $8,
  "updatedBy" = $9
WHERE
  "refOffersId" = $1
RETURNING
  *;
`;
export const getDeletedOfferQuery = `
SELECT
  *
FROM
  public."refOffers"
WHERE
  "refOffersId" = $1
`;
export const deleteOffersQuery = `
UPDATE
  public."refOffers"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refOffersId" = $1
RETURNING
  *;
`;

export const listOffersQuery =
`
SELECT
  *
FROM
  public."refOffers"
  WHERE "isDelete" IS NOT true
`;

export const applyCouponQuery = `
UPDATE
  public."users"
SET
  "refApplyCoupon" = 'Applied'
WHERE
  "refuserId" = $1
RETURNING
  *;
`;

export const getdataQuery = `
SELECT
  u."refCustId",
  u."refFName",
  u."refOffersId",
  ud."refUserEmail",
  u."refMoblile",
  o.*
FROM
  public."users" u
  LEFT JOIN public."refUserDomain" ud ON CAST (ud."refUserId" AS INTEGER ) = u."refuserId"
  LEFT JOIN public."refOffers" o ON CAST (o."refOffersId" AS INTEGER ) = u."refOffersId"
WHERE
  u."refuserId" = $1
`;

export const getOffersQuery = `
SELECT
  *
FROM
  public."refOffers"
WHERE
  "refOffersId" = $1
`;