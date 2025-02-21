import { Children, useReducer, useCallback, useContext, useMemo } from 'react'
import GeniusContext from './coreContext'
import GeniusReducer from './coreReducer'
import AxiosService from '../../services/axios.service'
import { IAIQuestion, IClearResource, ICollection, ICoreMetrics, IListQuery, IMetricQuery, IPagination, ISetLoading, IUnsetLoading } from '../../utils/interfaces.util'
import { useNavigate } from 'react-router-dom'
import storage from '../../utils/storage.util'
import loader from '../../utils/loader.util'
import { LoadingType } from '../../utils/types.util'
import { aiquestion, collection, initialMetrics } from '../../_data/seed'
import helper from '../../utils/helper.util'
import {
    GET_CAREERS,
    GET_FIELD,
    GET_FIELDS,
    GET_INDUSTRIES,
    GET_INDUSTRY,
    GET_METRICS,
    GET_QUESTION,
    GET_QUESTIONS,
    GET_SKILLS,
    GET_TOPIC,
    GET_TOPICS,
    SET_AIQUESTION,
    SET_ITEMS,
    SET_LOADING,
    SET_SEARCH,
    UNSET_LOADING
} from '../types'

const CoreState = (props: any) => {

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
        aiQuestions: aiquestion,
        topics: collection,
        topic: {},
        items: [],
        metrics: initialMetrics,
        search: collection,
        message: '',
        loading: false
    }

    const [state, dispatch] = useReducer(GeniusReducer, initialState);

    const logout = () => {
        navigate('/login');
        storage.clearAuth();
        AxiosService.logout();
    }

    /**
     * @name setLoading
     * @param data 
     */
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

    /**
     * @name unsetLoading
     * @param data 
     */
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

    /**
     * @name getIndustries
     */
    const getIndustries = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_INDUSTRIES })

        const response = await AxiosService.call({
            type: 'core',
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
                    message: response.data.length > 0 ? `displaying ${response.count!} industries` : 'There are no industries currently'
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

    }, [setLoading, unsetLoading, logout])

     /**
     * @name getIndustry
     */
    const getIndustry = useCallback(async (id: string) => {

        await setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'core',
            method: 'GET',
            isAuth: true,
            path: `/industries/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                dispatch({
                    type: GET_INDUSTRY,
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
            } 
            else if (response.data) {
                console.log(`Error! Could not get industry ${response.data}`)
            }
            else if (response.status === 500) {
                console.log(`Sorry, there was an error processing your request. Please try again later. ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, logout])


    /**
     * @name getCareers
     */
    const getCareers = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_CAREERS })

        const response = await AxiosService.call({
            type: 'core',
            method: 'GET',
            isAuth: true,
            path: `/careers?${q}`
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

    }, [setLoading, unsetLoading, logout])

    /**
     * @name getFields
     */
    const getFields = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_FIELDS })

        const response = await AxiosService.call({
            type: 'core',
            method: 'GET',
            isAuth: true,
            path: `/fields?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: response.data,
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.data.length > 0 ? `displaying ${response.count!} fields` : 'There are no fields currently'
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

    }, [setLoading, unsetLoading, logout])

     /**
     * @name getField
     */
     const getField = useCallback(async (id: string) => {

        await setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'core',
            method: 'GET',
            isAuth: true,
            path: `/fields/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                dispatch({
                    type: GET_FIELD,
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
            } 
            else if (response.data) {
                console.log(`Error! Could not get field ${response.data}`)
            }
            else if (response.status === 500) {
                console.log(`Sorry, there was an error processing your request. Please try again later. ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, logout])

    /**
     * @name getSkills
     */
    const getSkills = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_SKILLS })

        const response = await AxiosService.call({
            type: 'core',
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
                    message: response.data.length > 0 ? `displaying ${response.count!} skills` : 'There are no skills currently'
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

    }, [setLoading, unsetLoading, logout])

    /**
     * @name getQuestions
     */
    const getQuestions = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_QUESTIONS })

        const response = await AxiosService.call({
            type: 'core',
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
                    message: response.data.length > 0 ? `displaying ${response.count!} questions` : 'There are no questions currently'
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

    }, [setLoading, unsetLoading, logout])

    const getQuestion = useCallback(async (id: string) => {

        await setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'core',
            method: 'GET',
            isAuth: true,
            path: `/questions/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                dispatch({
                    type: GET_QUESTION,
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

    }, [setLoading, unsetLoading, logout])

    /**
     * @name getTopics
     */
    const getTopics = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        await setLoading({ option: 'resource', type: GET_TOPICS })

        const response = await AxiosService.call({
            type: 'core',
            method: 'GET',
            isAuth: true,
            path: `/topics?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: response.data,
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.data.length > 0 ? `displaying ${response.count!} topics` : 'There are no topics currently'
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

    }, [setLoading, unsetLoading, logout])

    /**
     * @name getTopic
     */
    const getTopic = useCallback(async (id: string) => {

        await setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'core',
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

    }, [setLoading, unsetLoading, logout])

    /**
     * @name getResourceQuestions
     */
    const getResourceQuestions = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order, resource, resourceId } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        if (resource && resourceId) {

            await setLoading({ option: 'resource', type: GET_QUESTIONS })

            const response = await AxiosService.call({
                type: 'core',
                method: 'GET',
                isAuth: true,
                path: `/${resource}/questions/${resourceId}?${q}`
            })

            if (response.error === false) {

                if (response.status === 200) {

                    const result: ICollection = {
                        data: response.data,
                        count: response.count!,
                        total: response.total!,
                        pagination: response.pagination!,
                        loading: false,
                        message: response.data.length > 0 ? `displaying ${response.count!} products` : 'There are no products currently'
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
                    console.log(`Error! Could not get products ${response.data}`)
                }

            }

        } else {

            await unsetLoading({
                option: 'resource',
                type: GET_QUESTIONS,
                message: 'invalid resource / resourceId'
            })

        }


    }, [setLoading, unsetLoading, logout]);

    /**
     * @name searchResource
     */
    const searchResource = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order, resource, key } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        if (resource) {

            await setLoading({ option: 'resource', type: SET_SEARCH })

            const response = await AxiosService.call({
                type: 'core',
                method: 'POST',
                isAuth: true,
                path: `/${resource}/search?${q}`,
                payload: { key: key }
            })

            if (response.error === false) {

                if (response.status === 200) {

                    const result: ICollection = {
                        data: response.data,
                        count: response.count!,
                        total: response.total!,
                        pagination: response.pagination!,
                        loading: false,
                        message: response.data.length > 0 ? `displaying ${response.count!} ${resource}` : `There are no ${resource} currently`
                    }

                    dispatch({
                        type: SET_SEARCH,
                        payload: result
                    })

                }

            }

            if (response.error === true) {

                await unsetLoading({
                    option: 'resource',
                    type: SET_SEARCH,
                    message: response.message ? response.message : response.data
                })

                if (response.status === 401) {
                    logout()
                } else if (response.message && response.message === 'Error: Network Error') {
                    loader.popNetwork();
                } else if (response.data) {
                    console.log(`Error! Could not search ${resource} ${response.data}`)
                }

            }

        } else {

            await unsetLoading({
                option: 'resource',
                type: SET_SEARCH,
                message: 'invalid resource / resourceId'
            })

        }


    }, [setLoading, unsetLoading, logout]);

    /**
     * @name filterResource
     */
    const filterResource = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order, resource, payload } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        if (resource) {

            await setLoading({ option: 'resource', type: SET_SEARCH })

            const response = await AxiosService.call({
                type: 'core',
                method: 'POST',
                isAuth: true,
                path: `/${resource}/filter?${q}`,
                payload: { ...payload }
            })

            if (response.error === false) {

                if (response.status === 200) {

                    const result: ICollection = {
                        data: response.data,
                        count: response.count!,
                        total: response.total!,
                        pagination: response.pagination!,
                        loading: false,
                        message: response.data.length > 0 ? `displaying ${response.count!} ${resource}` : `There are no ${resource} currently`
                    }

                    dispatch({
                        type: SET_SEARCH,
                        payload: result
                    })

                }

            }

            if (response.error === true) {

                await unsetLoading({
                    option: 'resource',
                    type: SET_SEARCH,
                    message: response.message ? response.message : response.data
                })

                if (response.status === 401) {
                    logout()
                } else if (response.message && response.message === 'Error: Network Error') {
                    loader.popNetwork();
                } else if (response.data) {
                    console.log(`Error! Could not filter ${resource} ${response.data}`)
                }

            }

        } else {

            await unsetLoading({
                option: 'resource',
                type: SET_SEARCH,
                message: 'invalid resource / resourceId'
            })

        }


    }, [setLoading, unsetLoading, logout]);

    /**
     * @name getResourceMetrics
     */
    const getResourceMetrics = useCallback(async (data: IMetricQuery) => {

        const { metric, type, difficulties, endDate, levels, questionTypes, resourceId, startDate } = data;

        if (metric === 'overview') {

            await setLoading({ option: 'resource', type: GET_METRICS })

            const response = await AxiosService.call({
                type: 'core',
                method: 'POST',
                isAuth: true,
                path: `/metrics/overview`,
                payload: {
                    type: type,
                    difficulties: difficulties,
                    endDate: endDate,
                    levels: levels,
                    questionTypes: questionTypes,
                    resourceId: resourceId,
                    startDate: startDate
                }
            })

            if (response.error === false) {

                if (response.status === 200) {

                    const result: ICoreMetrics = {
                        question: response.data.question,
                        loading: false,
                        message: `successful`
                    }

                    dispatch({
                        type: GET_METRICS,
                        payload: result
                    })

                }

            }

            if (response.error === true) {

                await unsetLoading({
                    option: 'resource',
                    type: GET_METRICS,
                    message: response.message ? response.message : response.data
                })

                if (response.status === 401) {
                    logout()
                } else if (response.message && response.message === 'Error: Network Error') {
                    loader.popNetwork();
                } else if (response.data) {
                    console.log(`Error! Could not get metrics ${response.data}`)
                }

            }


        } else {

            await unsetLoading({
                option: 'resource',
                type: GET_METRICS,
                message: 'invalid metric type'
            })
        }

    }, [setLoading, unsetLoading, logout]);

    /**
     * @name setResourceMetrics
     * @param data 
     */
    const setResourceMetrics = (data: ICoreMetrics) => {
        dispatch({
            type: GET_METRICS,
            payload: data
        })
    }

    /**
     * @name setAIQuestions
     * @param data 
     */
    const setAIQuestions = async (data: Array<IAIQuestion>) => {

        dispatch({
            type: SET_AIQUESTION,
            payload: data
        })

    }

    /**
     * @name clearResource
     * @param data 
     */
    const clearResource = (data: IClearResource) => {

        let payload: any = {}

        if (data.resource === 'multiple') {
            payload = collection
        }

        dispatch({
            type: data.type,
            payload: payload
        })

    }

    /**
     * @name setItems
     * @param data 
     */
    const setItems = (data: Array<any>) => {

        dispatch({
            type: SET_ITEMS,
            payload: data
        })

    }

    /**
     * @name clearSearch
     */
    const clearSearch = () => {
        dispatch({
            type: SET_SEARCH,
            payload: collection
        })
    }

    const contextValues = useMemo(() => ({
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
        aiQuestions: state.aiQuestions,
        topics: state.topics,
        topic: state.topic,
        items: state.items,
        metrics: state.metrics,
        search: state.search,
        message: state.message,
        loading: state.loading,
        setLoading: setLoading,
        unsetLoading: unsetLoading,
        setAIQuestions: setAIQuestions,
        clearResource: clearResource,
        setItems: setItems,
        clearSearch: clearSearch,
        getIndustries: getIndustries,
        getIndustry: getIndustry,
        getCareers: getCareers,
        getSkills: getSkills,
        getFields: getFields,
        getField: getField,
        getQuestions: getQuestions,
        getQuestion: getQuestion,
        getTopics: getTopics,
        getTopic: getTopic,
        getResourceQuestions: getResourceQuestions,
        getResourceMetrics: getResourceMetrics,
        setResourceMetrics: setResourceMetrics,
        searchResource: searchResource,
        filterResource: filterResource
    }), [
        state.industries,
        state.industry,
        state.careers,
        state.career,
        state.fields,
        state.field,
        state.skills,
        state.skill,
        state.questions,
        state.question,
        state.aiQuestions,
        state.topics,
        state.topic,
        state.items,
        state.metrics,
        state.search,
        state.message,
        state.loading,
        setLoading,
        unsetLoading,
        setAIQuestions,
        clearResource,
        setItems,
        clearSearch,
        getIndustries,
        getIndustry,
        getCareers,
        getSkills,
        getFields,
        getField,
        getQuestions,
        getQuestion,
        getTopics,
        getTopic,
        getResourceQuestions,
        getResourceMetrics,
        setResourceMetrics,
        searchResource,
        filterResource
    ])

    return <GeniusContext.Provider
        value={contextValues}
    >
        {props.children}
    </GeniusContext.Provider>

}

export default CoreState;