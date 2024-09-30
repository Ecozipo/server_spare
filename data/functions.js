export const format_data = (data)=>{
    const cleanedString = data.slice(1, -1)
    const jsonString = cleanedString.replace(/(\w+):/g, '"$1":')
    return JSON.parse(jsonString)
}

export const invertState = (state) => {
    for(let key in state){
        if(typeof state[key] === 'number'){
            if(state[key] === 0){
                state[key] = 1
            }else{
                state[key] = 0
            }
        }
    }
    return state
}