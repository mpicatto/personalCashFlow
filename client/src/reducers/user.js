import {ADD_USER, SET_USER,CLEAN_USER} from '../actions/user'


const initialState ={
    user:[{
        id: 0,
    }],
    email: []
}

export default function user (state = initialState, action){
    if (action.type === ADD_USER){
        return {
            ...state,
            // user: state.user.concat(action.payload)
        }
    }

    if (action.type === SET_USER){
        return {
            ...state,
            user: action.payload
        }
    }

    if (action.type === CLEAN_USER){
        return state = initialState
    }
    return state
}