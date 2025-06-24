import { Request, Response, NextFunction } from "express";
import { getAllProjectsService, getProjectByIDService, syncProjectService, insertNewProjectService, alterProjectService, deleteProjectByIDService, deleteAllProjectsService, checkIfProjectIDExist } from "../services";
import { projectInterface } from "../models";
import { projectSchema } from "../utils/validators";
import { CustomError } from "../middlewares";

export const getAllProjects = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const result = await getAllProjectsService();
        if(!result) throw new CustomError("internal database error");
        res.status(200).json(result.rows);
    }
    catch(error)
    {
        next(error);
    }
}

export const getProjectByID = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const id = parseInt(req.query.project_id as string);
        if(!id) return res.status(302).redirect("projects/all");
        const result = await getProjectByIDService(id);
        if(!result) throw new CustomError("internal database error");
        if(!(await checkIfProjectIDExist(id))) res.status(200).json({message: "no project found"});
        else res.status(200).json(result.rows);
    }
    catch(error)
    {
        next(error);
    }
}

export const insertNewProject = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const data: projectInterface = req.body;
        const {error, value} = projectSchema.validate(data);
        if(error) throw new CustomError(error.message, 400, error.stack);
        const result = await insertNewProjectService(data);
        if(!result) throw new CustomError("internal database error");
        res.status(201).json({Command: result?.command, Rows: result?.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const alterProject = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const id = parseInt(req.query.project_id as string);
        const data: projectInterface = req.body;
        const alterProjectSchema = projectSchema.fork("name", (schema)=>schema.optional());
        const {error, value} = alterProjectSchema.validate(data);
        if(error) throw new CustomError(error.message, 400, error.stack);
        if(!(await checkIfProjectIDExist(id))) throw new CustomError("projects does not exist", 404);
        const result = await alterProjectService(id, data);
        if(!result) throw new CustomError("internal database error");
        res.status(201).json({Command: result?.command, Rows: result?.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const syncProject = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const result = await syncProjectService();
        if(!result) throw new CustomError("internal database error");
        res.status(201);
    }
    catch(error)
    {
        next(error);
    }
}

export const deleteProjectByID = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const id = parseInt(req.query.project_id as string);
        if(!(await checkIfProjectIDExist(id))) throw new CustomError("project does not exist", 404);
        const result = await deleteProjectByIDService(id);
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({Command: result?.command, Rows: result?.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const deleteAllProjects = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const result =await deleteAllProjectsService();
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({Command: result?.command, Rows: result?.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}