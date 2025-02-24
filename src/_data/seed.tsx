import sidebarRoutes from "../routes/sidebar.route"
import { IAIQuestion, ICollection, ICoreMetrics, IPagination, ISidebarAttrs, IToastState } from "../utils/interfaces.util"

const pagination: IPagination = {
    next: { page: 1, limit: 25 },
    prev: { page: 1, limit: 25 },
}

const collection: ICollection = {
    data: [],
    count: 0,
    total: 0,
    pagination: pagination,
    loading: false,
    message: 'There are no data currently'
}

const aiquestion: Array<IAIQuestion> = []

// const aiquestion: Array<IAIQuestion> = [
//     {
//         code: '1',
//         body: 'In the context of leadership, what distinguishes transformational leadership from transactional leadership?',
//         answers: [
//             { alphabet: 'a', answer: 'Transformational leaders focus solely on rewards' },
//             { alphabet: 'b', answer: 'Transactional leaders are more inspirational' },
//             { alphabet: 'c', answer: 'Transformational leaders inspire and motivate beyond structured tasks and any other thing assigned' },
//             { alphabet: 'd', answer: 'Transactional leaders completely ignore team dynamics' }
//         ],
//         correct: 'b',
//         difficulties: ['normal'],
//         levels: ['beginner'],
//         score: '2',
//         time: {
//             value: '1',
//             handle: 'minute'
//         },
//         types: ['trivial'],
//         fields: [],
//     },
//     {
//         code: '2',
//         body: 'How many moons are there on earth?',
//         answers: [
//             { alphabet: 'a', answer: '2' },
//             { alphabet: 'b', answer: '1' },
//             { alphabet: 'c', answer: '5' },
//             { alphabet: 'd', answer: '6' }
//         ],
//         correct: 'b',
//         difficulties: ['normal'],
//         levels: ['beginner'],
//         score: '2',
//         time: {
//             value: '1',
//             handle: 'minute'
//         },
//         types: ['trivial'],
//         fields: [],
//     }
// ]

const sidebar: ISidebarAttrs = {
    collapsed: true,
    route: sidebarRoutes[0],
    isOpen: false,
    subroutes: []
}

const toast: IToastState = {
    type: 'success',
    show: false,
    message: '',
    title: 'Feedback',
    position: 'top-right',
}

const skillLevels = [
    { name: 'Novice', value: 'novice' },
    { name: 'Beginner', value: 'beginner' },
    { name: 'Intermediate', value: 'intermediate' },
    { name: 'Advanced', value: 'advanced' },
    { name: 'Professional', value: 'professional' },
    { name: 'Expert', value: 'expert' }
]

const difficulties = [
    { name: 'Random', value: 'random' },
    { name: 'Easy', value: 'easy' },
    { name: 'Normal', value: 'normal' },
    { name: 'Hard', value: 'hard' },
    { name: 'Difficult', value: 'difficult' }
]

const questionTypes = [
    { name: 'General', value: 'general' },
    { name: 'Practical', value: 'practical' },
    { name: 'Trivial', value: 'trivial' }
]

const timeHandles = [
    { name: 'Seconds', value: 'second' },
    { name: 'Minutes', value: 'minute' },
    { name: 'Hours', value: 'hour' }
]

const allocatedTimes = [
    { name: 'One', value: '1' },
    { name: 'Two', value: '2' },
    { name: 'Three', value: '3' },
    { name: 'Four', value: '4' },
    { name: 'Five', value: '5' }
]

const initialMetrics: ICoreMetrics = {
    loading: false,
    message: '',
    type: 'default',
    resource: 'default',
    question: {
        total: 0, disabled: 0, enabled: 0,
        resource: { total: 0, disabled: 0, enabled: 0 }
    }
}

export {
    pagination,
    collection,
    sidebar,
    toast,
    aiquestion,
    skillLevels,
    questionTypes,
    difficulties,
    timeHandles,
    allocatedTimes,
    initialMetrics
}