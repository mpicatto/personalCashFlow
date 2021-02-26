import { createStore, applyMiddleware} from "redux";
import rootReducer from '../reducers/index';
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension';

function saveToLocalStorage(state){
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state',serializedState)
  } catch(e){
    console.log(e)
  }
}

function loadFromLocalStorage(){
  try {

    const serializedState = localStorage.getItem('state')
    if (serializedState === null) return undefined
    return JSON.parse(serializedState) 
  } catch(e){
    console.log(e)
  }
}

 const persistedState = loadFromLocalStorage();


const store = createStore(
  rootReducer,
  
   persistedState,
  composeWithDevTools(applyMiddleware(thunk),
));

store.subscribe(()=>saveToLocalStorage(store.getState()))

export default store;