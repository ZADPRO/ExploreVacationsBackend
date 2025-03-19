//update Transaction 
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

export const addTourBookingQuery = `INSERT INTO
  public."userTourBooking" (
    "refPackageId",
    "refUserName",
    "refUserMail",
    "refUserMobile",
    "refPickupDate",
    "refAdultCount",
    "refChildrenCount",
    "refInfants",
    "refOtherRequirements",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING
  *;
`;


export const addcustomizeBookingQuery = `
    INSERT INTO public."customizeTourBooking" (
        "refUserName", 
        "refUserMail", 
        "refUserMobile", 
        "refPackageId", 
        "refArrivalDate", 
        "refSingleRoom", 
        "refTwinRoom", 
        "refTripleRoom", 
        "refAdultCount", 
        "refChildrenCount", 
        "refVaccinationType", 
        "refVaccinationCertificate", 
        "refOtherRequirements", 
        "createdAt", 
        "createdBy"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
    RETURNING *;
`;
