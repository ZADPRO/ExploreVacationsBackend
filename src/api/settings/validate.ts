import * as Joi from "joi";

export default {
  addDestination: {
    payload: Joi.object({
      refDestination: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  UpdateDestination: {
    payload: Joi.object({
      refDestinationId: Joi.number().integer().required(),
      refDestinationName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  DeleteDestination: {
    payload: Joi.object({
      refDestinationId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addLocation: {
    payload: Joi.object({
      refDestinationId: Joi.number().integer().required(),
      locations: Joi.array()
        .items(Joi.object({ refLocation: Joi.string().required() }))
        .required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  
  updateLocation:{
    payload: Joi.object({
        refLocationId: Joi.number().integer().required(),
        refLocationName: Joi.string().required(),
        refDestinationId: Joi.number().integer().required(),
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
  },
  deleteLocation:{
    payload:Joi.object({
        refLocationId: Joi.number().integer().required()
    }),
    headers: Joi.object({
        authorization: Joi.string().optional(),
    }).unknown(),
  },
  addCategories:{
    payload: Joi.object({
        refCategory: Joi.string().required(),
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
  },
  updateCategories:{
    payload: Joi.object({
        refCategoryId: Joi.number().integer().required(),
        refCategoryName: Joi.string().required(),
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
  },
  deleteCategories:{
    payload:Joi.object({
        refCategoryId: Joi.number().integer().required()
    }),
    headers: Joi.object({
        authorization: Joi.string().optional(),
    }).unknown(),
  },
  addActivities:{
    payload: Joi.object({
        refActivity: Joi.string().required(),
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
  },
  updateActivities:{
    payload: Joi.object({
        refActivitiesId: Joi.number().integer().required(),
        refActivitiesName: Joi.string().required(),
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
  },
  deleteActivities:{
    payload:Joi.object({
        refActivitiesId: Joi.number().integer().required()
    }),
    headers: Joi.object({
        authorization: Joi.string().optional(),
    }).unknown(),
  }
 


  
};
