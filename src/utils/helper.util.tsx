import $ from 'jquery';
import moment from 'moment'
import { IDateToday, IHelper } from './interfaces.util';
import { CurrencyType } from './enums.util';
import countries from '../_data/countries.json'

const init = () => {

}

const scrollTo = (id: string) => {

    const elem = document.getElementById(id);

    if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
    }

}

const addClass = (id: string, cn: string) => {

    const elem = document.querySelector(id);

    if (elem) {
        elem.classList.add(cn);
    }

    
}

const removeClass = (id: string, cn: string) => {
    
    const elem = document.querySelector(id);

    if (elem) {
        elem.classList.remove(cn)
    }
}

const splitQueries = (query: any, key: string) => {

    let value;

    for (let i = 0; i < query.length; i++) {

        let pair = query[i].split('=');
        if (pair[0] === key) {
            value = pair[1];
        }

    }

    return value;
    
}

const navOnScroll = (data: { id: string, cn: string, limit?: number }) => {

    const { id, cn, limit } = data;

    window.addEventListener('scroll', (e) => {

        // console.log(window.scrollY);
        const elem = $(id);
        let sl: number = limit && limit > 0 ? limit : 96;

        if(elem){

            if (window.scrollY > sl) {
                elem.addClass(cn);
            } else {
                elem.removeClass(cn);
            }

        }


    })
    
}

const decodeBase64 = (data: string) => {

    let result = {
        width: '',
        height: '',
        image: {}
    }

    const img = new Image();
    img.src = data;

    img.onload = function () {
        result.width = img.naturalWidth.toString();
        result.height = img.naturalHeight.toString();
    };

    result.image = img;
    return result;

}

const isEmpty = (data: any, type: 'object' | 'array') => {

    let result: boolean = false;

    if(type === 'object'){
        result = Object.getOwnPropertyNames(data).length === 0 ? true : false;
    }

    if(type === 'array'){
        result = data.length <= 0 ? true : false;
    }

    return result;
    
}

const capitalize = (val: string) => {
    return val.charAt(0).toUpperCase() + val.slice(1)
}

const sort = (data: Array<any>) => {

    const sorted = data.sort((a, b) => {
        if (a.name < b.name) { return -1 }
        else if (a.name > b.name) { return 1 }
        else { return 0 }
    })

    return sorted;

}

const days = () => {

    return [
        { id: 0, name: 'sunday' },
        { id: 1, name: 'monday' },
        { id: 2, name: 'tuesday' },
        { id: 3, name: 'wednesday' },
        { id: 4, name: 'thursday' },
        { id: 5, name: 'friday' },
        { id: 6, name: 'saturday' },
    ]
    
}

const months = () => {

    return [
        { id: 0, name: 'january' },
        { id: 1, name: 'february' },
        { id: 2, name: 'march' },
        { id: 3, name: 'april' },
        { id: 4, name: 'may' },
        { id: 5, name: 'june' },
        { id: 6, name: 'july' },
        { id: 7, name: 'august' },
        { id: 8, name: 'september' },
        { id: 9, name: 'october' },
        { id: 10, name: 'november' },
        { id: 11, name: 'december' },
    ]

}

const random = (size: number = 6, isAlpha?: boolean) => {

    const pool = isAlpha ? 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789abcdefghijklmnpqrstuvwxyz' : '0123456789';
    const rand = []; let i = -1;

    while (++i < size) rand.push(pool.charAt(Math.floor(Math.random() * pool.length)));

    return rand.join('');

}

const formatDate = (date: any, type: 'basic' | 'datetime') => {

    let result: string = '';

    if(type === 'basic'){
        result = moment(date).format('Do MMM, YYYY')
    }

    if(type === 'datetime'){
        result = moment(date).format('Do MMM, YYYY HH:mm:ss A')
    }
    
    return result;
    
}

const equalLength = (id: string, childId: string, len?: number) => {

    let heigthList = [];
    const items = $(id).find(childId);
    const val = len && len > 0 ? len : 2;


    for (let i = 0; i < items.length; i++) {
        heigthList.push(Math.floor($(items[i]).height()!))
    }                                                                      
    const height = Math.max(...heigthList); // get the highest length;

    for (let i = 0; i < items.length; i++) {

        if (Math.floor($(items[i]).height()!) !== height) {
            $(items[i]).height(height - val);
        }

    }
    
}

const setWidth = (id: string, val: number) => {

    const elem = document.querySelector(id);

    if (elem) {
        $(elem).width(val);
    }

}

const setHeight = (id: string, val: number) => {

    const elem = document.querySelector(id);

    if (elem) {
        $(elem).height(val);
    }
    
}

const isNAN = (val: any) => {
    return Number.isNaN(val);
}

/**
 * 
 * @param data 
 * @param from 
 * @param to 
 * @returns 
 */
const reposition = (data: Array<any>, from: number, to: number): Array<any> => {

    let temp: Array<any> = []
    let result: Array<any> = [];

    temp = [...data];

    // remove item from the {from} index and save
    const item = data.splice(from, 1)[0];

    if (item) {

        result = [...data]; // spread out the remaining items
        result.splice(to, 0, item) // add the item back

    } else {
        result = [...temp];
    }

    return result;

}

/**
 * 
 * @param data 
 * @returns 
 */
const splitByComma = (data: string): Array<string> => {

    let result: Array<string> = [];
    let temp: Array<string> = [];

    const split = data.split(',')

    // process the string
    if (split.length > 0) {

        split.forEach((val) => {
            temp.push(val.trim())
        })

    }

    // clean the result
    for (let i = 0; i < temp.length; i++) {

        if (temp[i]) {
            result.push(temp[i])
        }

    }

    return result;

}

/**
 * @name dateToday
 * @param d 
 * @returns 
 */
const dateToday = (d: string | Date): IDateToday => {

    const today = d !== '' ? new Date(d) : new Date(Date.now());

    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1) < 10 ? `0${(today.getMonth() + 1)}` : `${(today.getMonth() + 1)}`;
    const date = today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`;
    const hour = today.getHours() < 10 ? `0${today.getHours()}` : `${today.getHours()}`;
    const minutes = today.getMinutes() < 10 ? `0${today.getMinutes()}` : `${today.getMinutes()}`;
    const seconds = today.getSeconds() < 10 ? `0${today.getSeconds()}` : `${today.getSeconds()}`;
    const ISO = today.toISOString()
    const datetime = today.getTime()

    return { year, month, date, hour, minutes, seconds, ISO, dateTime: datetime }

}

/**
 * @name monthsOfYear
 * @param val 
 * @returns 
 */
const monthsOfYear = (val: string | number): string => {

    const monthList = months()
    const index = parseInt(val.toString(), 10);
    const month = monthList[index - 1];

    return capitalize(month.name);

}


/**
 * @name roundFloat
 * @param val 
 * @returns 
 */
const roundFloat = (val: number): number => {
    return Math.round(val * 100 + Number.EPSILON) / 100;
}

/**
 * @name addElipsis
 * @param val 
 * @param size 
 * @returns 
 */
const addElipsis = (val: string, size: number): string => {

    let result = val.substring(0, size) + '...';
    return result;

}

/**
 * @name leadingZero
 * @param val 
 * @returns 
 */
const leadingZero = (val: number): string => {
    let result: string = '';

    if (val < 10 && val > 0) {
        result = `0${val}`
    } else {
        result = val.toString()
    }

    return result;
}

/**
 * @name formatPhone
 * @param val 
 * @param code 
 * @returns 
 */
const formatPhone = (val: string, code: string): string => {

    let result = val;

    if (code && val) {

        if (code === 'NG') {
            result = `0${val.substring(3)}`;
        } else {
            result = val;
        }

    }

    return result;

}

const getCardBin = (num: string): string => {
    let result: string = '';
    if (num) {
        result = num.slice(0, 6);
    }
    return result;
}

const getCardLast = (num: string): string => {
    let result: string = '';
    if (num) {
        result = num.slice(-4);
    }
    return result;
}

const encodeCardNumber = (num: string): string => {

    let result: string = '';
    if (num) {
        result = `${getCardBin(num)}******${getCardLast(num)}`
    }
    return result;

}

const readCountries = (): Array<any> => {

    let result: Array<any> = countries;
    result = sortData(result, 'name');
    return result

}

const sortData = (data: Array<any>, filter: string = ''): Array<any> => {

    let sorted: Array<any> = [];

    if (filter !== '') {

        sorted = data.sort((a, b) => {
            if (a[filter].toString() < b[filter].toString()) { return -1 }
            else if (a[filter].toString() > b[filter].toString()) { return 1 }
            else { return 0 }
        })

    }

    if (filter === '') {

        sorted = data.sort((a, b) => {
            if (a.toString() < b.toString()) { return -1 }
            else if (a.toString() > b.toString()) { return 1 }
            else { return 0 }
        })

    }

    return sorted;
}

const attachPhoneCode = (code: string, phone: string, include: boolean): string => {

    let result: string = '';

    // format phone number
    let phoneStr: string;
    if (code.includes('-')) {
        phoneStr = code.substring(3);
    } else if (code.includes('+')) {
        phoneStr = include ? code : code.substring(1);
    } else {
        phoneStr = code
    }

    result = phoneStr + phone.substring(1);

    return result;

}

const capitalizeWord = (value: string): string => {

    const split = value.toLowerCase().split(" ");

    for (var i = 0; i < split.length; i++) {
        split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1);
    }

    return split.join(' ');

}

const shrinkWordInString = (value: string, ret: number): string => {

    const split = value.split(' ');
    let result: string = '';

    for (let i = 0; i < ret; i++) {
        result = result + ' ' + split[i];
    }

    return result;

}

const truncateText = (text: string, max: number): string => {
    return (text?.length > max) ? text.slice(0, max) + '...' : text;
}

const getChargebacks = (): Array<any> => {

    let result: Array<any> = [];

    return result

}

const objectToArray = (data: Object | any): Array<any> => {

    let result: Array<any> = [];

    for (const [key, value] of Object.entries(data)) {

        if (value && typeof (value) !== 'object') {

            let newData = {
                key: key.toString(),
                value: value.toString()
            }
            result.push(newData)

        } else if (value && typeof (value) === 'object') {

            for (const [_key, _value] of Object.entries(data)) {

                if (_value && typeof (_value) !== 'object') {

                    let _newData = {
                        key: _key.toString(),
                        value: _value.toString()
                    }

                    result.push(_newData)

                }

            }

        }

    }

    return result;

}

const displayBalance = (value: number): string => {

    let cast: number = 0;
    let result: string = value.toLocaleString();

    if (value <= 100000) {
        result = value.toLocaleString();
    } else if (value > 100000) {

        if (value >= 1e3 && value < 1e6) {
            cast = (value / 1e3);
            result = `${cast.toFixed(2)}K`;
        } else if (value >= 1e6 && value < 1e9) {
            cast = (value / 1e6);
            result = `${cast.toFixed(2)}M`;
        } else if (value >= 1e9 && value < 1e12) {
            cast = (value / 1e9);
            result = `${cast.toFixed(2)}B`;
        } else if (value >= 1e12) {
            cast = (value / 1e12);
            result = `${cast.toFixed(2)}T`;
        }

    }

    return result

}

const parseInputNumber = (value: string, type: 'number' | 'decimal'): number => {

    let result: number = 0;

    if (type === 'number') {
        result = Number.isNaN(parseInt(value)) ? 0 : parseInt(value);
    }

    if (type === 'decimal') {
        result = Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    }

    return result;

}

export const toDecimal = (v: number, p: number): number => {

    let result: number = v;
    result = parseFloat(v.toFixed(p));

    return result;

}

export const formatCurrency = (currency: string): string => {

    let result: string = '';

    if(currency){

        if (currency.toUpperCase() === CurrencyType.NGN) {
            result = `₦`
        } else if(currency.toUpperCase() === CurrencyType.USD){
            result = `$`
        }

    }

    return result;

}


const helper: IHelper = {
    init: init,
    scrollTo: scrollTo,
    addClass: addClass,
    removeClass:removeClass,
    splitQueries: splitQueries,
    navOnScroll: navOnScroll,
    decodeBase64: decodeBase64,
    isEmpty:isEmpty,
    capitalize: capitalize,
    sort: sort,
    days: days,
    months:months,
    random: random,
    formatDate: formatDate,
    equalLength: equalLength,
    setWidth:setWidth,
    setHeight: setHeight,
    isNAN: isNAN,
    reposition: reposition,
    splitByComma: splitByComma,
    dateToday: dateToday,
    roundFloat: roundFloat,
    addElipsis: addElipsis,
    formatPhone: formatPhone,
    leadingZero: leadingZero,
    encodeCardNumber: encodeCardNumber,
    monthsOfYear: monthsOfYear,
    readCountries: readCountries,
    sortData: sortData,
    attachPhoneCode: attachPhoneCode,
    capitalizeWord: capitalizeWord,
    shrinkWordInString: shrinkWordInString,
    truncateText: truncateText,
    objectToArray: objectToArray,
    displayBalance: displayBalance,
    parseInputNumber: parseInputNumber,
    toDecimal: toDecimal,
    formatCurrency: formatCurrency,

}

export default helper;