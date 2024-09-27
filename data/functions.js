export const format_data = (data)=>{
    const cleanedString = data.slice(1, -1)
    const jsonString = cleanedString.replace(/(\w+):/g, '"$1":')
    return JSON.parse(jsonString)
}