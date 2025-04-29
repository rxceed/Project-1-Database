import joi from "joi";

export const gradingParamsSchema = joi.object({
    chapterID: joi.number().required(),
    name: joi.string().required(),
    gradingMistakes: joi.number()
})