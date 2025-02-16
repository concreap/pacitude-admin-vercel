import {
    SET_LOADING,
    UNSET_LOADING,
    GET_INDUSTRIES,
    GET_INDUSTRY,
    GET_CAREERS,
    GET_CAREER,
    GET_FIELDS,
    GET_FIELD,
    GET_SKILLS,
    GET_SKILL,
    GET_QUESTIONS,
    GET_QUESTION,
    GET_TOPICS,
    GET_TOPIC,
    SET_AIQUESTION
} from "../types";

const reducer = (state: any, action: any) => {

    switch (action.type) {
        case GET_INDUSTRIES:
            return {
                ...state,
                industries: action.payload
            }
        case GET_INDUSTRY:
            return {
                ...state,
                industries: action.payload
            }
        case GET_CAREERS:
            return {
                ...state,
                careers: action.payload
            }
        case GET_CAREER:
            return {
                ...state,
                career: action.payload
            }
        case GET_FIELDS:
            return {
                ...state,
                fields: action.payload
            }
        case GET_FIELD:
            return {
                ...state,
                field: action.payload
            }
        case GET_SKILLS:
            return {
                ...state,
                skills: action.payload
            }
        case GET_SKILL:
            return {
                ...state,
                skill: action.payload
            }
        case GET_QUESTIONS:
            return {
                ...state,
                questions: action.payload
            }
        case GET_QUESTION:
            return {
                ...state,
                question: action.payload
            }
        case GET_TOPICS:
            return {
                ...state,
                topics: action.payload
            }
        case GET_TOPIC:
            return {
                ...state,
                topic: action.payload
            }
        case SET_AIQUESTION:
            return {
                ...state,
                aiQuestions: action.payload
            }
        case SET_LOADING:
            return {
                ...state,
                loading: true
            }
        case UNSET_LOADING:
            return {
                ...state,
                loading: false,
                message: action.payload
            }
        default:
            return {
                ...state
            }

    }
}

export default reducer;