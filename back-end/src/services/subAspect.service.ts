import { query } from "../db";
import { subAspectInterface } from "../models";
import format from "pg-format";

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
        const sql: string = format("SELECT * FROM sub_aspects");
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
        const sql: string = format("SELECT * FROM sub_aspects WHERE parameter_id = %L", paramID);
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
        return await query(sql);
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
        if(!newData.mistakes) newData.mistakes = oldData.mistakes;
        const sql: string = format("UPDATE sub_aspects SET sub_aspect_name = %L, mistakes = %L WHERE subaspect_id = %L", 
            newData.name, newData.mistakes,
            subAspectID);
        return await query(sql);
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
        const sql: string = format("DELETE FROM sub_aspects WHERE subaspect_id = %L", subAspectID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}