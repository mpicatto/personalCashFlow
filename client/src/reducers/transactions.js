import {SET_MOVES,SET_CATEGORIES, CLEAN_MOVES} from '../actions/transactions'


const initialState ={
    moves:[],
    categories:[]
}

export default function user (state = initialState, action){

    if (action.type === SET_MOVES){
        return {
            ...state,
            moves: action.payload
        }
    }

    if (action.type === SET_CATEGORIES){
        return {
            ...state,
            categories: action.payload
        }
    }

    if (action.type === CLEAN_MOVES){
        return state = initialState
    }
    return state
}