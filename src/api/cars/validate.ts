import * as Joi from "joi";

export default {
  addVehicle: {
    payload: Joi.object({
      refVehicleTypeName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateVehicle: {
    payload: Joi.object({
      refVehicleTypeId: Joi.number().integer().required(),
      refVehicleTypeName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteVehicle: {
    payload: Joi.object({
      refVehicleTypeId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addBenifits: {
    payload: Joi.object({
      refBenifitsName: Joi.array()
        .items(
          Joi.object({
            refBenifitsName: Joi.string().required(),
          })
        )
        .required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateBenifits: {
    payload: Joi.object({
      refBenifitsId: Joi.number().integer().required(),
      refBenifitsName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteBenifits: {
    payload: Joi.object({
      refBenifitsId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addInclude: {
    payload: Joi.object({
      refIncludeName: Joi.array()
        .items(
          Joi.object({
            refIncludeName: Joi.string().required(),
          })
        )
        .required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateInclude: {
    payload: Joi.object({
      refIncludeId: Joi.number().integer().required(),
      refIncludeName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteInclude: {
    payload: Joi.object({
      refIncludeId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addExclude: {
    payload: Joi.object({
      refExcludeName: Joi.array()
        .items(
          Joi.object({
            refExcludeName: Joi.string().required(),
          })
        )
        .required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  UpdateExclude: {
    payload: Joi.object({
      refExcludeId: Joi.number().integer().required(),
      refExcludeName: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteExclude: {
    payload: Joi.object({
      refExcludeId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addDriverDetails: {
    payload: Joi.object({
      refDriverName: Joi.string().required(),
      refDriverAge: Joi.number().integer().required(),
      refDriverMail: Joi.string().email().required(),
      refDriverMobile: Joi.string()
        .pattern(/^\d{10}$/)
        .required(),
      refDriverLocation: Joi.string().required(),
      isVerified: Joi.boolean().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateDriverDetails: {
    payload: Joi.object({
      refDriverDetailsId: Joi.number().integer().required(),
      refDriverName: Joi.string().required(),
      refDriverAge: Joi.number().integer().required(),
      refDriverMail: Joi.string().email().required(),
      refDriverMobile: Joi.string()
        .pattern(/^\d{10}$/)
        .required(),
      refDriverLocation: Joi.string().required(),
      isVerified: Joi.boolean().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteDriverDetails: {
    payload: Joi.object({
      refDriverDetailsId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  addFormDetails: {
    payload: Joi.object({
      refFormDetails: Joi.string().required(),
      refPrice: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  updateFormDetails: {
    payload: Joi.object({
      refFormDetailsId: Joi.number().integer().required(),
      refFormDetails: Joi.string().required(),
      refPrice: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteFormDetails: {
    payload: Joi.object({
      refFormDetailsId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  // addCars: {
  //   payload: Joi.object({
  //     refVehicleTypeId: Joi.number().integer().required(),
  //     refPersonCount: Joi.string().required(),
  //     refBag: Joi.string().required(),
  //     refFuelType: Joi.string().required(),
  //     refcarManufactureYear: Joi.string().required(),
  //     refMileage: Joi.string().required(),
  //     refTrasmissionType: Joi.string().required(),
  //     refFuleLimit: Joi.string().required(),
  //     refDriverDetailsId: Joi.number().integer().required(),
  //     refOtherRequirements: Joi.string().required(),
  //     refrefRentalAgreement: Joi.string().required(),
  //     refFuelPolicy: Joi.string().required(),
  //     refDriverRequirements: Joi.string().required(),
  //     refPaymentTerms: Joi.string().required(),
  //     refCarPrice: Joi.string().required(),
  //     refBenifits: Joi.array().items(Joi.string()).required(),
  //     refInclude: Joi.array().items(Joi.string()).required(),
  //     refExclude: Joi.array().items(Joi.string()).required(),
  //     refFormDetails: Joi.array().items(Joi.string()).required(),
  //   }),
  //   headers: Joi.object({
  //     authorization: Joi.string().optional(),
  //   }).unknown(),
  // },

  addCars: {
    payload: Joi.object({
      refVehicleTypeId: Joi.number().required(),
      refPersonCount: Joi.string().required(), // string digits
      refBag: Joi.string().required(), // string digits
      refCarGroupId: Joi.number().required(),
      refFuelType: Joi.string().required(),
      refcarManufactureYear: Joi.string().required(),
      refMileage: Joi.string().required(), // e.g. "18 km/l"
      refTrasmissionType: Joi.string().required(),
      refFuleLimit: Joi.string().required(),
      refOtherRequirements: Joi.string().required(),
      refrefRentalAgreement: Joi.string().required(),
      refFuelPolicy: Joi.string().required(),
      refPaymentTerms: Joi.string().required(),
      carImagePath: Joi.string().required(),
      refCarPrice: Joi.string().required(), // string number
      refCarTypeId: Joi.number().required(),
      refExtraKMcharges: Joi.string().required(),
      refBenifits: Joi.array().items(Joi.string()).required(),
      refInclude: Joi.array().items(Joi.string()).required(),
      refExclude: Joi.array().items(Joi.string()).required(),
      refFormDetails: Joi.array().items(Joi.string()).required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },

  updateCars: {
    payload: Joi.object({
      refCarsId: Joi.number().integer().required(),
      refVehicleTypeId: Joi.number().integer().required(),
      refCarTypeId: Joi.number().integer().required(),
      refPersonCount: Joi.string().required(),
      refBag: Joi.string().required(),
      refCarGroupId: Joi.number().required(),
      refFuelType: Joi.string().required(),
      refcarManufactureYear: Joi.string().required(),
      refMileage: Joi.string().required(),
      refTrasmissionType: Joi.string().required(),
      refFuleLimit: Joi.string().required(),
      refOtherRequirements: Joi.string().required(),
      refrefRentalAgreement: Joi.string().required(),
      refFuelPolicy: Joi.string().required(),
      refPaymentTerms: Joi.string().required(),
      refCarPrice: Joi.string().required(),
      refExtraKMcharges: Joi.string().required(),
      refBenifits: Joi.array().items(Joi.string()).required(),
      refInclude: Joi.array().items(Joi.string()).required(),
      refExclude: Joi.array().items(Joi.string()).required(),
      refFormDetails: Joi.array().items(Joi.string()).required(),
      carImagePath: Joi.string().required(),
    }),
  },
  getCars: {
    payload: Joi.object({
      refCarsId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteCars: {
    payload: Joi.object({
      refCarsId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  uploadCars: {
    payload: Joi.object({
      Image: Joi.object().required().messages({
        "any.required": "PDF file is required",
        "object.base": "PDF file must be a valid file object",
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
    }),
  },
};
