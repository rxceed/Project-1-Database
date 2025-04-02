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
        let sql: string;
        sql = format("SELECT * FROM grades");
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
        let sql: string;
        sql = format("INSERT INTO grades(grade, upper_limit, lower_limit) VALUES (%L, %L, %L)", gradeData.grade, gradeData.upperLimit, gradeData.lowerLimit);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const alterGradeService = async (grade: string, alterGradeData: alterGradeInterface)=>{
    try
    {
        let sql: string;
        if(alterGradeData.newGrade === null)
        {
            if(alterGradeData.newUpperLimit === null)
            {
                sql = format("UPDATE grades SET lower_limit = %L WHERE grade = %L", alterGradeData.newLowerLimit, grade);
            }
            else if(alterGradeData.newLowerLimit === null)
            {
                sql = format("UPDATE grades SET upper_limit = %L WHERE grade = %L", alterGradeData.newUpperLimit, grade);
            }
            else
            {
                sql = format("UPDATE grades SET upper_limit = %L, lower_limit = %L WHERE grade = %L", alterGradeData.newUpperLimit, alterGradeData.newLowerLimit, grade);
            }
        }
        else
        {
            if(alterGradeData.newUpperLimit === null && alterGradeData.newLowerLimit ===null)
            {
                sql = format("UPDATE grades SET grade = %L WHERE grade = %L", alterGradeData.newGrade, grade);
            }
            else if(alterGradeData.newUpperLimit === null)
            {
                sql = format("UPDATE grades SET grade = %L, lower_limit = %L WHERE grade = %L", alterGradeData.newGrade, alterGradeData.newLowerLimit, grade);
            }
            else if(alterGradeData.newLowerLimit === null)
            {
                sql = format("UPDATE grades SET grade = %L, upper_limit = %L WHERE grade = %L", alterGradeData.newGrade, alterGradeData.newUpperLimit, grade);
            }
            else
            {
                sql = format("UPDATE grades SET grade = %L, upper_limit = %L, lower_limit = %L WHERE grade = %L", alterGradeData.newGrade, alterGradeData.newUpperLimit, alterGradeData.newLowerLimit, grade);
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