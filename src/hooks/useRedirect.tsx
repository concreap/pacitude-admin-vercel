import React, { useEffect } from 'react'
import pop from '../utils/loader.util'
import { useNavigate } from 'react-router-dom'
import CookieService from '../services/cookie.service'
import storage from '../utils/storage.util'
import AxiosService from '../services/axios.service'

const useRedirect = (allowed: Array<string>) => {

    const navigate = useNavigate();
    const userType = CookieService.getUserType()

    const fireRedirect = () => {

        if(!storage.checkToken() && !storage.checkUserID()){
            navigate('/login');
            AxiosService.logout()
        }else if(!userType || userType === undefined || userType === null){
            navigate('/login');
            AxiosService.logout()
        }else if(allowed.includes(userType) === false){
            navigate('/login');
            AxiosService.logout()
        }

    }

    useEffect(() => {
        fireRedirect()
    }, [])

}

export default useRedirect