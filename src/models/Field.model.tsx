export interface Field {
    _id: string,
    code: string,
    name: string,
    label: string,
    description: string,
    isEnabled: boolean,
    slug: string,
    career: any,
    skills: Array<any>,
    questions: Array<any>,
    topics: Array<any>,
    createdAt: string,
    updatedAt: string,
    id: string
}

export default Field