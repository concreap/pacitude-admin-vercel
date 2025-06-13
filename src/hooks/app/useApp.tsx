import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ICollection, IListQuery, IUserContext } from '../../utils/interfaces.util'
import UserContext from '../../context/user/userContext'
import useContextType from '../useContextType'
import { GET_CAREER, GET_CAREERS, GET_CORE, GET_FIELD, GET_FIELDS, GET_INDUSTRIES, GET_INDUSTRY, GET_SKILLS, GET_TOPICS } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_CAREER, URL_CONFIG, URL_FIELD, URL_INDUSTRY } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import { collection, pagination } from '../../_data/seed'
import useGoTo from '../useGoTo'
import { coreTypeEnum } from '../../utils/enums.util'

const useApp = () => {

    const { appContext } = useContextType()
    const { toDetailRoute } = useGoTo()
    const { popNetwork } = useNetwork(false)
    const {
        core,
        loading,
        setCollection,
        setResource,
        setLoading,
        unsetLoading
    } = appContext

    useEffect(() => {

    }, [])


    const toggleAddResource = (e: any, type: string) => {

        if (e) { e.preventDefault(); }

        toDetailRoute(e, { route: 'core', name: `create-${type}` })
    
    }

    /**
     * @name getCoreResources
     */
    const getCoreResources = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_CONFIG}/core?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                setResource(GET_CORE, {
                    industries: response.data.industries,
                    careers: response.data.careers,
                    fields: response.data.fields,
                    skills: response.data.skills,
                    topics: response.data.topics,
                })

                unsetLoading({
                    option: 'default',
                    message: response.message ? response.message : ''
                })

            }

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
            } else if (response.data) {
                console.log(`Error! Could not get core resources ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setResource])

    return {
        core,
        loading,

        toggleAddResource,
        getCoreResources,
    }
}

export default useApp