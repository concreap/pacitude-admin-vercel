import React, { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie';

import Axios from 'axios';
import storage from '../../utils/storage.util'
import loader from '../../utils/loader.util'

import UserContext from './userContext';
import UserReducer from './userReducer';

import {
    GET_LOGGEDIN_USER,
    SET_USERTYPE,
    SET_IS_ADMIN,
    SET_IS_SUPER,
    SET_LOADING,
    UNSET_LOADING,
    SET_SIDEBAR,
    SET_USER,
    GET_USERS,
    SET_PAGINATION,
    SET_TOTAL,
    SET_COUNT,
    SET_SEARCH,
    GET_USER,
    SET_RESPONSE,
    GET_ADMINS,
    GET_AUDITS
} from '../types'
import { IListQuery, IUserPermission } from '../../utils/interfaces.util';

const UserState = (props: any) => {

    const cookie = new Cookies();
    const exp = new Date(
        Date.now() + 70 * 24 * 60 * 60 * 1000
    )

    const navigate = useNavigate()
    Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    const initialState = {
        audits: {},
        users: {},
        admins: {},
        user: {},
        userDetails: {},
        userType: '',
        isSuper: false,
        isAdmin: false,
        loading: false,
        total: 0,
        count: 0,
        pagination: {},
        response: {},
        sidebar: {
            collapsed: true
        }
    }

    const [state, dispatch] = useReducer(UserReducer, initialState);

    const logout = async () => {

        storage.clearAuth();
        localStorage.clear();
        navigate('/login');

        cookie.remove('token');
        cookie.remove('userType');

        await Axios.post(`${process.env.REACT_APP_AUTH_URL}/auth/logout`, {}, storage.getConfig());
    }

    const getAudits = async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 20}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        setLoading('audit')

        await Axios.get(`${process.env.REACT_APP_AUTH_URL}/audits?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                

                dispatch({
                    type: GET_AUDITS,
                    payload: {
                        data: resp.data.data,
                        count: resp.data.count,
                        total: resp.data.total,
                        pagination: resp.data.pagination,
                        loading: false
                    }
                });

            }).catch((err: any) => {

                if (err && err.response && err.response.data && err.response.data.status === 401) {

                    logout();

                } else if (err && err.response && err.response.data) {

                    console.log(`Error! Could not get all audits ${err.response.data}`)

                } else if (err && err.toString() === 'Error: Network Error') {

                    loader.popNetwork();

                } else if (err) {

                    console.log(`Error! Could not get all audits ${err}`)

                }

                unsetLoading('audit')

            })

    }

    const getUser = async (id: string) => {

        let userId = id ? id : storage.getUserID();

        setLoading()

        await Axios.get(`${process.env.REACT_APP_AUTH_URL}/auth/user/${userId}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_LOGGEDIN_USER,
                    payload: resp.data.data
                });

                cookie.set("userType", resp.data.data.userType, {
                    path: '/',
                    expires: exp
                });

            }).catch((err: any) => {

                if (err && err.response && err.response.data && err.response.data.status === 401) {

                    logout();

                } else if (err && err.response && err.response.data) {

                    console.log(`Error! Could not get logged in user ${err.response.data}`)

                } else if (err && err.toString() === 'Error: Network Error') {

                    loader.popNetwork();

                } else if (err) {

                    console.log(`Error! Could not get logged in user ${err}`)

                }

                unsetLoading()

            })

    }

    const getUserDetails = async (id: string) => {

        setLoading()

        await Axios.get(`${process.env.REACT_APP_AUTH_URL}/users/${id}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_USER,
                    payload: resp.data.data
                });

            }).catch((err: any) => {

                const { data, status, errors, error, message } = err.response.data

                if (err && err.response && err.response.data && err.response.data.status === 401) {

                    logout();

                } else if (err && err.response && err.response.data) {

                    console.log(`Error! Could not get logged in user ${err.response.data}`)

                } else if (err && err.toString() === 'Error: Network Error') {

                    loader.popNetwork();

                } else if (err) {

                    console.log(`Error! Could not get logged in user ${err}`)

                }

                unsetLoading()

            })

    }

    const getUsers = async (limit: number, page: number) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading('users')

        await Axios.get(`${process.env.REACT_APP_AUTH_URL}/users?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_USERS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err: any) => {

                const { data, status, errors, error, message } = err.response.data

                if (err && err.response && err.response.data && err.response.data.status === 401) {

                    logout();

                } else if (err && err.response && err.response.data) {

                    console.log(`Error! Could not get all users ${err.response.data}`)

                } else if (err && err.toString() === 'Error: Network Error') {

                    loader.popNetwork();

                } else if (err) {

                    console.log(`Error! Could not get all users ${err}`)

                }

                unsetLoading('users')

            })

    }

    const setLoading = (type?: string, payload?: any) => {

        let _data: any = {};

        if(payload ){

            if(payload.loading !== undefined){
                const { loading, ...rest } = payload;
                _data = rest;
            }else{
                _data = payload;
            }
            
        }

        if (type && type === 'audit') {

            dispatch({
                type: GET_AUDITS,
                payload: {
                    ..._data, 
                    loading: true
                }
            })

        } else if (type && type === 'users') {

            dispatch({
                type: GET_USERS,
                payload: {
                    ..._data, 
                    loading: true
                }
            })

        } else if (type && type === 'admins') {

            dispatch({
                type: GET_ADMINS,
                payload: {
                    ..._data, 
                    loading: true
                }
            })

        } else {
            dispatch({
                type: SET_LOADING
            })
        }


    }

    const unsetLoading = (type?: string, payload?: any) => {

        let _data: any = {};

        if(payload ){

            if(payload.loading !== undefined){
                const { loading, ...rest } = payload;
                _data = rest;
            }else{
                _data = payload;
            }
            
        }

        if (type && type === 'audit') {

            dispatch({
                type: GET_AUDITS,
                payload: {
                    ..._data, 
                    loading: false
                }
            })

        } else if (type && type === 'users') {

            dispatch({
                type: GET_USERS,
                payload: {
                    ..._data, 
                    loading: false
                }
            })

        } else if (type && type === 'admins') {

            dispatch({
                type: GET_ADMINS,
                payload: {
                    ..._data, 
                    loading: false
                }
            })

        } else {
            dispatch({
                type: SET_LOADING
            })
        }


    }

    const setUserType = (n: string) => {

        dispatch({
            type: SET_USERTYPE,
            payload: n
        })

        if (n === 'superadmin') {
            dispatch({
                type: SET_IS_SUPER,
                payload: true
            })
            dispatch({
                type: SET_IS_ADMIN,
                payload: false
            })
        } else if (n === 'admin') {
            dispatch({
                type: SET_IS_SUPER,
                payload: false
            })
            dispatch({
                type: SET_IS_ADMIN,
                payload: true
            })
        } else {
            dispatch({
                type: SET_IS_SUPER,
                payload: false
            })
            dispatch({
                type: SET_IS_ADMIN,
                payload: false
            })
        }
    }

    const getUserType = () => {
        const ut = cookie.get('userType');
        return ut.toString();
    }

    const isLoggedIn = (): boolean => {

        let flag = false;

        const ut = cookie.get('userType').toString();
        const tk = cookie.get('token').toString();

        if (storage.getUserID() && storage.getToken() && tk && ut) {
            flag = true;
        }

        return flag

    }

    const setSidebar = (data: any) => {
        dispatch({
            type: SET_SIDEBAR,
            payload: data
        })
    }

    const setUser = (data: any) => {
        dispatch({
            type: SET_USER,
            payload: data
        })
    }

    const setResponse = (data: any) => {

        dispatch({
            type: SET_RESPONSE,
            payload: data
        })

    }

    return <UserContext.Provider
        value={{
            audits: state.audits,
            users: state.users,
            admins: state.admins,
            user: state.user,
            userDetails: state.userDetails,
            userType: state.userType,
            isSuper: state.isSuper,
            isAdmin: state.isAdmin,
            loading: state.loading,
            total: state.total,
            count: state.count,
            pagination: state.pagination,
            response: state.response,
            sidebar: state.sidebar,
            getAudits,
            getUser,
            getUserDetails,
            getUsers,
            setUserType,
            setSidebar,
            getUserType,
            setUser,
            unsetLoading,
            isLoggedIn,
            setResponse
        }}
    >
        {props.children}

    </UserContext.Provider>

}

export default UserState