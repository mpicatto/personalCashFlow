import {SET_BALANCE,SET_CHARTDATA,SET_CHARTLABELS ,CLEAN_BALANCE} from '../actions/balance'


const initialState ={
    balance:0,
    date:"",
    chartData:[],
    chartLabels:[]
}

export default function user (state = initialState, action){

    if (action.type === SET_BALANCE){
        return {
            ...state,
            balance: action.payload.balance,
            date: action.payload.date
        }
    }

    if (action.type === SET_CHARTDATA){
        return {
            ...state,
            chartData: action.payload,
        }
    }
    if (action.type === SET_CHARTLABELS){
        return {
            ...state,
            chartLabels: action.payload,
        }
    }


    if (action.type === CLEAN_BALANCE){
        return state = initialState
    }
    return state
}