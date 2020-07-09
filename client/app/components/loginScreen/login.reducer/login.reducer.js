const LOGIN_SUCCESS ='LOGIN_SUCCESS'
const initialMainState = {
    data:null,

}

export const loginReducer = (state = initialMainState, action) => {
    const {type, payload} = action
    console.log(payload)
    switch (type) {
        case LOGIN_SUCCESS: 
            return{
                ...state,
                data:payload  // to payload
            }
        default:
            return state
    }
    return state
}