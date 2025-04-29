import { query } from "../db";
import format from "pg-format";
import { chapterInterface, projectInterface } from "../models";
import { alterProjectService, getProjectByIDService } from "./project.service";
import { finalScoreService } from "./aggregates.service";

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
        const returnVal = await query(sql);

        const projectID = chapterData.projectID;
        const retrieveProjectData = await getProjectByIDService(projectID);
        const oldProjectData = retrieveProjectData?.rows[0];
        const newFinalScore = await finalScoreService(projectID);
        let projectStatus: string;
        if(newFinalScore as number >= 55) projectStatus = "LULUS";
        else projectStatus = "TIDAK LULUS";
        const newProjectData: projectInterface = {name: oldProjectData.project_name, gradingDate: oldProjectData.grading_date, grade: oldProjectData.grade, status: projectStatus, comment: oldProjectData.grader_comment, finalScore: newFinalScore as number};
        const updateProject = await alterProjectService(projectID, newProjectData);
        
        return returnVal;
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
        if(!newData.weight) newData.weight = parseInt(oldData.chapter_weight);
        if(!newData.chapterScore) newData.chapterScore = parseInt(oldData.chapter_score);
        const sql: string = format("UPDATE chapters SET chapter_name = %L, chapter_weight = %L, chapter_score = %L WHERE chapter_id = %L", newData.name, newData.weight, newData.chapterScore, chapterID);
        const returnVal = await query(sql);

        const projectID = parseInt(oldData.project_id);
        const retrieveProjectData = await getProjectByIDService(projectID);
        const oldProjectData = retrieveProjectData?.rows[0];
        const newFinalScore = await finalScoreService(projectID);
        let projectStatus: string;
        if(newFinalScore as number >= 55) projectStatus = "LULUS";
        else projectStatus = "TIDAK LULUS";
        const newProjectData: projectInterface = {name: oldProjectData.project_name, gradingDate: oldProjectData.grading_date, grade: oldProjectData.grade, status: projectStatus, comment: oldProjectData.grader_comment, finalScore: newFinalScore as number};
        const updateProject = await alterProjectService(projectID, newProjectData);
        
        return returnVal;
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