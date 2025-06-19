export const getTourData = `
SELECT
  *
FROM
  public."userTourBooking" ut
  JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = ut."refuserId"
WHERE
  to_char(ut."refPickupDate"::date, 'YYYY-MM-DD') = to_char(CURRENT_DATE::TIMESTAMP, 'YYYY-MM-DD');

  `;

export const getCarData = `
SELECT
  *
FROM
  public."userCarBooking" cb
  JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = cb."refuserId"
WHERE
  to_char(cb."refPickupDate"::date, 'YYYY-MM-DD') = to_char(CURRENT_DATE::TIMESTAMP, 'YYYY-MM-DD');
`;

export const getCustomizeTourRemData = `
SELECT
  *
FROM
  public."customizeTourBooking" ct
  JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = ct."refuserId"
WHERE
  to_char(ct."refArrivalDate"::date, 'YYYY-MM-DD') = to_char(CURRENT_DATE::TIMESTAMP, 'YYYY-MM-DD');
`;

export const getCarParkingRemData = `
SELECT
  cp.*,
  u.*,
  ud."refUserEmail"
FROM
  public."userCarParkingBooking" cp
  JOIN public."users" u ON CAST(u."refuserId" AS INTEGER) = cp."refuserId"
  JOIN public."refUserDomain" ud ON CAST(ud."refUserId" AS INTEGER) = cp."refuserId"
WHERE
  to_char(cp."travelStartDate"::date, 'YYYY-MM-DD') = to_char(CURRENT_DATE::TIMESTAMP, 'YYYY-MM-DD');
`;