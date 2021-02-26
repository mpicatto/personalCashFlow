
export const SET_BALANCE = 'SET_BALANCE';
export const SET_CHARTDATA='SET_CHARTDATA'
export const SET_CHARTLABELS='SET_CHARTLABELS'
export const CLEAN_BALANCE = 'CLEAN_BALANCE'


export function setBalance (balance){
    return {type:SET_BALANCE, payload:balance}
}

export function setChartData (balances){
    return {type:SET_CHARTDATA, payload:balances}
}

export function setChartLabels (dates){
    return {type:SET_CHARTLABELS, payload:dates}
}

export function cleanBalance(){
    return{type:CLEAN_BALANCE}
} 