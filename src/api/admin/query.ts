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


export const listTourBookingsQuery = `SELECT 
rtb.*,
rp."refPackageName"
FROM public."userTourBooking" rtb
JOIN public."refPackage" rp ON CAST ( rp."refPackageId" AS INTEGER ) = rtb."refPackageId"

`;

export const listCarBookingsQuery = `SELECT 
rcb.*,
rvt."refVehicleTypeName"
FROM public."userCarBooking" rcb
JOIN public."refVehicleType" rvt ON CAST ( rvt."refVehicleTypeId" AS INTEGER ) = rcb."refVehicleTypeId"
`;


export const listCustomizeTourBookingsQuery = `SELECT 
ctb.*,
rp."refPackageName"
FROM public."customizeTourBooking" ctb
LEFT JOIN public."refPackage" rp ON CAST ( rp."refPackageId" AS INTEGER ) = ctb."refPackageId"::INTEGER
`;

export const listAuditPageQuery = `SELECT * FROM public."refTxnHistory";
`;