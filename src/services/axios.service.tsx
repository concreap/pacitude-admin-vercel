import { CallApiDTO } from "../dtos/axios.dto";
import Axios, { AxiosError } from 'axios'
import { ApiServiceType } from "../utils/types.util";
import storage from "../utils/storage.util";
import { IAPIResponse } from "../utils/interfaces.util";

class AxiosService {

    public baseUrl: string;
    constructor() {

        if (!import.meta.env.VITE_APP_API_URL) {
            throw new Error('API base url not defined')
        }

        Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        this.baseUrl = import.meta.env.VITE_APP_API_URL;

    }

    /**
     * @name call
     * @param params 
     * @returns 
     */
    public async call(params: CallApiDTO): Promise<IAPIResponse> {

        let result: any = {}
        const { isAuth = false, method, path, type, payload } = params;

        let urlpath = `${this.baseUrl}${path}`;

        await Axios({
            method: method,
            url: urlpath,
            data: payload,
            headers: isAuth ? storage.getConfigWithBearer().headers : storage.getConfig().headers
        }).then((resp) => {
            result = resp.data;
        }).catch((err) => {

            if (err.response) {

                result.error = true;
                result.errors = [err.message ? err.message : 'An error occured'];
                result.message = 'An error occured'
                result.data = err.response?.data?.data || null
                result.status = err.response.status

            } else if (typeof (err) === 'object') {
                result.error = true;
                result.errors = ['an error occurred. please try again']
                result.message = 'Error';
                result.data = err;
            } else if (typeof (err) === 'string') {
                result.error = true;
                result.errors = [err.toString()]
                result.message = err.toString();
                result.data = err.toString()
            }

        })

        return result;

    }

    /**
     * @name logout
     */
    public async logout(): Promise<void> {

        storage.clearAuth()
        await this.call({
            method: 'POST',
            type: 'default',
            path: '/auth/logout',
            isAuth: false,
            payload: {}
        });

    }

}

export default new AxiosService()