import IdempotentService  from "../services/idempotent.service";
import { HeaderType } from "./enums.util";
import { IStorage } from "./interfaces.util";

const storeCreds = (token: string, id: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
}

const checkToken = () => {
    return localStorage.getItem('token') ? true : false;
}

const getToken = () => {
    return localStorage.getItem('token');
}

const checkUserID = () => {
    return localStorage.getItem('userId') ? true : false;
}

const getUserID = () => {
    let uid = localStorage.getItem('userId');
    return uid ? uid : '';
}

const checkUserEmail = () => {
    return localStorage.getItem('user-email') ? true : false;
}

const getUserEmail = () => {
    return localStorage.getItem('user-email');
}

const getConfig = () => {

    const config = {
        headers: {
            ContentType: 'application/json',
            lg: 'en',
            ch: 'web'
        }
    }

    return config;

}

const getConfigWithBearer = () => {

    const config: any = {
        headers: {
            ContentType: 'application/json',
            Authorization: `Bearer ${getToken()}`,
            lg: 'en',
            ch: 'web'
        }
    }

    config.headers[HeaderType.IDEMPOTENT] = IdempotentService .getRequestKey();

    return config;

}

const clearAuth = () => {
    
    if(checkToken() && checkUserID()){
        localStorage.clear();
    }
}

const keep = (key: string, data: any) => {

    if(data && data !== undefined && data !== null){
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    }else{
        return false
    }
    
}

const keepLegacy = (key: string, data: any) => {

    if(data){
        localStorage.setItem(key, data);
        return true;
    }else{
        return false
    }
    
}

const fetch = (key: string) => {

    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

const fetchLegacy = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? data : '';
}

const deleteItem = (key: string, legacy: boolean = false) => {
    
    let data; 

    if(legacy && legacy === true){
        data = localStorage.getItem(key);
    }else{
        data = fetch(key);
    }

    if(data && data !== null && data !== undefined){
        localStorage.removeItem(key)
        return true;
    }else{
        return false;
    }
}

const trimSpace = (str: string) => {
    return str.replace(/\s/g, '');
}

const copyCode = (code: string) => {
    
    if(code !== '' && code !== undefined && typeof(code) === 'string'){
        navigator.clipboard.writeText(code);
        return true;
    }else{
        return false;
    }
}

const storage: IStorage = {

}

export default storage;