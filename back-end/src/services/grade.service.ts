import { query } from "../db";
import format from "pg-format";
import { alterGradeInterface, gradeInterface } from "../models";

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

export const getAllGradesService = async () =>{
    try
    {
        const sql: string = format("SELECT * FROM grades");
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const insertNewGradeService = async (gradeData: gradeInterface)=>{
    try
    {
        const sql: string = format("INSERT INTO grades(grade, upper_limit, lower_limit) VALUES (%L, %L, %L)", gradeData.grade, gradeData.upperLimit, gradeData.lowerLimit);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const alterGradeService = async (grade: string, gradeData: gradeInterface)=>{
    try
    {
        let sql: string;
        if(gradeData.grade === null)
        {
            if(gradeData.upperLimit === null)
            {
                sql = format("UPDATE grades SET lower_limit = %L WHERE grade = %L", gradeData.lowerLimit, grade);
            }
            else if(gradeData.lowerLimit === null)
            {
                sql = format("UPDATE grades SET upper_limit = %L WHERE grade = %L", gradeData.upperLimit, grade);
            }
            else
            {
                sql = format("UPDATE grades SET upper_limit = %L, lower_limit = %L WHERE grade = %L", gradeData.upperLimit, gradeData.lowerLimit, grade);
            }
        }
        else
        {
            if(gradeData.upperLimit === null && gradeData.lowerLimit ===null)
            {
                sql = format("UPDATE grades SET grade = %L WHERE grade = %L", gradeData.grade, grade);
            }
            else if(gradeData.upperLimit === null)
            {
                sql = format("UPDATE grades SET grade = %L, lower_limit = %L WHERE grade = %L", gradeData.grade, gradeData.lowerLimit, grade);
            }
            else if(gradeData.lowerLimit === null)
            {
                sql = format("UPDATE grades SET grade = %L, upper_limit = %L WHERE grade = %L", gradeData.grade, gradeData.upperLimit, grade);
            }
            else
            {
                sql = format("UPDATE grades SET grade = %L, upper_limit = %L, lower_limit = %L WHERE grade = %L", gradeData.grade, gradeData.upperLimit, gradeData.lowerLimit, grade);
            }
            return await query(sql);
        }
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

export const deleteAllGradesService = async ()=>{
    try
    {
        const sql: string = format("DELETE FROM grades");
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}