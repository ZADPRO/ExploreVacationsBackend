import * as Joi from "joi";

// const validateAge18Plus = Joi.string()
//   .less('now')
//   .required()
//   .custom((value, helpers) => {
//     const today = new Date();
//     const birthDate = new Date(value);
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();

//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }

//     if (age < 18) {
//       return helpers.error('any.custom', { message: 'Employee must be at least 18 years old.' });
//     }

//     return value;
//   }, 'Age Validation');


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
      refFName: Joi.string().min(2).max(30).required(),
      refLName: Joi.string().min(1).max(30).required(),
      refDOB:Joi.string().required(),
      refDesignation: Joi.string().max(50).required(),
      refQualification: Joi.string().max(50).required(),
      refProfileImage: Joi.string().optional(),
      refMoblile: Joi.string().min(5).max(18).required(),
      refUserTypeId:  Joi.array().items(Joi.string()).required(),
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
      refLName: Joi.string().min(1).max(50).required(),
      refDOB: Joi.string().required(),
      refDesignation: Joi.string().required(),
      refQualification: Joi.string().max(50).required(),
      refProfileImage: Joi.string().optional().allow(null, ""),
      refMoblile: Joi.string().min(5).max(12).required(),
      refUserTypeId: Joi.array().items(Joi.string()).required()
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  },

  updateEmployeeProfile: {
    payload: Joi.object({
      refFName: Joi.string().min(2).max(50).required(),
      refLName: Joi.string().min(1).max(50).required(),
      refDOB: Joi.string().required(),
      refDesignation: Joi.string().max(12).required(),
      refQualification: Joi.string().max(12).required(),
      refProfileImage: Joi.string().optional().allow(null, ""),
      refMoblile: Joi.string().min(5).max(12).required(),
      refUserEmail: Joi.string().required(),
      refUserPassword: Joi.string().min(5).max(8).required(),
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
  getUserData:{
    payload: Joi.object({
      userId: Joi.number().integer().required()
    }),
    headers: Joi.object({
      authorization: Joi.string().optional(),
    }).unknown(),
  }
};
