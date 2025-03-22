export const addVehicleQuery = `INSERT INTO
  public."refVehicleType" (
    "refVehicleTypeName",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, $2, $3, false)
RETURNING
  *;
`;
export const checkVehiclesQuery = `SELECT
  COUNT(*) AS count
FROM
  public."refVehicleType"
WHERE
  "refVehicleTypeId" = $1
  AND "isDelete" = false
`;

export const updateVehicleQuery = `UPDATE
  public."refVehicleType" 
SET
  "refVehicleTypeName" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refVehicleTypeId" = $1
  RETURNING *;
`;

export const listVehicleQuery = `SELECT
  *
FROM
  public."refVehicleType"
WHERE
  "isDelete" = false;
`;

export const deleteVehicleQuery = `UPDATE
  public."refVehicleType"
SET
  "isDelete" = TRUE,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refVehicleTypeId" = $1
RETURNING
  *;
`;

// benifits
export const addBenifitsQuery = `INSERT INTO public."refBenifits"  (
    "refBenifitsName",
    "createdAt",
    "createdBy",
  "isDelete"
  )
  VALUES ($1, $2, $3 , false)
  RETURNING *;
`;

export const checkBenifitsQuery = `SELECT COUNT(*) AS count 
FROM public."refBenifits" WHERE "refBenifitsId" = $1
  AND "isDelete" = false;
`;

export const updateBenifitsQuery = `UPDATE
public."refBenifits" 
SET
"refBenifitsName" = $2,
"updatedAt" = $3,
"updatedBy" = $4
WHERE
"refBenifitsId" = $1;`;

export const listBenifitsQuery = `SELECT * FROM public."refBenifits"
WHERE
  "isDelete" = false;
`;

export const deletebenifitsQuery = `UPDATE
  public."refBenifits"
SET
  "isDelete" = TRUE,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refBenifitsId" = $1
RETURNING
  *;
`;

//include
export const addIncludeQuery = `INSERT INTO public."refInclude"(
    "refIncludeName",
    "createdAt",
    "createdBy",
  "isDelete",
  )
  VALUES ($1, $2, $3, false)
  RETURNING *;
`;

export const checkIncludeQuery = `SELECT
  COUNT(*) AS count
FROM
  public."refInclude"
WHERE
  "refIncludeId" = $1
  AND "isDelete" = false
`;

export const updateIncludeQuery = `UPDATE
public."refInclude"
SET
"refIncludeName" = $2,
"updatedAt" = $3,
"updatedBy" = $4
WHERE
"refIncludeId" = $1;
`;

export const listIncludeQuery = `SELECT * FROM public."refInclude"
WHERE
  "isDelete" = false;
`;

export const deleteIncludeQuery = `UPDATE
  public."refInclude"
SET
  "isDelete" = TRUE,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refIncludeId" = $1
RETURNING
  *;
`;

// exclude
export const addExcludeQuery = `INSERT INTO
  public."refExclude" (
    "refExcludeName",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, $2, $3, false)
RETURNING
  *;
`;

export const checkExcludeQuery = `SELECT COUNT(*) AS count 
FROM public."refExclude" WHERE "refExcludeId" = $1
  AND "isDelete" = false
`;

export const updateExcludeQuery = `UPDATE
public."refExclude"
SET
"refExcludeName" = $2,
"updatedAt" = $3,
"updatedBy" = $4
WHERE
"refExcludeId" = $1;
`;

export const listExcludeQuery = `SELECT * FROM public."refExclude"
`;

export const deleteExcludeQuery = `UPDATE
  public."refExclude"
SET
  "isDelete" = TRUE,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refExcludeId" = $1
RETURNING
  *;
`;

// DriverDetails
export const addDriverDetailsQuery = `INSERT INTO
  public."refDriverDetails" (
    "refDriverName",
    "refDriverAge",
    "refDriverMail",
    "refDriverMobile",
    "refDriverLocation",
    "isVerified",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, false)
RETURNING
  *;
`;

export const checkDriverDetailsQuery = `SELECT COUNT(*) AS count 
FROM public."refDriverDetails" WHERE "refDriverDetailsId" = $1
  AND "isDelete" = false
`;

export const updateDriverDetailsQuery = `UPDATE
public."refDriverDetails"
SET
"refDriverName" = $2,
"refDriverAge" = $3,
"refDriverMail" = $4,
"refDriverMobile" = $5,
"refDriverLocation" = $6,
"isVerified" = $7,
"updatedAt" = $8,
"updatedBy" = $9
WHERE
"refDriverDetailsId" = $1;`;

export const listDriverDetailsQuery = `SELECT
  *
FROM
  public."refDriverDetails"
WHERE
  "isDelete" = false;
`;

export const deleteDriverDetailsQuery = `UPDATE
  public."refDriverDetails"
SET
  "isDelete" = TRUE,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refDriverDetailsId" = $1
RETURNING
  *;
`;

// TermsAndConditions
export const addTermsAndConditionsQuery = `UPDATE public."refTermsAndConditions"
SET "refAnswer" = $1,
"refCarsId" = $5,
"updatedAt" = $3,
"updatedBy" = $4
WHERE "refTermsAndConditionsId" = $2;
`;


// INSERT INTO public."refTermsAndConditions"  ("refQuestion", "refAnswer") VALUES ($1, $2, $3, $4)

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

// FormDetails

export const addFormDetailsQuery = `INSERT INTO
  public."refFormDetails" (
    "refFormDetails",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, $2, $3, false)
RETURNING
  *;
`;

export const checkFormDetailsQuery = `SELECT
  COUNT(*) AS count
FROM
  public."refFormDetails"
WHERE
  "refFormDetailsId" = $1
  AND "isDelete" = false;
`;

export const updateFormDetailsQuery = `UPDATE
  public."refFormDetails"
SET
  "refFormDetails" = $2,
  "updatedAt" = $3,
  "updatedBy" = $4
WHERE
  "refFormDetailsId" = $1;
`;

export const listFormDetailsQuery = `SELECT
  *
FROM
  public."refFormDetails"
WHERE
  "isDelete" = false;
`;

export const deleteFormDetailsQuery = `UPDATE
  public."refFormDetails"
SET
  "isDelete" = TRUE,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refFormDetailsId" = $1
RETURNING
  *;
`;

// cars

export const addCarsQuery = `INSERT INTO
  public."refCarsTable" (
    "refVehicleTypeId",
    "refPersonCount",
    "refBagCount",
    "refFuelType",
    "refcarManufactureYear",
    "refMileage",
    "refTrasmissionType",
    "refFuleLimit",
    "refBenifits",
    "refInclude",
    "refExclude",
    "refDriverDetailsId",
    "refFormDetails",
    "refOtherRequirements",
    "refCarPath",
    "createdAt",
    "createdBy",
    "isDelete"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, false) 
RETURNING
  *;
`;

export const addCondation = `INSERT INTO
  public."refTermsAndConditions"(
    "refCarsId",
    "refRentalAgreement",
    "refFuelPolicy",
    "refDriverRequirements",
    "refPaymentTerms",
    "createdAt",
    "createdBy"
  )
values
  ($1, $2, $3, $4, $5, $6, $7)
  `;


  export const updateCondation = `UPDATE
  public."refTermsAndConditions"
SET
  "refRentalAgreement" = $2,
  "refFuelPolicy" = $3,
  "refDriverRequirements" = $4,
  "refPaymentTerms" = $5,
  "updatedAt" = $6,
  "createdBy" = $7
WHERE
  "refCarsId" = $1
RETURNING
  *;
  `;

export const updateCarsQuery = `
        UPDATE public."refCarsTable"
        SET 
          "refVehicleTypeId" = $1,
          "refPersonCount" = $2,
          "refBagCount" = $3,
          "refFuelType" = $4,
          "refcarManufactureYear" = $5,
          "refMileage" = $6,
          "refTrasmissionType" = $7,
          "refFuleLimit" = $8,
          "refBenifits" = $9,
          "refInclude" = $10,
          "refExclude" = $11,
          "refDriverDetailsId" = $12,
          "refFormDetails" = $13,
          "refOtherRequirements" = $14,
          "refCarPath" = $15,
          "updatedAt" = $16,
          "updatedBy" = $17
        WHERE "refCarsId" = $18
        RETURNING *;
      `;

export const deleteCarsQuery =`UPDATE
  public."refCarsTable"
SET
  "isDelete" = TRUE,
  "deletedAt" = $2,
  "deletedBy" = $3
WHERE
  "refCarsId" = $1
RETURNING
  *;
`;


export const listCarsQuery = `SELECT
rc.refCarsId,
  rvt."refVehicleTypeName",
  rc."refPersonCount",
  rc."refBagCount",
  rc."refFuelType",
  rc."refcarManufactureYear",
  rc."refMileage",
  rc."refTrasmissionType",
  rc."refFuleLimit",
  rc."refCarPath"
FROM
  public."refCarsTable" rc
  LEFT JOIN public."refVehicleType" rvt ON CAST(rvt."refVehicleTypeId" AS INTEGER) = rc."refVehicleTypeId"
  WHERE rc."isDelete" IS NOT true ;
      `;

// export const getCarsByIdQuery = `SELECT
//   rc."refCarsId",
//   rvt."refVehicleTypeName",
//   rc."refPersonCount",
//   rc."refBagCount",
//   rc."refFuelType",
//   rc."refcarManufactureYear",
//   rc."refMileage",
//   rc."refTrasmissionType",
//   rc."refFuleLimit",
//   STRING_AGG(DISTINCT rb."refBenifitsName", ', ') AS "benifits",
//   STRING_AGG(DISTINCT ri."refIncludeName", ', ') AS "Include",
//   STRING_AGG(DISTINCT re."refExcludeName", ', ') AS "Exclude",
//   rdd."refDriverName",
//   rdd."refDriverAge",
//   rdd."refDriverMail",
//   rdd."refDriverMobile",
//   rdd."refDriverLocation",
//   rdd."isVerified",
//   rtc."refQuestion",
//   rtc."refAnswer",
//   STRING_AGG(DISTINCT rfd."refFormDetails", ', ') AS "refFormDetails",
//   rc."refOtherRequirements"
// FROM
//   public."refCarsTable" rc
//   LEFT JOIN public."refVehicleType" rvt ON CAST(rvt."refVehicleTypeId" AS INTEGER) = rc."refVehicleTypeId"
//   LEFT JOIN public."refBenifits" rb ON CAST(rb."refBenifitsId" AS INTEGER) = ANY (
//     string_to_array(
//       regexp_replace(rc."refBenifits", '[{}]', '', 'g'),
//       ','
//     )::INTEGER[]
//   )
//   LEFT JOIN public."refInclude" ri ON CAST(ri."refIncludeId" AS INTEGER) = ANY (
//     string_to_array(
//       regexp_replace(rc."refInclude", '[{}]', '', 'g'),
//       ','
//     )::INTEGER[]
//   )
//   LEFT JOIN public."refExclude" re ON CAST(re."refExcludeId" AS INTEGER) = ANY (
//     string_to_array(
//       regexp_replace(rc."refExclude", '[{}]', '', 'g'),
//       ','
//     )::INTEGER[]
//   )
//   LEFT JOIN public."refDriverDetails" rdd ON CAST(rdd."refDriverDetailsId" AS INTEGER) = rc."refDriverDetailsId"
//   LEFT JOIN public."refTermsAndConditions" rtc ON CAST(rtc."refTermsAndConditionsId" AS INTEGER) = rc."refTermsAndConditionsId"
//   LEFT JOIN public."refFormDetails" rfd ON CAST(rfd."refFormDetailsId" AS INTEGER) = ANY (
//     string_to_array(
//       regexp_replace(rc."refFormDetails", '[{}]', '', 'g'),
//       ','
//     )::INTEGER[]
//   )
//   WHERE rc."refCarsId" = $1 
// GROUP BY
//   rc."refCarsId",
//   rvt."refVehicleTypeName",
//   rc."refPersonCount",
//   rc."refBagCount",
//   rc."refFuelType",
//   rc."refcarManufactureYear",
//   rc."refMileage",
//   rc."refTrasmissionType",
//   rc."refFuleLimit",
//   rdd."refDriverName",
//   rtc."refQuestion",
//   rtc."refAnswer",
//   rc."refOtherRequirements",
//   rdd."refDriverDetailsId"
// ;
//       `;




export const getCarsByIdQuery = `SELECT
  rc."refCarsId",
  rvt."refVehicleTypeName",
  rc."refPersonCount",
  rc."refBagCount",
  rc."refFuelType",
  rc."refcarManufactureYear",
  rc."refMileage",
  rc."refTrasmissionType",
  rc."refFuleLimit",
  STRING_AGG(DISTINCT rb."refBenifitsName", ', ') AS "benifits",
  STRING_AGG(DISTINCT ri."refIncludeName", ', ') AS "Include",
  STRING_AGG(DISTINCT re."refExcludeName", ', ') AS "Exclude",
  rdd."refDriverName",
  rdd."refDriverAge",
  rdd."refDriverMail",
  rdd."refDriverMobile",
  rdd."refDriverLocation",
  rdd."isVerified",
  rtc."refRentalAgreement",
  rtc."refFuelPolicy",
  rtc."refDriverRequirements",
  rtc."refPaymentTerms",
  STRING_AGG(DISTINCT rfd."refFormDetails", ', ') AS "refFormDetails",
  rc."refOtherRequirements"
FROM
  public."refCarsTable" rc
  LEFT JOIN public."refVehicleType" rvt ON CAST(rvt."refVehicleTypeId" AS INTEGER) = rc."refVehicleTypeId"
  LEFT JOIN public."refBenifits" rb ON CAST(rb."refBenifitsId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(rc."refBenifits", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refInclude" ri ON CAST(ri."refIncludeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(rc."refInclude", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refExclude" re ON CAST(re."refExcludeId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(rc."refExclude", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refDriverDetails" rdd ON CAST(rdd."refDriverDetailsId" AS INTEGER) = rc."refDriverDetailsId"
  LEFT JOIN public."refTermsAndConditions" rtc ON CAST(rtc."refCarsId" AS INTEGER) = rc."refCarsId"
  LEFT JOIN public."refFormDetails" rfd ON CAST(rfd."refFormDetailsId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(rc."refFormDetails", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  WHERE rc."refCarsId" = $1 
GROUP BY
  rc."refCarsId",
  rvt."refVehicleTypeName",
  rc."refPersonCount",
  rc."refBagCount",
  rc."refFuelType",
  rc."refcarManufactureYear",
  rc."refMileage",
  rc."refTrasmissionType",
  rc."refFuleLimit",
  rdd."refDriverName",
  rc."refOtherRequirements",
  rdd."refDriverDetailsId",
  rtc."refTermsAndConditionsId";`;


  