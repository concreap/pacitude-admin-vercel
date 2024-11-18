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
            result = `${this.identityUrl}/${path}`
        } else if (type === 'core') {
            result = `${this.coreUrl}/${path}`
        } else if (type === 'genius') {
            result = `${this.geniusUrl}/${path}`
        } else if (type === 'resource') {
            result = `${this.resourceUrl}/${path}`
        }

        return result

    }

    /**
     * @name call
     * @param params 
     * @returns 
     */
    public async call(params: CallApiDTO): Promise<IAPIResponse> {

        let result: any = {};
        const { isAuth, method, path, type, payload } = params;

        let urlpath = this.getFullUrl(type, path);

        await Axios({
            method: method,
            url: urlpath,
            data: payload,
            headers: isAuth ? storage.getConfigWithBearer() : storage.getConfig()
        }).then((resp) => {
            result = resp.data;
        }).catch((err) => {
            result = err.response.data;
        })

        return result;

    }

}