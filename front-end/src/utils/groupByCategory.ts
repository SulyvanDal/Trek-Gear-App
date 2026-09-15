import type { BagItemLine } from "../types/api";

export function groupByCategory(items : BagItemLine[]){
 const itemsByCategory :{category : string; items : BagItemLine[]}[]= [];
 
 items.forEach((row) => {
    const foundGroupCategory = itemsByCategory.find((element)=> element.category === row.category)
    if(foundGroupCategory){
        foundGroupCategory.items.push(row)
    }else{
        itemsByCategory.push({category : row.category, items :[row]})
    }
 });
 return itemsByCategory;
}