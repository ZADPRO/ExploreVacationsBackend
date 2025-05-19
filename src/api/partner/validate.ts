import * as Joi from "joi";

export default {
  addPartners: {
    payload: Joi.object({
      refFName: Joi.string().required(),
      refLName: Joi.string().required(),
      refDOB: Joi.string().required(),
      refMoblile: Joi.string().required(),
      refOffersId: Joi.number().integer().required(),
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
      refOffersId: Joi.number().integer().required(),
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
  addOffers: {
    payload: Joi.object({
      refOffersName: Joi.string().required(),
      refOfferType: Joi.string().required(),
      refDescription: Joi.string().required(),
      refOfferValue: Joi.string().required(),
      refCoupon: Joi.string().required(),
      isActive: Joi.boolean().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateOffers: {
    payload: Joi.object({
      refOffersId: Joi.number().integer().required(),
      refOffersName: Joi.string().required(),
      refOfferType: Joi.string().required(),
      refDescription: Joi.string().required(),
      refOfferValue: Joi.string().required(),
      refCoupon: Joi.string().required(),
      isActive: Joi.boolean().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteOffers: {
    payload: Joi.object({
      refOffersId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  applyCoupon: {
    payload: Joi.object({
      userId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
   getOffers: {
    payload: Joi.object({
      refOffersId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
};
