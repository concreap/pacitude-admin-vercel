import { Children, useReducer, useState } from 'react'
import GeniusContext from './geniusContext'
import GeniusReducer from './geniusReducer'
import AxiosService from '../../services/axios.service'
import { GET_CAREERS, GET_FIELDS, GET_INDUSTRIES, GET_QUESTIONS, GET_SKILLS, GET_TOPIC, GET_TOPICS, SET_LOADING, UNSET_LOADING } from '../types'
import { ICollection, IListQuery, IPagination, ISetLoading, IUnsetLoading } from '../../utils/interfaces.util'
import { useNavigate } from 'react-router-dom'
import storage from '../../utils/storage.util'
import loader from '../../utils/loader.util'
import { LoadingType } from '../../utils/types.util'
import { collection } from '../../_data/seed'
import helper from '../../utils/helper.util'

const GeniusState = (props: any) => {

    const navigate = useNavigate()

    const initialState = {
        industries: collection,
        industry: {},
        careers: collection,
        career: {},
        fields: collection,
        field: {},
        skills: collection,
        skill: {},
        questions: collection,
        question: {},
        topics: collection,
        topic: {},
        message: '',
        loading: false
    }

    const [state, dispatch] = useReducer(GeniusReducer, initialState);

    const logout = () => {
        navigate('/login');
        storage.clearAuth();
        AxiosService.logout();
    }

    const getIndustries = async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_INDUSTRIES })

        const response = await AxiosService.call({
            type: 'genius',
            method: 'GET',
            isAuth: true,
            path: `/industries?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: helper.sortData(response.data, 'name'),
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: `displaying ${response.count!} industries`
                }

                dispatch({
                    type: GET_INDUSTRIES,
                    payload: result
                })

            }

        }

        if (response.error === true) {

            await unsetLoading({
                option: 'resource',
                type: GET_INDUSTRIES,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                loader.popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get logged in user ${response.data}`)
            }

        }

    }

    const getCareers = async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_CAREERS })

        const response = await AxiosService.call({
            type: 'genius',
            method: 'GET',
            isAuth: true,
            path: `/careers?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: helper.sortData(response.data, 'name'),
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: `displaying ${response.count!} careers`
                }

                dispatch({
                    type: GET_CAREERS,
                    payload: result
                })

            }

        }

        if (response.error === true) {

            await unsetLoading({
                option: 'resource',
                type: GET_CAREERS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                loader.popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get logged in user ${response.data}`)
            }

        }

    }

    const getFields = async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_FIELDS })

        const response = await AxiosService.call({
            type: 'genius',
            method: 'GET',
            isAuth: true,
            path: `/fields?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: helper.sortData(response.data, 'name'),
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: `displaying ${response.count!} fields`
                }

                dispatch({
                    type: GET_FIELDS,
                    payload: result
                })

            }

        }

        if (response.error === true) {

            await unsetLoading({
                option: 'resource',
                type: GET_FIELDS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                loader.popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get logged in user ${response.data}`)
            }

        }

    }

    const getSkills = async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_SKILLS })

        const response = await AxiosService.call({
            type: 'genius',
            method: 'GET',
            isAuth: true,
            path: `/skills?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: helper.sortData(response.data, 'name'),
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: `displaying ${response.count!} skills`
                }

                dispatch({
                    type: GET_SKILLS,
                    payload: result
                })

            }

        }

        if (response.error === true) {

            await unsetLoading({
                option: 'resource',
                type: GET_SKILLS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                loader.popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get logged in user ${response.data}`)
            }

        }

    }

    const getQuestions = async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_QUESTIONS })

        const response = await AxiosService.call({
            type: 'genius',
            method: 'GET',
            isAuth: true,
            path: `/questions?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: response.data,
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.data.length > 0 ? `displaying ${response.count!} questions` : 'There are no questions yet'
                }

                dispatch({
                    type: GET_QUESTIONS,
                    payload: result
                })

            }

        }

        if (response.error === true) {

            await unsetLoading({
                option: 'resource',
                type: GET_QUESTIONS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                loader.popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get logged in user ${response.data}`)
            }

        }

    }

    const getTopics = async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_TOPICS })

        const response = await AxiosService.call({
            type: 'genius',
            method: 'GET',
            isAuth: true,
            path: `/topics?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: helper.sortData(response.data, 'name'),
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.count ? `displaying ${response.count!} topics` : 'There are no topics yet'
                }

                dispatch({
                    type: GET_TOPICS,
                    payload: result
                })

            }

        }

        if (response.error === true) {

            await unsetLoading({
                option: 'resource',
                type: GET_TOPICS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                loader.popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get logged in user ${response.data}`)
            }

        }

    }

    const getTopic = async (id: string) => {

        await setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'genius',
            method: 'GET',
            isAuth: true,
            path: `/topics/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                dispatch({
                    type: GET_TOPIC,
                    payload: response.data
                })

            }

            await unsetLoading({
                option: 'default',
                message: 'data fetched successfully'
            })

        }

        if (response.error === true) {

            await unsetLoading({
                option: 'default',
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                loader.popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get topic ${response.data}`)
            }

        }

    }

    const setLoading = async (data: ISetLoading) => {

        if (data.option === 'default') {
            dispatch({
                type: SET_LOADING
            })
        }

        if (data.option === 'resource' && data.type) {

            const { loading, ...rest } = collection;

            dispatch({
                type: data.type,
                payload: {
                    ...rest,
                    loading: true
                }
            })

        }

    }

    const unsetLoading = async (data: IUnsetLoading) => {

        if (data.option === 'default') {
            dispatch({
                type: UNSET_LOADING,
                payload: data.message
            })
        }

        if (data.option === 'resource' && data.type) {

            const { loading, message, ...rest } = collection;

            dispatch({
                type: data.type,
                payload: {
                    ...rest,
                    loading: false,
                    message: data.message
                }
            })

        }

    }

    return <GeniusContext.Provider
        value={{
            industries: state.industries,
            industry: state.industry,
            careers: state.careers,
            career: state.career,
            fields: state.fields,
            field: state.field,
            skills: state.skills,
            skill: state.skill,
            questions: state.questions,
            question: state.question,
            topics: state.topics,
            topic: state.topic,
            message: state.message,
            loading: state.loading,
            setLoading: setLoading,
            unsetLoading: unsetLoading,
            getIndustries: getIndustries,
            getCareers: getCareers,
            getSkills: getSkills,
            getFields: getFields,
            getQuestions: getQuestions,
            getTopics: getTopics,
            getTopic: getTopic
        }}
    >
        {props.children}
    </GeniusContext.Provider>

}

export default GeniusState;