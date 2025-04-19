import { getChapterByIDService, getChapterByID_and_ProjectIDService, getAllChaptersByProjectIDService, getAllChaptersService,
    insertNewChapterService, alterChapterService, deleteAllChaptersByProjectIDService, deleteChapterByIDService,
    checkIfChapterExist
 } from "../services/";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares";
import { chapterSchema } from "../utils/validators";
import { checkIfProjectIDExist } from "../services";
import { chapterInterface } from "../models";

export const getAllChapters = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const result = await getAllChaptersService();
        if(!result) throw new CustomError("internal database error");
        res.status(200).json(result.rows);
    }
    catch(error)
    {
        next(error);
    }
}

export const getChapterByID_andOr_ProjectID = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const chapterID = parseInt(req.query.chapter_id as string);
        const projectID = parseInt(req.query.project_id as string);
        if(chapterID && !projectID)
        {
            if(!(await checkIfChapterExist(chapterID))) throw new CustomError("chapter does not exist", 404);
            const result = await getChapterByIDService(chapterID);
            if(!result) throw new CustomError("internal database error");
            res.status(200).json(result.rows);
        }
        else if(!chapterID && projectID)
        {
            const projectID = parseInt(req.query.project_id as string);
            if(!(await checkIfProjectIDExist(projectID))) throw new CustomError("project does not exist", 404);
            const result = await getAllChaptersByProjectIDService(projectID);
            if(!result) throw new CustomError("internal database error");
            res.status(200).json(result.rows);
        }
        else if(chapterID && projectID)
        {
            if(!(await checkIfChapterExist(chapterID))) throw new CustomError("chapter does not exist", 404);
            if(!(await checkIfProjectIDExist(projectID))) throw new CustomError("chapter does not exist", 404);
            const result = await getChapterByID_and_ProjectIDService(chapterID, projectID);
            if(!result) throw new CustomError("internal database error");
            res.status(200).json(result.rows);
        }
        else
        {
            res.status(302).redirect("chapters/all");             
        }
        
    }
    catch(error)
    {
        next(error);
    }
}

export const insertNewChapter = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
       const data: chapterInterface = req.body;
       const {error, value} = chapterSchema.validate(data);
       if(error) throw new CustomError(error.message, 400, error.stack);
       const result = await insertNewChapterService(data);
       if(!result) throw new CustomError("internal database error");
       res.status(201).json({command: result.command, rows: result.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const alterChapter = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const chapterID = parseInt(req.query.chapter_id as string);
        const data: chapterInterface = req.body;
        const alterChapterSchema = chapterSchema.fork(["projectsID", "name", "weight"], (schema)=>schema.optional());
        const {error, value} = alterChapterSchema.validate(data);
        if(error) throw new CustomError(error.message, 400, error.stack);
        if(!(await checkIfChapterExist(chapterID))) throw new CustomError("chappter does not exist", 404);
        const result = await alterChapterService(chapterID, data);
        if(!result) throw new CustomError("internal database error");
        res.status(201).json({command: result.command, rows: result.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const deleteAllChaptersByProjectID = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const projectID = parseInt(req.query.project_id as string);
        if(!(await checkIfProjectIDExist(projectID))) throw new CustomError("project does not exist", 404);
        const result = await deleteAllChaptersByProjectIDService(projectID);
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({command: result.command, rows: result.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const deleteChapterByID = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const chapterID = parseInt(req.query.chapter_id as string);
        if(!(await checkIfChapterExist(chapterID))) throw new CustomError("chapter does not exist", 404);
        const result = await deleteChapterByIDService(chapterID);
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({command: result.command, rows: result.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}