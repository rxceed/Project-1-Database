import { query } from "../db";
import format from "pg-format";
import { gradeInterface } from "../models";

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
        const sql: string = format("SELECT * FROM grades ORDER BY upper_limit DESC");
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getGradeByGradeCharService = async (gradeChar: string)=>{
    try
    {
        const sql: string = format("SELECT * FROM grades WHERE grade = %L", gradeChar);
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
        if(!gradeData.lowerLimit) gradeData.lowerLimit = 0;
        if(!gradeData.upperLimit) gradeData.upperLimit = 90;
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
        const retrieveDataSQL: string = format("SELECT * FROM grades WHERE grade = %L", grade);
        const retrieveResult = await query(retrieveDataSQL);
        const oldData = retrieveResult?.rows[0];
        let newData: gradeInterface = {...gradeData};
        if(!newData.grade) newData.grade = oldData.grade;
        if(!newData.upperLimit) newData.upperLimit = parseInt(oldData.upper_limit);
        if(!newData.lowerLimit) newData.lowerLimit = parseInt(oldData.lower_limit);
        const sql: string = format(
            "UPDATE grades SET grade = %L, upper_limit = %L, lower_limit = %L WHERE grade = %L", 
            newData.grade, 
            newData.upperLimit, 
            newData.lowerLimit, 
            grade);
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