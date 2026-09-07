import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../lib/errors.ts";

export function validateIdParam(req : Request, _res:Response, next : NextFunction){
    const id = Number(req.params.id);
    if(!Number.isInteger(id)){
        throw new ValidationError("L'id doit être un entier")
    }
    next();
}