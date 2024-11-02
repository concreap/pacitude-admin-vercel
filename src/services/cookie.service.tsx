import Cookies, { CookieSetOptions, CookieGetOptions } from 'universal-cookie';

interface ISetCookie {
    key: string,
    payload: any,
    expireAt?: Date,
    maxAge?: number,
    path?: string
}

interface IGetCookie {
    key: string,
    parse?: boolean
}

class CookieService {

    private cookie: Cookies;

    constructor() {
        this.cookie = new Cookies()
    }

    /**
     * @name setData
     * @param data 
     */
    public setData(data: ISetCookie): void {

        let dataString: string = '';

        const { expireAt, key, payload, maxAge, path } = data;

        if (typeof (payload) === 'object') {
            dataString = JSON.stringify(payload)
        } else {
            dataString = payload.toString()
        }

        let options: CookieSetOptions = {}

        if (dataString && key) {

            options.path = path ? path : '/';

            if(expireAt){
                options.expires = expireAt
            }

            if(maxAge && maxAge > 0){
                options.maxAge = maxAge
            }

            this.cookie.set(key, dataString, options);

        }

    }

    /**
     * @name getData
     * @param data 
     * @returns 
     */
    public getData(data: IGetCookie): any {

        let result: any = null;

        const { key, parse } = data;

        const cookieData = this.cookie.get(key, { doNotParse: true });

        if(cookieData){

            if(parse){
                result = JSON.parse(cookieData)
            }else{
                result = cookieData.toString()
            }

        }

        return result;

    }

}

export default new CookieService()