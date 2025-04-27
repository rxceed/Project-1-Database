import { Request, Response, NextFunction } from "express";
import { getAllSubAspectsService, getAllSubAspectsByParamIDService, getSubAspectsByIDService, getSubAspectByID_and_ParamIDService,
    insertNewSubAspectService, alterSubAspectService, deleteAllSubAspectsByParamIDService, deleteSubAspectByIDService, checkIfSubAspectExists
 } from "../services";
import { CustomError } from "../middlewares";
import { subAspectInterface } from "../models";
import { subAspectSchema } from "../utils/validators";
import { checkIfGradingParamExists } from "../services";

export const getAllSubAspects = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const result = await getAllSubAspectsService();
        if(!result) throw new CustomError("internal database error");
        res.status(200).json(result.rows);
    }
    catch(error)
    {
        next(error);
    }
}

export const getSubAspectByID_andOr_ParamID = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const subAspectID = parseInt(req.query.sub_aspect_id as string);
        const paramID = parseInt(req.query.parameter_id as string);
        if(subAspectID && !paramID)
        {
            if(!(await checkIfSubAspectExists(subAspectID))) throw new CustomError("sub aspect does not exist", 404);
            const result = await getSubAspectsByIDService(subAspectID);
            if(!result) throw new CustomError("internal database error");
            res.status(200).json(result.rows)
        }
        else if(!subAspectID && paramID)
        {
            if(!(await checkIfGradingParamExists(paramID))) throw new CustomError("grading parameter does not exist", 404);
            const result = await getAllSubAspectsByParamIDService(paramID);
            if(!result) throw new CustomError("internal database error");
            res.status(200).json(result.rows)
        }
        else if(subAspectID && paramID)
        {
            if(!(await checkIfSubAspectExists(subAspectID))) throw new CustomError("sub aspect does not exist", 404);
            if(!(await checkIfGradingParamExists(paramID))) throw new CustomError("grading parameter does not exist", 404);
            const result = await getSubAspectByID_and_ParamIDService(subAspectID, paramID);
            if(!result) throw new CustomError("internal database error");
            res.status(200).json(result.rows)
        }
        else
        {
            res.status(302).redirect("sub_aspects/all");
        }
    }
    catch(error)
    {
        next(error);
    }
}

export const insertNewSubAspect = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const data: subAspectInterface = req.body;
        const {error, value} = subAspectSchema.validate(data);
        if(error) throw new CustomError(error.message, 400, error.stack);
        if(!(await checkIfGradingParamExists(data.paramID))) throw new CustomError("parent grading parameter does not exist", 400);
        const result = await insertNewSubAspectService(data);
        if(!result) throw new CustomError("internal database error");
        res.status(201).json({command: result?.command, rows: result?.rowCount})
    }
    catch(error)
    {
        next(error);
    }
}

export const alterSubAspect = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const subAspectID = parseInt(req.query.sub_aspect_id as string);
        const data: subAspectInterface = req.body;
        const alterSubAspectSchema = subAspectSchema.fork(["paramID", "name"], (schema)=>schema.optional());
        const {error, value} = alterSubAspectSchema.validate(data);
        if(error) throw new CustomError(error.message, 400, error.stack);
        if(!(await checkIfSubAspectExists(subAspectID))) throw new CustomError("sub aspect does not exist", 404);
        const result = await alterSubAspectService(subAspectID, data);
        if(!result) throw new CustomError("internal database error");
        res.status(201).json({command: result?.command, rows: result?.rowCount})
    }
    catch(error)
    {
        next(error);
    }
}

export const deleteAllSubAspectsByParamID = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const paramID = parseInt(req.query.parameter_id as string);
        if(!(await checkIfGradingParamExists(paramID))) throw new CustomError("grading parameter does not exist", 404);
        const result = await deleteAllSubAspectsByParamIDService(paramID);
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({command: result?.command, rows: result?.rowCount})
    }
    catch(error)
    {
        next(error);
    }
}

export const deleteSubAspectsByID = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const subAspectID = parseInt(req.query.sub_aspect_id as string);
        if(!(await checkIfGradingParamExists(subAspectID))) throw new CustomError("sub aspect does not exist", 404);
        const result = await deleteSubAspectByIDService(subAspectID);
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({command: result?.command, rows: result?.rowCount})
    }
    catch(error)
    {
        next(error);
    }
}
