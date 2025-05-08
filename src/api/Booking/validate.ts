import * as Joi from "joi";

export default {
  homeImageContent: {
    payload: Joi.object({
      refHomePageName: Joi.string().required(),
      homePageHeading: Joi.string().required(),
      homePageContent: Joi.string().required(),
      refOffer: Joi.string().required(),
      refOfferName: Joi.string().required(),
      homePageImage: Joi.string().required(),
      refModuleId: Joi.number().integer().required(),

    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },

  updateContent: {
    payload: Joi.object({
      refHomePageId: Joi.number().integer().required(),
      refHomePageName: Joi.string().required(),
      homePageHeading: Joi.string().required(),
      homePageContent: Joi.string().required(),
      refOffer: Joi.string().required(),
      refOfferName: Joi.string().required(),
      homePageImage: Joi.string().required(),
      refModuleId: Joi.number().integer().required()

    }),
  },
  deletehomeImageContent: {
    payload: Joi.object({
      refHomePageId: Joi.number().integer().required(),
    }),
  },
};
