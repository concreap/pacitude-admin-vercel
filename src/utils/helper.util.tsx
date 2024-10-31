import $ from 'jquery';
import moment from 'moment'
import { IHelper } from './interfaces.util';

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
}

export default helper;