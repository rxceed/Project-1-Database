import joi from "joi";

export const projectSchema = joi.object({
    name: joi.string().required(),
    gradingDate: joi.date(),
    grade: joi.string(),
    status: joi.string()
})