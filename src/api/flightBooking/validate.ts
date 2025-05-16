import * as Joi from "joi";

export default {
  flightBooking: {
    payload: Joi.object({
      refUserName: Joi.string().required(),
      refMoblile: Joi.string().required(),
      refEmail: Joi.string().required(),
      refPickup: Joi.string().required(),
      refDestination: Joi.string().required(),
      refRequirements: Joi.string().required(),
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
