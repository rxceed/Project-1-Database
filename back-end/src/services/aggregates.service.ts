import { query } from "../db";
import format from "pg-format";

export const totalMistakesByParamService = async (paramID: number )=>{
    try
    {
        const sql: string = format("SELECT COALESCE(SUM(mistakes), 0) AS total_mistakes FROM sub_aspects WHERE parameter_id = %L", paramID)
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const totalMistakesAllParamsAsListService = async (chapterID: number)=>{
    try
    {
        const sql: string = format("SELECT grading_parameters.parameter_id, parameter_name, COALESCE(SUM(mistakes), 0) AS total_mistakes FROM sub_aspects INNER JOIN grading_parameters ON grading_parameters.parameter_id = sub_aspects.parameter_id WHERE chapter_id = %L GROUP BY grading_parameters.parameter_id", chapterID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const totalMistakesAllParamsAsResultService = async (chapterID: number)=>{
    try
    {
        const sql: string = format("SELECT COALESCE(SUM(mistakes), 0) AS total_mistakes FROM sub_aspects INNER JOIN grading_parameters ON grading_parameters.parameter_id = sub_aspects.parameter_id WHERE chapter_id = %L", chapterID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const totalChapterScoreService = async (chapterID: number)=>{
    try
    {
        const sql: string = format("SELECT COALESCE(90-SUM(mistakes), 0) AS chapter_score FROM sub_aspects INNER JOIN grading_parameters ON grading_parameters.parameter_id = sub_aspects.parameter_id WHERE chapter_id = %L", chapterID);
        return await query(sql);
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}

export const finalScoreService = async (projectID: number)=>{
    try
    {
        const projectChapterIDFilteringSQL: string = format("SELECT chapter_id FROM chapters INNER JOIN projects ON chapters.project_id = projects.project_id WHERE projects.project_id = %L", projectID);
        const projectChapterIDFilteringResult = await query(projectChapterIDFilteringSQL);
        const projectChapterIDs = projectChapterIDFilteringResult?.rows || [];
        let chapterScore = [];
        let chapterWeight = [];
        for (let i: number = 0; i < projectChapterIDs.length; i++)
        {
            const chapterScoreSQL: string = format("SELECT 90-SUM(mistakes) AS chapter_score FROM sub_aspects INNER JOIN grading_parameters ON grading_parameters.parameter_id = sub_aspects.parameter_id WHERE chapter_id = %L", projectChapterIDs[i].chapter_id);
            const chapterWeightSQL: string = format("SELECT chapter_weight FROM chapters WHERE chapter_id = %L", projectChapterIDs[i].chapter_id);
            const chapterScoreResult = await query(chapterScoreSQL);
            const chapterWeightResult = await query(chapterWeightSQL);
            chapterScore.push(chapterScoreResult?.rows[0].chapter_score);
            chapterWeight.push(chapterWeightResult?.rows[0].chapter_weight);
        }
        let sumWeightTimesScore: number = 0;
        let sumChapterWeight: number = 0;
        for (let i: number = 0; i < chapterScore.length; i++)
        {
            sumWeightTimesScore += chapterWeight[i]*chapterScore[i];
            sumChapterWeight += chapterWeight[i];
        }
        return sumWeightTimesScore/sumChapterWeight;
    }
    catch(error)
    {
        console.error("Error occured:", error);
    }
}