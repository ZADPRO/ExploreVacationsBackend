export const getPriceQuery = `
SELECT
  cp."refPrice"
FROM
  public."refCarParkingTable" cp
WHERE
  cp."refCarParkingId" = $1
`;