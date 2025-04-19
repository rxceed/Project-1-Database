import { query } from "../db";
import format from "pg-format";
import { chapterInterface } from "../models";

export const checkIfChapterExist = async (chapterID: number)=>{
    try
    {
        const sql: string = format("SELECT chapter_id FROM chapters WHERE chapter_id = %L", chapterID);
        const result = await query(sql);
        if(result?.rowCount) return true;
        else return false;
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getAllChaptersService = async ()=>{
    try
    {
        const sql: string = format("SELECT * FROM chapters");
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getAllChaptersByProjectIDService = async (projectID: number)=>{
    try
    {
        const sql: string = format("SELECT * FROM chapters WHERE project_id = %L", projectID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getChapterByIDService = async (chapterID: number)=>{
    try
    {
        const sql: string = format("SELECT * FROM chapters WHERE chapter_id = %L", chapterID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getChapterByID_and_ProjectIDService = async (chapterID: number, projectID: number)=>{
    try
    {
        const sql: string = format("SELECT * FROM chapters WHERE chapter_id = %L AND project_id = %L", chapterID, projectID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const insertNewChapterService = async (chapterData: chapterInterface)=>{
    try
    {
        const sql: string = format("INSERT INTO chapters(project_id, chapter_name, chapter_weight) VALUES (%L, %L, %L)",
            chapterData.projectID, 
            chapterData.name, 
            chapterData.weight
        )
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const alterChapterService = async (chapterID: number, chapterData: chapterInterface)=>{
    try
    {
        const retrieveDataSQL: string = format("SELECT * FROM chapters WHERE chapter_id = %L", chapterID);
        const retrievedData = await query(retrieveDataSQL);
        const oldData = retrievedData?.rows[0];
        let newData: chapterInterface = {...chapterData};
        if(!newData.name) newData.name = oldData.chapter_name;
        if(!newData.weight) newData.weight = oldData.chapter_weight;
        const sql: string = format("UPDATE chapters SET chapter_name = %L, chapter_weight = %L WHERE chapter_id = %L", newData.name, newData.weight, chapterID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const deleteAllChaptersByProjectIDService = async (projectID: number)=>{
    try
    {
        const sql: string = format("DELETE FROM chapters WHERE project_id = %L", projectID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const deleteChapterByIDService = async (chapterID: number)=>{
    try
    {
        const sql: string = format("DELETE FROM chapters WHERE chapter_id = %L", chapterID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}