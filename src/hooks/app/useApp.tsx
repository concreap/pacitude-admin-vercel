import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ICollection, IListQuery, IUserContext } from '../../utils/interfaces.util'
import UserContext from '../../context/user/userContext'
import useContextType from '../useContextType'
import { GET_CAREER, GET_CAREERS, GET_FIELD, GET_FIELDS, GET_INDUSTRIES, GET_INDUSTRY, GET_SKILLS, GET_TOPICS } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_CAREER, URL_CONFIG, URL_FIELD, URL_INDUSTRY } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import { collection, pagination } from '../../_data/seed'

const useApp = () => {

    const { appContext } = useContextType()
    const { popNetwork } = useNetwork(false)
    const {
        industries,
        careers,
        fields,
        skills,
        topics,
        loading,
        setCollection,
        setResource,
        setLoading,
        unsetLoading
    } = appContext

    useEffect(() => {

    }, [])

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

                if(response.data.industries){

                    const result: ICollection = {
                        data: response.data.industries,
                        count: response.data.industries.length,
                        total: response.data.industries.length,
                        pagination: pagination,
                        loading: false,
                        message: response.data.industries.length > 0 ? `displaying ${response.data.industries.length} industries` : 'There are no industries currently'
                    }
    
                    setCollection(GET_INDUSTRIES, result)

                }

                if(response.data.careers){

                    const result: ICollection = {
                        data: response.data.careers,
                        count: response.data.careers.length,
                        total: response.data.careers.length,
                        pagination: pagination,
                        loading: false,
                        message: response.data.careers.length > 0 ? `displaying ${response.data.careers.length} careers` : 'There are no careers currently'
                    }
    
                    setCollection(GET_CAREERS, result)

                }

                if(response.data.fields){

                    const result: ICollection = {
                        data: response.data.fields,
                        count: response.data.fields.length,
                        total: response.data.fields.length,
                        pagination: pagination,
                        loading: false,
                        message: response.data.fields.length > 0 ? `displaying ${response.data.fields.length} fields` : 'There are no fields currently'
                    }
    
                    setCollection(GET_FIELDS, result)

                }

                if(response.data.skills){

                    const result: ICollection = {
                        data: response.data.skills,
                        count: response.data.skills.length,
                        total: response.data.skills.length,
                        pagination: pagination,
                        loading: false,
                        message: response.data.skills.length > 0 ? `displaying ${response.data.skills.length} skills` : 'There are no skills currently'
                    }
    
                    setCollection(GET_SKILLS, result)

                }

                if(response.data.topics){

                    const result: ICollection = {
                        data: response.data.topics,
                        count: response.data.topics.length,
                        total: response.data.topics.length,
                        pagination: pagination,
                        loading: false,
                        message: response.data.topics.length > 0 ? `displaying ${response.data.topics.length} topics` : 'There are no topics currently'
                    }
    
                    setCollection(GET_TOPICS, result)

                }

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

    }, [setLoading, unsetLoading, setCollection])

    const clearCoreResources = useCallback(async () => {

        setCollection(GET_INDUSTRIES, collection)
        setCollection(GET_CAREERS, collection)
        setCollection(GET_FIELDS, collection)
        setCollection(GET_SKILLS, collection)
        setCollection(GET_TOPICS, collection)

    }, [setCollection])

    return {
        industries,
        careers,
        fields,
        skills,
        topics,
        loading,

        getCoreResources,
        clearCoreResources
    }
}

export default useApp