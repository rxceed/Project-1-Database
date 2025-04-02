import joi from "joi";

export const gradeSchema = joi.object({
    grade: joi.string().required(),
    upperLimit: joi.number(),
    lowerLimit: joi.number()
});