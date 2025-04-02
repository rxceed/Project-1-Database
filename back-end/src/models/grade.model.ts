import { NumberSchema } from "joi"

export interface gradeInterface{
    grade: string,
    upperLimit?: number,
    lowerLimit?: number
}

export interface alterGradeInterface{
    newGrade?: string,
    newUpperLimit?: number,
    newLowerLimit?: number
}