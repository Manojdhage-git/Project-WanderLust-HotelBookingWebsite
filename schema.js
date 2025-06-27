const joi=require('joi');

module.exports.listingSchema=joi.object({
    listing:joi.object({
        titile:joi.string().required,
        description: joi.string().required,
        location:joi.string().required,
        country:joi.string().required,
        price: joi.string().required().min(0),
        image:joi.string().allow("",null)
    }).required()
})