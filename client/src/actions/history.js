
export const SET_HISTORY = 'SET_HISTORY';
export const CLEAN_HISTORY = 'CLEAN_HISTORY'


export function setHistory (history){
    return {type:SET_HISTORY, payload:history}
}

export function cleanHistory(){
    return{type:CLEAN_HISTORY}
} 