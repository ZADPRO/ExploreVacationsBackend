import * as Joi from "joi";

export default {
  flightBooking: {
    payload: Joi.object({
      refUserName: Joi.string().min(2).max(50).required(),
      refMoblile: Joi.string().pattern(/^\d+$/).required(),
      refEmail: Joi.string().email().required(),
      refPickup: Joi.string().min(2).max(50).required(),
      refDestination: Joi.string().min(2).max(50).required(),
      flightORtour: Joi.string().required(),
      refAdultCount: Joi.string().pattern(/^\d+$/).required(),
      refKidsCount: Joi.string().pattern(/^\d+$/).required(),
      refInfantsCount: Joi.string().pattern(/^\d+$/).required(),
      refRequirements: Joi.string().min(2).max(100).required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
   deleteFlightBooking: {
      payload: Joi.object({
        flightBookingId: Joi.number().integer().required(),
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
    },
};
