import joi from "joi";

export const subAspectSchema = joi.object({
    paramID: joi.number().required(),
    name: joi.string().required(),
    mistakes: joi.number()
})