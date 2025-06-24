import { query } from "../db";
import { gradingParamsInterface, subAspectInterface } from "../models";
import format from "pg-format";
import { alterGradingParamService, getGradingParamByIDService } from "./gradingParameters.service";
import { totalMistakesByParamService } from "./aggregates.service";

export const checkIfSubAspectExists = async (subASpectID: number)=>{
    try
    {
        const sql: string = format("SELECT subaspect_id FROM sub_aspects WHERE subaspect_id = %L", subASpectID);
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

export const getAllSubAspectsService = async ()=>{
    try
    {
        const sql: string = format("SELECT * FROM sub_aspects ORDER BY subaspect_id ASC");
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getAllSubAspectsByParamIDService = async (paramID: number)=>{
    try
    {
        const sql: string = format("SELECT * FROM sub_aspects WHERE parameter_id = %L ORDER BY subaspect_id ASC", paramID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getSubAspectsByIDService = async (subAspectID: number)=>{
    try
    {
        const sql: string = format("SELECT * FROM sub_aspects WHERE subaspect_id = %L", subAspectID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getSubAspectByID_and_ParamIDService = async (subASpectID: number, paramID: number)=>{
    try
    {
        const sql: string = format("SELECT * FROM sub_aspects WHERE subaspect_id = %L AND parameter_id = %L", subASpectID, paramID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const insertNewSubAspectService = async (subAspectData: subAspectInterface)=>{
    try
    {
        if(!subAspectData.mistakes) subAspectData.mistakes = 0;
        const sql: string = format("INSERT INTO sub_aspects(parameter_id, sub_aspect_name, mistakes) VALUES(%L, %L, %L)",
            subAspectData.paramID,
            subAspectData.name,
            subAspectData.mistakes
        );

        const returnVal = await query(sql);

        const paramID = subAspectData.paramID;
        const retrieveParamData = await getGradingParamByIDService(paramID);
        const oldParamData = retrieveParamData?.rows[0];
        const newTotalMistakesInParam = await totalMistakesByParamService(paramID);
        const newParamData: gradingParamsInterface = {chapterID: oldParamData.chapter_id, name: oldParamData.parameter_name, totalMistakes: newTotalMistakesInParam?.rows[0].total_mistakes as number};
        await alterGradingParamService(paramID, newParamData);

        return returnVal;
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const alterSubAspectService = async (subAspectID: number, subAspectData: subAspectInterface)=>{
    try
    {
        const retrieveDataSQL: string = format("SELECT * FROM sub_aspects WHERE subaspect_id = %L", subAspectID);
        const retrievedData = await query(retrieveDataSQL);
        const oldData = retrievedData?.rows[0];
        let newData = {...subAspectData};
        if(!newData.name) newData.name = oldData.sub_aspect_name;
        if(!newData.mistakes) newData.mistakes = parseInt(oldData.mistakes);
        const sql: string = format("UPDATE sub_aspects SET sub_aspect_name = %L, mistakes = %L WHERE subaspect_id = %L", 
            newData.name, newData.mistakes,
            subAspectID);
        
        const returnVal = await query(sql);
            
        const paramID = parseInt(oldData.parameter_id);
        const retrieveParamData = await getGradingParamByIDService(paramID);
        const oldParamData = retrieveParamData?.rows[0];
        const newTotalMistakesInParam = await totalMistakesByParamService(paramID);
        const newParamData: gradingParamsInterface = {chapterID: oldParamData.chapter_id, name: oldParamData.parameter_name, totalMistakes: newTotalMistakesInParam?.rows[0].total_mistakes as number};
        await alterGradingParamService(paramID, newParamData);

        return returnVal;
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const deleteAllSubAspectsByParamIDService = async (paramID: number)=>{
    try
    {
        const sql: string = format("DELETE FROM sub_aspects WHERE parameter_id = %L", paramID);

        const retrieveParamData = await getGradingParamByIDService(paramID);
        const oldParamData = retrieveParamData?.rows[0];
        const newTotalMistakesInParam = await totalMistakesByParamService(paramID);
        const newParamData: gradingParamsInterface = {chapterID: oldParamData.chapter_id, name: oldParamData.parameter_name, totalMistakes: newTotalMistakesInParam?.rows[0].total_mistakes as number};
        await alterGradingParamService(paramID, newParamData);

        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const deleteSubAspectByIDService = async (subAspectID: number)=>{
    try
    {
        const retrieveDataSQL: string = format("SELECT * FROM sub_aspects WHERE subaspect_id = %L", subAspectID);
        const retrievedData = await query(retrieveDataSQL);
        const oldData = retrievedData?.rows[0];

        const sql: string = format("DELETE FROM sub_aspects WHERE subaspect_id = %L", subAspectID);
        
        const paramID = parseInt(oldData.parameter_id);
        const retrieveParamData = await getGradingParamByIDService(paramID);
        const oldParamData = retrieveParamData?.rows[0];
        const newTotalMistakesInParam = await totalMistakesByParamService(paramID);
        const newParamData: gradingParamsInterface = {chapterID: oldParamData.chapter_id, name: oldParamData.parameter_name, totalMistakes: newTotalMistakesInParam?.rows[0].total_mistakes as number};
        await alterGradingParamService(paramID, newParamData);

        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}