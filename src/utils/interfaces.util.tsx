import { ChangeEvent, CSSProperties, KeyboardEvent, RefObject, MouseEvent, ReactElement, ReactNode, LazyExoticComponent, LegacyRef } from "react";
import { AudioAcceptType, ButtonType, CSVAcceptType, DisabledType, FileAcceptType, FilterType, FlexReverseType, FontWeightType, FormatDateType, IconFamilyType, IconName, ImageAcceptType, ListUIType, LoadingType, NavItemType, PagesearchType, PDFAcceptType, PositionType, QueryOrderType, QuestionType, RefineType, ResourceType, RouteActionType, RouteParamType, RubricType, SemanticType, SizeType, StatusType, UserType, VideoAcceptType } from "./types.util";
import User from "../models/User.model";
import Industry from "../models/Industry.model";
import Question, { IQuestionCount, IQuestionTime } from "../models/Question.model";
import Career from "../models/Career.model";
import Field from "../models/Field.model";
import Skill from "../models/Skill.model";
import Topic from "../models/Topic.model";
import Talent from "../models/Talent.model";

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
        collapsed?: boolean
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

export interface IState {
    code: string,
    name: string,
    subdivision: string
}

export interface ITimezone {
    name: string,
    label: string,
    displayName: string,
    countries: Array<string>,
    utcOffset: string,
    utcOffsetStr: string,
    dstOffset: string,
    dstOffsetStr: string,
    aliasOf: string
}

export interface IUserCountry {
    name: string;
    code2: string;
    code3: string;
    capital: string;
    region: string;
    currencyCode: string;
    phoneCode: string;
    timezones: Array<ITimezone>;
}

export interface ICountry {
    name: string
    code2: string,
    code3: string,
    capital: string,
    region: string,
    subregion: string,
    states: Array<IState>,
    slug: string,
    timezones: Array<ITimezone>
    flag: string,
    base64: string,
    currencyCode: string,
    currencyImage: string,
    phoneCode: string

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
    formatDate(date: any, type: FormatDateType): string,
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
    listCountries(): Array<{ code: string, name: string, phone: string }>
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
    hyphenate(action: 'add' | 'remove', val: string): string,
    daysFromDates(start: string, end: string): number,
    getCountry(code: string): ICountry | null,
    getAvatar(select: string | number): string,
    enumToArray(data: Object, type: 'all' | 'values-only' | 'keys-only'): Array<any>,
    extractor(data: any): any

}

export interface IRoutil {
    computeAppRoute(route: IRoute): string,
    computePath(route: string): string,
    computeSubPath(route: IRoute, subroute: IRouteItem): string,
    computeInPath(inroute: IInRoute): string,
    inRoute(payload: { route: string, name: string, params?: Array<IRouteParam> }): string,
    resolveRouteParams(params: Array<IRouteParam>, stickTo: 'app' | 'page'): string
}

export interface IQuestionHelper {
    shortenRubric(question: Question, type: RubricType): string,
    rubricBadge(type: RubricType): SemanticType,
    formatTime(time: IQuestionTime): string,
    splitGenTime(value: string): { value: string, handle: string },
}

export interface IICon {
    type: IconFamilyType,
    name: string,
    size?: number,
    position?: 'absolute' | 'relative',
    clickable?: boolean,
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
    clear?: boolean,
    icon?: {
        enable: boolean,
        position: PositionType
        child: ReactNode,
        onClick?(e: any): void
    },
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onFocus?(e: any): void,
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
    disabled?: boolean
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    icon?: {
        enable: boolean,
        position: PositionType
        child: ReactNode,
        onClick?(e: any): void
    },
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
    disabled?: boolean
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onFocus?(e: any): void,
    onChange(e: ChangeEvent<HTMLInputElement>): void
    onSearch(e: MouseEvent<HTMLAnchorElement>): void
}

export interface ISelectInput {
    readonly?: boolean,
    name?: string,
    id?: string
    selected?: string,
    size?: SizeType,
    className?: string,
    showFocus?: boolean,
    isError?: boolean,
    placeholder: {
        value: string,
        enable?: boolean
    },
    options: Array<{
        name: string,
        value: any
    }>
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onSelect(e: ChangeEvent<HTMLSelectElement>): void
}

export interface ITextAreaInput {
    rows?: number,
    cols?: number,
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
    clear?: boolean,
    icon?: {
        enable: boolean,
        position: PositionType
        child: ReactNode,
        onClick?(e: any): void
    },
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onFocus?(e: any): void,
    onKeyUp?(e: KeyboardEvent<HTMLTextAreaElement>): void
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
    icon?: {
        enable: boolean,
        position: PositionType
        child: ReactNode,
        onClick?(e: any): void
    },
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    onChange(e: ChangeEvent<HTMLInputElement>): void

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
        type?: any,
        name?: string,
        style?: CSSProperties,
        child?: ReactNode
    }
    menu?: {
        style?: CSSProperties,
        search?: boolean,
        className?: string,
        fullWidth?: boolean,
        limitHeight?: SizeType,
    }
    items: Array<IFilterItem>,
    onChange(item: IFilterItem): void
}

export interface IFilterItem {
    label: string,
    value: string,
    image?: string,
    check?: {
        enable: boolean
    }
}

export interface ISearchFilter {
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
        type?: any,
        name?: string,
        style?: CSSProperties,
        child?: ReactNode
    }
    menu?: {
        style?: CSSProperties,
        search?: boolean,
        className?: string,
        fullWidth?: boolean,
        limitHeight?: SizeType,
    }
    items: Array<ISearchFilterItem>,
    onChange(item: ISearchFilterItem): void
}
export interface ISearchFilterItem {
    label: string,
    value: string,
    image?: string,
    check?: {
        enable: boolean
    }
}

export interface ICheckbox {
    readonly?: boolean,
    name?: string,
    id?: string
    checked?: boolean,
    className?: string,
    size?: SizeType,
    style?: CSSProperties,
    wraper?: {
        className?: string
    }
    label?: {
        title: string,
        className?: string,
        fontSize?: string,
        fontWeight?: FontWeightType
    },
    onChange(e: ChangeEvent<HTMLInputElement>): void

}

export interface IFileInput {
    name?: string,
    id?: string
    value?: string,
    size?: SizeType,
    className?: string,
    autoComplete?: boolean,
    placeholder?: string,
    showFocus?: boolean,
    isError?: boolean,
    disabled?: boolean
    accept?: FileAcceptType
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
    icon?: {
        enable: boolean,
        position: PositionType
        child: ReactNode,
        onClick?(e: any): void
    },
    onChange(file: IFileUpload | null): void

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
    position?: PositionType,
    isError?: boolean,
    time?: {
        enable: boolean,
        default?: Date
    }
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
    onChange(calendar: ICalendar): void
}

export interface ICalendar {
    date: string,
    time: string,
    data: {
        date: Date,
        time: ITimeProps
    },
}

export interface ITimeProps {
    hour: string,
    min: string,
    sec: string,
    ampm: string
}

export interface ILinkButton {
    text: {
        label: string,
        className?: string,
        weight?: FontWeightType,
        color?: string
    },
    url?: string,
    icon?: {
        enable?: boolean,
        child?: ReactNode
    }
    loading?: boolean,
    disabled?: boolean,
    className?: string
    onClick(e: MouseEvent<HTMLAnchorElement>): void
}

export interface IIconButton {
    icon: {
        size?: number,
        className?: string,
        name: string,
        type: IconFamilyType
        child?: ReactNode
    },
    label?: {
        text: string,
        className?: string,
        size?: number,
        weight?: FontWeightType,
    }
    active?: boolean,
    url?: string,
    size?: string,
    className?: string,
    radius?: string,
    onClick(e?: any): void
}

export interface IButton {
    id?: string,
    text: {
        label: string,
        size?: number,
        weight?: FontWeightType,
    },
    type?: ButtonType,
    url?: string,
    semantic?: SemanticType,
    size?: SizeType
    fill?: boolean,
    loading?: boolean,
    disabled?: boolean,
    disabledType?: DisabledType,
    block?: boolean,
    className?: string,
    reverse?: FlexReverseType,
    style?: CSSProperties,
    icon?: {
        enable: boolean,
        className?: string,
        child: ReactNode
    },
    onClick(e: MouseEvent<HTMLAnchorElement>): void
}

export interface ISelectedFilter {
    label: string,
    value: any,
    item?: IFilterItem
}

export interface IPopout {
    defaultValue?: string,
    className?: string,
    showFocus?: boolean,
    isError?: boolean,
    position?: PositionType,
    noFilter?: boolean,
    disabled?: boolean,
    menu?: {
        style?: CSSProperties,
        search?: boolean,
        className?: string,
        fullWidth?: boolean,
        limitHeight?: SizeType,
    }
    items: Array<IPopoutItem>,
}

export interface IPopoutItem {
    label: string,
    value: string,
    image?: string,
    disabled?: boolean,
    className?: string,
    icon?: {
        type: IconFamilyType,
        name: string,
        size?: number
    }
    check?: {
        enable: boolean
    }
    onClick(e: MouseEvent<HTMLAnchorElement>, item: IPopoutItem): void
}

export interface IAlert {
    name: string,
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
    close(e?: MouseEvent<HTMLAnchorElement>): void,
}

export interface IToast {
    show: boolean,
    title?: string,
    message: string,
    type: SemanticType,
    position: PositionType
}

export interface ICustomModal {
    show: boolean,
    title: string,
    header?: boolean,
    flattened?: boolean,
    className?: string,
    size?: SizeType,
    child?: ReactNode,
    children: ReactNode,
    hideOnClose?: boolean,
    backdrop?: {
        bgColor?: ''
    }
    closeModal(e?: any): void
}

export interface IModalProps {
    show: boolean,
    header?: boolean,
    title: string,
    flattened?: boolean,
    className?: string,
    size?: SizeType,
    closeModal(e?: any): void
}

export interface IDeleteModal extends IModalProps {
    resource: ResourceType,
    resourceId: string
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
    sizeExt: string,
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
    paginate?: string,
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
    payload?: any,
    report?: boolean
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

export interface IListUI {
    type: ListUIType,
    resource?: ResourceType
    resourceId?: string,
    subsource?: ResourceType
    headers?: Array<{ label: string, style?: CSSProperties }>,
    rows?: Array<IListUIRow>

}

export interface IAPIReport {
    format: string,
    csv?: string,
    xml?: any,
    pdf?: any
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

export interface IToastState {
    show: boolean,
    title?: string,
    error?: string,
    message: string,
    type: SemanticType,
    position: PositionType
}

export interface IPagination {
    next: { page: number, limit: number },
    prev: { page: number, limit: number },
}

export interface IDashboardLayout {
    component: any,
    title: string,
    back: boolean,
    sidebar: {
        collapsed: boolean
    }
}

export interface IAPIResponse {
    error: boolean,
    errors: Array<any>,
    report?: IAPIReport
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

export interface ISidebarProps {
    collapsed: boolean,
    route: IRouteItem,
    inroutes: Array<IInRoute>,
    subroutes: Array<IRouteItem>,
    isOpen: boolean
}

export interface ITopbar {
    pageTitle: string,
    sticky?: boolean,
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
    large?: boolean,
    style?: CSSProperties,
    children: ReactNode,
    onClick?(e: MouseEvent<any>): void
}
export interface IBadge {
    type: SemanticType,
    label: string
    display?: 'badge' | 'status',
    className?: string,
    style?: CSSProperties,
    size?: SizeType,
    padding?: { y: number, x: number }
    font?: {
        weight: FontWeightType,
        size: number
    }
    upper?: boolean
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
    skills: Array<{ name: string, id: string }>,
    topics: Array<{ name: string, id: string }>,
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
    skills: Array<string>,
    topics: Array<string>,
}

export interface IAnswer {
    code: string,
    alphabet: string,
    body: string,
}

export interface IQuestionOption {
    answer: IAnswer,
    type: 'option' | 'selected',
    isActive?: boolean,
    disabled?: boolean
    onClick?(answer: IAnswer): void
}

export interface IDivider {
    show?: boolean,
    bg?: string,
    padding?: {
        enable?: boolean,
        top?: string,
        bottom?: string
    }
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
    refine?: RefineType,
    payload?: any,
    type: PagesearchType,
    filters?: any,
    resource?: ResourceType,
    resourceId?: string
}

// contexts

export interface IAppMetrics {
    loading: boolean,
    message: string,
    type: ResourceType,
    resource?: ResourceType,
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
    report?: IAPIReport
    count: number,
    total: number,
    pagination: IPagination,
    loading: boolean,
    refineType?: RefineType,
    message?: string,
    payload?: any
}

export interface ICoreResource {
    industries: Array<Industry>,
    careers: Array<Career>,
    fields: Array<Field>,
    skills: Array<Skill>,
    topics: Array<Topic>
}

export interface IUserContext {
    users: ICollection,
    user: User,
    talents: ICollection,
    talent: Talent,
    userType: string,
    items: Array<any>,
    loading: boolean,
    loader: boolean,
    sidebar: ISidebarProps,
    toast: IToastState,
    setToast(data: IToastState): void,
    clearToast(): void,
    setSidebar(data: ISidebarProps): void,
    currentSidebar(collapse: boolean): ISidebarProps | null,
    setUserType(type: string): void,
    setCollection(type: string, data: ICollection): void,
    setResource(type: string, data: any): void
    setLoading(data: ISetLoading): void,
    unsetLoading(data: IUnsetLoading): void,
}

export interface IAppContext {
    industries: ICollection,
    industry: Industry,
    careers: ICollection,
    career: Career,
    fields: ICollection,
    field: Field,
    skills: ICollection,
    skill: Skill,
    questions: ICollection,
    question: Question,
    questionCount: Array<IQuestionCount>
    aiQuestions: Array<IAIQuestion>,
    topics: ICollection,
    topic: Topic,
    search: ICollection,
    metrics: IAppMetrics,
    items: Array<any>
    core: ICoreResource
    message: string,
    loading: boolean,
    loader: boolean,
    clearResource(data: IClearResource): void,
    setCollection(type: string, data: ICollection): void,
    setResource(type: string, data: any): void
    setLoading(data: ISetLoading): void,
    unsetLoading(data: IUnsetLoading): void,
}