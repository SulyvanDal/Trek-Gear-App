import { Prisma } from "@prisma/client";
import { NotFoundError } from "../lib/errors.ts";
import { prisma } from "../lib/prisma.ts";
import type { CreateItemInput, UpdateItemInput } from "../schema/item.schema.ts";

export async function getItemById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });

    if (item === null) throw new NotFoundError("item", id);

    return item;
}

export function getAllItems() {
    return prisma.item.findMany({ orderBy: { name: "asc" } })
}

export function createItem(input: CreateItemInput) {
    return prisma.item.create({ data: input });
}

export async function deleteItemById(id: number) {
    try{
        await prisma.item.delete({where:{id}});
    }catch(err){
        if(err instanceof Prisma.PrismaClientKnownRequestError && err.code ==="P2025"){
            throw new NotFoundError("item",id);
        }
        throw err;
    }
}

export async function patchItemById(id:number,input:UpdateItemInput) {
    try {
        return await prisma.item.update({where: {id}, data:input})
    } catch (err) {
        if(err instanceof Prisma.PrismaClientKnownRequestError && err.code==="P2025"){
            throw new NotFoundError("item",id);
        }
        throw err;
    }
}
