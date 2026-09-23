import type { NextFunction, Request, Response } from "express";

export function currentUser(_req : Request, res : Response, next : NextFunction){
        const user = 1;
        res.locals.userId = user;
        next();
    }
