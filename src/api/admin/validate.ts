import * as Joi from "joi";

export default {
  userLogin: {
    payload: Joi.object({
      login: Joi.string().required(),
      password: Joi.string().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },

  addEmployee: {
    payload: Joi.object({
      // label("Temporary Email"),
      refFName: Joi.string().required(),
      refLName: Joi.string().required(),
      refDOB: Joi.string().required(),
      refDesignation: Joi.string().required(),
      refQualification: Joi.string().required(),
      refProfileImage: Joi.string().optional(),
      refMoblile: Joi.string().required(),
      refUserTypeId: Joi.number().integer().required(),
      refUserEmail: Joi.string().email().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },

  uploadEmployeeImage: {
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

  updateEmployee: {
    payload: Joi.object({
      refuserId: Joi.number().integer().required(),
      refFName: Joi.string().min(2).max(50).required(),
      refLName: Joi.string().min(2).max(50).required(),
      refDOB: Joi.date().iso().required(),
      refDesignation: Joi.string().required(),
      refQualification: Joi.string().required(),
      refProfileImage: Joi.string().optional().allow(null, ""),
      refMoblile: Joi.string().required(),
      // refUserTypeId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },

  getEmployee: {
    payload: Joi.object({
      refuserId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },

  deleteEmployee: {
    payload: Joi.object({
      refuserId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteCarBookings: {
    payload: Joi.object({
      userCarBookingId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteTourBookings: {
    payload: Joi.object({
      userTourBookingId: Joi.number().integer().required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteCustomizeTourBookings: {
    payload: Joi.object({
      customizeTourBookingId: Joi.number().integer().required()
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },
  deleteCarParkingBookings: {
    payload: Joi.object({
      carParkingBookingId: Joi.number().integer().required()
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },

};
