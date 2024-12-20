import { CallApiDTO } from "../dtos/axios.dto";
import Axios from 'axios'
import { ApiServiceType } from "../utils/types.util";
import storage from "../utils/storage.util";
import { IAPIResponse } from "../utils/interfaces.util";

class AxiosService {

    public baseUrl: string;
    public identityUrl: string;
    public geniusUrl: string;
    public resourceUrl: string;
    public coreUrl: string;

    constructor() {

        if (!process.env.REACT_APP_API_URL) {
            throw new Error('API base url not defined')
        }

        this.baseUrl = process.env.REACT_APP_API_URL;
        this.identityUrl = `${this.baseUrl}/identity/v1`;
        this.geniusUrl = `${this.baseUrl}/genius/v1`;
        this.resourceUrl = `${this.baseUrl}/resource/v1`;
        this.coreUrl = `${this.baseUrl}/core/v1`;

    }

    /**
     * @name getFullUrl
     * @param type 
     * @param path 
     * @returns 
     */
    private getFullUrl(type: ApiServiceType, path: string) {

        let result: string = '';

        if (type === 'identity') {
            result = `${this.identityUrl}${path}`
        } else if (type === 'core') {
            result = `${this.coreUrl}${path}`
        } else if (type === 'genius') {
            result = `${this.geniusUrl}${path}`
        } else if (type === 'resource') {
            result = `${this.resourceUrl}${path}`
        }

        return result

    }

    /**
     * @name call
     * @param params 
     * @returns 
     */
    public async call(params: CallApiDTO): Promise<IAPIResponse> {

        let result: any = {}
        const { isAuth = false, method, path, type, payload } = params;

        let urlpath = this.getFullUrl(type, path);

        await Axios({
            method: method,
            url: urlpath,
            data: payload,
            headers: isAuth ? storage.getConfigWithBearer().headers : storage.getConfig().headers
        }).then((resp) => {
            result = resp.data;
        }).catch((err) => {

            if (err.response) {

                if (err.response.status === 404) {
                    result.error = true;
                    result.errors = ['could not find the requested resource'];
                    result.message = 'Could not find the requested resource';
                    result.data = null;
                } else if (err.response.status === 502) {
                    result.error = true;
                    result.errors = ['unable to get requested resource'];
                    result.message = 'unable to get requested resource';
                    result.data = null;
                } else {

                    if (err.response.data) {
                        result = err.response.data;
                    } else {
                        result.error = true;
                        result.errors = ['an error occured'];
                        result.message = 'An error occured';
                        result.data = null;
                    }

                }

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
            type: 'identity',
            path: '/auth/logout',
            isAuth: false,
            payload: {}
        });

    }

}

export default new AxiosService()