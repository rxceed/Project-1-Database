import {Request, Response, NextFunction} from "express";
import { ValidationError } from "joi";
import { stack } from "sequelize/types/utils";

export class CustomError extends Error{
    statusCode?: number;
    stack?: string | undefined;
    constructor( message: string, statusCode?: number, stack?: string){
        super(message);
        this.statusCode = statusCode;
        this.stack = stack;
    }
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction)=>{
    const errStatus: number = err.statusCode || 500;
    const errMessage: string = err.message || "Something went wrong";
    console.error(err.stack);
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: err.stack
    });
    next();
}