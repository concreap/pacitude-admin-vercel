interface Skill {
    code: string,
    name: string,
    label: string,
    description: string,
    slug: string,
    isEnabled: boolean
    createdBy: any,
    career: any,
    fields: Array<any>,
    questions: Array<any>,
    topics: Array<any>
    createdAt: string;
    updatedAt: string;
    _id: string;
    id: string;
}

export default Skill