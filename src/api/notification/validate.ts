import * as Joi from "joi";

export default {
  addNotifications: {
    payload: Joi.object({
      refUserTypeId: Joi.array().items(Joi.string()).required(),
      refSubject: Joi.string().required(),
      refDescription: Joi.string().required(),
      refNotes: Joi.string().required(),
    }),

    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },

  updateNotifications:{
    payload: Joi.object({
      refNotificationsId:Joi.number().integer().required(),
      refUserTypeId: Joi.array().items(Joi.string()).required(),
      refSubject: Joi.string().required(),
      refDescription: Joi.string().required(),
      refNotes: Joi.string().required(),
    }),

    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  getNotifications:{
    payload: Joi.object({
      refNotificationsId:Joi.number().integer().required()
    }),
    
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  }




};
