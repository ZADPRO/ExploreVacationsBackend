import * as Joi from "joi";

export default {
  addPackage: {
    payload: Joi.object({
      refPackageName: Joi.string().required(),
      refDesignationId: Joi.number().integer().positive().required(),
      refDurationIday: Joi.string().required(),
      refDurationINight: Joi.string().required(),
      refCategoryId: Joi.number().integer().positive().required(),
      refGroupSize: Joi.string().required(),
      refTourCode: Joi.string().required(),
      refTourPrice: Joi.string().required(),
      refSeasonalPrice: Joi.string().required(),
      images: Joi.array().items(Joi.string()).min(1).required(),
      refItinary: Joi.string().required(),
      refItinaryMapPath: Joi.string().optional(),
      refSpecialNotes: Joi.string().optional(),
      refTravalOverView: Joi.string().required(),
      refCoverImage: Joi.string().required(),
      refLocation: Joi.array().items(Joi.string()).required(),
      refActivity: Joi.array().items(Joi.string()).required(),
      refTravalInclude: Joi.array().items(Joi.string()).required(),
      refTravalExclude: Joi.array().items(Joi.string()).required(),
    }),
  },
  UpdatePackage: {
    payload: Joi.object({
      refPackageId: Joi.number().integer().required(),
      refPackageName: Joi.string().required(),
      refDesignationId: Joi.number().integer().required(),
      refDurationIday: Joi.string().required(),
      refDurationINight: Joi.string().required(),
      refCategoryId: Joi.number().integer().required(),
      refGroupSize: Joi.string().required(),
      refTourCode: Joi.string().required(),
      refTourPrice: Joi.string().required(),
      refSeasonalPrice: Joi.string().required(),
      images: Joi.array().items(Joi.string()).optional(),
      refItinary: Joi.string().required(),
      refItinaryMapPath: Joi.string().required(),
      refSpecialNotes: Joi.string().required(),
      refTravalOverView: Joi.string().required(),
      refCoverImage: Joi.string().required(),
      refLocation: Joi.array().items(Joi.string()).required(),
      refActivity: Joi.array().items(Joi.string()).required(),
      refTravalInclude: Joi.array().items(Joi.string()).required(),
      refTravalExclude: Joi.array().items(Joi.string()).required(),
    }),
  },
  deletePackage: {
    payload: Joi.object({
      refPackageId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addTravalInclude: {
    payload: Joi.object({
      refTravalInclude: Joi.array()
        .items(
          Joi.object({
            refTravalInclude: Joi.string().required()
          })
        )
        .required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateTravalInclude:{
     payload: Joi.object({
        refTravalIncludeId: Joi.number().integer().required(),
        refTravalInclude: Joi.string().required(),
        }),
        headers: Joi.object({
          authorization: Joi.string().optional(),
        }).unknown(),
  },
  deleteTravalInclude:{
    payload: Joi.object({
        refTravalIncludeId: Joi.number().integer().required(),
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
  },
  addTravalExclude:{
    payload: Joi.object({
        refTravalExclude: Joi.array()
          .items(
            Joi.object({
                refTravalExclude: Joi.string().required()
            })
          )
          .required(),
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
  },
  updateTravalExclude:{
    payload: Joi.object({
        refTravalExcludeId: Joi.number().integer().required(),
        refTravalExclude: Joi.string().required(),
        }),
        headers: Joi.object({
          authorization: Joi.string().optional(),
        }).unknown(),
  },
  deleteTravalExclude:{
    payload: Joi.object({
        refTravalExcludeId: Joi.number().integer().required(),
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
  },
  getTour:{
    payload: Joi.object({
        refPackageId: Joi.number().integer().required()
    }),
    headers: Joi.object({
        authorization: Joi.string().optional()
    }).unknown(),
  },
  uploadCoverImage:{

  }
};
