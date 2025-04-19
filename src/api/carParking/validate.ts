import * as Joi from "joi";

export default {
    addCarParking:{
         
        payload: Joi.object({
          refParkingTypeId:Joi.number().integer().required(),
          refParkingName: Joi.string().required(),
          refAssociatedAirport: Joi.string().required(),
          refLocation: Joi.string().required(),
          refAvailability: Joi.string().required(),
          refOperatingHours: Joi.string().required(),
          refBookingType: Joi.string().required(),
          pricePerHourORday: Joi.string().required(),
          refPrice: Joi.string().required(), // keep as string
          refWeeklyDiscount: Joi.string().required(), // keep as string
          refExtraCharges: Joi.string().required(), // keep as string
          MinimumBookingDuration: Joi.string().required(), // keep as string
          MaximumBookingDuration: Joi.string().required(), // keep as string
          isCancellationAllowed: Joi.boolean().required(),
          isRescheduleAllowed: Joi.boolean().required(),
          ServiceFeatures: Joi.array().items(Joi.string()).required(),
          instructions: Joi.string().required(),
          description: Joi.string().required(),
          parkingSlotImage: Joi.string().required(),
          refStatus: Joi.boolean().required()
        }),
        
     headers: Joi.object({
          authorization: Joi.string().optional(),
        }).unknown(),
      },

     updateCarParking:{
       payload: Joi.object({
        refCarParkingId:Joi.number().integer().required(),
        refParkingType: Joi.string().required(),
        refParkingName: Joi.string().required(),
        refAssociatedAirport: Joi.string().required(),
        refLocation: Joi.string().required(),
        refAvailability: Joi.string().required(),
        refOperatingHours: Joi.string().required(),
        refBookingType: Joi.string().required(),
        pricePerHourORday: Joi.string().required(),
        refPrice: Joi.string().required(), // keep as string
        refWeeklyDiscount: Joi.string().required(), // keep as string
        refExtraCharges: Joi.string().required(), // keep as string
        MinimumBookingDuration: Joi.string().required(), // keep as string
        MaximumBookingDuration: Joi.string().required(), // keep as string
        isCancellationAllowed: Joi.boolean().required(),
        isRescheduleAllowed: Joi.boolean().required(),
        ServiceFeatures: Joi.array().items(Joi.string()).required(),
        
        instructions: Joi.string().required(),
        description: Joi.string().required(),
        parkingSlotImage: Joi.string().required(),
        refStatus: Joi.boolean().required()
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