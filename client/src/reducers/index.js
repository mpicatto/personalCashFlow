import {combineReducers} from 'redux';
import user from './user'
import balance from './balance'
import moves from './transactions'
import history from './history'

export default combineReducers({
 user,balance,moves,history
}) 