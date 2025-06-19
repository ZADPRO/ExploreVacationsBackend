import * as Joi from "joi";

export default {
    addCarParking:{   
        payload: Joi.object({
          refParkingTypeId:Joi.number().integer().required(),
          refParkingName: Joi.string().min(2).max(50).required(),
          refAssociatedAirport: Joi.string().min(2).max(50).required(),
          refLocation: Joi.string().min(2).max(50).required(),
          refAvailability: Joi.string().min(2).max(50).required(),
          refOperatingHours: Joi.string().min(2).max(50).required(),
          refBookingType: Joi.string().min(2).max(50).required(),
          pricePerHourORday: Joi.string().required(),
          refPrice: Joi.string().pattern(/^\d+$/).required(), // keep as string
          refWeeklyDiscount: Joi.string().required(), // keep as string
          refExtraCharges: Joi.string().pattern(/^\d+$/).required(), // keep as string
          MinimumBookingDuration: Joi.string().required(), // keep as string
          MaximumBookingDuration: Joi.string().required(), // keep as string
          isCancellationAllowed: Joi.boolean().required(),
          isRescheduleAllowed: Joi.boolean().required(),
          ServiceFeatures: Joi.array().items(Joi.string()).required(),
          instructions: Joi.string().min(2).max(100).required(),
          description: Joi.string().min(2).max(50).required(),
          parkingSlotImage: Joi.string().required(),
          refStatus: Joi.boolean().required(),
          refCarParkingTypeId:Joi.number().integer().required(),
        }),
        
     headers: Joi.object({
          authorization: Joi.string().optional(),
        }).unknown(),
      },

     updateCarParking:{
       payload: Joi.object({
        refCarParkingId:Joi.number().integer().required(),
        refParkingTypeId: Joi.number().integer().required(),
        refParkingName: Joi.string().min(2).max(50).required(),
        refAssociatedAirport: Joi.string().min(2).max(50).required(),
        refLocation: Joi.string().min(2).max(50).required(),
        refAvailability: Joi.string().min(2).max(50).required(),
        refOperatingHours: Joi.string().min(2).max(50).required(),
        refBookingType: Joi.string().required(),
        pricePerHourORday: Joi.string().required(),
        refPrice: Joi.string().pattern(/^\d+$/).required(), // keep as string
        refWeeklyDiscount: Joi.string().required(), // keep as string
        refExtraCharges: Joi.string().pattern(/^\d+$/).required(), // keep as string
        MinimumBookingDuration: Joi.string().required(), // keep as string
        MaximumBookingDuration: Joi.string().required(), // keep as string
        isCancellationAllowed: Joi.boolean().required(),
        isRescheduleAllowed: Joi.boolean().required(),
        ServiceFeatures: Joi.array().items(Joi.string()).required(),
        instructions: Joi.string().min(2).max(100).required(),
        description: Joi.string().min(2).max(500).required(),
        parkingSlotImage: Joi.string().required(),
        refStatus: Joi.boolean().required(),
        refCarParkingTypeId:Joi.number().integer().required(),

      }),
      
   headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
    },

    getCarParking:{
      payload: Joi.object({
        refCarParkingId:Joi.number().integer().required()
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
    },
    deleteCarParking:{
      payload: Joi.object({
        refCarParkingId:Joi.number().integer().required()
      }),
      headers: Joi.object({
        authorization: Joi.string().optional(),
      }).unknown(),
    }
}