const joi = require('joi')

    const schema =  joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        body: joi.string().required()
    })


module.exports.blogValidate = schema