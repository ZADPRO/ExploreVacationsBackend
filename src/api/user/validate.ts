import * as Joi from "joi";

export default {
  tourBooking: {
    payload: Joi.object({
      refPackageId: Joi.number().integer().required(),
      refUserName: Joi.string().min(1).max(255).required(),
      refUserMail: Joi.string().email().required(),
      refUserMobile: Joi.string().required(),
      refPickupDate: Joi.date().iso().required(),
      refAdultCount: Joi.string().required(),
      refChildrenCount: Joi.string().required(),
      refInfants: Joi.string().required(),
      refOtherRequirements: Joi.string().optional(),
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
      refUserName: Joi.string().required(),
      refUserMail: Joi.string().email().required(),
      refUserMobile: Joi.string().required(),
      refPickupAddress: Joi.string().required(),
      refSubmissionAddress: Joi.string().required(),
      refPickupDate: Joi.string().required(),
      refAdultCount: Joi.string().required(),
      refChildrenCount: Joi.string().required(),
      refInfants: Joi.string().required(),
      refOtherRequirements: Joi.string().required(),
      refFormDetails: Joi.array().items(Joi.string()).min(1).optional(),
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
};