// post data to sever with socket.io
// if user is driver get data from soket.io
// get list driver location.
const POST_LOCATION ="POST_LOCATION";
export const getGenres = (token) => {
    return (dispatch) => {
        dispatch({type: GENRES_REQUEST})

        APIListGenres(token).get()
            .catch(err => {
                dispatch(errorHandler(err))
                dispatch({type: GENRES_FAILURE, payload: null})
            })
            //.then(res=>res.json())
            .then(res => {
                console.log(res)
                dispatch({type: GENRES_SUCCESS, payload: res.data})
            })
    }
}
// export const postLocation=(lat,log)=>{
//     return (dispatch)=>{
        
//     }
// }