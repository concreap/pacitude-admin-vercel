import { ChangeEvent, KeyboardEvent, RefObject } from "react";

export interface IStorage {
    
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
    init(): void,
    scrollTo(id: string): void,
    addClass(id: string, cn: string): void,
    removeClass(id: string, cn: string): void,
    splitQueries(query: any, key: string): any,
    navOnScroll(data: { id: string, cn: string, limit?: number }): void,
    decodeBase64(data: string): { width: string, height: string, image: any },
    isEmpty(data: any, type: 'object' | 'array'): boolean,
    capitalize(val: string): string,
    sort(data: Array<any>): Array<any>,
    days(): Array<{id: number, name: string}>
    months(): Array<{id: number, name: string}>,
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
    formatCurrency(currency: string): string

}

export interface ITextInput {
    ref?: RefObject<HTMLInputElement>,
    type: 'text' | 'email',
    readonly?: boolean,
    name?: string,
    id?: string
    default?: string,
    value?: string,
    size?: string,
    classname?: string,
    autoComplete?: boolean,
    placeholder?: string,
    label?: {
        title: string,
        classname?: string,
        required?: boolean,
        fontSize?: number
    },
    onKeyUp?(e: KeyboardEvent<HTMLInputElement>): void
    onChange(e: ChangeEvent<HTMLInputElement>): void

}