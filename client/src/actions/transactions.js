
export const SET_MOVES = 'SET_MOVES';
export const SET_CATEGORIES = 'SET_CATEGORIES' 
export const CLEAN_MOVES = 'CLEAN_MOVES'


export function setMoves (moves){
    return {type:SET_MOVES, payload:moves}
}

export function setCategories (categories){
    return {type:SET_CATEGORIES, payload:categories}
}

export function cleanMoves(){
    return{type:CLEAN_MOVES}
} 