import { query } from "../db";
import format from "pg-format";
import { projectInterface } from "../models"

export const checkIfProjectIDExist = async (id: number)=>{
    const sql: string = format('SELECT project_id FROM projects WHERE project_id = %L', id);
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

export const getAllProjectsService = async () =>{
    try
    {
        const sql: string = format("SELECT * FROM projects ORDER BY project_id ASC");
        return await query(sql);

    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const getProjectByIDService = async (id: number)=>{
    try
    {
        const sql: string = format("SELECT * FROM projects WHERE project_id = %L ORDER BY project_id ASC", id);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const insertNewProjectService = async (projectData: projectInterface)=>{
    try
    {
        const sql: string = format("INSERT INTO projects(project_name) VALUES (%L)", projectData.name);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const alterProjectService = async (id: number, projectData: projectInterface)=>{
    try
    {
        const retriveDataSQL: string = format("SELECT * FROM projects WHERE project_id = %L", id);
        const retrieveResult = await query(retriveDataSQL);
        const oldData = retrieveResult?.rows[0];
        let newData: projectInterface = {...projectData};
        if(!newData.name) newData.name = oldData.project_name;
        if(!newData.gradingDate) newData.gradingDate = oldData.grading_date;
        if(!newData.grade) newData.grade = oldData.grade;
        if(!newData.status) newData.status = oldData.status;
        if(!newData.finalScore) newData.finalScore = parseInt(oldData.final_score);
        if(!newData.comment) newData.comment = oldData.grader_comment;
        const sql: string = format(
            "UPDATE projects SET project_name = %L, grading_date = %L, grade = %L, status = %L, final_score = %L, grader_comment = %L WHERE project_id = %L", 
            newData.name,
            newData.gradingDate,
            newData.grade,
            newData.status,
            newData.finalScore,
            newData.comment,
            id);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const syncProjectService = async ()=>{
    try
    {
        //NOTE: Update query untuk mentrigger trigger function antara grade scoring dan predikat project untuk menghindari
        const retriveDataSQL: string = format("SELECT * FROM projects");
        const retrieveResult = await query(retriveDataSQL);
        if(!retrieveResult) return null;
        const oldData = retrieveResult.rows;
        const dataLength = oldData.length;
        for(let i = 0; i < dataLength; i++)
        {
            const sql: string = format(
            "UPDATE projects SET project_name = %L, grading_date = %L, grade = %L, status = %L, final_score = %L, grader_comment = %L WHERE project_id = %L", 
            oldData[i].project_name,
            oldData[i].grading_date,
            oldData[i].grade,
            oldData[i].status,
            oldData[i].final_score,
            oldData[i].grader_comment,
            oldData[i].project_id);
            await query(sql);
        }
        return true;
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const deleteProjectByIDService = async (id: number)=>{
    try
    {
        const sql: string = format("DELETE FROM projects WHERE project_id = %L", id);
        return await query(sql);
    }
    catch(error)
    {
        console.error(error);
    }
}

export const deleteAllProjectsService = async ()=>{
    try
    {
        const sql: string = format("DELETE FROM projects");
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}