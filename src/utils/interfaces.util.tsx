import { ChangeEvent, KeyboardEvent, RefObject } from "react";

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