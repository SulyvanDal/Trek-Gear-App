import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ValidationError } from "../lib/errors.ts";

export function validateBody(schema:ZodType){
    return (req:Request,res:Response,next:NextFunction)=>{
        const result = schema.safeParse(req.body);
        if (!result.success){
            throw new ValidationError("Body error");
        }
        req.body=result.data;
        next();
    }
}