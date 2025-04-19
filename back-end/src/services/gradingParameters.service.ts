import {query} from "../db";
import format from "pg-format";
import { gradingParamsSchema } from "../utils/validators";
import { gradingParamsInterface } from "../models";

export const Service = async ()=>{
    try
    {

    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const checkIfGradingParamExists = async (paramID: number)=>{
    try
    {
        const sql: string = format("SELECT parameter_id FROM grading_parameters WHERE parameter_id = %L", paramID);
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
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getAllGradingParamsService = async ()=>{
    try
    {
        const sql: string = format("SELECT * FROM grading_parameters");
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getGradingParamByIDService = async (paramID: number)=>{
    try
    {
        const sql: string = format("SELECT * FROM grading_parameters WHERE parameter_id = %L", paramID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getAllGradingParamsByChapterIDService = async (chapterID: number)=>{
    try
    {
        const sql: string = format("SELECT * FROM grading_parameters WHERE chapter_id = %L", chapterID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getGradingParameterByID_and_ChapterIDService = async (paramID: number, chapterID: number)=>{
    try
    {
        const sql: string = format("SELECT * FROM grading_paramters WHERE parameter_id = %L AND chapter_id = %L", paramID, chapterID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}


export const insertGradingParamService = async (paramData: gradingParamsInterface)=>{
    try
    {
        const sql: string = format("INSERT INTO grading_parameters(chapter_id, parameter_name) VALUES (%L, %L)", 
            paramData.chapterID, 
            paramData.name);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const alterGradingParamService = async (paramID: number, paramData: gradingParamsInterface)=>{
    try
    {
        const retrieveDataSQL: string = format("SELECT * FROM grading_parameters WHERE parameter_id = %L", paramID);
        const retrievedData = await query(retrieveDataSQL);
        const oldData = retrievedData?.rows[0];
        let newData: gradingParamsInterface = {...paramData};
        if(!newData.name) newData.name = oldData.parameter_name;
        const sql: string = format("UPDATE grading_parameters SET parameter_name = %L WHERE parameter_id = %L", newData.name, paramID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const deleteAllGradingParamsByChapterIDService = async (chapterID: number)=>{
    try
    {
        const sql: string = format("DELETE FROM grading_parameters WHERE chapter_id = %L", chapterID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const deleteGradingParamByIDService = async (paramID: number)=>{
    try
    {
        const sql: string = format("DELETE FROM grading_parameters WHERE parameter_id = %L", paramID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}