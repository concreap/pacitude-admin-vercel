import { ChangeEvent, CSSProperties, KeyboardEvent, RefObject, MouseEvent, ReactElement, ReactNode, LazyExoticComponent, LegacyRef } from "react";
import { AudioAcceptType, ButtonType, CSVAcceptType, FileAcceptType, FilterType, FlexReverseType, FontWeightType, IconFamilyType, IconName, ImageAcceptType, LoadingType, NavItemType, PagesearchType, PDFAcceptType, PositionType, QueryOrderType, QuestionType, ResourceType, RouteActionType, RouteParamType, RubricType, SemanticType, SizeType, StatusType, UserType, VideoAcceptType } from "./types.util";
import User from "../models/User.model";
import Industry from "../models/Industry.model";
import Question, { IQuestionTime } from "../models/Question.model";

export interface ISetCookie {
    key: string,
    payload: any,
    expireAt?: Date,
    maxAge?: number,
    path?: string
}

export interface IGetCookie {
    key: string,
    parse?: boolean
}

export interface IRemoveCookie {
    key: string,
    parse?: boolean
}

export interface IRouteParam {
    type: RouteParamType,
    name: string,
    value?: string
}


export interface IRouteItem {
    name: string,
    title?: string,
    url: string,
    isAuth: boolean,
    iconName?: string,
    action?: RouteActionType,
    content: {
        backButton?: boolean,
        sidebar?: boolean
    }
    params?: Array<IRouteParam>
}

export interface IInRoute extends IRouteItem {
    route: string,
    parent: string,
}

export interface IRoute extends IRouteItem {
    subroutes?: Array<IRouteItem>
    inroutes?: Array<IInRoute>
}

export interface INavItem {
    type: NavItemType,
    label: string,
    path?: string,
    active?: boolean,
    icon: {
        enable?: boolean,
        name: string,
        className?: string
    }
    onClick(e: MouseEvent<HTMLAnchorElement>): void
}

export interface INavDivider {
    type: NavItemType,
    show?: boolean
}

export interface IStorage {
    storeAuth(token: string, id: string): void,
    checkToken(): boolean,
    getToken(): string | null,
    checkUserID(): boolean,
    getUserID(): string,
    checkUserEmail(): boolean,
    getUserEmail(): string | null,
    getConfig(): any,
    getConfigWithBearer(): any,
    clearAuth(): void,
    keep(key: string, data: any): boolean,
    keepLegacy(key: string, data: any): boolean,
    fetch(key: string): any,
    fetchLegacy(key: string): any,
    deleteItem(key: string, legacy?: boolean): void,
    trimSpace(str: string): void,
    copyCode(code: string): void
}

export interface IDateToday {
    year: string,
    month: string,
    date: string,
    hour: string,
    minutes: string,
    seconds: string,
    ISO: string,
    dateTime: string | number
}

export interface IAudioHelper {
    progressBar: any,
    audioPlayer: any,
    progressCont: any,
    audioDuration: number | string,
    audioCurrentTime: number | string,
    audioId: string,
    playAudio(id: string): void,
    pauseAudio(id: string): void,
    muteAudio(id: string): void,
    unmuteAudio(id: string): void,
    getSeek(id: string): void,
    getSeekBar(id: string): void,
    getAudio(id: string, index: number): void,
    updateProgress(e: any): void,
    setProgress(e: any): void,
    initProgress(audioId: string): void,
    getDuration(meta: any): string | number;
    convertDuration(tm: any): string | number,
    convertTime(tm: any): string | number,
    formatTime(tm: any): { hours: number, minutes: number, seconds: number }
}

export interface IVideoHelper {
    duration: string | number,
    playVideo(id: string): void,
    pauseVideo(id: string): void,
    muteVideo(id: string): void,
    unmuteVideo(id: string): void,
    changeView(id: string): void
    seekVideo(id: string, barId: string, timeId: string): void,
    timeUpdate(id: string, barId: string, timeId: string): void,
    getDuration(id: string, timeId: string): string,
    setVolume(id: string, rid: string): void,
    seekProgress(id: string, barId: string, seekId: string): void,
    convertTime(tm: any): string,
    formatTime(tm: any): { hours: number, minutes: number, seconds: number }
}

export interface IVideoControls {
    videoId: string,
    volumeId: string,
    timeId: string,
    barId: string,
    seekId: string,
    play: boolean,
    expand: boolean,
    playPause(e: any, id: string): void,
    expandView(e: any): void
}

export interface IOverControls {
    videoId: string,
    play: boolean,
    plaux: boolean,
    type: string,
    audioName: string,
    index: number,
    playPause(e: any, id: string): void,
    playAudio(e: any, id: string, index: number): void
}

export interface IAudioControls {
    name: string,
    play: boolean,
    muted: boolean,
    source: string,
    index: number,
    expand: boolean,
    playPause(e: any, id: string, index: number): void,
    muteToggle(e: any, id: string): void
    expandView(e: any): void
}

export interface IHelper {
    init(type: string): void,
    scrollTo(id: string): void,
    scrollToTop(): void,
    addClass(id: string, cn: string): void,
    removeClass(id: string, cn: string): void,
    splitQueries(query: any, key: string): any,
    navOnScroll(data: { id: string, cn: string, limit?: number }): void,
    decodeBase64(data: string): { width: string, height: string, image: any },
    isEmpty(data: any, type: 'object' | 'array'): boolean,
    capitalize(val: string): string,
    sort(data: Array<any>): Array<any>,
    days(): Array<{ id: number, name: string, label: string }>
    months(): Array<{ id: number, name: string, label: string }>,
    random(size: number, isAlpha?: boolean): string,
    formatDate(date: any, type: 'basic' | 'datetime'): string,
    equalLength(id: string, childId: string, len?: number): void,
    setWidth(id: string, val: number): void,
    setHeight(id: string, val: number): void,
    isNAN(val: any): boolean,
    reposition(data: Array<any>, from: number, to: number): Array<any>
    splitByComma(data: string): Array<string>
    dateToday(date: string | Date): IDateToday,
    roundFloat(val: number): number,
    addElipsis(val: string, size: number): string,
    formatPhone(val: string, code: string): string,
    leadingZero(val: number): string,
    encodeCardNumber(num: string): string,
    monthsOfYear(val: string | number): string,
    readCountries(): Array<any>,
    sortData(data: Array<any>, filter: string): Array<any>,
    attachPhoneCode(code: string, phone: string, include: boolean): string,
    capitalizeWord(value: string): string,
    shrinkWordInString(value: string, ret: number): string,
    truncateText(text: string, max: number): string
    objectToArray(data: Object | any): Array<any>,
    displayBalance(value: number): string,
    parseInputNumber(value: string, type: 'number' | 'decimal'): number,
    toDecimal(value: number, places: number): number
    formatCurrency(currency: string): string,
    currentDate(): Date,
    getCurrentPage(data: IPagination): number;
    getInitials(value: string): string,
    splitGenTime(value: string): { value: string, handle: string },
    randomNum(min: number, max: number): number,
    canNext(data: IPagination): boolean,
    canPrev(data: IPagination): boolean

}

export interface IRoutil {
    computeAppRoute(route: IRoute): string,
    computePath(route: string): string,
    computeSubPath(route: IRoute, subroute: IRouteItem): string,
    computeInPath(inroute: IInRoute): string,
    inRoute(payload: { route: string, name: string, params?: Array<IRouteParam> }): string,
    resolveRouteParams(params: Array<IRouteParam>, stickTo: 'app' | 'page'): string
}

export interface IQuestionUtil {
    shortenRubric(question: Question, type: RubricType): string,
    rubricBadge(type: RubricType): SemanticType,
    formatTime(time: IQuestionTime): string,
}

export interface IICon {
    type: IconFamilyType,
    name: string,
    size?: number,
    position?: 'absolute' | 'relative',
    isActive?: boolean,
    clickable: boolean,
    url?: string,
    height?: number,
    className?: string,
    style?: CSSProperties
    onClick?(e: MouseEvent<HTMLAnchorElement>): void
}

export interface IPanelBox {
    title: string,
    animate?: boolean,
    width?: number,
    children?: React.ReactNode,
    onClose?(e: any): void,
    onOpen?(e: any): void
}

export interface ITextInput {
    ref?: LegacyRef<HTMLInputElement>,
    type: 'text' | 'email',
    readonly?: boolean,
    name?: string,
    id?: string
    defaultValue?: string,
    value?: string,
    size?: SizeType,
    className?: string,
    autoComplete?: boolean,
    placeholder?: string,
    showFocus?: boolean,
    isError?: boolean,
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onKeyUp?(e: KeyboardEvent<HTMLInputElement>): void
    onChange(e: ChangeEvent<HTMLInputElement>): void

}

export interface IPinInput {
    type: 'text' | 'password',
    readonly?: boolean,
    size?: SizeType,
    className?: string,
    showFocus?: boolean,
    length: number,
    isError?: boolean,
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onChange(pin: string): void

}

export interface IPasswordInput {
    ref?: RefObject<HTMLInputElement>
    readonly?: boolean,
    name?: string,
    id?: string
    defaultValue?: string,
    value?: string,
    size?: SizeType,
    className?: string,
    autoComplete?: boolean,
    placeholder?: string,
    showFocus?: boolean,
    isError?: boolean,
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onKeyUp?(e: KeyboardEvent<HTMLInputElement>): void
    onChange(e: ChangeEvent<HTMLInputElement>): void

}

export interface ISearchInput {
    readonly?: boolean,
    name?: string,
    id?: string
    defaultValue?: string,
    value?: string,
    size?: SizeType,
    className?: string,
    autoComplete?: boolean,
    placeholder?: string,
    showFocus?: boolean,
    isError?: boolean,
    hasResult?: boolean,
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onSearch(e: MouseEvent<HTMLAnchorElement>): void
    onChange(e: ChangeEvent<HTMLInputElement>): void
}

export interface ISelectInput {
    name?: string,
    id?: string
    defaultValue?: string,
    size?: SizeType,
    className?: string,
    selected?: string,
    placeholder: {
        value: string,
        enable?: boolean
    },
    showFocus?: boolean,
    readonly?: boolean,
    isError?: boolean,
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    options: Array<{
        name: string,
        value: any
    }>
    onSelect(e: ChangeEvent<HTMLSelectElement>): void
}

export interface ITextAreaInput {
    ref?: RefObject<HTMLTextAreaElement>
    readonly?: boolean,
    name?: string,
    id?: string
    defaultValue?: string,
    value?: string,
    size?: SizeType,
    className?: string,
    autoComplete?: boolean,
    placeholder?: string,
    showFocus?: boolean,
    isError?: boolean,
    rows?: number,
    cols?: number,
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onChange(e: ChangeEvent<HTMLTextAreaElement>): void

}

export interface IPhoneInput {
    ref?: RefObject<HTMLInputElement>,
    readonly?: boolean,
    name?: string,
    id?: string
    defaultValue?: string,
    value?: string,
    size?: SizeType,
    className?: string,
    autoComplete?: boolean,
    placeholder?: string,
    showFocus?: boolean,
    isError?: boolean,
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    dropdown: {
        className?: string,
        placeholder?: string,
        countryCode?: boolean
        contryName?: boolean,
        size?: string,
    }
    onSelect(data: any): void
    onChange(e: ChangeEvent<HTMLInputElement>): void

}

export interface ICountryInput {
    ref?: RefObject<HTMLInputElement>,
    readonly?: boolean,
    name?: string,
    id?: string
    defaultValue?: string,
    value?: string,
    size?: string,
    className?: string,
    autoComplete?: boolean,
    placeholder?: string,
    showFocus?: boolean,
    isError?: boolean,
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    dropdown: {
        countryCode?: boolean
        contryName?: boolean,
        size?: string,
    }
    onSelect(data: any): void

}

export interface INumberInput {
    ref?: RefObject<HTMLInputElement>,
    readonly?: boolean,
    name?: string,
    id?: string
    defaultValue?: string,
    value?: string,
    size?: SizeType,
    className?: string,
    autoComplete?: boolean,
    placeholder?: string,
    showFocus?: boolean,
    isError?: boolean,
    min?: string | number,
    max?: string | number,
    step?: string,
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    }
    onChange(e: ChangeEvent<HTMLInputElement>): void

}

export interface IFileInput {
    ref?: RefObject<HTMLInputElement>
    readonly?: boolean,
    name?: string,
    id?: string
    defaultValue?: string,
    value?: string,
    size?: SizeType,
    className?: string,
    autoComplete?: boolean,
    placeholder?: string,
    showFocus?: boolean,
    isError?: boolean,
    file: {
        name: string,
        type: string,
        accept?: 'image' | 'file' | 'csv' | 'pdf' | 'zip'
    }
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onChange(e: ChangeEvent<HTMLInputElement>, type: string): void

}

export interface IDropSelect {
    placeholder: string,
    options: any,
    onChange: any,
    focus: boolean,
    className: string,
    controlClassName: string
    isDisabled: boolean,
    defaultValue: any,
    controlDisplayImage: boolean,
    optionDisplayImage: boolean,
    controlDisplayLabel: boolean,
    optionDisplayLabel: boolean,
    controlDisplayLeft: boolean,
    disableSeparator: boolean | undefined,
    menuPosition: string,
    isSearchable: boolean,
    optionDisplayLeft: boolean,
    menuBackground: string,
    menuStyle: CSSProperties,
    menuClassName: string,
    searchBackground: string,
    searchColor: string,
    optionColor: string
}

export interface IDropSelectState {
    options: Array<any>,
    selected: {
        value: string,
        label: string,
        left: string,
        image: string,
    },
    isOpen: boolean,
    placeholder: string | undefined
}

export interface IDropdown {
    options: any,
    className: string,
    selected: any,
    defaultValue: any,
    placeholder: string,
    disabled: boolean,
    size: SizeType,
    control: {
        left: boolean,
        label: boolean,
        image: boolean,
        className?: string
    },
    menu: {
        bgColor: string,
        position: string,
        itemColor: string,
        itemLeft: boolean,
        itemLabel: boolean,
        style?: CSSProperties,
        className?: string
    },
    search: {
        enable: boolean,
        bgColor: string,
        color: string
    }
}

export interface IDateInput {
    name?: string,
    id?: string
    defaultValue?: Date,
    size?: SizeType,
    className?: string,
    selected?: boolean,
    position?: 'top' | 'bottom',
    isError?: boolean,
    placeholder: {
        value: string,
        enable?: boolean
    },
    showFocus?: boolean,
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onChange(date: Date): void
}

export interface IButton {
    id?: string,
    text: string,
    type?: ButtonType,
    semantic?: SemanticType,
    size?: SizeType
    loading?: boolean,
    disabled?: boolean,
    block?: boolean,
    className?: string,
    fontSize?: number,
    fontWeight?: FontWeightType,
    lineHeight?: number,
    reverse?: FlexReverseType,
    style?: CSSProperties,
    icon?: {
        enable?: boolean,
        name?: string,
        size?: number,
        style?: CSSProperties
        loaderColor?: string,
        type?: IconFamilyType
    },
    onClick(e: MouseEvent<HTMLAnchorElement>): void
}

export interface ILinkButton {
    id?: string,
    text: string,
    color?: string,
    weight?: string,
    size?: SizeType
    loading?: boolean,
    disabled?: boolean,
    className?: string,
    lineHeight?: number,
    newtab?: boolean,
    icon?: {
        enable?: boolean,
        name?: string,
        size?: number,
        style?: CSSProperties
    },
    url?: string,
    onClick?(e: MouseEvent<HTMLAnchorElement>): void
}

export interface IFilter {
    readonly?: boolean,
    name?: string,
    id?: string
    defaultValue?: string,
    size?: SizeType,
    className?: string,
    placeholder?: string,
    showFocus?: boolean,
    isError?: boolean,
    position?: PositionType,
    noFilter?: boolean,
    disabled?: boolean,
    icon?: {
        type: IconFamilyType,
        name: string,
        style?: CSSProperties
    }
    items: Array<IFilterItem>,
    onChange(item: ISelectedFilter): void
}

export interface IFilterItem {
    label: string,
    value: any,
    subitems?: Array<{
        label: string,
        value: any
    }>
}

export interface ISelectedFilter {
    label: string,
    value: any,
    item?: IFilterItem
}

export interface IPopout {
    ref?: RefObject<HTMLInputElement>
    readonly?: boolean,
    name?: string,
    id?: string
    defaultValue?: string,
    className?: string,
    position?: PositionType,
    items: Array<IPopoutItem>,
}

export interface IPopoutItem {
    label: string,
    value: any,
    disabled?: boolean,
    className?: string,
    icon?: {
        type: IconFamilyType,
        name: string,
        size?: number
    }
    onClick(e: MouseEvent<HTMLAnchorElement>): void
}

export interface IAlert {
    type: SemanticType,
    show: boolean,
    className?: string,
    message?: string,
    dismiss?: boolean,
}

export interface IToast {
    show: boolean,
    title?: string,
    message: string,
    type: SemanticType,
    position: PositionType,
    close(e: MouseEvent<HTMLAnchorElement>): void,
}

export interface IToastState {
    show: boolean,
    title?: string,
    message: string,
    type: SemanticType,
    position: PositionType
}

export interface ICustomModal {
    show: boolean,
    slim: string,
    title: string,
    stretch?: boolean,
    flattened?: boolean,
    className?: string,
    size?: SizeType,
    children: {
        child?: ReactElement
        main: ReactElement
    }
    closeModal(e?: any): void
}

export interface IModalProps {
    show: boolean,
    slim: string,
    title: string,
    stretch?: boolean,
    flattened?: boolean,
    className?: string,
    size?: SizeType,
    closeModal(e?: any): void
}


export interface IMessageCompProps {
    title: string,
    message: string,
    action: any,
    status: string,
    actionType: string,
    buttonText: string,
    setBg: boolean,
    bgColor: string,
    buttonPosition: string,
    icon: string,
    slim: boolean,
    slimer: boolean,
    className: string,
    displayTitle: boolean,
    displayMessage: string,
    titleColor: string,
    messageColor: string,
    buttonContainerWidth: string,
    messageWidth: string,
    msgColor: string,
    msgSize: string,
    titleSize: string,
    cardSize: string
}

export interface IForgotPasswordModal extends IModalProps {

}

export interface IRoundButton {
    icon: ReactElement
    className?: string,
    clickable?: boolean,
    size?: SizeType,
    style?: CSSProperties,
    onClick?(e: MouseEvent<HTMLAnchorElement>): void
}

export interface IFileUpload {
    raw: any,
    base64: string,
    parsedSize: number,
    name: string,
    size: number,
    type: string,
    dur: number
}

export interface IFileog {
    sizeLimit?: number,
    accept: Array<CSVAcceptType> | Array<ImageAcceptType> | Array<PDFAcceptType> | Array<VideoAcceptType> | Array<AudioAcceptType>,
    type: FileAcceptType,
    onSelect(file: IFileUpload): void
}

export interface IListQuery {
    limit?: number,
    page?: number,
    select?: string,
    order?: QueryOrderType,
    type?: string,
    admin?: boolean,
    mapped?: boolean,
    from?: string,
    to?: string,
    resource?: ResourceType,
    resourceId?: string,
    key?: string,
    payload?: any
}

export interface IMetricQuery {
    metric: 'overview' | 'resource',
    type: FilterType,
    startDate?: string,
    endDate?: string,
    resource?: FilterType,
    resourceId?: string,
    levels?: Array<string>,
    difficulties?: Array<string>,
    questionTypes?: Array<string>
}

export interface IListUI {
    type: 'self' | 'resource',
    resource?: ResourceType
    resourceId?: string,
    headers?: Array<{ label: string, style?: CSSProperties }>,
    rows?: Array<IListUIRow>

}

export interface IListUIRow {
    option: 'status' | 'data',
    resource: ResourceType,
    type?: StatusType,
    data: any,
    callback?(data: any): void
}

export interface IUserPermission {
    entity: string,
    actions: Array<string>
}

export interface IAPIKey {
    secret: string,
    public: string,
    token: string,
    publicToken: string,
    domain: string,
    isActive: boolean,
    updatedAt: string
}

export interface IPagination {
    next: { page: number, limit: number },
    prev: { page: number, limit: number },
}

export interface IDashboardMaster {
    component: ReactNode,
    title: string,
    back: boolean,
    sidebar: {
        collapsed: boolean
    }
}

export interface IAPIResponse {
    error: boolean,
    errors: Array<any>,
    count?: number,
    total?: number,
    pagination?: IPagination,
    data: any,
    message: string,
    token?: string,
    status: number
}

export interface ISidebar {
    pageTitle: string,
    collapsed: boolean
}

export interface ISidebarAttrs {
    collapsed: boolean,
    route: IRouteItem,
    subroutes: Array<IRouteItem>,
    isOpen: boolean
}

export interface ITopbar {
    pageTitle: string,
    showBack: boolean
}

export interface ISetLoading {
    option: LoadingType,
    type?: string
}

export interface IUnsetLoading {
    option: LoadingType,
    type?: string,
    message: string
}

export interface IFileUpload {
    raw: any,
    base64: string,
    parsedSize: number,
    name: string,
    size: number,
    type: string,
    dur: number
}

export interface IEmptyState {
    children: any,
    bgColor?: string,
    size: SizeType,
    className?: string,
    bound?: boolean
}
export interface ITableHead {
    className?: string,
    items: Array<ICellHead>
}
export interface ICellHead {
    fontSize?: number,
    className?: string,
    label: string,
    style?: CSSProperties
}
export interface ICellData {
    fontSize?: number,
    className?: string,
    status?: {
        enable: boolean,
        type: StatusType,
        value: boolean | string,
    },
    render: any,
    onClick?(e: MouseEvent<any>): void
}
export interface IBadge {
    type: SemanticType,
    label: string
    className?: string,
    style?: CSSProperties,
    size?: SizeType,
    close?: boolean,
    onClose?(e: any): void
}

export interface IGeneratedQuestion {
    body: string,
    answers: Array<IGenAnswer>,
    correct: string,
    level: string,
    score: string,
    time: string
    difficulty: string,
    type: string
}

export interface IGenAnswer {
    alphabet: string,
    answer: string
}

export interface IAIQuestion {
    code: string,
    body: string,
    answers: Array<IGenAnswer>,
    correct: string,
    levels: Array<string>,
    score: string,
    time: {
        value: string,
        handle: string,
    },
    difficulties: Array<string>,
    types: Array<string>,
    fields: Array<{ name: string, id: string }>,
}

export interface IAddQuestion {
    body: string,
    answers: Array<{
        alphabet: string,
        body: string
    }>,
    correct: string,
    levels: Array<string>,
    score: string,
    time: {
        value: string,
        handle: string,
    },
    difficulties: Array<string>,
    types: Array<string>,
    fields: Array<string>,
}

export interface IPlaceholder {
    className: string,
    height: string,
    bgColor: string,
    width: string,
    minWidth: string,
    minHeight: string,
    animate: boolean,
    radius: string | number,
    marginTop: string
    marginBottom: string,
    top: string
    left: string
    right: string,
    flex: boolean
}

export interface IPageSearch {
    key: string,
    hasResult: boolean,
    type: PagesearchType,
    filters: any,
    resource: FilterType,
    resourceId: string
}

// contexts

export interface ICoreMetrics {
    loading: boolean,
    message: string,
    type: FilterType,
    resource?: FilterType,
    question?: {
        total: number,
        enabled: number,
        disabled: number,
        resource: {
            total: number,
            enabled: number,
            disabled: number,
        }
    }
}

export interface IClearResource {
    type: string,
    resource: 'multiple' | 'single'
}

export interface ICollection {
    data: Array<any>,
    count: number,
    total: number,
    pagination: IPagination,
    loading: boolean,
    message?: string
}

export interface IUserContext {
    audits: ICollection,
    users: ICollection,
    admins: ICollection,
    user: User,
    userDetails: User,
    userType: UserType,
    isSuper: boolean,
    isAdmin: boolean,
    loading: boolean,
    total: number,
    count: number,
    pagination: any,
    response: any,
    sidebar: ISidebarAttrs
    getAudits(data: IListQuery): void,
    getUser(id: string): void,
    getUsers(limit: number, page: number): void,
    getUserDetails(id: string): void
    setUserType(n: string): void,
    setSidebar(data: ISidebarAttrs): void,
    currentSidebar(collapse: boolean): ISidebarAttrs | null,
    getUserType(): string,
    setUser(data: any): void,
    unsetLoading(): void,
    isLoggedIn(): void,
    setResponse(data: any): void
}

export interface IGeniusContext {
    industries: ICollection,
    industry: Industry,
    careers: ICollection,
    career: Industry,
    fields: ICollection,
    field: Industry,
    skills: ICollection,
    skill: any,
    questions: ICollection,
    question: any,
    topics: ICollection,
    topic: any,
    message: string,
    loading: boolean,
    total: number,
    count: number,
    pagination: any,
    getIndustries(data: IListQuery): Promise<void>,
    getCareers(data: IListQuery): Promise<void>,
    getFields(data: IListQuery): Promise<void>,
    getSkills(data: IListQuery): Promise<void>,
    getQuestions(data: IListQuery): Promise<void>,
    getTopics(data: IListQuery): Promise<void>,
    getTopic(id: string): Promise<void>,
    setLoading(data: ISetLoading): Promise<void>,
    unsetLoading(data: IUnsetLoading): Promise<void>,
}

export interface ICoreContext {
    industries: ICollection,
    industry: Industry,
    careers: ICollection,
    career: Industry,
    fields: ICollection,
    field: Industry,
    skills: ICollection,
    skill: any,
    questions: ICollection,
    question: Question,
    aiQuestions: Array<IAIQuestion>,
    topics: ICollection,
    topic: any,
    search: ICollection,
    metrics: ICoreMetrics,
    items: Array<any>
    message: string,
    loading: boolean,
    total: number,
    count: number,
    pagination: any,
    getIndustries(data: IListQuery): Promise<void>,
    getIndustry(id: string): Promise<void>,
    getCareers(data: IListQuery): Promise<void>,
    getFields(data: IListQuery): Promise<void>,
    getField(id: string): Promise<void>,
    getSkills(data: IListQuery): Promise<void>,
    getQuestions(data: IListQuery): Promise<void>,
    getQuestion(id: string): Promise<void>,
    getTopics(data: IListQuery): Promise<void>,
    getTopic(id: string): Promise<void>,
    setAIQuestions(data: Array<IAIQuestion>): void,
    clearResource(data: IClearResource): void,
    setItems(data: Array<any>): void,
    getResourceQuestions(data: IListQuery): Promise<void>,
    getResourceMetrics(data: IMetricQuery): Promise<void>,
    setResourceMetrics(data: ICoreMetrics): Promise<void>
    searchResource(data: IListQuery): Promise<void>,
    filterResource(data: IListQuery): Promise<void>,
    clearSearch(): void,
    setLoading(data: ISetLoading): void,
    unsetLoading(data: IUnsetLoading): void,
}

export interface IResourceContext {
    countries: Array<any>,
    country: any,
    toast: IToastState,
    loading: boolean,
    setToast(data: IToastState): void,
    clearToast(): void,
    getCountries(): Promise<void>
}