import sidebarRoutes from "../routes/sidebar.route"
import { ICollection, IPagination, ISidebarAttrs, IToastState } from "../utils/interfaces.util"

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

export { pagination, collection, sidebar, toast }