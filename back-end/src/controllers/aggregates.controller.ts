import { CustomError } from "../middlewares";
import { checkIfChapterExist, checkIfGradingParamExists, totalMistakesAllParamsAsResultService, totalMistakesAllParamsAsListService,
     totalMistakesByParamService, totalChapterScoreService, 
     checkIfProjectIDExist,
     finalScoreService} from "../services";
import { Request, Response, NextFunction } from "express";

export const controler = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {

    }
    catch(error)
    {
        next(error);
    }
}

export const totalMistakesByParam = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const paramID = parseInt(req.query.parameter_id as string);
        if(!(await checkIfGradingParamExists(paramID))) throw new CustomError("grading parameter does not exist", 404);
        const result = await totalMistakesByParamService(paramID);
        if(!result) throw new CustomError("internal database error");
        res.status(200).json(result.rows);
    }
    catch(error)
    {
        next(error);
    }
}

export const totalMistakesAllParams = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const chapterID = parseInt(req.query.chapter_id as string);
        const asList = parseInt(req.query.list as string);
        if(!(await checkIfChapterExist(chapterID))) throw new CustomError("chapter does not exist", 404);
        if(!asList)
        {
            const result = await totalMistakesAllParamsAsResultService(chapterID);
            if(!result) throw new CustomError("internal database error");
            res.status(200).json(result.rows)
        }
        else
        {
            const result = await totalMistakesAllParamsAsListService(chapterID);
            if(!result) throw new CustomError("internal database error");
            res.status(200).json(result.rows);
        } 
    }
    catch(error)
    {
        next(error);
    }
}

export const totalChapterScore = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const chapterID = parseInt(req.query.chapter_id as string);
        if(!(await checkIfChapterExist(chapterID))) throw new CustomError("chapter does not exist", 404);
        const result = await totalChapterScoreService(chapterID);
        if(!result) throw new CustomError("internal database error");
        res.status(200).json(result.rows);
    }
    catch(error)
    {
        next(error);
    }
}

export const finalScore = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const projectID = parseInt(req.query.project_id as string);
        if(!(await checkIfProjectIDExist(projectID))) throw new CustomError("project does not exist", 404);
        const result = await finalScoreService(projectID);
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({final_score: result});
    }
    catch(error)
    {
        next(error);
    }
}