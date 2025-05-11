import sidebarRoutes from "../routes/sidebar.route";
import { IAIQuestion, ICollection, IAppMetrics, IPagination, ISidebarProps, IToast, ICoreResource } from "../utils/interfaces.util";

const avatars = [
    { name: 'sandra', avatar: 'https://storage.googleapis.com/pacitude-buckets/sandra.png' },
    { name: 'femi', avatar: 'https://storage.googleapis.com/pacitude-buckets/femi.png' },
    { name: 'vivek', avatar: 'https://storage.googleapis.com/pacitude-buckets/vivek.png' },
    { name: 'zuri', avatar: 'https://storage.googleapis.com/pacitude-buckets/zuri.png' },
    { name: 'minho', avatar: 'https://storage.googleapis.com/pacitude-buckets/Minho.png' },
    { name: 'sophie', avatar: 'https://storage.googleapis.com/pacitude-buckets/sophie.png' },
    { name: 'trab', avatar: 'https://storage.googleapis.com/pacitude-buckets/trab.png' },
]

const levels = [
    { name: 'Novice', value: 'novice' },
    { name: 'Beginner', value: 'beginner' },
    { name: 'Intermediate', value: 'intermediate' },
    { name: 'Advanced', value: 'advanced' },
    { name: 'Professional', value: 'professional' },
    { name: 'Expert', value: 'expert' }
]

const talents = [
    {
        id: '34567890',
        avatar: 'JD',
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe'
    },
    {
        id: '876544567',
        avatar: avatars[3].avatar,
        firstName: 'Elizabeth',
        lastName: 'Awelayo',
        name: 'Elizabeth Awelayo'
    },
    {
        id: '54567890',
        avatar: avatars[2].avatar,
        firstName: 'Benjamin',
        lastName: 'Reyes',
        name: 'Benjamin Reyes'
    },
    {
        id: '8765456789',
        avatar: avatars[5].avatar,
        firstName: 'Sophie',
        lastName: 'Brent',
        name: 'Sophie Brent'
    },
    {
        id: '745678978',
        avatar: avatars[4].avatar,
        firstName: 'Minho',
        lastName: 'Kwon',
        name: 'Minho Kwon'
    }
]

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

const sidebar: ISidebarProps = {
    collapsed: false,
    route: sidebarRoutes[0],
    isOpen: false,
    subroutes: [],
    inroutes: []
}

const toast: IToast = {
    type: 'success',
    show: false,
    message: '',
    title: 'Feedback',
    position: 'top-right',
    close: () => { }
}

// special to project
const aiquestion: Array<IAIQuestion> = [];

const metrics: IAppMetrics = {
    loading: false,
    message: '',
    type: 'default',
    resource: 'default',
    question: {
        total: 0, disabled: 0, enabled: 0,
        resource: { total: 0, disabled: 0, enabled: 0 }
    }
}

const limits: Array<{ label: string, value: number }> = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: '200', value: 200 }
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

const coreResource: ICoreResource = {
    industries: [],
    careers: [],
    fields: [],
    skills: [],
    topics: []
}

export {
    sidebar,
    avatars,
    toast,
    collection,
    pagination,
    talents,
    limits,
    levels,
    difficulties,
    questionTypes,
    timeHandles,
    allocatedTimes,
    coreResource,

    // special to project
    aiquestion,
    metrics
};