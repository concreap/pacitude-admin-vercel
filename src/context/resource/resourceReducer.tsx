import { GET_COUNTRIES, SET_LOADING, SET_TOAST } from "../types";

const reducer = (state: any, action: any) => {

    switch (action.type) {

        case GET_COUNTRIES:
            return {
                ...state,
                countries: action.payload
            }
        case SET_TOAST:
            return {
                ...state,
                toast: action.payload
            }
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        default:
            return {
                ...state
            }

    }
}

export default reducer;