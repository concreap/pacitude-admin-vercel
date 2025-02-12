export interface Career {
    _id: string,
    code: string,
    name: string,
    label: string,
    description: string,
    isEnabled: boolean,
    slug: string,
    synonyms: Array<string>,
    fields: Array<any>,
    skills: Array<any>,
    questions: Array<any>,
    createdAt: string,
    updatedAt: string,
    id: string
}

export default Career;