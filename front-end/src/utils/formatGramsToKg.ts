export function formatGramsToKg (grams : number){
    return (grams/1000).toFixed(1).replace('.',',')
}