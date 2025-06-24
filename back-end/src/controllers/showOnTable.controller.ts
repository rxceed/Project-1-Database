import { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares";
import { showOnTableService } from "../services";

export const showOnTable = async(req: Request, res: Response, next: NextFunction)=>{
    try
    {
        const result = await showOnTableService();
        if(!result) throw new CustomError("internal database error");
        res.status(200).json(result);
    }
    catch(err)
    {
        next(err);
    }
}