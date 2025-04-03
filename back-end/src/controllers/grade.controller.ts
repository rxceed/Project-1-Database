import { Request, Response, NextFunction } from "express";
import { checkIfGradeExists, insertNewGradeService, alterGradeService, deleteGradeService, getAllGradesService, deleteAllGradesService } from "../services";
import { gradeSchema } from "../utils/validators";
import { gradeInterface } from "../models";
import { CustomError } from "../middlewares";

export const getAllGrades = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const result = await getAllGradesService();
        if(!result) throw new CustomError("internal database error");
        res.status(200).json(result?.rows);
    }
    catch(error)
    {
        next(error);
    }
}

export const insertNewGrade = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const data: gradeInterface = req.body;
        const {error, value} = gradeSchema.validate(data);
        if(error) throw new CustomError(error.message, 400, error.stack);
        if(await checkIfGradeExists(data.grade)) throw new CustomError("grade already exists", 400);
        const result = await insertNewGradeService(data);
        if(!result) throw new CustomError("internal database error");
        res.status(201).json({Command: result?.command, Rows: result?.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const alterGrade = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const data: gradeInterface = req.body;
        const grade: string = req.query.grade as string;
        const alterGradeSchema = gradeSchema.fork("grade", (schema) => schema.optional());
        const {error, value} = alterGradeSchema.validate(data);
        if(error) throw new CustomError(error.message, 400, error.stack);
        if(!(await checkIfGradeExists(grade))) throw new CustomError("grade does not exist", 404);
        const result = await alterGradeService(grade, data);
        if(!result) throw new CustomError("internal database error");
        res.status(201).json({Command: result?.command, Rows: result?.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const deleteGrade = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const grade = req.query.grade;
        if(!(await checkIfGradeExists(grade as string))) throw new CustomError("grade does not exist", 404);
        const result = await deleteGradeService(grade as string);
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({Command: result?.command, Rows: result?.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}

export const deleteAllGrades = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const result = await deleteAllGradesService();
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({Command: result?.command, Rows: result?.rowCount});
    }
    catch(error)
    {
        next(error);
    }
}