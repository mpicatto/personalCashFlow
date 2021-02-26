import {SET_HISTORY, CLEAN_HISTORY} from '../actions/history'

const initialState ={
    history:[],
}

export default function user (state = initialState, action){

    if (action.type === SET_HISTORY){
        return {
            ...state,
            history: action.payload
        }
    }

    if (action.type === CLEAN_HISTORY){
        return state = initialState
    }
    return state
}