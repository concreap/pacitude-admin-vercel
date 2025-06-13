import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ICollection, IListQuery, IUserContext } from '../../utils/interfaces.util'
import UserContext from '../../context/user/userContext'
import useContextType from '../useContextType'
import { GET_CAREER, GET_CAREERS, GET_INDUSTRIES, GET_INDUSTRY } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_CAREER, URL_INDUSTRY } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import Career from '../../models/Career.model'
import useGoTo from '../useGoTo'
import routil from '../../utils/routes.util'

const useCareer = () => {

    const { toDetailRoute } = useGoTo()

    const addRef = useRef<any>(null)

    const { appContext } = useContextType()
    const { popNetwork } = useNetwork(false)
    const {
        careers,
        career,
        loading,
        setCollection,
        setResource,
        setLoading,
        unsetLoading
    } = appContext

    useEffect(() => {

    }, [])


    const toggleAddCareer = (e: any) => {

        if (e) { e.preventDefault(); }

        toDetailRoute(e, { route: 'core', name: 'create-career' })

    }


    const getCareerById = (id: string) => {

        let result: Career | null = null;

        if (careers.data.length > 0) {

            const cr = careers.data.find((x) => x._id === id);

            if (cr) {
                result = cr;
            }
        }

        return result;
    }

    /**
     * @name getCareers
     */
    const getCareers = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        setLoading({ option: 'resource', type: GET_CAREERS })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_CAREER}?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: response.data,
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.data.length > 0 ? `displaying ${response.count!} careers` : 'There are no careers currently'
                }

                setCollection(GET_CAREERS, result)

            }

        }

        if (response.error === true) {

            unsetLoading({
                option: 'resource',
                type: GET_CAREERS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get careers ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setCollection])

    const getResourceCareers = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order, resource, resourceId } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}&paginate=relative`;

        if (resource && resourceId) {

            setLoading({ option: 'resource', type: GET_CAREERS })

            const response = await AxiosService.call({
                type: 'default',
                method: 'GET',
                isAuth: true,
                path: `/${resource}/careers/${resourceId}?${q}`
            })

            if (response.error === false) {

                if (response.status === 200) {

                    const result: ICollection = {
                        data: response.data,
                        count: response.count!,
                        total: response.total!,
                        pagination: response.pagination!,
                        loading: false,
                        message: response.data.length > 0 ? `displaying ${response.count!} careers` : 'There are no careers currently'
                    }

                    setCollection(GET_CAREERS, result)

                }

            }

            if (response.error === true) {

                unsetLoading({
                    option: 'resource',
                    type: GET_CAREERS,
                    message: response.message ? response.message : response.data
                })

                if (response.status === 401) {
                    AxiosService.logout()
                } else if (response.message && response.message === 'Error: Network Error') {
                    popNetwork();
                } else if (response.data) {
                    console.log(`Error! Could not get careers ${response.data}`)
                }

            }

        } else {

            unsetLoading({
                option: 'resource',
                type: GET_CAREERS,
                message: 'invalid resource / resourceId'
            })

        }


    }, [setLoading, unsetLoading, setCollection])

    /**
     * @name getCareer
     */
    const getCareer = useCallback(async (id: string) => {

        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_INDUSTRY}/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                setResource(GET_CAREER, response.data)
            }

            unsetLoading({
                option: 'default',
                message: 'data fetched successfully'
            })

        }

        if (response.error === true) {

            unsetLoading({
                option: 'default',
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            }
            else if (response.data) {
                console.log(`Error! Could not get career ${response.data}`)
            }
            else if (response.status === 500) {
                console.log(`Sorry, there was an error processing your request. Please try again later. ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setResource])

    return {
        careers,
        career,
        loading,
        toggleAddCareer,

        getCareerById,

        getCareers,
        getResourceCareers,
        getCareer
    }
}

export default useCareer