import { Request, Response, NextFunction } from "express";
import { checkIfGradeExists, insertNewGradeService, alterGradeService, deleteGradeService } from "../services";

export const insertNewGrade