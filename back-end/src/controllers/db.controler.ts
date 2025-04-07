import { dbSetup, dbDrop } from "../db";
import {Request, Response, NextFunction} from "express";
import { CustomError } from "../middlewares";

export const databaseSetup = async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const result = await dbSetup();
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({message: "database setup successful"});
    }
    catch(error)
    {
        next(error);
    }
}

export const databaseDrop =  async (req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const result = await dbDrop();
        if(!result) throw new CustomError("internal database error");
        res.status(200).json({message: "database drop successful"});
    }
    catch(error)
    {
        next(error);
    }
}