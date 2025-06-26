import { MouseEvent, useCallback, useRef, useState } from 'react'
import { ICollection, IListQuery } from '../../utils/interfaces.util'
import useContextType from '../useContextType'
import { GET_TOPIC, GET_TOPICS, } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_TOPIC } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import useToast from '../useToast'
import helper from '../../utils/helper.util'

interface ITopicData {
    name: string;
    label: string,
    description: string;
    isEnabled: any;
    fieldId: string;
    skills: string[];
}

const useTopic = () => {

    const fieldRef = useRef<any>(null)
    const skillRef = useRef<any>(null)
    const statusRef = useRef<any>(null)

    const { appContext } = useContextType()
    const { popNetwork } = useNetwork(false)
    const { topics, topic, loading, setCollection, setResource, setLoading, unsetLoading } = appContext
    const [field, setField] = useState({ _id: '', name: '' })
    const [skillList, setSkillList] = useState<Array<{ id: string, name: string, ex: boolean }>>([])
    const { toast, setToast } = useToast()

    const [topicData, setTopicData] = useState<ITopicData>({
        name: '',
        label: '',
        description: '',
        isEnabled: null,
        fieldId: '',
        skills: []
    })

    const handleAddSkillsChange = (val: string) => {

        setTopicData((prev) => ({
            ...prev,
            skills: [...prev.skills, val]
        }))
    }

    const addSkill = (val: any) => {

        let skillIds = skillList.map((x) => x.id);

        if (!skillIds.includes(val.id)) {
            handleAddSkillsChange(val.id)
            setSkillList(prev => [...prev, val])
        }

    }

    const removeSkill = (id: string) => {

        setTopicData(prev => ({
            ...prev,
            skills: prev.skills.filter((x) => x !== id)
        }))
        setSkillList(prev => prev.filter((x) => x.id !== id))

    }

    const handleChange = <K extends keyof ITopicData>(field: K, value: ITopicData[K]) => {
        setTopicData((prev) => ({
            ...prev,
            [field]: value
        }))
    };


    /**
     * @name createTopic
     */
    const createTopic = useCallback(async (validate: () => boolean) => {

        const isValidated = validate()

        if (isValidated === true) {
            const payload = { ...topicData }

            setLoading({ option: 'default' })

            const response = await AxiosService.call({
                type: 'default',
                method: 'POST',
                isAuth: true,
                path: `${URL_TOPIC}`,
                payload: payload
            })

            if (response.error === false) {

                if (response.status === 200) {
                    setToast({ ...toast, show: true, type: 'success', message: 'Topic created successfully' })
                }

                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 3000)

                unsetLoading({
                    option: 'default',
                    message: 'data saved successfully'
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
                else if (!helper.isEmpty(response.data, 'object')) {
                    setToast({ ...toast, show: true, error: 'topic', type: 'error', message: `Error! Could not create topic ${response?.data}` })
                }
                else if (response.errors && response.errors.length > 0) {
                    setToast({ ...toast, show: true, error: 'topic', type: 'error', message: `Error! Could not create topic ${response?.errors[0]}` })
                }
                else if (response.status === 500) {
                    setToast({ ...toast, show: true, error: 'topic', type: 'error', message: `Sorry, there was an error processing your request. Please try again later.` })
                }
                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 3000)

            }
        }

    }, [topicData, setLoading, unsetLoading, setResource])

    /**
     * @name editTopic
     */
    const editTopic = useCallback(async (e: MouseEvent<HTMLAnchorElement>) => {

        if (e) e.preventDefault()

        const payload: any = { ...topicData }

        Object.keys(payload).forEach((key) => {
            const k = key as keyof typeof payload;
            const value = payload[k];

            if (
                value === '' ||
                value === null ||
                value === undefined ||
                (Array.isArray(value) && value.length === 0)
            ) {
                delete payload[k];
            }
        });


        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'PUT',
            isAuth: true,
            path: `${URL_TOPIC}/${topic._id}`,
            payload: payload
        })

        if (response.error === false) {

            if (response.status === 200) {
                setToast({ ...toast, show: true, error: 'topic', type: 'success', message: `Topic updated successfully!!! ${response?.errors[0]}` })
                setResource(GET_TOPIC, response.data)
            }

            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

            unsetLoading({
                option: 'default',
                message: 'data saved successfully'
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
            else if (!helper.isEmpty(response.data, 'object')) {
                setToast({ ...toast, show: true, error: 'topic', type: 'error', message: `Error! Could not update topic, ${response?.data}` })
            }
            else if (response.errors && response.errors.length > 0) {
                setToast({ ...toast, show: true, error: 'topic', type: 'error', message: `Error! Could not update topic ${response?.errors[0]}` })
            }
            else if (response.status === 500) {
                setToast({ ...toast, show: true, error: 'topic', type: 'error', message: `Sorry, there was an error processing your request. Please try again later.` })
            }
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

        }

    }, [topicData, setLoading, unsetLoading, setResource])

    /**
     * @name getTopics
     */
    const getTopics = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        setLoading({ option: 'resource', type: GET_TOPICS })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_TOPIC}?${q}`
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

                setCollection(GET_TOPICS, result)

            }

        }

        if (response.error === true) {

            unsetLoading({
                option: 'resource',
                type: GET_TOPICS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get topics ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setCollection])

    const getResourceTopics = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order, resource, resourceId } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}&paginate=relative`;

        if (resource && resourceId) {

            setLoading({ option: 'resource', type: GET_TOPICS })

            const response = await AxiosService.call({
                type: 'default',
                method: 'GET',
                isAuth: true,
                path: `/${resource}/topics/${resourceId}?${q}`
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

                    setCollection(GET_TOPICS, result)

                }

            }

            if (response.error === true) {

                unsetLoading({
                    option: 'resource',
                    type: GET_TOPICS,
                    message: response.message ? response.message : response.data
                })

                if (response.status === 401) {
                    AxiosService.logout()
                } else if (response.message && response.message === 'Error: Network Error') {
                    popNetwork();
                } else if (response.data) {
                    console.log(`Error! Could not get topics ${response.data}`)
                }

            }

        } else {

            unsetLoading({
                option: 'resource',
                type: GET_TOPICS,
                message: 'invalid resource / resourceId'
            })

        }


    }, [setLoading, unsetLoading, setCollection])

    /**
     * @name getTopic
     */
    const getTopic = useCallback(async (id: string) => {

        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_TOPIC}/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                setResource(GET_TOPIC, response.data)
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
                console.log(`Error! Could not get topic ${response.data}`)
            }
            else if (response.status === 500) {
                console.log(`Sorry, there was an error processing your request. Please try again later. ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setResource])

    return {
        fieldRef,
        skillRef,
        statusRef,
        topicData,
        field,
        skillList,
        topics,
        topic,
        loading,

        setField,
        setSkillList,
        addSkill,
        removeSkill,
        handleChange,
        editTopic,
        createTopic,
        handleAddSkillsChange,
        getTopics,
        getResourceTopics,
        getTopic
    }
}

export default useTopic