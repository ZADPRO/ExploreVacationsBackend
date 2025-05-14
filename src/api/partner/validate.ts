import * as Joi from "joi";

export default {
  addPartners: {
    payload: Joi.object({
      refFName: Joi.string().required(),
      refLName: Joi.string().required(),
      refDOB: Joi.string().required(),
      refMoblile: Joi.string().required(),
      refUserEmail: Joi.string().email().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updatePartner: {
    payload: Joi.object({
      refuserId: Joi.number().integer().required(),
      refFName: Joi.string().required(),
      refLName: Joi.string().required(),
      refDOB: Joi.string().required(),
      refMoblile: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  getPartners: {
    payload: Joi.object({
      userId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deletePartners: {
    payload: Joi.object({
      refuserId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
};
