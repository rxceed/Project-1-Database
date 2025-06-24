import { query } from "../db";
import format from "pg-format";
import { getAllProjectsService } from "./project.service";
import { getAllChaptersService } from "./chapter.service";
import { getAllGradingParamsService } from "./gradingParameters.service";
import { getAllSubAspectsService } from "./subAspect.service";
import { CustomError } from "../middlewares";
import { getAllGradesService } from "./grade.service";

interface Subaspect {
    id: number,
    name: string;
    value: number;
  }
  
  interface Aspect {
    id: number,
    name: string,
    totalMistakes: number,
    subaspects: Subaspect[]
  }
  
  interface Chapter {
    id: number,
    no_chapter: number;
    chapter_name: string;
    chapter_weight: number;
    aspects: Aspect[];
  }
  
  interface Score {
    operator: number;
    upper: number;
    lower: number;
    predicate: string;
  }
  
  interface FormData {
    id: number,
    name: string;
    gradingDate: Date,
    chapters: Chapter[],
    totalChapterWeight: number,
    finalScore: number,
    totalMistakes: number,
    grade: string,
    scores: Score[],
    catatan: string,
    status: string
  }
  
  interface FormTableProps {
    formData: FormData;
  }

export const showOnTableService = async ()=>{
    try
    {
        const retrieveProjects = await getAllProjectsService();
        if(!retrieveProjects) throw new CustomError("retrieve error");
        const retrieveChapters = await getAllChaptersService();
        if(!retrieveChapters) throw new CustomError("retrieve error");
        const retrieveAspects = await getAllGradingParamsService();
        if(!retrieveAspects) throw new CustomError("retrieve error");
        const retrieveSubaspects = await getAllSubAspectsService();
        if(!retrieveSubaspects) throw new CustomError("retrieve error");
        const retrieveGrades = await getAllGradesService();
        if(!retrieveGrades) throw new CustomError("retrieve error");
    
        const projects = retrieveProjects.rows;
        const chapters = retrieveChapters.rows;
        const aspects = retrieveAspects.rows;
        const subaspects = retrieveSubaspects.rows;
        const grades = retrieveGrades.rows;
    
        let formData = [];
        for(let i = 0; i < projects.length; i++)
        {
            let newFormData: FormData = {
                id: projects[i].project_id,
                name: projects[i].project_name,
                gradingDate: projects[i].grading_date,
                catatan: projects[i].grader_comment,
                chapters: [],
                totalChapterWeight: 0,
                totalMistakes: 0,
                finalScore: projects[i].final_score,
                grade: projects[i].grade,
                scores: [],
                status: projects[i].status
            }
            for(let j = 0; j < chapters.length; j++)
            {
                if(chapters[j].project_id === projects[i].project_id)
                {
                    let numCount = 1;
                    let chapterData: Chapter = {
                        id: chapters[j].chapter_id,
                        no_chapter: numCount,
                        chapter_name: chapters[j].chapter_name,
                        chapter_weight: chapters[j].chapter_weight,
                        aspects: []
                    }
                    for(let k = 0; k < aspects.length; k++)
                    {
                        if(aspects[k].chapter_id === chapters[j].chapter_id)
                        {
                            let aspectData: Aspect = {
                                id: aspects[k].parameter_id,
                                name: aspects[k].parameter_name,
                                totalMistakes: aspects[k].total_mistakes,
                                subaspects: []
                            }
                            for(let l = 0; l < subaspects.length; l++)
                            {
                                if(subaspects[l].parameter_id === aspects[k].parameter_id)
                                {
                                    let subAspectData: Subaspect = {
                                        id: subaspects[l].subaspect_id,
                                        name: subaspects[l].sub_aspect_name,
                                        value: subaspects[l].mistakes
                                    }
                                    aspectData.subaspects.push(subAspectData);
                                }
                            }
                            chapterData.aspects.push(aspectData);
                        }
                    }
                    newFormData.chapters.push(chapterData);
                    numCount++;
                }
            }
            for(let i = 0; i < grades.length; i++)
            {
                let operatorSign;
                if(grades[i].lower_limit === 0)
                {
                    operatorSign = 4;
                }
                else if(grades[i].upper_limit === 90)
                {
                    operatorSign = 3;
                }
                else
                {
                    operatorSign = 0;
                }
                const gradeData: Score = {
                    upper: grades[i].upper_limit,
                    lower: grades[i].lower_limit,
                    operator: operatorSign,
                    predicate: grades[i].grade
                }
                newFormData.scores.push(gradeData);
            }
            const sumChapterWeight = ()=>{
                let totalWeight = 0;
                for(let i = 0; i < newFormData.chapters.length; i++)
                {
                    totalWeight += newFormData.chapters[i].chapter_weight;
                }
                return totalWeight;
            }
            const sumMistakes = ()=>{
                let totalMistakes = 0;
                for(let i = 0; i < newFormData.chapters.length; i++)
                {
                    for(let j = 0; j < newFormData.chapters[i].aspects.length; j++)
                    {
                        totalMistakes += newFormData.chapters[i].aspects[j].totalMistakes;
                    }
                }
                return totalMistakes;
            }
            newFormData.totalChapterWeight = sumChapterWeight();
            newFormData.totalMistakes = sumMistakes();
            formData.push(newFormData);
        }
        return formData;
    }
    catch(err)
    {
        console.error("Error occurred:",err);
    }
}