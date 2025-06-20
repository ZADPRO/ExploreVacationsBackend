import * as Joi from "joi";

export default {
  tourBooking: {
    payload: Joi.object({
      refPackageId: Joi.number().integer().required(),
      refUserFname: Joi.string().required(),
      refUserLname: Joi.string().required(),
      refUserMail: Joi.string().email().required(),
      refUserMobile: Joi.string().required(),
      refPickupDate: Joi.string().required(),
      refAdultCount: Joi.string().required(),
      refChildrenCount: Joi.string().required(),
      refInfants: Joi.string().required(),
      refSingleRoom: Joi.string().required(),
      refTwinRoom: Joi.string().required(),
      refTripleRoom: Joi.string().required(),
      refVaccinationCertificate: Joi.string().required(),
      refOtherRequirements: Joi.string().optional().allow(null, ""),
      refPassPort: Joi.string().required(),
      refAgreementPath: Joi.string().required(),
      refApplyOffers: Joi.boolean().required(),
      refCouponCode: Joi.when("refApplyOffers", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional().allow(null, ""),
      }),
      transactionId: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  customizeBooking: {
    payload: Joi.object({
      refPackageId: Joi.number().integer().optional(),
      refUserName: Joi.string().required(),
      refUserMail: Joi.string().email().required(),
      refUserMobile: Joi.string().required(),
      refArrivalDate: Joi.string().required(),
      refSingleRoom: Joi.string().required(),
      refTwinRoom: Joi.string().required(),
      refTripleRoom: Joi.string().required(),
      refAdultCount: Joi.string().required(),
      refChildrenCount: Joi.string().required(),
      refVaccinationType: Joi.string().required(),
      refOtherRequirements: Joi.string().required(),
      refVaccinationCertificate: Joi.string().optional(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  userCarBooking: {
    payload: Joi.object({
      refCarsId: Joi.number().integer().required(),
      refUserFname: Joi.string().required(),
      refUserLname: Joi.string().required(),
      refUserMail: Joi.string().email().required(),
      refUserMobile: Joi.string().min(6).max(13).required(),
      refUserAddress: Joi.string().max(50).required(),
      refPickupDate: Joi.string().required(),
      refDropDate: Joi.string().required(),
      refFormDetails: Joi.array().items(Joi.string()).optional(),
      refOtherRequirements: Joi.string().optional(),
      refDriverName: Joi.string().required(),
      refDriverAge: Joi.string().min(18).required(),
      refDriverMail: Joi.string().email().required(),
      refDriverMobile: Joi.string().min(6).max(13).required(),
      refAgreementPath: Joi.string().required(),
      transactionId: Joi.string().required(),
      isExtraKMneeded: Joi.boolean().required(),
      refExtraKm: Joi.when("isExtraKMneeded", {
        is: true,
        then: Joi.string().optional(),
        otherwise: Joi.string().optional().allow(null, ""),
      }),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  listTour: {
    payload: Joi.object({
      refPackageId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  getCarById: {
    payload: Joi.object({
      refCarsId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  uploadCertificate: {
    payload: Joi.object({
      PdfFile: Joi.object().required().messages({
        "any.required": "PDF file is required",
        "object.base": "PDF file must be a valid file object",
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
    }),
  },
  addUserAddress: {
    payload: Joi.object({
      refUserAddress: Joi.string().required(),
      refUserCity: Joi.string().required(),
      refUserState: Joi.string().required(),
      refUserCountry: Joi.string().required(),
      refUserZipCode: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },

  UpdateprofileData: {
    payload: Joi.object({
      refFName: Joi.string().required(),
      refLName: Joi.string().required(),
      refDOB: Joi.string().required(),
      refMoblile: Joi.string().required(),
      refUserEmail: Joi.string().email().required(),
      refUserPassword: Joi.string().required(),
      refUserAddress: Joi.string().required(),
      refUserCity: Joi.string().required(),
      refUserState: Joi.string().required(),
      refUserCountry: Joi.string().required(),
      refUserZipCode: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  listCarParking: {
    payload: Joi.object({
      travelStartDate: Joi.string().required(),
      travelEndDate: Joi.string().required(),
      refAssociatedAirport: Joi.string().required(),
      refCarParkingTypeId: Joi.number().integer().required(),
      refParkingTypeId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  carParkingBooking: {
    payload: Joi.object({
      travelStartDate: Joi.string().required(),
      travelEndDate: Joi.string().required(),
      refCarParkingId: Joi.number().integer().required(),
      returnFlightNumber: Joi.string().required(),
      returnFlightLocation: Joi.string().required(),
      VehicleModel: Joi.string().required(),
      vehicleNumber: Joi.string().required(),
      refHandOverTime: Joi.string().required(),
      refReturnTime: Joi.string().required(),
      WhoWillHandover: Joi.boolean().required(),

      HandoverPersonName: Joi.alternatives().conditional("WhoWillHandover", {
        is: false,
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),

      HandoverPersonPhone: Joi.alternatives().conditional("WhoWillHandover", {
        is: false,
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),

      HandoverPersonEmail: Joi.alternatives().conditional("WhoWillHandover", {
        is: false,
        then: Joi.string().email().required(),
        otherwise: Joi.forbidden(),
      }),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  checkoffer: {
    payload: Joi.object({
      refPackageId: Joi.number().integer().required(),
      refCouponCode: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  extraKMcharges: {},
};
