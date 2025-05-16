export const addFlightBookingQuery = `
INSERT INTO
  public."flightBooking" (
    "refUserName",
    "refMoblile",
    "refEmail",
    "refPickup",
    "refDestination",
    "refRequirements",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING
  *;
`;

export const listuserflightBookingHistoryQuery =`
SELECT
  *
FROM
  public."flightBooking"
WHERE
  "createdBy"::INTEGER = $1
`;

export const listFlightBookingQuery =`
SELECT
  *
FROM
  public."flightBooking"
WHERE
  "isDelete" IS NOT true
`;

export const deleteflightBookingQuery  = `
UPDATE
  public."flightBooking"
SET
  "isDelete" = true,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "flightBookingId" = $1
RETURNING
  *;
`;