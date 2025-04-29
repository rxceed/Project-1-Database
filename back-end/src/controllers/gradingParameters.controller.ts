import { Request, Response, NextFunction } from "express";
import { getAllGradingParamsService, getAllGradingParamsByChapterIDService, getGradingParamByIDService, getGradingParameterByID_and_ChapterIDService,
    insertGradingParamService, alterGradingParamService, deleteAllGradingParamsByChapterIDService, deleteGradingParamByIDService,
    checkIfGradingParamExists,
    checkIfChapterExist,
    getChapterByIDService,
    totalChapterScoreService,
    alterChapterService
 } from "../services";
import { gradingParamsSchema } from "../utils/validators";
import { chapterInterface, gradingParamsInterface } from "../models";
import { CustomError } from "../middlewares";

export const getAllGradingParams = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const result = await getAllGradingParamsService();
        if(!result) throw new CustomError("internal database error");
        res.status(200).json(result.rows);
    }
    catch(error)
    {
        next(error);
    }
}

export const getGradingParamsByID_andOr_ChapterID = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const paramID = parseInt(req.query.parameter_id as string);
        const chapterID = parseInt(req.query.chapter_id as string);
        if(paramID && chapterID)
        {
            if(!(await checkIfGradingParamExists(paramID))) throw new CustomError("grading parameter does not exist", 404);
            if(!(await checkIfChapterExist(chapterID))) throw new CustomError("chapter does not exist", 404);
            const result = await getGradingParameterByID_and_ChapterIDService(paramID, chapterID)
            if(!result) throw new CustomError("internal database error");
            res.status(200).json(result.rows);
        }
        else if(!paramID && chapterID)
        {
            if(!(await checkIfChapterExist(chapterID))) throw new CustomError("chapter does not exist", 404);
            const result = await getAllGradingParamsByChapterIDService(chapterID);
            if(!result) throw new CustomError("internal database error");
            res.status(200).json(result.rows);
        }
        else if(paramID && !chapterID)
        {
            if(!(await checkIfGradingParamExists(paramID))) throw new CustomError("grading parameter does not exist", 404);
            const result = await getGradingParamByIDService(paramID);
            if(!result) throw new CustomError("internal database error");
            res.status(200).json(result.rows);
        }
        else
        {
            res.status(302).redirect("grading_parameters/all");
        }
    }
    catch(error)
    {
        next(error);
    }
}

export const insertGradingParam = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const data: gradingParamsInterface = req.body;
        const {error, value} = gradingParamsSchema.validate(data);
        if(error) throw new CustomError(error.message, 400, error.stack);
        if(!(await checkIfChapterExist(data.chapterID))) throw new CustomError("parent chapter does not exist", 400);
        const result = await insertGradingParamService(data);
        if(!result) throw new CustomError("internal database error");
        res.status(201).json({Command: result.command, Rows: result.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const alterGradingParam = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const paramID = parseInt(req.query.parameter_id as string);
        const data: gradingParamsInterface = req.body;
        const alterGradingParamsSchema = gradingParamsSchema.fork(["chapterID", "name"], (schema)=>schema.optional());
        const {error, value} = alterGradingParamsSchema.validate(data);
        if(error) throw new CustomError(error.message, 400, error.stack);
        const result = await alterGradingParamService(paramID, data);
        if(!result) throw new CustomError("internal database error");
        res.status(201).json({Command: result.command, Rows: result.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const deleteAllGradingParamsByChapterID = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const chapterID = parseInt(req.query.chapter_id as string);
        if(!(await checkIfChapterExist(chapterID))) throw new CustomError("chapter does not exist");
        const result = await deleteAllGradingParamsByChapterIDService(chapterID);
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({Command: result.command, Rows: result.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const deleteGradingparamByID = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const paramID = parseInt(req.query.parameter_id as string);
        if(!(await checkIfGradingParamExists(paramID))) throw new CustomError("grading parameter does not exist");
        const result = await deleteGradingParamByIDService(paramID);
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({Command: result.command, Rows: result.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}