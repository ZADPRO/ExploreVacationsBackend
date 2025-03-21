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


export const addCarBookingQuery = ` INSERT INTO public."userCarBooking" (
        "refUserName", 
        "refUserMail", 
        "refUserMobile", 
        "refPickupAddress", 
        "refSubmissionAddress", 
        "refPickupDate", 
        "refVehicleTypeId", 
        "refAdultCount", 
        "refChildrenCount", 
        "refInfants", 
        "refFormDetails", 
        "refOtherRequirements", 
        "createdAt", 
        "createdBy"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
    RETURNING *;

`;



export const listTourQuery = `SELECT 
rp.*
FROM public."refPackage" rp
WHERE rp."refPackageId" = $1
`;


export const listOtherTourQuery = `SELECT *
FROM public."refPackage"
WHERE "refPackageId" NOT IN ($1);
`;

export const listallTourQuery = `SELECT 
  rp."refPackageName",
  rp."refDesignationId",
  rp."refDurationIday",
  rp."refDurationINight",
  rp."refCategoryId",
  rp."refGroupSize",
  rp."refTourPrice",
  rp."refSeasonalPrice",
    STRING_AGG(DISTINCT rl."refLocationName", ', ') AS "refLocation",
    STRING_AGG(DISTINCT ra."refActivitiesName", ', ') AS "refActivity",
    STRING_AGG(DISTINCT rti."refTravalInclude", ', ') AS "travalInclude",
    STRING_AGG(DISTINCT rte."refTravalExclude", ', ') AS "travalExclude",
    rg.*,
    rtd.*
FROM public."refPackage" rp
LEFT JOIN public."refGallery" rg ON CAST (rg."refPackageId" AS INTEGER ) = rp."refPackageId"
LEFT JOIN public."refTravalData" rtd ON CAST(rtd."refTravalDataId" AS INTEGER) = rp."refTravalDataId"
LEFT JOIN public."refLocation" rl 
    ON CAST(rl."refLocationId" AS INTEGER) = ANY (
        string_to_array(
            regexp_replace(rp."refLocation", '[{}]', '', 'g'),
            ','
        )::INTEGER[]
    )
LEFT JOIN public."refActivities" ra 
    ON CAST(ra."refActivitiesId" AS INTEGER) = ANY (
        string_to_array(
            regexp_replace(rp."refActivity", '[{}]', '', 'g'),
            ','
        )::INTEGER[]
    )
LEFT JOIN public."refTravalInclude" rti
    ON CAST(rti."refTravalIncludeId" AS INTEGER) = ANY (
        string_to_array(
            regexp_replace(rtd."refTravalInclude", '[{}]', '', 'g'),
            ','
        )::INTEGER[]
    ) 
LEFT JOIN public."refTravalExclude" rte
    ON CAST(rte."refTravalExcludeId" AS INTEGER) = ANY (
        string_to_array(
            regexp_replace(rtd."refTravalExclude", '[{}]', '', 'g'),
            ','
        )::INTEGER[]
    )    
GROUP BY rp."refPackageId", rg."refGalleryId", rtd."refTravalDataId";

`;

export const addTravalDataQuery = `INSERT INTO
  public."refTravalData" (
    "refPackageId",
    "refItinary",
    "refItinaryMapPath",
    "refTravalInclude",
    "refTravalExclude",
    "refOtherRequirements",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, false)
RETURNING
  *;
`;

export const updateTravalDataQuery = `UPDATE
  public."refTravalData"
SET
  "refPackageId" = $2,
  "refItinary" = $3,
  "refItinaryMapPath" = $4,
  "refTravalInclude" = $5,
  "refTravalExclude" = $6,
  "refSpecialNotes" = $7,
  "updatedAt" = $8,
  "updatedBy" = $9
WHERE
  "refTravalDataId" = $1 
RETURNING
  *;
`;