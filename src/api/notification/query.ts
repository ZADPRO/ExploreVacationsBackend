export const addNotificationQuery = `
INSERT INTO
  public."refNotifications" (
    "refUserTypeId",
    "refSubject",
    "refDescription",
    "refNotes",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6)
RETURNING
  *;
`;

export const updateNotificationQuery =`
UPDATE
  public."refNotifications"
SET
  "refUserTypeId" = $2,
  "refSubject" = $3,
  "refDescription" = $4,
  "refNotes" = $5,
  "updatedAt" = $6,
  "updatedBy" = $7
WHERE
  "refNotificationsId" = $1
RETURNING
  *;
`;

export const listNotificationQuery = `
SELECT
  n.*,
  array_agg(ut."refUserType") AS "refUserType"
FROM
  public."refNotifications" n
  LEFT JOIN public."refUserType" ut ON CAST(ut."refUserTypeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(n."refUserTypeId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  n."isDelete" IS NOT true
GROUP BY
  n."refNotificationsId";
`;

export const getNotificationQuery = `
SELECT
  n.*,
  array_agg(ut."refUserType") AS "refUserType",
  array_to_json(
    string_to_array(
      trim(
        both '{}'
        from
          n."refUserTypeId"
      ),
      ','
    )::int[]
  ) AS "userTypeId"
FROM
  public."refNotifications" n
  LEFT JOIN public."refUserType" ut ON CAST(ut."refUserTypeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(n."refUserTypeId", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  n."isDelete" IS NOT true
  AND n."refNotificationsId" = $1
GROUP BY
  n."refNotificationsId";
`;

export const deleteNotificationQuery = `
UPDATE
  public."refNotifications"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refNotificationsId" = $1
RETURNING
  *;
`;

export const staffNotificationCountQuery = `
SELECT
  COUNT(*) AS "unReadNotifications"
FROM
  public."refNotifications"
WHERE
  "isDelete" IS NOT true
  AND "refReadStatus" != 'Read';
`;

export const staffNotificationsQuery =`

`;