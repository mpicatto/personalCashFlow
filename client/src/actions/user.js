import axios from 'axios';
import {useHistory} from 'react-router-dom';
export const ADD_USER = 'ADD_USER';
export const SET_USER = 'SET_USER';
export const CLEAN_USER = 'CLEAN_USER'

//CREAR USUARIO
export function addUser(data){
    return function (dispatch){
         axios.post ("http://localhost:3001/user",data)
        .then(resp=>{
            dispatch({type: ADD_USER, payload: resp.data})
            alert("Usuario creado.")
        })
        .then(useHistory.push("/"))
        .catch(err=>{
            alert(err);
        })
        
    }
}

export function setUser (user){
    return {type:SET_USER, payload:user}
}


export function cleanUser(){
    return{type:CLEAN_USER}
} 