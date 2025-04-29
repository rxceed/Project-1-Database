import joi from "joi"

export const chapterSchema = joi.object({
    projectID: joi.number().required(),
    name: joi.string().required(),
    weight: joi.number().required(),
    chapterScore: joi.number()
})