import React, { useEffect, useState, useRef, Fragment, MouseEvent, CSSProperties } from "react"
import moment from 'moment'

enum CalBodyView {
    WEEK_DAYS = 'week-days',
    MONTH_YEAR = 'month-year',
    TIME_SLOT = 'time-slot'
}
enum NavActionType {
    MONTH = 'nav-month',
    YEAR = 'nav-year'
}
interface ITimeProps {
    hour: string,
    min: string,
    sec: string,
    ampm: string
}

type PositionType = 'default' | 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'right'

export interface ICalendar {
    date: string,
    time: string,
    data: {
        date: Date,
        time: ITimeProps
    },
}

interface IWebfixCalendar {
    id?: string,
    date?: Date | string,
    onetap?: boolean,
    separator?: '/' | '-',
    placeholder?: string,
    format?: string,
    future?: boolean,
    position?: PositionType,
    time?: {
        enable: boolean,
        default?: Date
    },
    display?: {
        className?: string,
        style?: CSSProperties,
        editable?: boolean,
        reveal?: boolean,
        name?: string,
    }
    calendar?: {
        className?: string,
        style?: CSSProperties,
    }
    onChange(calendar: ICalendar): void
}

const random = (size: number = 6, isAlpha?: boolean) => {

    const pool = isAlpha ? 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789abcdefghijklmnpqrstuvwxyz' : '0123456789';
    const rand = []; let i = -1;

    while (++i < size) rand.push(pool.charAt(Math.floor(Math.random() * pool.length)));

    return rand.join('');

}

const days = () => {

    return [
        { id: 0, name: 'sunday', label: 'su' },
        { id: 1, name: 'monday', label: 'mo' },
        { id: 2, name: 'tuesday', label: 'tu' },
        { id: 3, name: 'wednesday', label: 'we' },
        { id: 4, name: 'thursday', label: 'th' },
        { id: 5, name: 'friday', label: 'fr' },
        { id: 6, name: 'saturday', label: 'sa' }
    ]

}

const months = () => {

    return [
        { id: 0, name: 'january', label: 'jan' },
        { id: 1, name: 'february', label: 'feb' },
        { id: 2, name: 'march', label: 'mar' },
        { id: 3, name: 'april', label: 'apr' },
        { id: 4, name: 'may', label: 'may' },
        { id: 5, name: 'june', label: 'jun' },
        { id: 6, name: 'july', label: 'jul' },
        { id: 7, name: 'august', label: 'aug' },
        { id: 8, name: 'september', label: 'sept' },
        { id: 9, name: 'october', label: 'oct' },
        { id: 10, name: 'november', label: 'nov' },
        { id: 11, name: 'december', label: 'dec' },
    ]

}

const WebfixCalendar = (props: IWebfixCalendar) => {

    // props
    const {
        id = random(6, true),
        date = new Date(),
        onetap = true,
        separator = '/',
        placeholder = 'Select Date',
        format = 'date',
        position = 'default',
        future = false,
        time = {
            enable: false,
            default: ''
        },
        display = { editable: true, reveal: true },
        calendar = {},
        onChange
    } = props;

    const daysOfweek = days();
    const monthsOfYear = months()
    const currentDate = date ? new Date(date) : new Date();
    const calRef = useRef<any>(null)
    const hourRef = useRef<any>(null)
    const minRef = useRef<any>(null)
    const secRef = useRef<any>(null)

    const [calBodyView, setCalBodyView] = useState<string>(CalBodyView.WEEK_DAYS)
    const [navFrom, setNavFrom] = useState<string>(CalBodyView.WEEK_DAYS);
    const [reveal, setReveal] = useState<boolean>(false);

    const [selectedDate, setSelectedDate] = useState<Date | null>(date ? new Date(date) : null)
    const [currentMonth, setCurrentMonth] = useState<any>(currentDate.getMonth())
    const [currentYear, setCurrentYear] = useState<any>(currentDate.getFullYear())
    const [currentDay, setCurrentDay] = useState<any>(currentDate.getDate())
    const [currenTime, setCurrentTime] = useState({ hour: '', min: '', sec: '', ampm: 'AM' })

    const daysInMonth = new Date(currentYear, (currentMonth + 1), 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [calPosition, setCalPosition] = useState({ top: '', left: '', right: '', bottom: '' })

    useEffect(() => {

        setPosition();
        setCurrentTime({
            ...currenTime,
            hour: formatTime(currentDate).hour,
            min: formatTime(currentDate).min,
            sec: formatTime(currentDate).sec,
            ampm: formatTime(currentDate).ampm
        })

        if (time.enable === false) {
            setCalBodyView(CalBodyView.WEEK_DAYS)
        }

    }, [])

    useEffect(() => {
        if (display.reveal !== undefined && display.reveal == true) {
            setReveal(true)
        }
    }, [display])

    // control the time handles to scroll into view
    useEffect(() => {

        if (calBodyView === CalBodyView.TIME_SLOT) {

            if (hourRef.current) {

                hourRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                })
            }

            if (minRef.current) {

                minRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                })
            }

            if (secRef.current) {

                secRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                })
            }

        }

    }, [calBodyView])

    // control click outside
    useEffect(() => {

        const handlerOut = (e: any) => {

            if (!calRef.current) {
                return
            }

            if (!calRef.current.contains(e.target)) {
                setIsOpen(false)
            }

        }

        window.addEventListener('mousedown', handlerOut, true)

        return () => {
            window.removeEventListener('mousedown', handlerOut)
        }

    }, [])

    // reset params once calendar is opened
    useEffect(() => {

        if (isOpen) {
            setCalBodyView(CalBodyView.WEEK_DAYS)
        }

    }, [isOpen])

    // control returned date based on changes
    useEffect(() => {

        const _nd = new Date(convertDateTime());

        if (onetap === true) {
            onChange({ 
                date: convertDate(), 
                time: convertTime(),
                data: {
                    date: _nd,
                    time: getCurrentTime()
                }
            });
        }


    }, [selectedDate, currentYear, currentMonth, currentDay, currenTime])


    // generic functions
    const leadingZero = (val: number): string => {
        let result: string = '';

        if (val >= 0 && val < 10) {
            result = `0${val}`
        } else {
            result = val.toString()
        }

        return result;
    }

    const setPosition = () => {

        if (position === 'default' || position === 'bottom') {
            setCalPosition({
                ...calPosition,
                top: '', left: '', right: '', bottom: ''
            })
        }

        if (position === 'top') {
            setCalPosition({
                ...calPosition,
                top: '-721%', left: '', right: '', bottom: ''
            })
        }

        if (position === 'left') {
            setCalPosition({
                ...calPosition,
                top: '-300%', left: '-91%', right: '', bottom: ''
            })
        }

        if (position === 'right') {
            setCalPosition({
                ...calPosition,
                top: '-300%', right: '-91%', left: '', bottom: ''
            })
        }

        if (position === 'bottom-right') {
            setCalPosition({
                ...calPosition,
                top: '98%', right: '0', left: '', bottom: ''
            })
        }

        if (position === 'bottom-left') {
            setCalPosition({
                ...calPosition,
                top: '98%', right: '', left: '0', bottom: ''
            })
        }

    }

    const capitalize = (val: string) => {
        return val.charAt(0).toUpperCase() + val.slice(1)
    }

    const isSameDay = (d1: Date, d2: Date) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        )

    }

    const isToday = (day: number) => {

        let isEqual = (day + 1) === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();
        return isEqual;

    }

    const isSelected = (day: number) => {

        let isEqual: boolean = false;

        if (selectedDate) {
            isEqual = (day + 1) === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
        }

        return isEqual;

    }

    const isCurrentMonth = (id: number) => {

        let isEqual: boolean = false;

        if (selectedDate) {
            isEqual = id === currentMonth && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear()
        } else {
            isEqual = id === currentMonth && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()
        }

        return isEqual

    }

    const range = (start: number, end: number) => {
        return Array.from({ length: end }, (_, index) => start + index)
    }

    const prev = (e: MouseEvent<HTMLSpanElement>, type: string) => {

        e.preventDefault()

        if (type === NavActionType.MONTH) {
            // 0 => January
            setCurrentMonth((month: any) => month === 0 ? 11 : month - 1)
            setCurrentYear((year: any) => currentMonth === 0 ? year - 1 : year)
        }

        if (type === NavActionType.YEAR) {
            const clicked = new Date(currentYear - 1, currentMonth, currentDay);

            setCurrentMonth(clicked.getMonth())
            setCurrentYear(clicked.getFullYear())
            setSelectedDate(clicked);
        }


    }

    const next = (e: MouseEvent<HTMLSpanElement>, type: string) => {

        e.preventDefault()

        if (type === NavActionType.MONTH) {
            // 0 => January
            setCurrentMonth((month: any) => month === 11 ? 0 : month + 1)
            setCurrentYear((year: any) => currentMonth === 11 ? year + 1 : year)
        }

        if (type === NavActionType.YEAR) {
            const clicked = new Date(currentYear + 1, currentMonth, currentDay);

            setCurrentMonth(clicked.getMonth())
            setCurrentYear(clicked.getFullYear())
            setSelectedDate(clicked);
        }


    }

    const changeBodyView = (e: MouseEvent<HTMLSpanElement>, v?: string) => {

        e.preventDefault();

        if (time.enable && v) {
            setNavFrom(calBodyView);
            setCalBodyView(v)

        } else {

            if (calBodyView === CalBodyView.WEEK_DAYS) {
                setCalBodyView(CalBodyView.MONTH_YEAR)
            }

            if (calBodyView === CalBodyView.MONTH_YEAR) {
                setCalBodyView(CalBodyView.WEEK_DAYS)
            }

        }


    }

    const handleSelectDate = (e: MouseEvent<HTMLSpanElement>, day: number) => {

        e.preventDefault();

        const clicked = new Date(currentYear, currentMonth, day + 1);
        const today = new Date();

        setReveal(true); // allow display to be revealed

        if (future === true) {

            if (clicked >= today || isSameDay(clicked, today)) {
                setSelectedDate(clicked);
                setCurrentDay(clicked.getDate())
            }

        } else {
            setSelectedDate(clicked);
            setCurrentDay(clicked.getDate())
        }

        displayDateTime() // trigger input display

    }

    const handleSelectMonth = (e: MouseEvent<HTMLSpanElement>, month: number) => {

        e.preventDefault();

        const clicked = new Date(currentYear, month, currentDay);

        setReveal(true); // allow display to be revealed

        setCurrentMonth(clicked.getMonth());
        setSelectedDate(clicked);

        setCalBodyView(CalBodyView.WEEK_DAYS);

        displayDateTime() // trigger input display
    }

    const handleSelectTime = (e: MouseEvent<HTMLDivElement>, type: string, val: number) => {

        e.preventDefault();

        setReveal(true); // allow display to be revealed

        if (type === 'hour') {
            const ampm = val >= 12 ? 'PM' : 'AM';
            setCurrentTime({ ...currenTime, hour: leadingZero(val), ampm })
        }

        if (type === 'min') {
            setCurrentTime({ ...currenTime, min: leadingZero(val) })
        }

        if (type === 'sec') {
            setCurrentTime({ ...currenTime, sec: leadingZero(val) })
        }

        displayDateTime() // trigger input display

    }

    const formatDate = (date: Date) => {

        let result = date.toLocaleDateString();

        if (separator === '-') {
            result = `${date.getFullYear()}-${leadingZero(date.getMonth() + 1)}-${leadingZero(date.getDate())}`;
        }

        if (separator === '/') {
            result = `${date.getFullYear()}/${leadingZero(date.getMonth() + 1)}/${leadingZero(date.getDate())}`;
        }

        return result;

    }

    const formatTime = (date: Date) => {

        const hr = date.getHours();
        const hour = leadingZero((hr % 12 || 12));
        const min = leadingZero(date.getMinutes());
        const sec = leadingZero(date.getSeconds());
        const ampm = hr >= 12 ? 'PM' : 'AM';


        return { hour, min, sec, ampm }
    }

    const convertDateTime = () => {

        let result: string = '';
        const td = `${currenTime.hour}:${currenTime.min}:${currenTime.sec} ${currenTime.ampm}`

        if (date && selectedDate) {
            result = `${formatDate(selectedDate)} ${td}`;
        } else {

            if (selectedDate) {
                result = `${formatDate(selectedDate)} ${td}`;
            } else {
                result = `${formatDate(currentDate)} ${td}`;
            }

        }

        return result;

    }

    const convertDate = () => {

        let result: string = '';

        if (date && selectedDate) {
            result = `${formatDate(selectedDate)}`;
        } else {

            if (selectedDate) {
                result = `${formatDate(selectedDate)}`;
            } else {
                result = `${formatDate(currentDate)}`;
            }

        }

        return result;

    }

    const displayDateTime = () => {

        let result: string = '';
        const td = `${currenTime.hour}:${currenTime.min}:${currenTime.sec} ${currenTime.ampm}`

        if (date && selectedDate) {
            result = `${formatDate(selectedDate)} → ${td}`;
        } else {

            if (selectedDate) {
                result = `${formatDate(selectedDate)} → ${td}`;
            } else {
                result = `${formatDate(currentDate)} → ${td}`;
            }

        }

        return result;

    }

    const displayDate = () => {

        let result: string = '';

        if (date && selectedDate) {
            result = `${formatDate(selectedDate)}`;
        } else {

            if (selectedDate) {
                result = `${formatDate(selectedDate)}`;
            } else {
                result = `${formatDate(currentDate)}`;
            }

        }

        return result;

    }

    const getCurrentTime = () => {
        const tm: ITimeProps = time.enable ?
            { ...currenTime } :
            {
                hour: formatTime(currentDate).hour,
                min: formatTime(currentDate).min,
                sec: formatTime(currentDate).sec,
                ampm: formatTime(currentDate).ampm
            }
        return tm
    }

    const convertTime = (a: boolean = false) => {

        const time = getCurrentTime()
        const ampm = a ? ` ${time.ampm}`: '';
        let result: string = `${time.hour}:${time.min}:${time.sec}${ampm}`;

        return result;

    }

    const toggleIsOpen = (e?: any) => {
        if (e) { e.preventDefault() }
        setIsOpen(!isOpen)
    }

    return (
        <>

            <div className={`webfix-calendar`}>

                <div className="cal-display">
                    <span onClick={(e) => toggleIsOpen(e)} className="cal-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                            <path d="M13 3V1H8.5M1 7V16C1 17.1046 1.89543 18 3 18H17C18.1046 18 19 17.1046 19 16V7H1Z" stroke="#9194A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M1 7V3C1 1.89543 1.89543 1 3 1H13" stroke="#9194A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19 7V3C19 1.89543 18.1046 1 17 1H16.5" stroke="#9194A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <input
                        id={random(6, true)}
                        type="text"
                        placeholder={placeholder}
                        name={display.name ? display.name : `cal-control-${random(6, true)}`}
                        style={display.style ? display.style : {}}
                        value={reveal ? displayDateTime() : placeholder}
                        readOnly={display.editable ? false : true}
                        onFocus={(e) => toggleIsOpen(e)}
                        onChange={(e) => { }}
                        className={`cal-control ${display.className ? display.className : ''}`}
                    />
                </div>

                <div ref={calRef} id={id}
                    style={
                        calendar.style ? {
                            ...calendar.style,
                            left: calendar.style.left ? calendar.style.left : calPosition.left,
                            right: calendar.style.right ? calendar.style.right : calPosition.right,
                            top: calendar.style.top ? calendar.style.top : calPosition.top,
                            bottom: calendar.style.bottom ? calendar.style.bottom : calPosition.bottom
                        } : {
                            left: calPosition.left,
                            right: calPosition.right,
                            top: calPosition.top,
                            bottom: calPosition.bottom
                        }
                    }
                    className={`cal-wrapper ${isOpen ? 'show' : 'hide'} ${position} ${calendar.className ? calendar.className : ''}`}>

                    <div className="cal-header">

                        <div className="cal-nav">

                            {
                                calBodyView === CalBodyView.WEEK_DAYS &&
                                <Fragment>
                                    <span onClick={(e) => prev(e, NavActionType.MONTH)} className="cal-btn-prev">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 14" fill="none">
                                            <path d="M0.499997 7.80005L6.2 13.4C6.6 13.8 7.2 13.8 7.6 13.4C8 13 8 12.4 7.6 12L2.7 7.00005L7.6 2.00005C8 1.60005 8 1.00005 7.6 0.600049C7.4 0.400049 7.2 0.300049 6.9 0.300049C6.6 0.300049 6.4 0.400049 6.2 0.600049L0.499997 6.20005C0.099997 6.70005 0.099997 7.30005 0.499997 7.80005C0.499997 7.70005 0.499997 7.70005 0.499997 7.80005Z" fill="#797B86" />
                                        </svg>
                                    </span>

                                    <div className="cal-year">
                                        <span className="cal-year-name">{capitalize(monthsOfYear[currentMonth].name)}</span>
                                        <span onClick={(e) => changeBodyView(e)} className="cal-year-arrow">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                                                <path d="M9.73527 0.260249C9.56759 0.0935608 9.34076 0 9.10432 0C8.86788 0 8.64105 0.0935608 8.47337 0.260249L5.26045 3.42842L2.09229 0.260249C1.9246 0.0935608 1.69777 0 1.46134 0C1.2249 0 0.99807 0.0935608 0.830387 0.260249C0.746504 0.343447 0.679923 0.442431 0.634487 0.55149C0.589051 0.66055 0.565659 0.777527 0.565659 0.895672C0.565659 1.01382 0.589051 1.13079 0.634487 1.23985C0.679923 1.34891 0.746504 1.4479 0.830387 1.5311L4.62503 5.32574C4.70823 5.40962 4.80721 5.4762 4.91627 5.52164C5.02533 5.56708 5.14231 5.59047 5.26045 5.59047C5.3786 5.59047 5.49558 5.56708 5.60464 5.52164C5.7137 5.4762 5.81268 5.40962 5.89588 5.32574L9.73527 1.5311C9.81915 1.4479 9.88573 1.34891 9.93117 1.23985C9.97661 1.13079 10 1.01382 10 0.895672C10 0.777527 9.97661 0.66055 9.93117 0.55149C9.88573 0.442431 9.81915 0.343447 9.73527 0.260249Z" fill="#797B86" />
                                            </svg>
                                        </span>
                                    </div>

                                    <span onClick={(e) => next(e, NavActionType.MONTH)} className="cal-btn-next">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 14" fill="none">
                                            <path d="M7.54 6.28998L1.88 0.639976C1.78703 0.546247 1.67643 0.471853 1.55457 0.421084C1.43271 0.370316 1.30201 0.344177 1.17 0.344177C1.03799 0.344177 0.90728 0.370316 0.78542 0.421084C0.663561 0.471853 0.55296 0.546247 0.459997 0.639976C0.273746 0.827338 0.169205 1.08079 0.169205 1.34498C0.169205 1.60916 0.273746 1.86261 0.459997 2.04998L5.41 7.04998L0.459997 12C0.273746 12.1873 0.169205 12.4408 0.169205 12.705C0.169205 12.9692 0.273746 13.2226 0.459997 13.41C0.552612 13.5045 0.663057 13.5796 0.784932 13.6311C0.906807 13.6826 1.03769 13.7094 1.17 13.71C1.3023 13.7094 1.43319 13.6826 1.55506 13.6311C1.67694 13.5796 1.78738 13.5045 1.88 13.41L7.54 7.75998C7.6415 7.66633 7.72251 7.55268 7.77792 7.42618C7.83333 7.29968 7.86193 7.16308 7.86193 7.02498C7.86193 6.88687 7.83333 6.75027 7.77792 6.62377C7.72251 6.49727 7.6415 6.38362 7.54 6.28998Z" fill="#797B86" />
                                        </svg>
                                    </span>
                                </Fragment>
                            }

                            {
                                calBodyView === CalBodyView.MONTH_YEAR &&
                                <Fragment>

                                    <span onClick={(e) => prev(e, NavActionType.YEAR)} className="cal-btn-prev">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 14" fill="none">
                                            <path d="M0.499997 7.80005L6.2 13.4C6.6 13.8 7.2 13.8 7.6 13.4C8 13 8 12.4 7.6 12L2.7 7.00005L7.6 2.00005C8 1.60005 8 1.00005 7.6 0.600049C7.4 0.400049 7.2 0.300049 6.9 0.300049C6.6 0.300049 6.4 0.400049 6.2 0.600049L0.499997 6.20005C0.099997 6.70005 0.099997 7.30005 0.499997 7.80005C0.499997 7.70005 0.499997 7.70005 0.499997 7.80005Z" fill="#797B86" />
                                        </svg>
                                    </span>

                                    <div className="cal-year">
                                        <span className="cal-year-name">{currentYear}</span>
                                        <span onClick={(e) => changeBodyView(e)} className="cal-year-arrow" style={{ marginLeft: '3px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10" fill="none">
                                                <path d="M5.81782 9.24768C5.9845 9.07999 6.07806 8.85316 6.07806 8.61673C6.07806 8.38029 5.9845 8.15346 5.81782 7.98578L2.64965 4.77286L5.81782 1.60469C5.9845 1.43701 6.07806 1.21018 6.07806 0.973741C6.07806 0.737305 5.9845 0.510475 5.81782 0.342793C5.73462 0.258909 5.63563 0.192329 5.52657 0.146893C5.41751 0.101456 5.30054 0.0780639 5.18239 0.0780639C5.06425 0.0780639 4.94727 0.101456 4.83821 0.146893C4.72915 0.192329 4.63017 0.258909 4.54697 0.342792L0.752324 4.13744C0.668441 4.22063 0.60186 4.31962 0.556424 4.42868C0.510989 4.53774 0.487595 4.65471 0.487595 4.77286C0.487595 4.89101 0.510988 5.00798 0.556424 5.11704C0.60186 5.2261 0.668441 5.32508 0.752324 5.40828L4.54697 9.24768C4.63017 9.33156 4.72915 9.39814 4.83821 9.44357C4.94727 9.48901 5.06425 9.51241 5.18239 9.51241C5.30054 9.51241 5.41751 9.48901 5.52657 9.44357C5.63563 9.39814 5.73462 9.33156 5.81782 9.24768Z" fill="#797B86" />
                                            </svg>
                                        </span>
                                    </div>

                                    <span onClick={(e) => next(e, NavActionType.YEAR)} className="cal-btn-next">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 14" fill="none">
                                            <path d="M7.54 6.28998L1.88 0.639976C1.78703 0.546247 1.67643 0.471853 1.55457 0.421084C1.43271 0.370316 1.30201 0.344177 1.17 0.344177C1.03799 0.344177 0.90728 0.370316 0.78542 0.421084C0.663561 0.471853 0.55296 0.546247 0.459997 0.639976C0.273746 0.827338 0.169205 1.08079 0.169205 1.34498C0.169205 1.60916 0.273746 1.86261 0.459997 2.04998L5.41 7.04998L0.459997 12C0.273746 12.1873 0.169205 12.4408 0.169205 12.705C0.169205 12.9692 0.273746 13.2226 0.459997 13.41C0.552612 13.5045 0.663057 13.5796 0.784932 13.6311C0.906807 13.6826 1.03769 13.7094 1.17 13.71C1.3023 13.7094 1.43319 13.6826 1.55506 13.6311C1.67694 13.5796 1.78738 13.5045 1.88 13.41L7.54 7.75998C7.6415 7.66633 7.72251 7.55268 7.77792 7.42618C7.83333 7.29968 7.86193 7.16308 7.86193 7.02498C7.86193 6.88687 7.83333 6.75027 7.77792 6.62377C7.72251 6.49727 7.6415 6.38362 7.54 6.28998Z" fill="#797B86" />
                                        </svg>
                                    </span>

                                </Fragment>
                            }

                            {
                                calBodyView === CalBodyView.TIME_SLOT &&
                                <Fragment>

                                    <span onClick={(e) => setCalBodyView(navFrom)} className="cal-btn-prev">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 14" fill="none">
                                            <path d="M0.499997 7.80005L6.2 13.4C6.6 13.8 7.2 13.8 7.6 13.4C8 13 8 12.4 7.6 12L2.7 7.00005L7.6 2.00005C8 1.60005 8 1.00005 7.6 0.600049C7.4 0.400049 7.2 0.300049 6.9 0.300049C6.6 0.300049 6.4 0.400049 6.2 0.600049L0.499997 6.20005C0.099997 6.70005 0.099997 7.30005 0.499997 7.80005C0.499997 7.70005 0.499997 7.70005 0.499997 7.80005Z" fill="#797B86" />
                                        </svg>
                                    </span>

                                    <div className="cal-time-display">
                                        <span className="hour">{currenTime.hour}</span>
                                        <span className="time-col">:</span>
                                        <span className="min">{currenTime.min}</span>
                                        <span className="time-col">:</span>
                                        <span className="sec">{currenTime.sec}</span>
                                        <span className="time-col">&nbsp;</span>
                                        <span className="sec">{currenTime.ampm}</span>
                                    </div>

                                    <span className="cal-btn-next"></span>

                                </Fragment>
                            }


                        </div>

                    </div>

                    <div className="cal-body">

                        {
                            calBodyView === CalBodyView.WEEK_DAYS &&

                            <div className="cal-weekdays">

                                <div className="cal-day-names">
                                    {
                                        daysOfweek.map((day, index) =>
                                            <Fragment key={day.name}>
                                                <span className="day sunday">{capitalize(day.label)}</span>
                                            </Fragment>
                                        )
                                    }
                                </div>

                                <div className="cal-days">

                                    {/* FOR EMPTY SPACES */}
                                    {
                                        [...Array(firstDayOfMonth).keys()].map((_, index) =>
                                            <span key={`empty-${index}`} className="date bland" />
                                        )
                                    }

                                    {/* FOR DAYS */}
                                    {
                                        [...Array(daysInMonth).keys()].map((day, index) =>
                                            <Fragment key={day + 1}>
                                                <span
                                                    onClick={(e) => handleSelectDate(e, day)}
                                                    className={`date ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''}`}
                                                >
                                                    {day + 1}
                                                </span>
                                            </Fragment>
                                        )
                                    }

                                </div>

                            </div>

                        }

                        {
                            calBodyView === CalBodyView.MONTH_YEAR &&
                            <div className="cal-month-year">

                                <div className="cal-months">
                                    {
                                        monthsOfYear.map((month, index) =>
                                            <Fragment key={month.name + (index + 1)}>

                                                <span
                                                    onClick={(e) => handleSelectMonth(e, month.id)}
                                                    className={`month ${isCurrentMonth(month.id) ? 'current' : ''}`}>
                                                    {capitalize(month.label)}
                                                </span>

                                            </Fragment>
                                        )
                                    }
                                </div>

                            </div>
                        }

                        {
                            calBodyView === CalBodyView.TIME_SLOT &&
                            <div className="cal-time">

                                <div className="time-wrapper">

                                    <div className="time-handle handle-hour">
                                        {
                                            range(0, 24).map((item, index) =>
                                                <Fragment key={item + index + 1}>
                                                    <div
                                                        onClick={(e) => handleSelectTime(e, 'hour', item)}
                                                        ref={currenTime.hour === leadingZero(item) ? hourRef : null}
                                                        className={`reading ${currenTime.hour === leadingZero(item) ? 'selected' : ''}`}>{leadingZero(item)}</div>
                                                </Fragment>
                                            )
                                        }
                                    </div>

                                    <div className="time-handle handle-min">
                                        {
                                            range(0, 60).map((item, index) =>
                                                <Fragment key={item + index + 1}>
                                                    <div
                                                        onClick={(e) => handleSelectTime(e, 'min', item)}
                                                        ref={currenTime.min === leadingZero(item) ? minRef : null}
                                                        className={`reading ${currenTime.min === leadingZero(item) ? 'selected' : ''}`}>{leadingZero(item)}</div>
                                                </Fragment>
                                            )
                                        }
                                    </div>

                                    <div className="time-handle handle-sec">
                                        {
                                            range(0, 60).map((item, index) =>
                                                <Fragment key={item + index + 1}>
                                                    <div
                                                        onClick={(e) => handleSelectTime(e, 'sec', item)}
                                                        ref={currenTime.sec === leadingZero(item) ? secRef : null}
                                                        className={`reading ${currenTime.sec === leadingZero(item) ? 'selected' : ''}`}>{leadingZero(item)}</div>
                                                </Fragment>
                                            )
                                        }
                                    </div>

                                </div>

                            </div>
                        }

                    </div>

                    <div className="cal-divider"></div>

                    <div className={`cal-footer ${time.enable ? '' : 'year'}`}>

                        <h4 className="year">Year - {currentYear}</h4>

                        {
                            time.enable &&
                            <>
                                <div onClick={(e) => changeBodyView(e, CalBodyView.TIME_SLOT)} className="cal-time-display">
                                    <span className="hour">{currenTime.hour}</span>
                                    <span className="time-col">:</span>
                                    <span className="min">{currenTime.min}</span>
                                    <span className="time-col">:</span>
                                    <span className="sec">{currenTime.sec}</span>
                                    <span className="time-col">&nbsp;</span>
                                    <span className="sec">{currenTime.ampm}</span>
                                </div>
                            </>
                        }

                    </div>

                </div>


            </div >

        </>
    )

};

export default WebfixCalendar;
