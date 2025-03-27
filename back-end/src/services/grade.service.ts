import { query } from "../db";
import format from "pg-format";

export const checkIfGradeExists = async (grade: string)=>{
    const sql: string = format("SELECT grade FROM grades WHERE grade = %L", grade);
    const result = await query(sql);
    if(result?.rowCount)
    {
        return true;
    }
    else
    {
        return false;
    }
}

export const insertNewGradeService = async (grade: string, upperLimit: number|null = null, lowerLimit: number|null = null)=>{
    try
    {
        let sql: string;
        if(upperLimit === null)
        {
            sql = format("INSERT INTO grades(grade, lower_limit) VALUES (%L, %L)", grade, lowerLimit);
        }
        else if(lowerLimit === null) 
        {
            sql = format("INSERT INTO grades(grade, upper_limit) VALUES (%L, %L)", grade, upperLimit);
        }
        else
        {
            sql = format("INSERT INTO grades(grade, upper_limit, lower_limit) VALUES (%L, %L, %L)", grade, upperLimit, lowerLimit);
        }
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const alterGradeService = async (grade: string, newUpperLimit: number|null = null, newLowerLimit: number|null = null)=>{
    try
    {
        let sql: string;
        if(newUpperLimit === null)
        {
            sql = format("UPDATE grades SET lower_limit = %L WHERE grade = %L", newLowerLimit, grade);
        }
        else if(newLowerLimit === null)
        {
            sql = format("UPDATE grades SET upper_limit = %L WHERE grade = %L", newUpperLimit, grade);
        }
        else
        {
            sql = format("UPDATE grades SET upper_limit = %L, lower_limit = %L WHERE grade = %L", newUpperLimit, newLowerLimit, grade);
        }
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const deleteGradeService = async (grade: string)=>{
    try
    {
        const sql: string = format("DELETE FROM grades WHERE grade = %L", grade);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}