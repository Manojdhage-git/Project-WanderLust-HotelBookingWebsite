const joi=require('joi');

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),        
    description: Joi.string().required(), 
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),  
    image: Joi.string().allow("", null)
  }).required()
});


module.exports.reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().required()
  }).required()
});