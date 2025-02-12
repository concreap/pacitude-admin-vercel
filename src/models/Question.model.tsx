import { DifficultyType, LevelType, QuestionType } from "../utils/types.util"

export interface IQuestionScore {
    cutoff: number,
    default: number,
    bonus: number
}

export interface IQuestionAnswer {
    code: string,
    alphabet: string,
    label: string,
    body: string,
    images: Array<string>,
    isCorrect: boolean
}

export interface IQuestionTime {
    duration: number,
    handle: string
}

interface Question {
    code: string,
    body: string,
    slug: string,
    time: IQuestionTime,
    isEnabled: boolean,
    difficulty: DifficultyType,
    level: LevelType,
    type: QuestionType,
    score: IQuestionScore,
    answers: Array<IQuestionAnswer>
    createdBy: any,
    topic: any,
    careers: Array<any>,
    fields: Array<any>,
    skills: Array<any>
    createdAt: string;
    updatedAt: string;
    _id: string;
    id: string;
}

export default Question