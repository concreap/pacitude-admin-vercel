import Question, { IQuestionTime } from "../models/Question.model";
import helper from "./helper.util";
import { IQuestionUtil } from "./interfaces.util";
import { RubricType, SemanticType } from "./types.util";

const shortenRubric = (question: Question, type: RubricType): string => {

    let result: string = '';
    let resources: Array<any> = []

    if (type === 'level') {
        resources = question.levels ? question.levels : [];
    } else if (type === 'difficulty') {
        resources = question.difficulties ? question.difficulties : [];
    } else if (type === 'question-type') {
        resources = question.types ? question.types : [];
    }

    if (resources.length === 1) {
        result = helper.capitalize(resources[0])
    } else if (resources.length > 1) {
        result = `${helper.capitalize(resources[0])} +${resources.length - 1}`
    } else {
        result = '---'
    }

    return result;

}

const rubricBadge = (type: RubricType) => {

    let result: SemanticType = 'info';

    if (type === 'level') {
        result = 'info'
    } else if (type === 'difficulty') {
        result = 'warning'
    } else if (type === 'question-type') {
        result = 'ongoing'
    } else if (type === 'score') {
        result = 'normal'
    } else if (type === 'time') {
        result = 'success'
    }

    return result

}

const formatTime = (time: IQuestionTime) => {
    
    let result = '1 Minute';

    if(time && time.duration && time.handle){

        result = `${time.duration} ${time.handle}`

        if(time.duration > 1){
            result = `${result}s`
        }

    }

    return result

}

const questionHelper: IQuestionUtil = {
    shortenRubric: shortenRubric,
    rubricBadge: rubricBadge,
    formatTime: formatTime
}

export default questionHelper;