import { combineReducers } from 'redux'

import { mainReducer } from '../components/Admin/reducer/main.reducer'
import {loginReducer} from '../components/loginScreen/login.reducer/login.reducer'
const rootReducer = combineReducers({
    //mainReducer: mainReducer,
    loginReducer:loginReducer,
})

export default  rootReducer;