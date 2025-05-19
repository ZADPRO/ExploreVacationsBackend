import * as Joi from "joi";

export default {
  addCarGroup: {
    payload: Joi.object({
      refCarGroupName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateCarGroup:{
  payload: Joi.object({
      refCarGroupId: Joi.number().integer().required(),
      refCarGroupName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteCarGroup: {
      payload: Joi.object({
        refCarGroupId: Joi.number().integer().required(),
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
    },
      userOfflineCarBooking: {
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
          refDriverName: Joi.string().required(),
          refDriverAge: Joi.string().required(),
          refDriverMail: Joi.string().required(),
          refDriverMobile: Joi.string().required(),
        }),
        headers: Joi.object({
          authorization: Joi.string().optional(),
        }).unknown(),
      },
};
