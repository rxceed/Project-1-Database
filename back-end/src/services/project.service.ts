import { query } from "../db";
import format from "pg-format";
import { projectInterface } from "../models"

export const checkIfProjectIDExist = async (id: number)=>{
    const sql: string = format("SELECT project_id FROM grades WHERE project_id = %L", id);
    const result = await query(sql);
    if(result?.rowCount) return true;
    else return false;
}

export const getAllProjectsService = async () =>{
    try
    {
        const sql: string = format("SELECT * FROM projects");
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
        const sql: string = format("SELECT * FROM projects WHERE project_id = %L", id);
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
        const sql: string = format("INSERT INTO projects(project_name, grading_date, grade, status) VALUES (%L, %L, %L, %L)", projectData.name, projectData.gradingDate, projectData.grade, projectData.status);
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
        const sql: string = format(
            "UPDATE projects SET project_name = %L, grading_date = %L, grade = %L, status = %L WHERE project_id = %L", 
            newData.name,
            newData.gradingDate,
            newData.grade,
            newData.status,
            id);
        return await query(sql);
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